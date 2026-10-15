# 04: Archive a note

**Status:** ready-for-agent
**Blocked by:** None (can start immediately)

## Goal
`notes archive <id>` hides a note from `notes list` without deleting it.

## Acceptance criteria
- [ ] `run(["archive", "2"], store)` prints `Archived note 2.`
- [ ] An archived note no longer appears in `notes list`.

## Verify command
`npm test`
