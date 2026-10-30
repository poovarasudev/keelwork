## What it does

`quick-finishing-a-dev-branch` is the short way to hand a branch over: it runs the tests, commits everything pending in one commit, pushes the branch, and then asks you whether to open a PR. It is the light sibling of [finishing-a-dev-branch](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/finishing-a-dev-branch.md).

It skips the review. There is no lint, typecheck or build run and no whole-branch [code-review](https://aihero.dev/skills-code-review), and it never opens a PR until you say yes. It also never pushes to the main branch, never force-pushes and never merges.

## When to reach for it

You invoke this by typing `/quick-finishing-a-dev-branch`, and the agent won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| A small change, you just want it tested, committed and pushed | `quick-finishing-a-dev-branch` |
| A feature that should be reviewed against its spec before anyone else sees it | [finishing-a-dev-branch](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/finishing-a-dev-branch.md) |
| A whole feature, idea to PR, unattended | [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) |

## Prerequisites

A test command in `docs/agents/commands.md`, which [setup-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/setup-keelwork.md) writes. Without it the skill falls back to the command the repo's own scripts expose. Pushing and opening the PR use `git` and `gh` (or `glab` on GitLab), which must be logged in.

## Four steps, in order

1. **Test.** Only the test command, through [verify-before-done](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/verify-before-done.md). A failure off the known-failure list stops everything: nothing is committed.
2. **Commit.** One commit of everything pending, except files that look like secrets or scratch (it names what it left out).
3. **Push.** `git push -u origin HEAD`.
4. **Ask.** Whether to open a PR. Yes runs `gh pr create --fill`; no leaves the branch pushed.

## Common questions

**Why `git push` and not `gh`?**

`gh` has no push command. It owns the PR step and the login check, and `git` pushes with the credentials `gh auth` set up.

**It stopped on a failing test. How do I push anyway?**

Fix the test, or tell the agent to go ahead after it reports the failure. It will not commit a failing run on its own.

**Can I get the Summary, Evidence and Merge Danger body?**

Not here: `--fill` builds the body from your commit. Run [finishing-a-dev-branch](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/finishing-a-dev-branch.md) for that.

## It's working if

- The test output appears before the commit, and nothing is committed on a red run.
- You get one commit, a pushed branch, and a question about the PR rather than a PR you did not ask for.
- The main branch is untouched.

## Where it fits

A **reach-for-it-anytime standalone**, the quick exit at the end of a build. For the full hand-over use [finishing-a-dev-branch](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/finishing-a-dev-branch.md); for review first use [code-review](https://aihero.dev/skills-code-review). [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes across the whole set.
