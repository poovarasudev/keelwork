## What it does

`strategy-red-team` attacks a plan's **load-bearing assumptions** before reality does: the claims that, if false, make the plan fail. For each, it states the strongest case for it, attacks that version, writes the failure as "Fails if ___", and ranks the survivors by impact if wrong, likelihood of being wrong, and how cheap they are to test.

The goal is a sharper decision, not a longer risk list. Each surviving kill-assumption comes with the evidence to get this week, a kill criterion, and the cheapest test, and it says plainly what is well-reasoned instead of manufacturing doubt.

## When to reach for it

You invoke this by typing `/strategy-red-team`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| An idea, spec, roadmap or strategy you're about to commit to | `/strategy-red-team` |
| A design to sharpen decision by decision | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| No idea chosen yet | [brainstorm-ideas-new](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-new.md) or [brainstorm-ideas-existing](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-existing.md) |

## Steelman, then attack

An attack on a weak version of a claim is worthless, so every attack starts from the strongest case for the claim. And a red-team is not a pre-mortem: a pre-mortem imagines the plan already failed and narrates why, while a red-team attacks the assumptions now, while the cheapest test is still cheap. You then keep, rework or drop each critical assumption, and the answers are saved with the red-team.

## Common questions

**What does `/ship` do with the result?**

Hand `/ship` the file and it treats the idea as chosen and red-teamed, starting at design brainstorming. Run inside `/ship`, the same red-team is optional step 2, and every critical assumption must be kept or reworked before design starts.

## It's working if

- Each failure mode is concrete and falsifiable, not "execution risk".
- The top of the list is something you could test this week.
- It names what holds up, as well as what doesn't.

## Where it fits

The second **on-ramp** step, after [brainstorm-ideas-new](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-new.md) or [brainstorm-ideas-existing](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-existing.md) and before [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md). It works on any plan, not only product ideas. [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
