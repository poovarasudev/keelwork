#!/usr/bin/env bash
# Deterministic tests for the Keelwork hooks in ../hooks. No model involved:
# each case builds a throwaway project, pipes a hook a JSON payload shaped like
# Claude Code's, and checks the exit code and output.
#
#   bash evals/hooks.test.sh
set -uo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS="$REPO/hooks"
PASS=0
FAIL=0

ok() { PASS=$((PASS + 1)); printf '  ok   %s\n' "$1"; }
bad() { FAIL=$((FAIL + 1)); printf '  FAIL %s\n%s\n' "$1" "$2"; }

new_project() {
  local dir
  dir="$(mktemp -d)"
  mkdir -p "$dir/docs/agents" "$dir/src"
  printf '%s' "$dir"
}

write_commands() {
  # $1 project dir, $2 lint command, $3 typecheck command, $4 lint-extensions (optional)
  {
    echo "# Commands"
    echo
    echo "## Commands"
    echo
    echo "- **test**: \`true\`"
    echo "- **lint**: \`$2\`"
    echo "- **typecheck**: \`$3\`"
    [ -n "${4:-}" ] && echo "- **lint-extensions**: \`$4\`"
    echo
    echo "- **lint**: the linter, explained in prose; this line must never be parsed."
  } > "$1/docs/agents/commands.md"
}

write_ledger() {
  # $1 project dir, $2 run id, $3 status, $4 stop guard, $5 ticket 02 status
  mkdir -p "$1/.ship/$2"
  cat > "$1/.ship/$2/ledger.md" <<EOF
# Ship ledger · run $2

Status: $3
Phase: execute
Stop guard: $4

## Tickets

| ID | Title | Status | Blocked by | Rounds | Commit |
| --- | --- | --- | --- | --- | --- |
| 01 | First | done | - | 1 | abc1234 |
| 02 | Second | $5 | 01 | 0 | |

## Log

- 22:14 · 02 · ready to start
EOF
}

edit_payload() { printf '{"session_id":"t","cwd":"%s","hook_event_name":"PostToolUse","tool_name":"Edit","tool_input":{"file_path":"%s"}}' "$1" "$2"; }
stop_payload() { printf '{"session_id":"t","cwd":"%s","hook_event_name":"Stop","stop_hook_active":false}' "$1"; }
start_payload() { printf '{"session_id":"t","cwd":"%s","hook_event_name":"SessionStart","source":"%s"}' "$1" "$2"; }

run_hook() {
  # $1 hook script, $2 payload. Sets OUT, ERR, CODE.
  local errfile
  errfile="$(mktemp)"
  OUT="$(printf '%s' "$2" | env -u CLAUDE_PROJECT_DIR bash "$HOOKS/$1" 2>"$errfile")"
  CODE=$?
  ERR="$(cat "$errfile")"
  rm -f "$errfile"
}

echo "session-start"
P="$(new_project)"
run_hook session-start.sh "$(start_payload "$P" startup)"
lines="$(printf '%s\n' "$OUT" | wc -l | tr -d ' ')"
if [ "$CODE" -eq 0 ] && [ "$lines" -lt 10 ] && printf '%s' "$OUT" | grep -q "keelwork:ship"; then ok "short reminder, under 10 lines ($lines)"; else bad "short reminder" "$OUT"; fi
if printf '%s' "$OUT" | grep -q "means the keelwork: one"; then ok "names skill precedence over other packs"; else bad "skill precedence line" "$OUT"; fi
write_ledger "$P" 2026-10-16-a running on ready
run_hook session-start.sh "$(start_payload "$P" compact)"
if printf '%s' "$OUT" | grep -q "re-read .ship/2026-10-16-a/ledger.md"; then ok "after compaction, points at the running ledger"; else bad "compaction pointer" "$OUT"; fi
lines="$(printf '%s\n' "$OUT" | wc -l | tr -d ' ')"
if [ "$lines" -lt 10 ]; then ok "still under 10 lines with a run in progress ($lines)"; else bad "line budget" "$OUT"; fi
rm -rf "$P"

echo "post-edit"
P="$(new_project)"
echo "x" > "$P/src/a.ts"
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 0 ]; then ok "no commands.md: does nothing"; else bad "no commands.md" "$ERR"; fi

write_commands "$P" "echo linted {files} > $P/lint.log" "true"
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 0 ] && grep -q "linted src/a.ts" "$P/lint.log"; then ok "lints only the edited file"; else bad "lint the edited file" "$ERR $(cat "$P/lint.log" 2>/dev/null)"; fi

write_commands "$P" "echo 'a.ts:1 no-unused-vars' {files} && false" "true"
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 2 ] && printf '%s' "$ERR" | grep -q "no-unused-vars"; then ok "lint failure exits 2 with the output on stderr"; else bad "lint failure" "code=$CODE $ERR"; fi

