# Morning report

Step 10 of `/ship`. The report is the only thing the human reads after the run, possibly a client with no context, so every section has a plain heading and every item stands on its own. Build it from the ledger; write it to `.ship/<run-id>/morning-report.md`.

## Template

```markdown
# Morning Report · run <run-id>

**Feature:** <one line>
**Outcome:** <finished | halted: reason> · **Branch:** <name> · **PR:** <url, or "not opened: reason">
**Tickets:** <n> shipped · <n> parked · <n> blocked

## Shipped
One entry per done ticket: the title, the commit, and its verify output in one line.

- **01 Archive a note from the list** · `9be41d0` · `npm test -- notes/archive`: 12 passed

## Parked: needs your decision
One entry per parked ticket, with the exact question and what happens for each answer. Numbered as in the ledger, so answers can say "P1: hard delete".

- **P1 · 04 Purge archived notes after 30 days** · data deletion
  Purging deletes rows permanently. Hard delete after 30 days, or keep soft-deleted rows forever?
  If hard delete: ticket 04 runs as planned. If keep: 04 is dropped and 05 is unblocked.

## Decisions made: to skim
Every decision the agent made alone, with its reason and what it costs to undo.

- **D1 · 01** Named the flag `archivedAt`, not `isArchived`, so restore can show the date. Undo: rename in one file.

## Review findings
Whole-branch review, security audit and performance audit. Criticals first; say what was fixed and what is still open.

## Suggested rule updates
New entries for `docs/agents/autonomy-contract.md`, drawn from this run: a decision that should have been a one-way door, a door that parked work needlessly, a command worth adding to the allowlist, a budget that was too tight or too loose.
```

## Rules

- **Never merge.** The report ends with the branch or PR; merging is the human's call.
- Write `None.` under a section that has nothing, so its absence is visibly deliberate.
- Lead with what needs the human: if anything is parked, the summary lines say so before anything else.
- Close by telling the human how to continue: answer the parked questions, then run `/ship resume <run-id>`.
