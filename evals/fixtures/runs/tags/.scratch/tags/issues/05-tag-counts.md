# 05: Show tag counts

**Status:** ready-for-agent
**Blocked by:** 01
**Spec:** .scratch/tags/spec.md

## Goal
`notes tags` prints every tag with how many notes carry it, most used first.

## Acceptance criteria
- [ ] `tagCounts(path)` returns `[{ tag, count }]` sorted by count descending, then tag ascending.
- [ ] `run(["tags"], store)` prints one `tag (count)` line per tag.
- [ ] With no tagged notes, `run(["tags"], store)` prints `No tags yet.`

## Implementation steps
1. Add `tagCounts(path)` in `src/notes.js`.
2. Add the `tags` command to `src/cli.js`.

## Files
- Change: `src/notes.js`: `tagCounts`.
- Change: `src/cli.js`: `tags` command.
- Test: `test/tags.test.js`.

## Interfaces

    export function tagCounts(path) // returns { tag: string, count: number }[]

## Data and schema changes
None.

## Test cases
- Ordering by count, then alphabetical on ties.
- Old notes without `tags` are ignored.
- Empty state.

## Verify command
`node --test test/tags.test.js`

## Definition of done
- [ ] Acceptance criteria checked against command output
- [ ] `npm test` passes
