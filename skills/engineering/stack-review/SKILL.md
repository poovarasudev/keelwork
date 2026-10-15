---
name: stack-review
description: "Language and framework review checklists (TypeScript, React, Node.js, Python, Go, SQL). Always load it when reviewing or checking code in these stacks, even a quick look."
---

# Stack Review

Generic review catches generic problems. Each stack also has its own traps (a missing `await`, a stale React closure, a mutable default argument, a migration that locks a table), and those need a reviewer who knows the stack. This skill holds one **checklist** per stack and loads only the ones the diff actually touches, so a stack the change doesn't use costs nothing.

## 1. Detect the stacks

From the diff's file list (and the repo's manifests when an extension is ambiguous), match against this table:

| Stack | Matches | Checklist |
| --- | --- | --- |
| TypeScript | `.ts`, `.tsx`, `.mts`, `.cts`, or `tsconfig.json` | [stacks/typescript.md](stacks/typescript.md) |
| React | `.jsx`, `.tsx`, or `react` in `package.json` dependencies | [stacks/react.md](stacks/react.md) |
| Node.js | `.js`, `.mjs`, `.cjs`, or `.ts` server code, with a `package.json` | [stacks/node.md](stacks/node.md) |
| Python | `.py`, `pyproject.toml`, `requirements*.txt` | [stacks/python.md](stacks/python.md) |
| Go | `.go`, `go.mod` | [stacks/go.md](stacks/go.md) |
| SQL and migrations | `.sql`, or files under a `migrations/` directory, or ORM schema files | [stacks/sql.md](stacks/sql.md) |

Read only the matching checklists. A diff can match several (a React component in TypeScript matches both).

## 2. Apply them

Hand each matching checklist to the reviewer that runs the Standards axis (in `code-review`, paste it into the Standards sub-agent's prompt beside the smell baseline). Rules that bind every checklist:

- **The repo overrides.** A documented repo standard wins over a checklist item; where the repo endorses something a checklist would flag, drop the item.
- **Tooling already enforces it? Skip it.** If the repo's linter or type checker would catch an item, it isn't a review finding.
- **Cite the hunk.** Each finding names the checklist item and quotes the code.
- **Severity is honest.** `critical` only for a real bug, data loss, or security hole; `important` for a likely bug or a maintainability trap; `minor` otherwise.

## Adding a stack

Write `stacks/<stack>.md` in the same shape as the existing ones (short, grouped items, each naming the trap and the fix), and add one row to the table above. Nothing else loads it.
