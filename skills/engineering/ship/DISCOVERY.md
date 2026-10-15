# Discovery and red-team

Steps 1 and 2 of `/ship`, for when the idea isn't chosen yet. They are the same methods as the `brainstorm-ideas-new`, `brainstorm-ideas-existing` and `strategy-red-team` skills, carried inline here because one user-invoked skill can't call another. Save each step's output to `.ship/<run-id>/discovery.md` as you go.

## Step 1: Discovery

Ask one question: is this a **new product** (nothing live yet: you're testing whether it should exist) or an **existing product** (live users: you're finding the next thing to build)? Then ask for the target segment, the opportunity, and the outcome the user wants, in one round. Read any files they point at (research, interviews, analytics).

Generate five specific ideas from each of three perspectives:

| Perspective | New product: focus on | Existing product: focus on |
| --- | --- | --- |
| Product manager | Market fit, value created, competitive advantage | Business value, strategic fit, customer impact |
| Designer | User experience, onboarding, engagement | Usability, delight, friction removed |
| Engineer | Technical leverage, integrations, platform capabilities | Data the product already has, technical possibilities, scale |

Then rank the top five across all perspectives:

- **New product**: core value delivered, speed to validate, differentiation.
- **Existing product**: fit with the stated outcome, impact on it, effort, differentiation from what exists.

For each of the five give a name, one sentence, why it ranked, and the key assumptions to test. The user picks one, or asks for another round.

## Step 2: Red-team

Offer it; it's optional. If the user accepts, attack the chosen idea's load-bearing assumptions before any design work:

1. **Extract the claims** the idea depends on (about the user, the market, the constraint, the mechanism). Keep only the **load-bearing** ones: if false, the idea fails.
2. **Steelman, then attack** each: state the strongest case for it, then attack that version, never a strawman.
3. Write each failure as **"Fails if ___"**, concrete and falsifiable.
4. **Rank** by impact if wrong × likelihood wrong × cheapness to test, and mark the top ones **critical**.
5. Say plainly what is well-reasoned. Don't manufacture doubt.

For each critical assumption give the evidence to get this week, the kill criterion, and the cheapest test. The user then keeps, reworks or drops each critical one; record every answer in the ledger's *Decisions*. Brainstorming starts only once none is left undecided.

## Credits

Adapted from `brainstorm-ideas-new`, `brainstorm-ideas-existing` and `strategy-red-team` in [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT, copyright 2026 Pawel Huryn). See [CREDITS.md](CREDITS.md).
