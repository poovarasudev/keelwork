# Run loop

Steps 8 and 9 of `/ship`, run with nobody at the keyboard. You have the approved tickets, the contract and the ledger. Every judgement call is yours to make within the contract; everything outside it is parked. Re-read the ledger at the start of every ticket.

## Picking work

The **frontier** is every ticket whose status is `ready`. Take tickets in ID order.

- **Inline mode**: one ticket at a time, in this session.
- **Subagent mode**: one fresh implementer subagent per ticket. Several ready tickets may run in parallel only when their *Files* lists share no file and their verify commands don't run each other's tests. When in doubt, run them one after another.

Before taking a ticket, check the budget: if the ticket count, the time limit or the parked-ticket limit is reached, stop picking work and go to **Halting**.

## The per-ticket loop

Run every ticket through these steps in order. Each step writes a log line to the ledger.

### 1. Start

Set the ticket to `in-progress` and log its base commit (`git rev-parse HEAD`).

### 2. Implement

Build the ticket from its plan, calling the Skill tool with "tdd" at the ticket's seams.

In subagent mode, dispatch a fresh implementer subagent with only what it needs: the ticket file path ("read this first; it is your requirements"), the contract path, `docs/agents/commands.md`, and any ruling from an earlier ticket that touches its files. Never paste the run's history. The implementer:

- builds the ticket with the "tdd" skill, and runs its verify command;
- doesn't commit, and doesn't dispatch subagents of its own (reviews come from you);
- stops and reports `NEEDS_DECISION` with the exact question when it meets a one-way door;
- reports the files it changed, the verify output, and anything it was unsure of.

Check its claims against `git diff` rather than trusting the report.

### 3. Doors

Whenever the work needs a decision, classify it against the contract:

- **Two-way door**: decide, append it to *Decisions* (`D<n> · <ticket> · two-way · <decision>. Why: <reason>. If wrong: <cost to undo>.`), and continue.
- **One-way door**: **park** the ticket (below), then continue with the next ready ticket.

Unsure which kind it is? It's a one-way door.

### 4. Spec review

Dispatch a fresh reviewer subagent (in both modes: the session that wrote the code doesn't grade it). Give it the ticket file, the diff since the ticket's base (`git diff <base>` including untracked files the ticket created), and the contract's out-of-scope list. It reports:

- **Missing**: acceptance criteria or definition-of-done items not met, quoting the ticket line;
- **Extra**: behaviour the ticket didn't ask for;
- **Misunderstood**: the right thing built the wrong way.

Verdict `pass` only with no finding in any of the three.

### 5. Quality review

Only after the spec review passes. Call the Skill tool with "code-review", with the ticket's base commit as the fixed point and the ticket file as the spec. (Code-review loads the matching stack checklists itself.)

### 6. Fix

Call the Skill tool with "receiving-code-review" on every finding from steps 4-5. Log each one in *Review findings* as `accepted` (with the fix) or `rejected` (with the reason).

Fix the accepted findings, then re-run the review that failed: a spec fix re-runs the spec review and then the quality review. Each fix plus its re-review is one **round**; update the ticket's *Rounds* column.

At the contract's round limit, stop fixing. Then judge what's still open:

- the ticket's acceptance criteria are met and nothing open is critical: log the open findings for the morning report and continue to verify;
- an acceptance criterion is unmet, or a finding is critical (a regression, a security hole, data loss): **park** the ticket.

### 7. Verify

Call the Skill tool with "verify-before-done" with the ticket's verify command, then with the **test** command. Append the evidence to *Verify evidence*.

A failure on the known-failure list is not a blocker. Any other failure that wasn't there at the ticket's base is a **regression**: go back to step 6 if rounds remain. A regression still failing after the last round is a halt condition.

### 8. Commit

Stage only the ticket's files, commit as `<ticket id>: <ticket title>`, record the commit in the *Tickets* table, and set the ticket to `done`. On a local tracker, set the ticket file's `Status:` to `done` in the same commit. On a real tracker, leave the issue open: the PR closes it.

Recompute which tickets are now `ready`, and pick the next one.

## Parking

Parking sets a ticket aside without stopping the run.

1. If the ticket has uncommitted changes, save them: `git diff -- <its files>` (plus new files) to `.ship/<run-id>/parked/<id>.patch`, then restore those files so the next ticket starts from a clean tree.
2. Set the ticket to `parked`, and append to *Parked*: `P<n> · <ticket> · <reason> · Question: "<the exact question the human must answer>" · Patch: <path or none>`.
3. Set every ticket blocked by it to `blocked`; they wait for the human.
4. Continue with the next ready ticket.

The question is the most important line: write it so the human can answer in one sentence without opening anything else, and say what you'd do with each answer.

## Halting

A single blocked ticket never ends the run. Halt only when:

- no ticket is `ready` or `in-progress`, but tickets remain that aren't `done` (everything left is parked or blocked by a parked ticket);
- a regression survived the last fix round;
- parked tickets are more than half the plan;
- the budget ran out.

To halt: log `Halted: <reason>` under the ledger header, set `Status: halted`, run the **finish** below with whatever is `done` (skip it if nothing is), and write the morning report.

## Finish

When no ticket is `ready` or `in-progress`, set `Phase: finish` and run, in order:

1. **Full suite**: call the Skill tool with "verify-before-done" for the **test**, **lint**, **typecheck** and **build** commands. A regression goes back to the ticket that caused it if rounds remain; otherwise it's a halt.
2. **Whole-branch review**: call the Skill tool with "code-review", with the merge-base with the main branch as the fixed point and the spec as the spec. Run its findings through "receiving-code-review", then one fix wave and one re-review. Log what remains.
3. **Security audit**: call the Skill tool with "security-audit" over the branch diff, writing its report to `.ship/<run-id>/security-audit.md`.
4. **Performance audit**: call the Skill tool with "performance-audit" over the branch diff, writing its report to `.ship/<run-id>/performance-audit.md`.
5. **Critical findings block the PR.** Give each critical audit finding one fix wave and one re-audit. If any critical finding survives, downgrade the finish action from `open-pr` to `push-branch`, and say why in the report.
6. **PR**: call the Skill tool with "pr", passing the finish action, the spec and ticket references, and the fact that the full suite and the whole-branch review already ran at this commit (with the ledger as evidence), so it doesn't repeat them.

Record each result in the ledger's *Finish* section, then go to step 10.
