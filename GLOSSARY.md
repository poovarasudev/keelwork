# Keelwork

A collection of agent skills (slash commands and behaviors) loaded by Claude Code, forked from Matt Pocock's skills. Skills are organized into buckets and consumed by per-repo configuration emitted by `/setup-matt-pocock-skills`.

## Language

**Issue tracker**:
The tool that hosts a repo's issues: GitHub Issues, Linear, a local `.scratch/` markdown convention, or similar. Skills like `to-tickets`, `to-spec`, and `triage` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker**: a bug, task, spec, or slice produced by `to-tickets`.
_Avoid_: ticket (use only when quoting external systems that call them tickets, or for a **Decision ticket**, see below)

**Decision ticket**:
A `wayfinder` unit: a child **Issue** of a `wayfinder:map` holding a *question* whose resolution is a decision, not a slice of a build to execute. The **decision** qualifier is what keeps it distinct from an implementation ticket; `wayfinder` introduces the term, then uses "ticket".

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g. `needs-triage`, `ready-for-afk`). Each role maps to a real label string in the **Issue tracker** via `docs/agents/triage-labels.md`.

**KEEL loop**:
Keelwork's method name for an unattended run: **Know** (discovery, red-team, grill), **Elaborate** (autonomy contract, spec, tickets), **Execute** (per-ticket loop, audits, PR), **Learn** (morning report). The human is present for Know and Elaborate, absent for Execute, and back for Learn.

**Morning report**:
The document an unattended run leaves for the human, with the plain headings Shipped, Parked, Decisions made, Review findings and Suggested rule updates. Its template lives in the `ship` skill's `MORNING-REPORT.md`.

**Run**:
One `/ship` execution of one feature, identified by a run id such as `2026-10-16-a`, with its state under `.ship/<run-id>/`.
_Avoid_: job, session (a run can span several sessions)

**Ledger**:
The file `.ship/<run-id>/ledger.md` that holds a **Run**'s whole state: tickets, review rounds, commits, decisions, parked items, the chosen grill style and execution mode. It is what a run is resumed from.
_Avoid_: progress file, state file

**Autonomy contract**:
A **Run**'s standing orders, agreed with the human before execution: which decisions are **Two-way doors**, which are **One-way doors**, the budget, the command allowlist and the **Finish action**. Team-wide entries live in a repo's `docs/agents/autonomy-contract.md`.

**Two-way door**:
A decision cheap to walk back. During a **Run** the agent decides it and logs it with a reason.

**One-way door**:
A decision expensive or impossible to reverse (schema, public API, new dependency, auth, payments, data deletion). During a **Run** it always **Parks** the ticket.

**Park**:
To set a ticket aside with the exact question the human must answer, and carry on with other ready tickets. A parked ticket never ends a **Run** on its own.
_Avoid_: block, stop, skip

**Known failure**:
A test that already failed when the baseline was taken, recorded in `docs/agents/commands.md`. It doesn't block a claim of done; a failure not on the list is a regression.
_Avoid_: flaky test (a known failure may be deterministic)

**Execution mode**:
How a set of tickets is implemented: a fresh subagent per ticket, or inline in the current session.

**Finish action**:
What a **Run** does with its branch at the end: push it, or open a PR. Never a merge.

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time
- A **Decision ticket** is an **Issue** (a child of a `wayfinder:map`)
- A **KEEL loop** run ends in one **Morning report**
- A **Run** has one **Ledger** and one **Autonomy contract**
- The **Autonomy contract** sorts every decision into a **Two-way door** or a **One-way door**
- A **One-way door** **Parks** the ticket that needs it

## Flagged ambiguities

- "backlog" was previously used to mean both the *tool* hosting issues and the *body of work* inside it. Resolved: the tool is the **Issue tracker**; "backlog" is no longer used as a domain term.
- "backlog backend" / "backlog manager". Resolved: collapsed into **Issue tracker**.
