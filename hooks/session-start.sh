#!/usr/bin/env bash
# Keelwork SessionStart hook (SRD E1). Runs at startup, resume, /clear and
# after compaction, and prints a short reminder that Claude Code adds to the
# session's context. It stays under ten lines and never injects skill text.
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
. "$HOOK_DIR/lib.sh"

INPUT="$(cat || true)"
CWD="$(keelwork_json_get "$INPUT" cwd)"
SOURCE="$(keelwork_json_get "$INPUT" source)"
DIR="$(keelwork_project_dir "$CWD")"

echo "Keelwork is active."
echo "- Build requests start with grilling: /keelwork:grill-with-docs in a repo, /keelwork:grill-me outside one."
echo "- Unattended work runs through /keelwork:ship, which settles every question up front and parks what needs a human."
echo "- Claim done only with fresh verify output (the verify-before-done skill); commands live in docs/agents/commands.md."

while IFS= read -r ledger; do
  [ -n "$ledger" ] || continue
  run="$(basename "$(dirname "$ledger")")"
  if [ "$SOURCE" = "compact" ]; then
    echo "- /ship run $run is in progress and context was just compacted: re-read .ship/$run/ledger.md before doing anything else, and trust it over memory."
  else
    echo "- /ship run $run is in progress (.ship/$run/ledger.md). /keelwork:ship resume continues it."
  fi
done < <(keelwork_running_ledgers "$DIR")

exit 0
