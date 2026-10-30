#!/usr/bin/env bash
set -euo pipefail

# Step 1 of the monthly upstream sync (see .agents/upstream-sync.md).
#
#   scripts/upstream-sync.sh <upstream-ref>
#
# Fetches mattpocock/skills, creates sync/upstream-<ref> from main, and applies
# upstream's delta from the baseline recorded in FORK-CHANGES.md to <ref> with a
# three-way apply. Prints the conflicted files, marking those FORK-CHANGES.md
# lists. It never commits, pushes or merges: resolving and releasing is the
# owner's job (steps 2 to 4).

UPSTREAM_URL="https://github.com/mattpocock/skills.git"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

if [ $# -ne 1 ]; then
  echo "usage: scripts/upstream-sync.sh <upstream-ref>   (e.g. v1.4.0 or upstream/main)" >&2
  exit 1
fi
TARGET="$1"

if [ -n "$(git status --porcelain)" ]; then
  echo "error: the working tree has changes. Commit or stash them first." >&2
  exit 1
fi

BASELINE="$(sed -n 's/^\*\*Baseline:\*\* tag `[^`]*`, commit `\([0-9a-f]\{40\}\)`.*/\1/p' FORK-CHANGES.md)"
if [ -z "$BASELINE" ]; then
  echo "error: couldn't read the baseline commit from FORK-CHANGES.md." >&2
  exit 1
fi

if ! git remote get-url upstream >/dev/null 2>&1; then
  git remote add upstream "$UPSTREAM_URL"
fi
git fetch --quiet upstream --tags

TARGET_SHA="$(git rev-parse --verify "$TARGET^{commit}")"
if [ "$TARGET_SHA" = "$BASELINE" ]; then
  echo "Already at $TARGET ($TARGET_SHA). Nothing to sync."
  exit 0
fi

SAFE_NAME="$(printf '%s' "$TARGET" | tr '/' '-')"
BRANCH="sync/upstream-$SAFE_NAME"
git switch --quiet -c "$BRANCH" main
echo "On $BRANCH. Applying upstream ${BASELINE:0:7}..${TARGET_SHA:0:7}."

PATCH="$(mktemp)"
# Keelwork renamed three upstream skills (FORK-CHANGES.md, "Renamed"); rewrite their
# paths in the patch so upstream's changes land on the renamed files.
git diff --binary "$BASELINE" "$TARGET_SHA" \
  | sed -e 's#skills/engineering/ask-matt#skills/engineering/ask-keelwork#g' \
        -e 's#skills/engineering/setup-matt-pocock-skills#skills/engineering/setup-keelwork#g' \
        -e 's#docs/engineering/ask-matt\.md#docs/engineering/ask-keelwork.md#g' \
        -e 's#docs/engineering/setup-matt-pocock-skills\.md#docs/engineering/setup-keelwork.md#g' \
        -e 's#skills/engineering/pr/#skills/engineering/finishing-a-dev-branch/#g' \
        -e 's#docs/engineering/pr\.md#docs/engineering/finishing-a-dev-branch.md#g' > "$PATCH"
if git apply -3 --index "$PATCH"; then
  echo "Applied cleanly."
else
  echo "Applied with conflicts."
fi
rm -f "$PATCH"

# Upstream's pending changesets name upstream's package. Point them at keelwork,
# so upstream's change notes flow into Keelwork's release notes instead of
# breaking `changeset version`.
RETARGETED=""
for f in $(git diff --cached --name-only --diff-filter=A -- .changeset/); do
  case "$f" in
    *.md)
      if grep -q '^"mattpocock-skills":' "$f"; then
        sed -i.bak 's/^"mattpocock-skills":/"keelwork":/' "$f" && rm -f "$f.bak"
        git add "$f"
        RETARGETED="$RETARGETED $f"
      fi
      ;;
  esac
done
if [ -n "$RETARGETED" ]; then
  echo
  echo "Upstream changesets retargeted to the keelwork package (review their wording):"
  for f in $RETARGETED; do echo "  $f"; done
fi

CONFLICTS="$(git diff --name-only --diff-filter=U)"
if [ -n "$CONFLICTS" ]; then
  echo
  echo "Conflicted files (* = listed in FORK-CHANGES.md, replay its row):"
  while IFS= read -r f; do
    if grep -qF "\`$f\`" FORK-CHANGES.md; then
      echo "  * $f"
    else
      echo "    $f"
    fi
  done <<< "$CONFLICTS"
fi

echo
echo "Changed upstream files that Keelwork also edits (check the replay even if they applied cleanly):"
git diff --name-only "$BASELINE" "$TARGET_SHA" | while IFS= read -r f; do
  if grep -qF "\`$f\`" FORK-CHANGES.md; then echo "  $f"; fi
done

echo
echo "Next (see .agents/upstream-sync.md):"
echo "  1. Resolve conflicts, replaying each FORK-CHANGES.md row."
echo "  2. Set the Baseline line in FORK-CHANGES.md to: tag \`$TARGET\`, commit \`$TARGET_SHA\`"
echo "  3. Regenerate the baseline manifest:"
echo "     { head -n 2 .agents/upstream-baseline.txt | sed 's|v[0-9.]* ([0-9a-f]*)|$TARGET ($TARGET_SHA)|'; git ls-tree -r $TARGET_SHA | awk '{print \$3\" \"\$4}'; } > .agents/upstream-baseline.txt.new && mv .agents/upstream-baseline.txt.new .agents/upstream-baseline.txt"
echo "  4. node scripts/check-repo.mjs && bash evals/hooks.test.sh && node evals/run.mjs all"
