# Issue tracker: Local Markdown (Superpowers layout)

Issues and specs for this repo live as markdown files under `docs/superpowers/`, the layout the Superpowers skills use, so a repo moving off Superpowers keeps one docs tree.

## Conventions

- The spec is `docs/superpowers/specs/<YYYY-MM-DD>-<feature-slug>-design.md`, dated the day it is written
- Implementation issues are one file per ticket at `docs/superpowers/plans/<YYYY-MM-DD>-<feature-slug>/<NN>-<slug>.md`, the folder dated like its spec, numbered from `01`, never a single combined plan file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## What Superpowers already wrote

- **Specs** in `docs/superpowers/specs/` are the repo's design record: the decisions behind each feature, and why. Before working in an area, read the specs that touch it, and flag a contradiction rather than silently overriding one.
- **Plans** at `docs/superpowers/plans/<YYYY-MM-DD>-<name>.md` (a single file, not a folder) are Superpowers' combined plans. Leave them as they are. To finish one still in flight, split its remaining tasks into tickets with `/to-tickets`.
- **Other folders** under `docs/superpowers/` (such as `notes/` or `contracts/`) are the project's own. Leave them, and read them as background.
- **`.superpowers/`** at the root is Superpowers' git-ignored scratch space. Never write there.

## When a skill says "publish to the issue tracker"

Write a spec to `docs/superpowers/specs/`, and tickets to a new folder under `docs/superpowers/plans/` (creating the directories if needed).

An issue that belongs to no spec (a bug report, an incoming request) gets its own folder, as a single ticket: `docs/superpowers/plans/<YYYY-MM-DD>-<slug>/01-<slug>.md`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## When a skill needs a spec's tickets

A spec's tickets don't sit beside it. They are in the folder under `docs/superpowers/plans/` named for the spec's date and slug: the spec file name minus `-design.md` (`specs/2026-10-28-health-endpoint-design.md` → `plans/2026-10-28-health-endpoint/`). Confirm each ticket's `Spec:` line names that spec. Going the other way, a ticket's `Spec:` line names its spec.

No such folder means the spec has no tickets yet, which is normal for a spec Superpowers wrote, even one with a single-file plan beside it (`plans/<YYYY-MM-DD>-<slug>.md`). Say so and point at `/to-tickets` rather than working from the plan file.

## When a skill says "list the issues"

Scan the numbered files inside the folders under `docs/superpowers/plans/` and read each one's `Status:` line. Skip the single-file plans beside those folders (Superpowers' plans, not tickets) and any folder holding a `map.md` (a wayfinding effort, whose tickets are decisions, not issues).

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket, in one folder.

- **Map**: `docs/superpowers/plans/<YYYY-MM-DD>-<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `docs/superpowers/plans/<YYYY-MM-DD>-<effort>/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan the effort's folder for numbered files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
