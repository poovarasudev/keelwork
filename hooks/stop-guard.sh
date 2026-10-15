#!/usr/bin/env bash
# Keelwork Stop hook (SRD E3, optional). While a /ship run's ledger says
# "Status: running" and "Stop guard: on", and its Tickets table still has a
# ready or in-progress ticket, it blocks the session from ending and tells the
# agent to carry on. Outside a running /ship run it never blocks.
#
# To avoid trapping a stuck session, it lets the session stop once it has
# blocked three times in a row with the ledger unchanged.
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
. "$HOOK_DIR/lib.sh"

INPUT="$(cat || true)"
CWD="$(keelwork_json_get "$INPUT" cwd)"
DIR="$(keelwork_project_dir "$CWD")"
MAX_UNCHANGED_BLOCKS=3

while IFS= read -r ledger; do
  [ -n "$ledger" ] || continue
  grep -q '^Stop guard:[[:space:]]*on[[:space:]]*$' "$ledger" || continue

  open="$(keelwork_open_ticket_count "$ledger")"
  [ "$open" -gt 0 ] || continue

  run_dir="$(dirname "$ledger")"
  run="$(basename "$run_dir")"
  state="$run_dir/.stop-guard"
  sum="$(cksum < "$ledger" | awk '{print $1}')"
  count=1
  if [ -f "$state" ]; then
    read -r last_sum last_count < "$state" || true
    if [ "${last_sum:-}" = "$sum" ]; then
      count=$(( ${last_count:-0} + 1 ))
    fi
  fi
  printf '%s %s\n' "$sum" "$count" > "$state" 2>/dev/null || true

  if [ "$count" -gt "$MAX_UNCHANGED_BLOCKS" ]; then
    echo "Keelwork stop guard: /ship run $run still has $open open ticket(s), but the ledger hasn't changed across $MAX_UNCHANGED_BLOCKS stops, so the session may end. Halt the run in the ledger if it is stuck." >&2
    continue
  fi

  reason="/ship run $run still has $open ready or in-progress ticket(s) in .ship/$run/ledger.md. Re-read the ledger and continue the run loop. If the run can't go on, record why and set Status: halted (see the ship skill's halting rules) instead of stopping."
  reason="${reason//\\/\\\\}"
  reason="${reason//\"/\\\"}"
  printf '{"decision":"block","reason":"%s"}\n' "$reason"
  exit 0
done < <(keelwork_running_ledgers "$DIR")

exit 0
