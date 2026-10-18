#!/usr/bin/env bash
# Keelwork PreToolUse hook on Bash (SRD N6). While a /ship run's ledger says
# "Status: running", every shell command must match the run contract's command
# allowlist, and a few commands are refused outright: pushing to or merging
# into the main branch, force pushes, and deleting branches. A refused command
# exits 2, so the agent sees why and parks the ticket instead. Outside a running
# /ship run it never blocks.
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
. "$HOOK_DIR/lib.sh"

INPUT="$(cat || true)"
CWD="$(keelwork_json_get "$INPUT" cwd)"
DIR="$(keelwork_project_dir "$CWD")"
COMMAND="$(keelwork_json_get "$INPUT" tool_input.command)"
[ -n "$COMMAND" ] || exit 0

LEDGER="$(keelwork_running_ledgers "$DIR" | head -n 1)"
[ -n "$LEDGER" ] || exit 0
RUN="$(basename "$(dirname "$LEDGER")")"
CONTRACT="$(dirname "$LEDGER")/contract.md"

# Split the command into simple commands on ;, &&, || and |, outside quotes.
segments() {
  printf '%s\n' "$1" | awk '
    BEGIN { RS = "\001" }
    {
      s = $0; out = ""; q = ""
      for (i = 1; i <= length(s); i++) {
        c = substr(s, i, 1); n = substr(s, i + 1, 1)
        if (q != "") {
          out = out c
          if (c == "\\" && q == "\"") { out = out n; i++; continue }
          if (c == q) q = ""
          continue
        }
        if (c == "\"" || c == "'\''") { q = c; out = out c; continue }
        if (c == "\\") { out = out c n; i++; continue }
        if (c == ";" || c == "\n") { print out; out = ""; continue }
        if ((c == "&" && n == "&") || (c == "|" && n == "|")) { print out; out = ""; i++; continue }
        if (c == "|") { print out; out = ""; continue }
        out = out c
      }
      print out
    }'
}

# Trim, drop a leading "(", "{", "!", "time", and VAR=value assignments.
normalise() {
  local s="$1"
  s="$(printf '%s' "$s" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/^[({!][[:space:]]*//; s/[)}][[:space:]]*$//')"
  while [[ "$s" =~ ^[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]]+(.*)$ ]]; do s="${BASH_REMATCH[1]}"; done
  s="${s#time }"
  printf '%s' "$s" | tr -s '[:space:]' ' '
}

deny() {
  echo "Keelwork allowlist (/ship run $RUN): \`$1\` was refused: $2 Park the ticket that needs it, with the exact question for the human, per .ship/$RUN/contract.md." >&2
  exit 2
}

BRANCH="$(cd "$DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"

# Hard rules (SRD N6): never merge into main, push to main, force-push, or delete branches.
while IFS= read -r raw; do
  seg="$(normalise "$raw")"
  [ -n "$seg" ] || continue
  case "$seg" in
    "git push"*)
      if [[ " $seg " =~ [[:space:]](-f|--force|--force-with-lease)[[:space:]=] ]]; then deny "$seg" "force pushes are never run during a /ship run."; fi
      if [[ " $seg " =~ [[:space:]:+](main|master)[[:space:]] ]]; then deny "$seg" "nothing is ever pushed to the main branch."; fi
      ;;
    "git merge"*|"git rebase"*|"git pull"*)
      if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then deny "$seg" "nothing is merged into the main branch; merging is the human's decision."; fi
      ;;
    "git branch -D"*|"git branch -d"*|"git branch --delete"*|"git push --delete"*|"git push origin --delete"*|"git push origin :"*)
      deny "$seg" "branches are never deleted during a /ship run."
      ;;
  esac
done < <(segments "$COMMAND")

# Allowlist prefixes from the contract. A backticked command in a bullet allows
# itself and any arguments after it; "<placeholders>" and "{files}" end the
# prefix. A backticked .md path pulls in that file's commands.
[ -f "$CONTRACT" ] || exit 0
SECTION="$(awk '/^## /{ on = ($0 ~ /^## Command allowlist/) ; next } on' "$CONTRACT")"
[ -n "$SECTION" ] || exit 0

PREFIXES=()
add_prefix() {
  local p="$1"
  p="${p%%<*}"; p="${p%%\{files\}*}"
  p="$(printf '%s' "$p" | sed -E 's/[[:space:]]+$//' | tr -s '[:space:]' ' ')"
  [ -n "$p" ] && PREFIXES+=("$p")
}
while IFS= read -r span; do
  case "$span" in
    *.md)
      if [ -f "$DIR/$span" ]; then
        for key in test lint typecheck build verify; do
          cmd="$(keelwork_command "$DIR" "$key")"
          [ -n "$cmd" ] && add_prefix "$cmd"
        done
      fi
      ;;
    *) add_prefix "$span" ;;
  esac
done < <(printf '%s\n' "$SECTION" | grep -o '`[^`]*`' | tr -d '`')

[ "${#PREFIXES[@]}" -gt 0 ] || exit 0

while IFS= read -r raw; do
  seg="$(normalise "$raw")"
  [ -n "$seg" ] || continue
  allowed=0
  for p in "${PREFIXES[@]}"; do
    if [ "$seg" = "$p" ] || [[ "$seg" == "$p "* ]] || { [[ "$p" == */ ]] && [[ "$seg" == "$p"* ]]; }; then allowed=1; break; fi
  done
  [ $allowed -eq 1 ] || deny "$seg" "it isn't on the run's command allowlist."
done < <(segments "$COMMAND")

exit 0
