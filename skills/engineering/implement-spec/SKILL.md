---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Execution mode

Before implementing anything, ask the user which execution mode to use, and wait for the answer. Never pick one silently; skip the question only when the user already named a mode when invoking you.

- **Subagent per ticket**: a fresh implementer subagent per ticket, each in its own worktree, running ready tickets in parallel. Best for larger specs with independent tickets.
- **Inline**: you implement each ticket yourself in this session, one at a time in frontier order, committing straight onto the integration branch. Best for small specs, or tightly coupled tickets.

## The per-ticket loop

Both modes put every ticket through the same loop, in this order:

1. **Implement** the ticket, calling the Skill tool with "tdd" at the ticket's seams.
2. **Spec review**: a fresh reviewer subagent compares the ticket's diff against its acceptance criteria and definition of done, and reports what is missing, what is extra, and what was misunderstood. It quotes the ticket line for each finding.
3. **Quality review**, only once the spec review passes: call the Skill tool with "code-review", with the ticket's base commit as the fixed point and the ticket as the spec.
4. **Fix**: call the Skill tool with "receiving-code-review" on the findings, fix the ones it accepts, and re-run the review that failed (a spec fix re-runs the spec review, then the quality review). Stop at **3 fix rounds** per ticket unless the user set another limit, and report the findings still open.
5. **Verify**: call the Skill tool with "verify-before-done" with the ticket's verify command.
6. **Commit** the ticket.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Run each ready ticket through the per-ticket loop.
   - **Inline mode**: work the frontier one ticket at a time yourself, committing each ticket on the integration branch, then skip to step 7.
   - **Subagent mode**: use **implementer subagents**, each in its own worktree on its own branch. Each implementer subagent:
     - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
     - calls the Skill tool with `tdd` to build the ticket;
     - calls the Skill tool with `verify-before-done`, then commits;
     - merges the integration branch tip into its own branch before reporting done.

     You run the spec and quality reviews on its branch, and send fix rounds back to the same implementer.

5. Once an **implementer subagent**'s ticket has passed both reviews, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, call the Skill tool with `code-review` on the integration branch. Fix all issues raised by the code review in a single **implementer subagent** (inline mode: fix them yourself).

8. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

9. Clean up all **implementer subagent** worktrees.
