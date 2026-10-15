# 04: Rename a tag on every note

**Status:** ready-for-agent
**Blocked by:** 01
**Spec:** .scratch/tags/spec.md

## Goal
`notes rename-tag errand errands` renames the tag on every note that has it.

## Acceptance criteria
- [ ] `renameTag(path, "errand", "Errands")` changes `errand` to `errands` on every note and returns the count of notes changed.
- [ ] A note that already has both tags ends up with `errands` once.
- [ ] Renaming a tag no note has returns 0 and changes nothing.

## Implementation steps
1. Add `renameTag(path, from, to)` in `src/notes.js`, normalising both and de-duplicating per note.
2. Add the `rename-tag` command to `src/cli.js`, printing `Renamed "errand" to "errands" on 2 notes.`

## Files
- Change: `src/notes.js`: `renameTag`.
- Change: `src/cli.js`: `rename-tag` command.
- Test: `test/tags.test.js`.

## Interfaces

    export function renameTag(path, from, to) // returns number of notes changed

## Data and schema changes
None.

## Test cases
- Renames across several notes.
- Merge when a note has both tags.
- Unknown tag returns 0.

## Verify command
`node --test test/tags.test.js`

## Definition of done
- [ ] Acceptance criteria checked against command output
- [ ] `npm test` passes
