# 01: Attach tags when adding a note

**Status:** ready-for-agent
**Blocked by:** None (can start immediately)
**Spec:** .scratch/tags/spec.md

## Goal
`notes add "buy milk" --tag errands --tag Home` saves the note with tags `["errands", "home"]`.

## Acceptance criteria
- [ ] `addNote(path, "x", [" Home ", "home", "errands"])` stores `tags: ["home", "errands"]`.
- [ ] `addNote(path, "x", ["  "])` throws "A tag can't be empty."
- [ ] `run(["add", "buy", "milk", "--tag", "errands"], store)` stores text "buy milk" with tags `["errands"]`.
- [ ] A note added with no tags stores `tags: []`.

## Implementation steps
1. Add `normaliseTags(tags)` in `src/notes.js`: trim, lower-case, reject empty, de-duplicate keeping first order.
2. Give `addNote` a third parameter `tags = []` and store `tags: normaliseTags(tags)`.
3. In `src/cli.js`, split `add`'s arguments into text words and `--tag <name>` pairs.

## Files
- Change: `src/notes.js`: `normaliseTags`, `addNote` signature.
- Change: `src/cli.js`: parse `--tag` on `add`.
- Test: `test/tags.test.js`: new file for every tags test.

## Interfaces

    export function addNote(path, text, tags = []) // returns { id, text, tags, createdAt }

## Data and schema changes
Notes gain `tags: string[]`. Old notes without the field read as `[]`.

## Test cases
- Duplicate and mixed-case tags collapse to one lower-case tag.
- An empty or whitespace tag throws.
- No `--tag` flags: `tags` is `[]`.
- `--tag` given before the text words still works.

## Verify command
`node --test test/tags.test.js`

## Definition of done
- [ ] Acceptance criteria checked against command output
- [ ] `npm test` passes
