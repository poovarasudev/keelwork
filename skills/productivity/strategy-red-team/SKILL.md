---
name: strategy-red-team
description: "Red-team an idea, plan, spec or strategy: steelman then attack its load-bearing assumptions, and get the cheapest test and kill criterion for each."
disable-model-invocation: true
---

# Strategy Red-Team

Be a sharp, fair adversary to the plan the user names. Most plans have only survived polite feedback. This finds the **load-bearing assumptions** that would make the plan fail, attacks them honestly, and gives each one something to do this week: the evidence to get, the kill criterion, and the cheapest test.

A red-team is not a pre-mortem. A pre-mortem imagines the plan already failed and narrates why; a red-team attacks the assumptions **now**, while the cheapest test is still cheap. The goal is a sharper decision, not a longer risk list: five real kill-assumptions with tests beat twenty generic risks.

## Process

1. **Extract every claim** the plan asserts as true: about the user, the market, the constraint, the mechanism, the timeline. Separate **load-bearing** claims (if false, the plan dies) from cosmetic ones, and keep only the load-bearing.

2. **Steelman, then attack.** For each, first state the strongest case for why it is true, then attack that version. An attack on a weak version of a claim is worthless.

3. **Write each failure as "Fails if ___"**, concrete and falsifiable. "Fails if activation isn't actually the constraint" beats "execution risk".

4. **Rank** by impact if wrong × likelihood wrong × cheapness to test. The top of the list is what to test this week. Mark the top ones **critical**.

5. **Refute honestly.** Default to "this risk is real" unless the plan already cites evidence against it, but where a claim is genuinely well-reasoned, say so plainly. Never invent a weakness the plan doesn't have.

6. **Give each surviving kill-assumption an action:**
   - **Fails if**: the precise condition that breaks the plan;
   - **Evidence to get this week**: the specific data, query or conversation;
   - **Kill criterion**: the threshold at which you'd stop or change course;
   - **Cheapest test**: the smallest experiment that moves the belief.

7. **Second opinion, only if asked.** If the user wants it and another model is reachable, run the same plan through it and flag where the two disagree.

## Output

```markdown
## Red-team: <the plan in one line>

### Top kill-assumptions (ranked)
For each, three to five at most:
- **Claim:** <the load-bearing assertion> · **critical** where it is
- **Fails if:** <concrete, falsifiable condition>
- **Evidence to get this week:** <specific>
- **Kill criterion:** <threshold>
- **Cheapest test:** <smallest experiment>

### What's well-reasoned
<what holds up, and why>

### What I couldn't assess
<where the plan didn't give enough to judge>
```

End with what to **do**, not just what to fear.

## Hand-off

Save the red-team beside the plan it attacked (for a discovery file, append it to that file). Ask the user to **keep**, **rework** or **drop** each critical assumption, and record the answers in the same file. When the idea is headed for a build, tell the user to run `/ship` with that file: `/ship` treats the idea as chosen and red-teamed, and starts at design brainstorming.

## Credits

Ported from `strategy-red-team` in [phuryn/pm-skills](https://github.com/phuryn/pm-skills). See [CREDITS.md](CREDITS.md).