write_commands "$P" "true {files}" "echo 'TS2322: type error' && false"
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 2 ] && printf '%s' "$ERR" | grep -q "TS2322"; then ok "typecheck failure exits 2"; else bad "typecheck failure" "code=$CODE $ERR"; fi

KEELWORK_POST_EDIT_TYPECHECK=off
export KEELWORK_POST_EDIT_TYPECHECK
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
unset KEELWORK_POST_EDIT_TYPECHECK
if [ "$CODE" -eq 0 ]; then ok "KEELWORK_POST_EDIT_TYPECHECK=off skips the typecheck"; else bad "typecheck opt-out" "$ERR"; fi

echo "# notes" > "$P/README.md"
write_commands "$P" "false {files}" "true" "ts tsx"
run_hook post-edit.sh "$(edit_payload "$P" "$P/README.md")"
if [ "$CODE" -eq 0 ]; then ok "lint-extensions skips a file the linter doesn't handle"; else bad "lint-extensions" "$ERR"; fi
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 2 ]; then ok "lint-extensions still lints a matching file"; else bad "lint-extensions match" "code=$CODE"; fi

write_commands "$P" "false" "true"
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
if [ "$CODE" -eq 0 ]; then ok "lint without {files} is skipped"; else bad "whole-project lint skipped" "$ERR"; fi

write_commands "$P" "false {files}" "false"
mkdir -p "$P/.ship/r"; echo "x" > "$P/.ship/r/ledger.md"
run_hook post-edit.sh "$(edit_payload "$P" "$P/.ship/r/ledger.md")"
if [ "$CODE" -eq 0 ]; then ok "ignores edits to .ship run state"; else bad ".ship ignored" "$ERR"; fi
OUTSIDE="$(mktemp)"
run_hook post-edit.sh "$(edit_payload "$P" "$OUTSIDE")"
if [ "$CODE" -eq 0 ]; then ok "ignores files outside the project"; else bad "outside project" "$ERR"; fi
rm -f "$OUTSIDE"
KEELWORK_POST_EDIT=off
export KEELWORK_POST_EDIT
run_hook post-edit.sh "$(edit_payload "$P" "$P/src/a.ts")"
unset KEELWORK_POST_EDIT
if [ "$CODE" -eq 0 ]; then ok "KEELWORK_POST_EDIT=off disables the hook"; else bad "opt-out" "$ERR"; fi
rm -rf "$P"

echo "stop-guard"
P="$(new_project)"
run_hook stop-guard.sh "$(stop_payload "$P")"
if [ "$CODE" -eq 0 ] && [ -z "$OUT" ]; then ok "no /ship run: never blocks"; else bad "no run" "$OUT"; fi

write_ledger "$P" 2026-10-16-a running on ready
run_hook stop-guard.sh "$(stop_payload "$P")"
if printf '%s' "$OUT" | grep -q '"decision":"block"'; then ok "running run with a ready ticket: blocks"; else bad "blocks on ready" "$OUT"; fi
if printf '%s' "$OUT" | python3 -c 'import json,sys; json.load(sys.stdin)' 2>/dev/null; then ok "block output is valid JSON"; else bad "valid JSON" "$OUT"; fi

write_ledger "$P" 2026-10-16-a running on in-progress
run_hook stop-guard.sh "$(stop_payload "$P")"
if printf '%s' "$OUT" | grep -q '"decision":"block"'; then ok "in-progress ticket: blocks"; else bad "blocks on in-progress" "$OUT"; fi

write_ledger "$P" 2026-10-16-a running on parked
run_hook stop-guard.sh "$(stop_payload "$P")"
if [ -z "$OUT" ]; then ok "only parked and done tickets: lets the session stop"; else bad "parked only" "$OUT"; fi

write_ledger "$P" 2026-10-16-a halted on ready
run_hook stop-guard.sh "$(stop_payload "$P")"
if [ -z "$OUT" ]; then ok "halted run: never blocks"; else bad "halted" "$OUT"; fi

write_ledger "$P" 2026-10-16-a running off ready
run_hook stop-guard.sh "$(stop_payload "$P")"
if [ -z "$OUT" ]; then ok "stop guard off: never blocks"; else bad "guard off" "$OUT"; fi

write_ledger "$P" 2026-10-16-a running on ready
rm -f "$P/.ship/2026-10-16-a/.stop-guard"
for _ in 1 2 3; do run_hook stop-guard.sh "$(stop_payload "$P")"; done
run_hook stop-guard.sh "$(stop_payload "$P")"
if [ -z "$OUT" ]; then ok "unchanged ledger after 3 blocks: releases the session"; else bad "release after 3" "$OUT"; fi
echo "- 23:00 · 02 · implement started" >> "$P/.ship/2026-10-16-a/ledger.md"
run_hook stop-guard.sh "$(stop_payload "$P")"
if printf '%s' "$OUT" | grep -q '"decision":"block"'; then ok "ledger changed: blocks again"; else bad "re-arm on change" "$OUT"; fi
rm -rf "$P"

