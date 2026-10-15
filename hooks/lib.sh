#!/usr/bin/env bash
# Shared helpers for the Keelwork hooks. Sourced, never run directly.

# Read one string field from the hook's JSON input. $1 is the JSON, $2 a dotted
# path such as "tool_input.file_path". Prints nothing when the field is absent.
# Tries jq, then python3, then node, then a regex that handles flat string
# fields, so the hooks work on a machine with none of the three installed.
keelwork_json_get() {
  local json="$1" path="$2"
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$json" | jq -r ".${path} // empty" 2>/dev/null
    return
  fi
  if command -v python3 >/dev/null 2>&1; then
    printf '%s' "$json" | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
except ValueError:
    sys.exit(0)
for key in sys.argv[1].split("."):
    data = data.get(key) if isinstance(data, dict) else None
if data is not None:
    print(data if isinstance(data, str) else json.dumps(data))
' "$path" 2>/dev/null
    return
  fi
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$json" | node -e '
let raw = "";
process.stdin.on("data", (c) => (raw += c)).on("end", () => {
  let data;
  try { data = JSON.parse(raw); } catch { return; }
  for (const key of process.argv[1].split(".")) data = data && typeof data === "object" ? data[key] : undefined;
  if (data !== undefined && data !== null) console.log(typeof data === "string" ? data : JSON.stringify(data));
});
' "$path" 2>/dev/null
    return
  fi
  local key="${path##*.}"
  printf '%s' "$json" | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -n 1
}

# The project the session runs in.
keelwork_project_dir() {
  local cwd="$1"
  if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
    printf '%s' "$CLAUDE_PROJECT_DIR"
  elif [ -n "$cwd" ]; then
    printf '%s' "$cwd"
  else
    pwd
  fi
}

# Read one command from docs/agents/commands.md. $1 is the project dir, $2 the
# key. The file holds lines shaped "- **<key>**: `<command>`"; the first match
# wins, so the Commands list takes precedence over the explanations below it.
keelwork_command() {
  local file="$1/docs/agents/commands.md" key="$2"
  [ -f "$file" ] || return 0
  sed -n "s/^[[:space:]]*- \*\*${key}\*\*:[[:space:]]*\`\(.*\)\`[[:space:]]*\$/\1/p" "$file" | head -n 1
}

# Print the ledger paths of /ship runs that are running.
keelwork_running_ledgers() {
  local dir="$1" ledger
  for ledger in "$dir"/.ship/*/ledger.md; do
    [ -f "$ledger" ] || continue
    if grep -q '^Status:[[:space:]]*running[[:space:]]*$' "$ledger"; then
      printf '%s\n' "$ledger"
    fi
  done
}

# Count the tickets in a ledger's Tickets table whose status is ready or
# in-progress.
keelwork_open_ticket_count() {
  awk -F'|' '
    /^## / { in_table = ($0 ~ /^## Tickets[[:space:]]*$/); next }
    in_table && /^\|/ {
      status = $4
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", status)
      if (status == "ready" || status == "in-progress") count++
    }
    END { print count + 0 }
  ' "$1"
}
