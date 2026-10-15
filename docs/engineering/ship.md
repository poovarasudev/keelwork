## What it does

`ship` takes one feature from idea to a reviewed pull request, with you present only at the start and the end. It runs the **KEEL loop**: you and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) **Know** what to build and **Elaborate** it into tickets together; the agent **Executes** them unattended, overnight if you like; and you **Learn** what happened from a morning report.

Once you approve the plan, it asks you nothing. Every question a long run would otherwise stop on is either settled up front, decided by the agent and logged (a **two-way door**), or **parked**: set aside with the exact question for you, while the run carries on with the next ready ticket. A single blocked ticket never ends the run, and the run never merges.

## When to reach for it

You invoke this by typing `/ship`, and the agent won't reach for it on its own. `/ship resume` continues a run that halted or was interrupted.

| Your situation | Reach for |
| --- | --- |
| A scoped feature you want built while you're away | `/ship` |
| You want to steer each step yourself | the hand-driven chain: [grill-with-docs](https://aihero.dev/skills-grill-with-docs), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets), [implement-spec](https://aihero.dev/skills-implement-spec) |
| No idea chosen yet | `/ship` runs discovery inline, or run [brainstorm-ideas-new](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-new.md) first and hand `/ship` the file |
| A huge, foggy effort that one feature can't hold | [wayfinder](https://aihero.dev/skills-wayfinder) first |
| A run stopped or the session died | `/ship resume` |

## Prerequisites

- [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) has run in this repo, so the issue tracker, the commands and the **known-failure** baseline are recorded. `ship` stops and tells you to run it otherwise.
- A clean working tree. `ship` creates its own feature branch.
- For overnight runs, a [harness](https://www.aihero.dev/ai-coding-dictionary/harness) session that can keep going without approval prompts on the commands you allowlist.

It writes its run state to `.ship/<run-id>/` (the ledger, the contract, the design draft, the audit reports and the morning report), which it keeps out of git unless your team opts in to committing run history.

## The ten steps

| Step | With you? | What happens |
| --- | --- | --- |
| 1. Discovery | optional | Ideas from product, design and engineering perspectives, ranked; you pick one |
| 2. Red-team | optional | The chosen idea's load-bearing assumptions attacked; you keep, rework or drop each critical one |
| 3. Design brainstorming | yes | Two or three approaches with trade-offs and YAGNI cuts, via [brainstorming](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/brainstorming.md); you pick |
| 4. Grill | yes | You choose `grill-me` or `grill-with-docs` style, every run; [grilling](https://aihero.dev/skills-grilling) adds **autonomy prep** |
| 5. Contract and preflight | yes | The autonomy contract, the test baseline re-checked, the feature branch created |
| 6. Spec and plan | yes | `to-spec`, then `to-tickets` with a detailed plan per ticket; you approve the plan |
| 7. Execution mode | yes | A fresh [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) per ticket, or inline |
| 8. Per-ticket loop | no | Implement, spec review, quality review, fix, verify, commit |
| 9. Finish | no | Full suite, whole-branch review, security and performance audits, then a pushed branch or an open PR |
| 10. Morning report | yes, again | What shipped, the parked questions, the decisions to skim, the review findings |

## The autonomy contract

The contract is the run's standing orders, agreed at step 5. **Two-way doors** (private names, internal structure, test layout, a reviewer finding that's wrong for this codebase) the agent decides and logs with a reason. **One-way doors** always park: schema changes and migrations, public API changes, new dependencies, anything touching auth or payments, data deletion, and any command outside the allowlist. Your team adds its own entries in `docs/agents/autonomy-contract.md`, and each morning report suggests more.

The allowlist isn't just advice. With the plugin installed, a hook checks every shell command during a running `/ship` run against the contract's allowlist, refuses anything else (and always refuses pushing to or merging into the main branch, force pushes and branch deletion), and tells the agent to park the ticket instead.

The contract also fixes the budget (tickets per run, fix rounds per ticket, a time limit) and the **finish action**: push the branch, or open a PR.

## The ledger

`.ship/<run-id>/ledger.md` is the run's memory. Every ticket status, review round, commit, decision and parked question is written there the moment it happens. A [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) that compacts mid-run, or a session that dies, loses nothing: the agent re-reads the ledger and `git log` and continues from the last recorded step, without redoing finished tickets. The optional stop hook reads the same ledger to keep the session going while tickets are ready.

## Common questions

**What happens when the agent hits a question at 3am?**

If the contract says it's a two-way door, the agent decides, writes the decision and its reason to the ledger, and carries on; you skim those in the morning. If it's a one-way door, the ticket is parked with the exact question, and anything blocked by that ticket waits. The run halts only when nothing is left to work on, a regression can't be fixed, more than half the plan is parked, or the budget runs out.

**Will it merge or push to main?**

No. It works on its own `ship/<run-id>-<slug>` branch, never pushes to the main branch, never merges, and never deletes a branch with unmerged work. The most it does is push its branch and open a PR, and only if you chose that finish action.

**Why does it ask the grill style every time?**

Because the right depth changes per feature. A small change needs only decisions (`grill-me` style); a feature that introduces new domain language should update `GLOSSARY.md` and the ADRs as well (`grill-with-docs` style). The choice is stored in the ledger, never carried over from the last run.

**Can I run it without the overnight part?**

Yes. Nothing requires you to leave. The value of the unattended half is that it doesn't need you, not that you must be absent; watching a run is a good way to tune the contract.

## It's working if

- After you approve the plan, the session doesn't ask you anything until the morning report.
- Every parked item in the report has a question you can answer in one sentence without opening anything else.
- The decisions list reads like calls you'd have made, and the ones you wouldn't are cheap to undo.
- An interrupted run picks up from the ledger without redoing a finished ticket.
- The run ends on a branch or an open PR, never a merge.

## Where it fits

`ship` is the main build chain run for you: `grill-with-docs → to-spec → to-tickets → implement-spec → code-review → pr`, with discovery in front and audits behind. It calls [brainstorming](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/brainstorming.md), [grilling](https://aihero.dev/skills-grilling), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets), [tdd](https://aihero.dev/skills-tdd), [code-review](https://aihero.dev/skills-code-review), [verify-before-done](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/verify-before-done.md), [receiving-code-review](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/receiving-code-review.md), [security-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/security-audit.md), [performance-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/performance-audit.md) and [pr](https://aihero.dev/skills-pr). [ask-matt](https://aihero.dev/skills-ask-matt) routes you when you are not sure whether a feature is ready for it.
