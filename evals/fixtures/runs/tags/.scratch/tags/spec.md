# Spec: tags for notes

**Status:** ready-for-agent

## Problem Statement

Users of notes-cli can't group or find related notes; every list shows everything.

## Solution

Notes carry tags. Users attach tags when adding a note, filter the list by a tag, remove a tag from a note, rename a tag everywhere, and see how many notes carry each tag.

## User Stories

1. As a note-taker, I want to attach tags when I add a note, so that I can group it.
2. As a note-taker, I want to list only notes with a given tag, so that I can find related notes.
3. As a note-taker, I want to remove one tag from a note, so that I can fix a mistake.
4. As a note-taker, I want to rename a tag on every note, so that I can tidy my vocabulary.
5. As a note-taker, I want to see each tag with its note count, so that I know what I use most.

## Implementation Decisions

- A **Note** gains a `tags` array of strings. Notes saved before this change have no `tags` field and are treated as having none.
- Tags are normalised: trimmed, lower-cased, de-duplicated per note. An empty tag is rejected with "A tag can't be empty."
- `src/notes.js` gains `addNote(path, text, tags = [])`, `listNotes(path, { tag } = {})`, `untag(path, id, tag)`, `renameTag(path, from, to)` and `tagCounts(path)`.
- The CLI gains `--tag <name>` (repeatable) on `add` and `list`, and the commands `untag`, `rename-tag` and `tags`.
- No new dependencies. No change to the notebook file's location.

## Testing Decisions

Test through the exported functions in `src/notes.js` and through `run()` in `src/cli.js`, against a temporary notebook file, as `test/notes.test.js` already does.

## Out of Scope

Tag colours, nested tags, searching note text, and any change to `delete`.
