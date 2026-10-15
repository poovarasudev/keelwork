# 03: Remove a tag from a note

**Status:** ready-for-agent
**Blocked by:** 01
**Spec:** .scratch/tags/spec.md

## Goal
`notes untag 3 errands` removes `errands` from note 3.

## Acceptance criteria
- [ ] `untag(path, id, "Errands")` removes `errands` from that note and keeps its other tags.
- [ ] Untagging a tag the note doesn't have throws `Note 3 isn't tagged "errands".`
- [ ] Untagging a missing note throws `No note with id 99.`

## Implementation steps
1. Add `untag(path, id, tag)` in `src/notes.js`.
2. Add the `untag` command to `src/cli.js`, printing `Removed "errands" from note 3.`

## Files
- Change: `src/notes.js`: `untag`.
- Change: `src/cli.js`: `untag` command.
- Test: `test/tags.test.js`.

## Interfaces

    export function untag(path, id, tag) // returns the updated Note

## Data and schema changes
None.

## Test cases
- Removes only the named tag.
- Case-insensitive match.
- Missing tag and missing note each throw their message.

## Verify command
`node --test test/tags.test.js`

## Definition of done
- [ ] Acceptance criteria checked against command output
- [ ] `npm test` passes
