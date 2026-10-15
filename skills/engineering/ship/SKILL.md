---
name: ship
description: "Take one feature from idea to reviewed PR: set the course with you, run the tickets unattended, and leave a morning report. `/ship resume` continues a run."
disable-model-invocation: true
---

# Ship

Run one feature through the **KEEL loop**. The human is here for **Know** and **Elaborate** (steps 1-7), away for **Execute** (steps 8-9), and back for **Learn** (step 10, the morning report). Between step 7 and the report you ask nothing: you decide two-way doors and log them, and you **park** anything that needs the human, then carry on with the next ready ticket.

The **ledger** at `.ship/<run-id>/ledger.md` is the run's memory. Write every state change to it the moment it happens, and re-read it whenever you're unsure where you are; it is what survives context compaction and restarts. Its format is in [LEDGER.md](LEDGER.md).

## Before you start

- `docs/agents/issue-tracker.md` and `docs/agents/commands.md` must exist. If either is missing, tell the user to run `/setup-matt-pocock-skills` and stop.
- The working tree is clean. If it isn't, ask the user to commit or stash first.
- `/ship resume [run-id]` skips everything below: go to **Resuming a run**.

Create the run: pick the run id `<YYYY-MM-DD>-<letter>` (`a` for the day's first run, then `b`, ...), create `.ship/<run-id>/`, and start the ledger with `Status: preflight` and `Phase: know`. Keep `.ship/` out of git by adding it to `.git/info/exclude`, which ignores it without touching any tracked file. The one exception: when `docs/agents/autonomy-contract.md` says `Run history: committed`, leave it unignored, and commit the run's ledger and report on the feature branch at the finish.

## With the human

### 1. Discovery (optional)

Ask one question: is the idea already chosen? If yes, or the user passed a file from a discovery session, take the idea and go straight to step 3 with no further questions.

If not, run discovery from [DISCOVERY.md](DISCOVERY.md): it generates and ranks ideas, and the user picks one.

### 2. Red-team (optional)

Only after discovery: ask whether to red-team the chosen idea, following [DISCOVERY.md](DISCOVERY.md). Every assumption it flags as critical must be **kept** or **reworked** by the user before step 3; record each answer in the ledger's *Decisions*. If the user **drops** the idea instead, go back to step 1, or end the run if they'd rather stop.

### 3. Design brainstorming

Call the Skill tool with "brainstorming". Tell it this is the `/ship` design step and that its design draft goes to `.ship/<run-id>/design.md`. The user picks an approach there.

### 4. Grill

Ask which grill style to use for this run, every run, never carried over from a previous one:

- **grill-me**: decisions only. Call the Skill tool with "grilling".
- **grill-with-docs**: decisions, plus `GLOSSARY.md` and ADR updates. Call the Skill tool twice, for "grilling" and "domain-modeling".

Either way, tell grilling this is a `/ship` run (so it applies autonomy prep) and give it the design draft as its starting point. Record the style in the ledger's *Grill style*.

### 5. Autonomy contract and preflight

Draft the run's **autonomy contract** at `.ship/<run-id>/contract.md` from [CONTRACT.md](CONTRACT.md), and walk the user through it: two-way doors, one-way doors (plus the team's entries from `docs/agents/autonomy-contract.md`, if it exists), the budget, the command allowlist, and the **finish action** (push the branch, or open a PR). Each gets a recommended default the user can accept in a word.

Then preflight:

- Run the **test** command once and compare against the **known failures** in `docs/agents/commands.md`. If anything new fails, the user decides now: fix it first, or record it as a known failure for this run.
- Create the feature branch `ship/<run-id>-<slug>` from the main branch, and record it and the base commit in the ledger.
- Ask whether to turn on the stop guard (the `/ship` stop hook, which keeps the session going while tickets are ready). Default on. Record it as `Stop guard: on` or `off`.

### 6. Spec and detailed plan

Call the Skill tool with "to-spec", then call it again with "to-tickets". The tickets are detailed plans; the user approves the breakdown at `to-tickets`' quiz step, and that approval is the **plan approval**. Copy every ticket into the ledger's *Tickets* table, with its blocking edges. On a local tracker, commit the spec and ticket files on the feature branch as the run's first commit, so every later ticket commit can update its ticket's status.

If the plan exceeds the budget's ticket limit, say so now and let the user cut or split the feature.

### 7. Execution mode

Ask once:

- **Subagent per ticket**: a fresh implementer subagent per ticket. Ready tickets may run in parallel when their *Files* lists don't overlap.
- **Inline**: you implement each ticket in this session, one at a time.

Record it in the ledger, set `Status: running` and `Phase: execute`, and tell the user the course is set: what will run, and that the morning report will be at `.ship/<run-id>/morning-report.md`. From here on you ask nothing.

## Unattended

### 8. Per-ticket loop

Follow [RUN-LOOP.md](RUN-LOOP.md): implement, spec review, quality review, fix, verify, commit, for every ready ticket. Two-way doors are decided and logged; one-way doors park the ticket. A blocked ticket never ends the run: park it and move on. Halt only on the conditions RUN-LOOP.md lists.

### 9. Finish

When no ticket is ready or in progress, run the finish in [RUN-LOOP.md](RUN-LOOP.md): the full suite, a whole-branch review, the security and performance audits, then the `pr` skill with the contract's finish action.

## With the human again

### 10. Morning report

Write `.ship/<run-id>/morning-report.md` from [MORNING-REPORT.md](MORNING-REPORT.md), set the ledger to `Status: finished` (or `halted`, with the reason) and `Phase: learn`, and end the session by pointing the user at the report.

## Resuming a run

`/ship resume` takes the run id, or the newest `.ship/*/ledger.md` whose status isn't `finished`. Re-read the ledger, the contract and `git log` on the run's branch; trust them over your memory. Then:

- Tickets marked `done` stay done. A ticket marked `in-progress` restarts its loop from the last step the ledger records for it, after checking its working-tree changes still exist.
- A `halted` run resumes only after the user has answered what halted it. Record each answer in *Decisions*, unpark the tickets it unblocks, and set `Status: running`.
- A run still in `preflight` (it died during steps 1-7) resumes, with the user, at the first step whose output is missing.

## Rules that hold all run

- **Never merge** into the main branch, and never push to it. Merge is the human's decision.
- **Never delete a branch** that has unmerged work.
- **Run only allowlisted commands.** A command outside the contract's allowlist is a one-way door: park the ticket that needs it.
- **Every decision you make goes in the ledger** with its reason; the morning report lists them for the human to skim.
- **Evidence before done.** No ticket is `done` without verify output in the ledger (the `verify-before-done` skill).
