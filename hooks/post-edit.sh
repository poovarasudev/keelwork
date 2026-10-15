#!/usr/bin/env bash
# Keelwork PostToolUse hook (SRD E2). After an edit, runs the repo's lint
# command on the edited file and its typecheck command, both read from
# docs/agents/commands.md. On failure it exits 2, which Claude Code reports
# back to the agent in the same turn. A repo without that file is left alone.
#
# Opt out per session with KEELWORK_POST_EDIT=off, or skip only the typecheck
# with KEELWORK_POST_EDIT_TYPECHECK=off.
set -uo pipefail

[ "${KEELWORK_POST_EDIT:-on}" = "off" ] && exit 0

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
. "$HOOK_DIR/lib.sh"

INPUT="$(cat || true)"
CWD="$(keelwork_json_get "$INPUT" cwd)"
DIR="$(keelwork_project_dir "$CWD")"
FILE="$(keelwork_json_get "$INPUT" tool_input.file_path)"
[ -n "$FILE" ] || FILE="$(keelwork_json_get "$INPUT" tool_input.notebook_path)"

[ -f "$DIR/docs/agents/commands.md" ] || exit 0
[ -n "$FILE" ] || exit 0

# Only files inside the project, and never generated or run-state directories.
case "$FILE" in
  /*) ;;
  *) FILE="$DIR/$FILE" ;;
esac
case "$FILE" in
  "$DIR"/*) ;;
  *) exit 0 ;;
esac
REL="${FILE#"$DIR"/}"
case "$REL" in
  .git/*|.ship/*|node_modules/*|*/node_modules/*) exit 0 ;;
esac
[ -f "$FILE" ] || exit 0

LINT="$(keelwork_command "$DIR" lint)"
TYPECHECK="$(keelwork_command "$DIR" typecheck)"
EXTENSIONS="$(keelwork_command "$DIR" lint-extensions)"

run_check() {
  # $1 is the label, $2 the command. Prints the failure tail and returns 1 on failure.
  local label="$1" cmd="$2" out status
  out="$(cd "$DIR" && bash -c "$cmd" 2>&1)"
  status=$?
  if [ $status -ne 0 ]; then
    printf '%s failed (exit %s): %s\n' "$label" "$status" "$cmd"
    printf '%s\n' "$out" | tail -n 40
    return 1
  fi
  return 0
}

REPORT=""
FAILED=0

case "$LINT" in
  *"{files}"*)
    lint_this=1
    if [ -n "$EXTENSIONS" ]; then
      lint_this=0
      ext="${REL##*.}"
      for allowed in $EXTENSIONS; do
        [ "$ext" = "${allowed#.}" ] && lint_this=1
      done
    fi
    if [ $lint_this -eq 1 ]; then
      quoted="'${REL//\'/\'\\\'\'}'"
      if ! out="$(run_check "Lint" "${LINT//\{files\}/$quoted}")"; then
        REPORT+="$out"$'\n'
        FAILED=1
      fi
    fi
    ;;
esac

if [ -n "$TYPECHECK" ] && [ "${KEELWORK_POST_EDIT_TYPECHECK:-on}" != "off" ]; then
  if ! out="$(run_check "Typecheck" "$TYPECHECK")"; then
    REPORT+="$out"$'\n'
    FAILED=1
  fi
fi

if [ $FAILED -eq 1 ]; then
  {
    echo "Keelwork post-edit checks failed after editing $REL. Fix these before moving on (a failure listed under Known failures in docs/agents/commands.md is pre-existing):"
    printf '%s' "$REPORT"
  } >&2
  exit 2
fi

exit 0
