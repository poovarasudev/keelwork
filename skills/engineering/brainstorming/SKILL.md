---
name: brainstorming
description: "Design step of a /ship run: compare 2-3 approaches with trade-offs and YAGNI cuts. Use only when the ship skill calls it."
---

# Brainstorming

Turn a chosen idea into a chosen **approach**, before any grilling or planning. You compare real alternatives side by side so the user picks deliberately, instead of inheriting whichever design came to mind first.

This skill runs only as the design step of `/ship`. Its output is a **design draft** that grilling then sharpens; it never plans or implements.

## Process

### 1. Understand the idea

Read what `/ship` hands you: the idea, plus any discovery or red-team output. Explore the project enough to ground the design (layout, the modules the feature touches, recent commits, `GLOSSARY.md`, ADRs in the area). Then write back your understanding in a few lines: the intended outcome, who it's for, the constraints, and what success looks like, separating what the user said from what you assumed. Let them correct it before you go on.

If the idea is really several independent subsystems, say so now and help the user pick the first one. Each piece gets its own `/ship` run.

### 2. Propose 2-3 approaches

Lead with the one you recommend. For each approach give:

- **Shape**: how it works, in a short paragraph or a small diagram.
- **Trade-offs**: what it's good at, what it costs, what it makes harder later.
- **One-way doors**: schema changes, public API changes, new dependencies, auth or payment changes it implies.
- **YAGNI cuts**: the features and generality you removed from it because nothing in the idea needs them yet, as a list. The user can restore any item by name.

Make the approaches genuinely different (different data model, different place in the architecture, build versus reuse), not one design in three sizes.

Use visuals only when the question is visual: if the choice turns on what a screen or flow looks like, call the Skill tool with "prototype" for that question. Text questions stay in text.

### 3. Let the user pick

Ask which approach to take, and whether to restore any YAGNI cut. Revise until they pick.

### 4. Write the design draft

Write the chosen design to the path `/ship` gives you (normally `.ship/<run-id>/design.md`):

```markdown
# Design: <feature>

## Understanding
Outcome, users, constraints, success criteria.

## Chosen approach
<shape, components, data flow, error handling, testing approach>

## Rejected approaches
<one line each, and why it lost>

## YAGNI cuts
<what was left out, so it can be restored later>

## Open questions for grilling
<anything the design depends on that isn't settled yet>
```

Then hand back to `/ship`. The draft is grilling's input: grilling settles the open questions, and `to-spec` turns the result into a spec.

## Credits

Ported from Superpowers' `brainstorming`. See [CREDITS.md](CREDITS.md).
