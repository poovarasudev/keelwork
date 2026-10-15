---
name: verify-before-done
description: "Run the verify command and show its output before claiming work is done, fixed or passing. Use before marking a ticket done, committing, or saying tests pass."
---

# Verify Before Done

**Evidence before claims.** A "done", "fixed" or "passing" is only true when the command that proves it ran in this turn and its output is on the record.

## The gate

Before any claim of status, including the soft ones ("should work now", "looks good", a ticket ticked off):

1. **Identify** the command that proves the claim. In order: the verify command the ticket names; otherwise the matching command in `docs/agents/commands.md` (**verify** for "done", **test**, **lint**, **typecheck** or **build** for those claims). If the repo has no such file, tell the user to run `/setup-matt-pocock-skills`, and in the meantime use the command the repo's own scripts expose.
2. **Run** it fresh and in full. A previous run, a partial run, or a subagent's report of a run is not evidence.
3. **Read** the whole output: exit code, failure count, warnings.
4. **Compare** each failure against the **known failures** in `docs/agents/commands.md`. A failure on that list is the baseline and does not block. A failure off the list is a regression, and it does.
5. **Record** the evidence, then make the claim: the command, the exit code, and the summary lines (counts, the first failure). In a `/ship` run, also append it to the ledger's *Verify evidence* section.

If the output doesn't support the claim, state the actual status with that evidence instead.

## What proves what

| Claim | Needs | Is not enough |
| --- | --- | --- |
| Tests pass | Test command output: 0 failures off the known-failure list | An earlier run, "should pass" |
| Lint is clean | Lint output: 0 errors | A partial check, a single file when many changed |
| Types check | Typecheck exit 0 | Lint passing, the editor showing no squiggles |
| Build succeeds | Build exit 0 | Lint or typecheck passing |
| Bug fixed | The original symptom's test now passes | The code changed |
| Regression test works | Seen red without the fix, green with it | Passing once |
| Ticket done | Every acceptance criterion checked against output, plus the verify command | Tests passing |
| Subagent finished | The diff shows the change, and the verify command passes | The subagent's own report |

## Tells that the gate is being skipped

Hedged words ("should", "probably", "seems to"), satisfaction before evidence ("Done!", "Perfect"), a commit or PR about to go out with no fresh run, and trust in a report you didn't check. Each one means: run the command now.

## Credits

Ported from Superpowers' `verification-before-completion`. See [CREDITS.md](CREDITS.md).
