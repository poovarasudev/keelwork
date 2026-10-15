# 02: List notes by tag

**Status:** ready-for-agent
**Blocked by:** 01
**Spec:** .scratch/tags/spec.md

## Goal
`notes list --tag errands` lists only the notes tagged `errands`.

## Acceptance criteria
- [ ] `listNotes(path, { tag: "Errands" })` returns only notes whose tags include `errands`.
- [ ] `listNotes(path)` still returns every note, including old notes with no `tags` field.
- [ ] `run(["list", "--tag", "nope"], store)` prints `No notes tagged "nope".`

## Implementation steps
1. Give `listNotes` an options object `{ tag }`; normalise the tag and filter.
2. Treat a missing `tags` field as `[]`.
3. Parse `--tag` on `list` in `src/cli.js` and print the tag-specific empty state.

## Files
- Change: `src/notes.js`: `listNotes` options.
- Change: `src/cli.js`: `list --tag`.
- Test: `test/tags.test.js`.

## Interfaces

    export function listNotes(path, { tag } = {}) // returns Note[]

## Data and schema changes
None.

## Test cases
- Filter matches case-insensitively.
- Old notes without `tags` are listed unfiltered and excluded when filtering.
- Empty result with a tag prints the tag-specific empty state.

## Verify command
`node --test test/tags.test.js`

## Definition of done
- [ ] Acceptance criteria checked against command output
- [ ] `npm test` passes
