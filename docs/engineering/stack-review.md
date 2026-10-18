## What it does

`stack-review` holds one review **checklist** per stack: TypeScript, React, Node.js, Python, Go, and SQL with migrations. Each lists the traps specific to that stack, as the trap and its fix: a promise nobody awaits, a stale closure in a React effect, a mutable default argument, a migration that locks a big table.

It loads only the checklists for the stacks a diff actually touches. A Python change never pays for the React list, so adding stacks costs nothing for the diffs that don't use them.

## When to reach for it

Type `/stack-review`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it when reviewing a diff for language- or framework-specific pitfalls. Most of the time you won't call it: [code-review](https://aihero.dev/skills-code-review) loads it for its Standards axis on every review.

## On-demand checklists

Generic review catches generic problems; the stack-specific ones need someone who knows the stack. Rather than load every stack's rules into every review, the skill matches the diff's files (and the repo's manifests) against its table and reads only the matching checklists. Three rules bind every item: a documented repo standard overrides it, anything the repo's linter or type checker already enforces is skipped, and each finding quotes the hunk it accuses.

Adding a stack is a file and a table row: write `stacks/<stack>.md` in the same shape, and nothing else loads it until a diff touches that stack.

## Common questions

**My stack isn't on the list.**

Add it: a short checklist file in the same trap-then-fix shape, plus one row in the skill's table. The first set covers the common web and backend stacks; which stacks to add next is an open decision the team owns.

## It's working if

- A review of a Python-only diff mentions no React or Go items.
- Every stack finding names the checklist item and quotes the code.
- Items your linter already catches don't show up as review findings.

## Where it fits

A **reference layer underneath** [code-review](https://aihero.dev/skills-code-review), which pulls it in on every review, including the per-ticket and whole-branch reviews in [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md). [ask-matt](https://aihero.dev/skills-ask-matt) routes you over the whole set.
