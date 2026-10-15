# Ticket plan

Each ticket is a detailed plan, written for an implementer with **no session history**: someone who has never seen the conversation, the spec discussion or the other tickets. The bar is that they finish it without asking anything. Every judgement call they would otherwise stall on is made here, in the ticket.

Explore the code before writing a ticket's plan: the file list, the signatures and the test cases are facts about this codebase, not guesses.

## Sections

Use these headings, in this order. A section with genuinely nothing to say gets "None."; never drop the heading.

```markdown
# <NN>: <Ticket title>

**Status:** ready-for-agent
**Blocked by:** <NN, NN> or "None (can start immediately)"
**Spec:** <path or issue reference>

## Goal
The end-to-end behaviour this ticket makes work, from the user's perspective, in two or three sentences.

## Acceptance criteria
- [ ] <observable behaviour that is false at the base commit and true when done>
- [ ] <one per behaviour; each names how you'd see it>

## Implementation steps
1. <ordered, concrete step>
2. <...>

## Files
- Create: `path/to/new_file.ts`: <what it holds>
- Change: `path/to/existing.ts`: <what changes>
- Test: `path/to/thing.test.ts`: <what it covers>

## Interfaces
The signatures this ticket adds or changes, as code:

    export function archiveNote(id: NoteId, at: Date): Promise<ArchivedNote>

## Data and schema changes
Tables, columns, migrations, stored formats, config keys. "None." if none.

## Test cases
- <happy path>
- <edge case: empty input, boundary value, permission denied, concurrent call, ...>
- <error case and the expected message or status>

## Verify command
`<exact command that proves this ticket done, e.g. npm test -- notes/archive>`

## Definition of done
- [ ] Acceptance criteria all checked against command output
- [ ] Verify command passes; no failure outside the known-failure list
- [ ] <anything ticket-specific: docs updated, migration reversible, ...>
```

On a real issue tracker the body is the same minus the title line, with `Blocked by` expressed as native blocking links where the tracker has them, and a `## Parent` reference to the spec issue at the top.

## Rules

- **Acceptance criteria are concrete.** Each one is observable and can fail: name the observation that would show it false, and confirm it is false at the commit the implementer starts from. "Works correctly" and "handles errors" are not criteria. A ticket whose criteria aren't concrete isn't ready: it goes back to grilling.
- **Exact files.** Name every file to create or change. "Somewhere in the API layer" is a judgement call left to the implementer.
- **Signatures, not prose.** Write the interfaces as code in the repo's language.
- **Snippets where the approach isn't obvious.** A tricky algorithm, a state machine, a migration, a regex: include a short snippet of the decision-rich part. Skip snippets for code any implementer would write the same way.
- **Edge cases are test cases.** Every edge case named in the spec or grilling becomes a test case in the ticket that owns it.
- **One verify command per ticket**, scoped to the ticket where the test runner allows it, falling back to `docs/agents/commands.md`'s **verify**.
- **Blocking edges stay explicit.** The plan never assumes work from a ticket that doesn't block it.
