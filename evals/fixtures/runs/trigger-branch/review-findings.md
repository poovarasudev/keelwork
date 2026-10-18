# Code review: feature/wip

## Standards
1. `src/NoteList.jsx`: list items keyed by index.
2. `src/notes.js`: `archiveNote` duplicates the load/save shape of `deleteNote`; extract a helper.
3. `scripts/report.py`: rename `seen` to `tags`.

## Spec
4. Ticket 04 says archived notes disappear from `notes list`; they still show.
5. Add a `notes unarchive` command for symmetry (not in the ticket).
