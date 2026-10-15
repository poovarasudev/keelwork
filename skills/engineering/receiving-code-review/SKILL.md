---
name: receiving-code-review
description: "Decide which review findings to act on: accept each with a fix or reject it with a reason. Always use it when review findings, audit results or PR comments need acting on."
---

# Receiving Code Review

A review comment is a claim about the code, and claims can be wrong. Check each one against the codebase before changing anything, then give it a **verdict**: **accepted** with the fix, or **rejected** with the reason. Applying every comment because a reviewer said so is how wrong suggestions land.

## For each comment

1. **Read it whole**, and the rest of the batch, before reacting. Comments are often related.
2. **Restate** the requirement in your own words. If you can't, it's unclear (see below).
3. **Check it against the code**: does the problem exist here? Would the fix break something else, a test, another caller, a platform the repo supports? Is there a reason the code is the way it is (a comment, an ADR, a ticket, a test that pins it)?
4. **Decide**:
   - **Accepted**: the problem is real here and the fix is right for this codebase. Fix it.
   - **Rejected**: the comment is wrong for this codebase, breaks existing behaviour, conflicts with a decision the human or an ADR made, or adds something nothing needs (YAGNI: if a reviewer asks to "implement it properly", check whether anything calls it). Write the reason as a technical fact a reviewer can check.

## Unclear comments

Clarify before implementing any part of a batch whose comments might depend on each other. With a human present, ask about the unclear items and leave the rest until they answer. In a `/ship` run nobody is there to ask: treat it as a decision under the autonomy contract, so either decide and log it (a two-way door) or park the ticket with the exact question (a one-way door).

## Implementing

Order the accepted fixes: blocking issues first (breakage, security), then simple fixes, then larger refactors. Make one fix at a time and run the tests that cover it before the next. A fix that turns out wrong goes back through this skill as a new finding.

## Reporting

Produce one line per comment:

| # | Comment | Verdict | Fix or reason |
| --- | --- | --- | --- |
| 1 | Missing empty-state test for the archive list | accepted | Added `archive-list.test.ts` "renders empty state"; commit `9be41d0` |
| 2 | Extract archive logic into a service | rejected | One caller, nothing shares it; extraction adds an indirection with no reuse |

In a `/ship` run, also append each line to the ledger's *Review findings*. On a GitHub pull request, reply in the comment's own thread rather than as a top-level comment.

State fixes plainly ("Fixed: added the empty-state test") and corrections plainly ("Checked again: the reviewer was right, fixing"). Agreement and thanks add nothing a fix doesn't already say.

## Credits

Ported from Superpowers' `receiving-code-review`. See [CREDITS.md](CREDITS.md).
