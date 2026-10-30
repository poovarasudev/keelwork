---
name: quick-finishing-a-dev-branch
description: "Quick hand-over of a branch: run the tests, commit everything pending, push the branch, then ask whether to open a PR."
disable-model-invocation: true
---

The user wants the branch handed over **fast**: no lint, typecheck or build, and no review. If they want those, tell them to run `/finishing-a-dev-branch` instead. **Never push to or merge into the main branch**, and never force-push.

1. **Check the branch.** Run `git branch --show-current` and `git status --short`. If the current branch is the main branch, stop and tell the user to take a branch first. If there is nothing to commit and nothing unpushed, say so and stop.
2. **Run the tests.** Call the Skill tool with "verify-before-done" for the **test** command in `docs/agents/commands.md` only. A failure off the known-failure list stops here: report it and commit nothing. Carry on to step 3 only if the user then tells you to go ahead anyway.
3. **Commit everything pending.** Read the `git status` output first. Leave out anything that looks like a secret or scratch file (`.env`, credentials, keys, logs) and name what you left out. Stage the rest with `git add -A`, then make one commit whose message follows the style of `git log --oneline -10` and describes what changed. Never `--amend`, never `--no-verify`. If a hook rejects the commit, report it.
4. **Push the branch.** Run `git push -u origin HEAD`. If `gh` is the tracker's CLI (`docs/agents/issue-tracker.md`), first confirm it is logged in with `gh auth status`; tell the user if it is not.
5. **Ask whether to open a PR.** Ask the user, and wait for the answer. Don't open one unprompted.
   - **Yes**: run `gh pr create --fill` (`glab mr create --fill` on GitLab), then print the PR URL. Add `Closes #<n>` lines only for issues the user named. If they want the full Summary, Evidence and Merge Danger body, tell them `/finishing-a-dev-branch` writes it.
   - **No**: say the branch is pushed and stop.

Finish by reporting, in order: the test result (command, exit code, summary line), the commit hash and message, the pushed branch, and the PR URL if one was opened.
