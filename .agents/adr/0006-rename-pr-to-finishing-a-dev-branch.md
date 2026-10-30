# Rename `pr` to `finishing-a-dev-branch`

`pr` is model-invoked, so its name and description sit in every session's skill list. A two-letter name matched ordinary chat about pull requests ("write the PR text", "what's in this PR"), and the skill fired when nobody was finishing a branch.

## Decision

Rename it to `finishing-a-dev-branch`, and lead its description with finishing a branch rather than with writing a PR body. Add a user-invoked sibling, `quick-finishing-a-dev-branch`, for the short path: run the tests, commit everything pending, push the branch, then ask whether to open a PR. The skill stays model-invoked because `/ship` calls it by name, and a user-invoked skill can't be called by another skill.

## Consequences

- This is the third upstream rename after ADR 0005. The tables in `scripts/upstream-sync.sh` and `scripts/check-repo.mjs` carry it; `FORK-CHANGES.md` lists it under **Renamed**.
- The docs page is a Keelwork page now, so its published URL is the page on GitHub, not `aihero.dev/skills-pr`.
- With the plugin installed the command reads `/keelwork:finishing-a-dev-branch`. Anyone who typed `/pr` must use the new name.
- `quick-finishing-a-dev-branch` skips lint, typecheck, build and review on purpose. It never pushes to the main branch and never opens a PR without being asked.
