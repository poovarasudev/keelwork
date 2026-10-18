## What it does

`brainstorming` is the design step of [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md). It turns a chosen idea into a chosen **approach**: it writes back its understanding for you to correct, proposes two or three genuinely different approaches with their trade-offs and the one-way doors each implies, lets you pick, and writes a design draft that grilling then sharpens.

Every approach lists its **YAGNI cuts**: the features and generality removed because nothing in the idea needs them yet. You see exactly what was left out, and can restore any item by name. It never plans or implements; its output is grilling's input.

## When to reach for it

`ship` calls it at step 3, and that is the only time it runs. Its description scopes it to that step, so the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't fire it during ordinary design chat, and it never competes with [grilling](https://aihero.dev/skills-grilling).

| Your situation | Reach for |
| --- | --- |
| Starting a `/ship` run | nothing: `/ship` runs it for you |
| Sharpening a design by hand | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| A visual question (what should this screen look like?) | [prototype](https://aihero.dev/skills-prototype), which `brainstorming` also reaches for |

## Approaches, then grilling

Grilling is very good at drilling into one design and very bad at noticing there was another. `brainstorming` puts the alternatives side by side first (a different data model, a different place in the architecture, build versus reuse), so that what you grill is a design you chose rather than the first one that came to mind. The draft it writes to `.ship/<run-id>/design.md` records the chosen approach, the rejected ones and why, the YAGNI cuts, and the open questions it hands to grilling.

## Common questions

**How is this different from Superpowers' brainstorming?**

It's a port with three changes: it never auto-triggers, it hands off to grilling instead of writing an implementation plan, and its design draft feeds grilling rather than becoming the spec. Each approach also lists what YAGNI removed.

## It's working if

- The approaches differ in shape, not just size.
- Each one names the one-way doors it would open.
- You can see, per approach, what was cut and restore it by name.
- It stops at a design draft and hands back to `/ship`; no plan, no code.

## Where it fits

A **chain step** inside [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md): after discovery and red-team (when they run), before [grilling](https://aihero.dev/skills-grilling). [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