echo "allowlist"
pre_payload() { python3 -c 'import json,sys; print(json.dumps({"session_id":"t","cwd":sys.argv[1],"hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":sys.argv[2]}}))' "$1" "$2"; }
allow_case() {
  # $1 expected exit (0 allowed, 2 refused), $2 command, $3 label
  run_hook allowlist.sh "$(pre_payload "$P" "$2")"
  if [ "$CODE" -eq "$1" ]; then ok "$3"; else bad "$3" "code=$CODE cmd=$2 $ERR"; fi
}
P="$(new_project)"
(cd "$P" && git init -q -b main && git -c user.email=a@b -c user.name=a commit -q --allow-empty -m init && git switch -qc ship/2026-10-16-a-x)
allow_case 0 "curl https://example.com" "no /ship run: nothing is refused"
write_ledger "$P" 2026-10-16-a running on ready
awk '/^```markdown$/{f=1; next} /^```$/{if (f) exit} f' "$REPO/skills/engineering/ship/CONTRACT.md" > "$P/.ship/2026-10-16-a/contract.md"
cp "$REPO/skills/engineering/setup-keelwork/commands.md" "$P/docs/agents/commands.md"
allow_case 0 "npm test -- notes" "contract template: a commands.md command with extra args is allowed"
allow_case 0 "npx eslint src/a.ts src/b.ts" "a {files} command is allowed with its files"
allow_case 0 "git status && git diff --stat | tail -5" "chained read-only git and shell are allowed"
allow_case 0 "grep -E \"a|b\" src/a.ts" "a pipe inside quotes isn't split"
allow_case 0 "mkdir -p .ship/2026-10-16-a/parked" "a path-prefix entry allows paths beneath it"
allow_case 0 "FOO=1 npm test" "leading env assignments are ignored"
allow_case 0 "git push -u origin ship/2026-10-16-a-x" "pushing the feature branch is allowed"
allow_case 0 "git push -u origin feature-main" "a branch merely containing 'main' isn't mistaken for main"
allow_case 2 "curl https://example.com" "a command off the allowlist is refused"
allow_case 2 "git status; rm -rf src" "a refused segment after an allowed one is still refused"
allow_case 2 "npm install slugify" "installing a dependency is refused"
allow_case 2 "git push origin main" "pushing to main is refused"
allow_case 2 "git push origin HEAD:main" "pushing to main through a refspec is refused"
allow_case 2 "git push --force -u origin ship/2026-10-16-a-x" "force push is refused"
allow_case 2 "git branch -D old" "branch deletion is refused"
(cd "$P" && git switch -q main)
allow_case 2 "git merge ship/2026-10-16-a-x" "merging while on main is refused"
if printf '%s' "$ERR" | grep -q "Park the ticket"; then ok "the refusal tells the agent to park"; else bad "refusal text" "$ERR"; fi
write_ledger "$P" 2026-10-16-a halted on ready
allow_case 0 "curl https://example.com" "halted run: nothing is refused"
rm -rf "$P"

echo "templates the skills teach stay parseable by the hooks"
# shellcheck source=../hooks/lib.sh
. "$HOOKS/lib.sh"
P="$(new_project)"
mkdir -p "$P/.ship/2026-10-16-a"
awk '/^```markdown$/{f=1; next} /^```$/{if (f) exit} f' "$REPO/skills/engineering/ship/LEDGER.md" > "$P/.ship/2026-10-16-a/ledger.md"
n="$(keelwork_open_ticket_count "$P/.ship/2026-10-16-a/ledger.md")"
if [ "$n" = "2" ]; then ok "LEDGER.md example: 2 open tickets (one ready, one in-progress)"; else bad "LEDGER.md example parse" "got $n"; fi
if [ "$(keelwork_running_ledgers "$P")" = "$P/.ship/2026-10-16-a/ledger.md" ]; then ok "LEDGER.md example: Status line is recognised"; else bad "LEDGER.md status line" "$(keelwork_running_ledgers "$P")"; fi
cp "$REPO/skills/engineering/setup-keelwork/commands.md" "$P/docs/agents/commands.md"
if [ "$(keelwork_command "$P" lint)" = "npx eslint {files}" ] && [ "$(keelwork_command "$P" typecheck)" = "npx tsc --noEmit" ] && [ "$(keelwork_command "$P" lint-extensions)" = "ts tsx js jsx" ]; then
  ok "commands.md seed template: lint, typecheck and lint-extensions parse"
else
  bad "commands.md template parse" "lint=$(keelwork_command "$P" lint) typecheck=$(keelwork_command "$P" typecheck) ext=$(keelwork_command "$P" lint-extensions)"
fi
rm -rf "$P"

echo
echo "$PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
