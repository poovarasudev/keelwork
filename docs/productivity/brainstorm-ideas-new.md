## What it does

`brainstorm-ideas-new` supports **initial discovery** for a product that doesn't exist yet. It generates five specific feature ideas from each of three perspectives (product manager, designer, engineer), ranks the top five across all fifteen, and gives each one its reasoning and the key assumptions to test.

For a new product the ranking leans hard on three things: does the idea deliver the core value, can it be validated quickly, and does it differentiate. It saves the result to a file and hands the chosen idea to [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md).

## When to reach for it

You invoke this by typing `/brainstorm-ideas-new`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| No product yet; deciding what it must do first | `/brainstorm-ideas-new` |
| A live product; deciding what to build next | [brainstorm-ideas-existing](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-existing.md) |
| An idea already chosen, assumptions feel shaky | [strategy-red-team](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/strategy-red-team.md) |
| An idea already chosen and solid | [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) directly |

## Three perspectives, one ranking

A single brainstorm drifts toward one kind of idea. Asking for five each from a product manager (market fit, value, advantage), a designer (experience, onboarding, engagement) and an engineer (technical leverage, integrations, platform) widens the field before anything is cut. The ranking then narrows it back to five, each with the assumptions you'd need to be true.

## Common questions

**Do I have to use this before `/ship`?**

No. `/ship` asks whether your idea is chosen; if it isn't, it runs the same discovery inline. This standalone version is for when you want to explore without starting a build.

## It's working if

- The fifteen ideas are specific features, not themes.
- Each of the top five lists assumptions you could actually test.
- The result is saved to a file you can hand to `/ship`.

## Where it fits

The **on-ramp** in front of [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md), usually followed by [strategy-red-team](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/strategy-red-team.md). [ask-matt](https://aihero.dev/skills-ask-matt) routes you over the whole set.
