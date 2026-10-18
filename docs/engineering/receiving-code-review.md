## What it does

`receiving-code-review` decides what to do with review feedback before anything is changed. The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) checks each comment against the codebase (does the problem exist here, would the fix break a caller or a test, is there a recorded reason for the current code) and gives it a **verdict**: **accepted**, with the fix, or **rejected**, with a reason a reviewer can check.

Reviewers are sometimes wrong, and an agent that applies every comment turns a wrong suggestion into a regression. This skill makes pushing back a normal, recorded outcome rather than a social risk.

## When to reach for it

Type `/receiving-code-review`, or the agent reaches for it automatically when findings arrive: from [code-review](https://aihero.dev/skills-code-review), from the audits, from PR comments, or from a human reviewer. [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) and [implement-spec](https://aihero.dev/skills-implement-spec) run it on every review round.

## A verdict per comment

The output is one row per comment: the comment, the verdict, and the fix or the reason. Accepted fixes are made one at a time, blocking issues first, with the covering tests run after each. A rejection cites a fact: "one caller, nothing shares it", "the ADR chose this", "the reviewer's version breaks the export path". Unclear comments are clarified before any related fix is made; in an unattended `/ship` run, where nobody is there to ask, an unclear comment becomes a logged decision or a parked ticket instead.

## Common questions

**Won't the agent just reject everything to save work?**

The rejection has to be a checkable technical reason, and in a `/ship` run every verdict lands in the ledger and the morning report. A pattern of thin rejections is visible there, and the next run's contract can tighten it.

## It's working if

- Every review comment ends with accepted or rejected; none is silently dropped.
- Rejections cite code, tests, ADRs or the spec, not opinion.
- Accepted fixes land one at a time, each followed by its tests.
- No "great catch" or "you're absolutely right": just the fix or the reason.

## Where it fits

A **gate** inside the review loop: after [code-review](https://aihero.dev/skills-code-review), [security-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/security-audit.md) or [performance-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/performance-audit.md) report, before anything is fixed. [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
