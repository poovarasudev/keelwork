## What it does

`verify-before-done` is an evidence gate. Before the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) says work is done, fixed or passing, it runs the command that proves it, reads the whole output, and shows it: the command, the exit code, and the counts.

The command comes from the ticket or from `docs/agents/commands.md`, never guessed fresh, and failures are compared against the recorded **known failures**. A test that was already failing before the work started doesn't block the claim; a failure that wasn't on the list does. That is the difference from a plain "run the tests": it can tell a regression from old breakage.

## When to reach for it

Type `/verify-before-done`, or the agent reaches for it automatically before marking a ticket done, committing, opening a PR, or reporting that tests, lint, typecheck or a build pass. [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md), [implement-spec](https://aihero.dev/skills-implement-spec) and [pr](https://aihero.dev/skills-pr) call it at every "done".

## Prerequisites

`docs/agents/commands.md`, written by [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). Without it the skill falls back to the repo's own scripts and tells you to run setup.

## Evidence before claims

The leading idea is **fresh evidence**. A run from earlier in the session, a partial run, a subagent's report of a run, "should pass now": none of them count. The claim gets made only after the command ran in this turn and the output supports it. When it doesn't, the agent reports the actual status with the output instead.

| Claim | Proven by |
| --- | --- |
| Tests pass | The test command: no failures off the known-failure list |
| Types check | The typecheck command, exit 0 |
| Build succeeds | The build command, exit 0 |
| Ticket done | Every acceptance criterion checked, plus the ticket's verify command |
| A subagent finished | The diff shows the change, and the verify command passes |

## Common questions

**A test was failing before I touched anything. Will it block me forever?**

Not if it's on the known-failure list in `docs/agents/commands.md`. Setup records the baseline once; add or remove entries there as the baseline changes. A failure that isn't on the list blocks, because that's exactly what a regression looks like.

## It's working if

- Every "done" in the transcript sits right after a command and its output.
- Hedged words ("should", "probably") are replaced by a run.
- A pre-existing failure is named as known, not hidden and not treated as new.
- In a `/ship` run, every done ticket has a line under *Verify evidence* in the ledger.

## Where it fits

A **gate** that the build skills call at every claim of completion: [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) per ticket and at the finish, [implement-spec](https://aihero.dev/skills-implement-spec) per ticket, and [pr](https://aihero.dev/skills-pr) before handing a branch over. Its baseline comes from [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). [ask-matt](https://aihero.dev/skills-ask-matt) routes you over the whole set.
