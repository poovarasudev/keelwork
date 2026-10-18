---
name: brainstorm-ideas-new
description: "Brainstorm and rank feature ideas for a new product from product, design and engineering perspectives, then hand the chosen idea to /ship."
disable-model-invocation: true
---

# Brainstorm Ideas: New Product

Multi-perspective ideation for **initial discovery**: the product doesn't exist yet, and the question is whether it should and what it must do first. (For a product with live users, use `/brainstorm-ideas-existing` instead.)

## Process

1. **Understand the opportunity.** Confirm the product concept, the target segment, and what those users want to achieve. Read any files the user points at (market research, competitive analysis); search the web for the market if it helps. Ask once, in one round, for anything missing.

2. **Ideate from three perspectives.** Five specific feature ideas each from:
   - **Product manager**: market fit, value created, competitive advantage.
   - **Designer**: user experience, onboarding, engagement.
   - **Engineer**: technical leverage, integrations, platform capabilities.

3. **Rank the top five** across all fifteen. For a new product, weight heavily toward:
   - core value delivered (does it solve the primary problem?);
   - speed to validate (can it be tested quickly?);
   - differentiation.

4. **For each of the five**, give a name, one sentence, why it ranked, and the **key assumptions to test**.

5. **Save and hand off.** Write the result to `docs/discovery/<YYYY-MM-DD>-<slug>.md` (or wherever the user asks): the opportunity, all fifteen ideas, the ranked five with their assumptions, and the user's pick. Then tell the user the next steps: `/strategy-red-team` on the chosen idea if its assumptions feel shaky, then `/ship` with that file, which starts at design brainstorming.

## Credits

Ported from `brainstorm-ideas-new` in [phuryn/pm-skills](https://github.com/phuryn/pm-skills). See [CREDITS.md](CREDITS.md).
