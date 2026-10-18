# Feature: tags

Users want to organise notes with tags.

- When adding a note, the user can attach tags: `notes add "buy milk" --tag errands --tag home`.
- `notes list --tag errands` lists only notes with that tag.
- `notes untag <id> <tag>` removes one tag from a note.
- `notes rename-tag <old> <new>` renames a tag on every note that has it.
- `notes tags` prints each tag with how many notes carry it, most used first.

Tags are lower-case, trimmed, and unique per note. A note with no tags behaves exactly as today. No new dependencies.
