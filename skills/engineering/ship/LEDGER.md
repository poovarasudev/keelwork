# Ledger

`.ship/<run-id>/ledger.md` holds the whole state of a run. Conversation memory doesn't survive compaction, and a controller that lost its place will redo finished work, so the ledger is the source of truth: write each change the moment it happens, and after any interruption trust the ledger and `git log` over your recollection.

Keep the header lines and the *Tickets* table in exactly this shape. The `/ship` stop hook reads `Status:`, `Stop guard:` and the table's *Status* column.

## Format

```markdown
# Ship ledger · run 2026-10-16-a

Status: running
Phase: execute
Feature: Archive notes instead of deleting them
Branch: ship/2026-10-16-a-archive-notes
Base: 4f1c2ab
Spec: .scratch/archive-notes/spec.md
Grill style: grill-with-docs
Execution mode: subagent
Finish action: open-pr
Stop guard: on
Started: 2026-10-16T22:10+05:30
Budget: 8 tickets · 3 fix rounds · 8h

## Tickets

| ID | Title | Status | Blocked by | Rounds | Commit |
| --- | --- | --- | --- | --- | --- |
| 01 | Archive a note from the list | done | - | 1 | 9be41d0 |
| 02 | Show archived notes in a filter | in-progress | 01 | 0 | |
| 03 | Restore an archived note | ready | 01 | 0 | |
| 04 | Purge archived notes after 30 days | parked | 01 | 0 | |
| 05 | Archive from the detail view | blocked | 02 | 0 | |

## Log

- 22:14 · 01 · implement started (base 4f1c2ab)
- 22:31 · 01 · spec review: fail (1 missing)
- 22:40 · 01 · spec review: pass
- 22:47 · 01 · quality review: pass (2 findings, 1 accepted, 1 rejected)
- 22:52 · 01 · verify: pass
- 22:53 · 01 · committed 9be41d0

## Decisions

- D1 · 01 · two-way · Named the flag `archivedAt`, not `isArchived`, so restore can show the date. If wrong: rename in one file.

## Parked

- P1 · 04 · one-way: data deletion · Question: "Purging deletes rows permanently. Hard delete after 30 days, or keep soft-deleted rows forever?" · Patch: none (parked before implementation)

## Verify evidence

- 01 · `npm test -- notes/archive` · exit 0 · 12 passed, 0 failed

## Review findings

- 01 · quality · accepted · Missing empty-state test for the archive list. Fixed in 9be41d0.
- 01 · quality · rejected · "Extract archive logic to a service": one caller, nothing to share (YAGNI).

## Finish

- Full suite: <command · exit · counts>
- Whole-branch review: <summary, findings>
- Security audit: <critical / other counts, report path>
- Performance audit: <critical / other counts, report path>
- PR: <url, or "branch pushed: <name>", or "branch kept local">
```

## Field values

| Field | Values |
| --- | --- |
| `Status` | `preflight` (steps 1-7), `running` (steps 8-9), `halted`, `finished` |
| `Phase` | `know` (1-4), `elaborate` (5-7), `execute` (8), `finish` (9), `learn` (10) |
| `Grill style` | `grill-me`, `grill-with-docs` |
| `Execution mode` | `subagent`, `inline` |
| `Finish action` | `push-branch`, `open-pr` |
| `Stop guard` | `on`, `off` |
| Ticket `Status` | `ready` (every blocker done), `in-progress`, `done`, `parked`, `blocked` (waiting on a ticket that isn't done) |

## Writing rules

- Every log line starts with the local time and the ticket id (`-` for run-level lines). `Started` always carries its UTC offset (`2026-10-16T22:10+05:30`), so the time limit is never misread across time zones.
- Every step of the per-ticket loop leaves a log line, so a resumed run can tell exactly where a ticket stopped.
- A `halted` run gets a `Halted: <reason>` line under the header.
- Every entry in *Decisions* and *Parked* is numbered (`D1`, `P1`) so the morning report and the human's answers can refer to it.
- Recompute `ready` versus `blocked` every time a ticket changes status.
