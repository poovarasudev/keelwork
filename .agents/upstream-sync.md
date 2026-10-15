# Upstream sync

Keelwork is a thin fork of [mattpocock/skills](https://github.com/mattpocock/skills). Once a month, one owner merges upstream in. The aim (SRD G4) is that this stays a small, routine job: within one working day. Upstream accepts PRs from collaborators only, so nothing flows the other way; the fork is a long-lived divergence, kept cheap by keeping it thin.

**Owner:** <name, to be assigned> (an open question in the SRD).

## Why a patch, not a merge

This repo's history starts at a snapshot of upstream `v1.3.1`, not at upstream's own commits, so `git merge upstream/main` would see two unrelated histories and conflict on every file. Instead, each sync takes upstream's **delta** since the last baseline and applies it on top of Keelwork with a three-way apply. Files Keelwork never touched apply cleanly; files listed in [`FORK-CHANGES.md`](../FORK-CHANGES.md) may conflict, and that list says what each Keelwork edit was and why, so it can be replayed by hand.

## Steps

1. **Fetch upstream into a sync branch.** Run `scripts/upstream-sync.sh <upstream-ref>` (a tag such as `v1.4.0`, or `upstream/main`). It adds the `upstream` remote if it's missing, fetches, creates `sync/upstream-<ref>` from `main`, and applies the delta from the baseline in `FORK-CHANGES.md` to `<ref>` with `git apply -3`. It prints the files that conflicted, marking the ones `FORK-CHANGES.md` lists. It never commits or pushes.
2. **Merge, replaying the edits in `FORK-CHANGES.md`.** For each conflicted file, take upstream's new version and re-apply the Keelwork change its row describes. Where upstream changed something Keelwork depends on (a renamed skill, a moved section, a changed `SKILL.md` that a Keelwork skill calls), fix the Keelwork side too. Then:
   - update the **Baseline** line in `FORK-CHANGES.md` to the new ref and commit;
   - regenerate `.agents/upstream-baseline.txt` (the script prints the command);
   - add any new upstream skill to `plugin.json`, the READMEs and `ask-matt` as CLAUDE.md requires, and decide whether a Keelwork skill now duplicates it.
3. **Run the full eval suite**, upstream regression included: `node scripts/check-repo.mjs`, `bash evals/hooks.test.sh`, `claude plugin validate .`, then `node evals/run.mjs all` (see [`evals/README.md`](../evals/README.md)). A failing upstream-regression case means a Keelwork edit broke upstream behaviour: fix it before releasing.
4. **Release a tagged version.** Add a changeset describing the sync (`npx changeset`), merge the sync branch to `main` through a PR, and let the release workflow version and tag it.

Then add a row to the log below.

## Sync log

| Date | Upstream from → to | Owner | Conflicts (files) | Evals | Release |
| --- | --- | --- | --- | --- | --- |
| 2026-10-15 | (fork created at `v1.3.1`) | Poovarasu Sekar | none | n/a | `1.3.1` rebranded |
