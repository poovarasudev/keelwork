---
name: brainstorm-ideas-existing
description: "Brainstorm and rank ideas for a live product from product, design and engineering perspectives, then hand the chosen idea to /ship."
disable-model-invocation: true
---

# Brainstorm Ideas: Existing Product

Multi-perspective ideation for **continuous discovery**: the product is live, and the question is what to build next for a stated outcome. The three perspectives are the **product trio** (product manager, designer, engineer) working discovery together, because the best ideas often come from engineers. (For a product that doesn't exist yet, use `/brainstorm-ideas-new` instead.)

## Process

1. **Understand the opportunity.** Confirm the product, the objective, the target segment, and the desired outcome. Read any files the user points at (research, opportunity trees, personas, analytics); look the product up if they give a URL. Ask once, in one round, for anything ambiguous.

2. **Ideate from three perspectives.** Five ideas each from:
   - **Product manager**: business value, strategic fit, customer impact.
   - **Designer**: usability, delight, friction removed.
   - **Engineer**: data the product already has, technical possibilities, scale.

3. **Rank the top five** across all fifteen, on:
   - fit with the stated objective;
   - likely impact on the desired outcome;
   - feasibility and effort;
   - differentiation from what already exists.

4. **For each of the five**, give a name, one sentence, why it ranked, and the **key assumptions to validate**.

5. **Save and hand off.** Write the result to `docs/discovery/<YYYY-MM-DD>-<slug>.md` (or wherever the user asks): the objective, all fifteen ideas, the ranked five with their assumptions, and the user's pick. Then tell the user the next steps: `/strategy-red-team` on the chosen idea if its assumptions feel shaky, then `/ship` with that file, which starts at design brainstorming.

## Credits

Ported from `brainstorm-ideas-existing` in [phuryn/pm-skills](https://github.com/phuryn/pm-skills). See [CREDITS.md](CREDITS.md).
