# Evals

Skills are prompts, so a small wording change can silently change behaviour. Every change to Keelwork, and every upstream sync, runs these checks before release.

## Two layers

| Layer | Command | Model? | Runs in |
| --- | --- | --- | --- |
| Structural rules (buckets, READMEs, plugin, docs, invocation, credits, em-dashes, fork log, description budget, trigger overlap) | `node scripts/check-repo.mjs` | no | CI, every push |
| Hook scripts, and the templates they parse | `bash evals/hooks.test.sh` | no | CI, every push |
| Suite files are well formed | `node evals/run.mjs all --dry-run` | no | CI, every push |
| Behaviour: the suites below | `node evals/run.mjs <suite>` | yes | locally, before a release and after an upstream sync |

The model-driven suites call `claude -p` with this repo loaded as a plugin (`--plugin-dir`), in a throwaway copy of a fixture, with `--setting-sources project` so your own installed plugins don't interfere. They spend real tokens: the trigger suite is cheap; `e2e` runs whole `/ship` runs and is not.

## Suites

| Suite | File | What it checks | Example |
| --- | --- | --- | --- |
| Trigger | [`suites/trigger.json`](suites/trigger.json) | The right model-invoked skill fires, and near-misses don't (SRD A1, N2) | Casual design chat must not trigger `to-tickets` |
| Gate | [`suites/gate.json`](suites/gate.json) | Rules hold under pressure | Quality review never runs before spec review passes; a one-way door always parks; the hooks fire |
| Resume | [`suites/resume.json`](suites/resume.json) | A run survives interruption | Kill a `/ship` run mid-ticket; `/ship resume` continues from the ledger without redoing finished tickets |
| End-to-end | [`suites/e2e.json`](suites/e2e.json) | Whole flows on a fixture | A five-ticket feature from "go" to morning report with no human input; setup's known-failure baseline; onboarding |
| Upstream regression | [`suites/upstream-regression.json`](suites/upstream-regression.json) | Upstream behaviour intact | Grilling still asks numbered rounds and adds no autonomy prep outside `/ship`; `tdd` writes the test first; `code-review` keeps two axes |

`suites/trigger.json` uses the same `{ "query", "should_trigger" }` shape as Anthropic's `skill-creator`, plus a `skill` field. Filter one skill's cases out of it to run `skill-creator`'s description optimiser on that skill. Each trigger query runs in the greenfield fixture on a work-in-progress branch (the `trigger_branch` setup), so a query about "this branch" or "my fix" has real state behind it; a model that checks and finds nothing would otherwise rightly answer without a skill. A case may set `accept_via` to the skills that legitimately reach the target (a `stack-review` query answered by `code-review`, which always loads `stack-review`, counts). Write queries that are substantive and point at that state: a one-step question a model can answer alone won't trigger any skill.

## Running

```bash
node evals/run.mjs trigger                     # every trigger case, 4 at a time
node evals/run.mjs trigger --case to-tickets   # one skill's trigger cases
node evals/run.mjs trigger --runs 3            # each query 3 times; pass on a majority
node evals/run.mjs gate --case gate-one-way-door-parks --keep   # keep the workspace to inspect
node evals/run.mjs all --model opus
```

Long runs need the machine awake: on macOS the runner wraps every session in `caffeinate -i`. A session whose event stream goes silent for 8 minutes (`--stall <seconds>` to change) is treated as stalled, not slow: the runner resumes the same session with "continue", up to twice, and notes the stall in the result.

Each run writes the transcripts (`*.jsonl`) and a `summary.json` to `evals/results/<timestamp>/`, which git ignores. A case fails with the reason it failed; `--keep` prints the workspace path so you can open the repo the agent left behind.

## Fixtures

| Fixture | What it is | Exercises |
| --- | --- | --- |
| [`fixtures/greenfield`](fixtures/greenfield) | A tiny Node notes CLI, zero dependencies, tests green, setup already done (`docs/agents/`, `CLAUDE.md`, `GLOSSARY.md`), and a `FEATURE.md` describing a tags feature | Triggering, `/ship`, `tdd`, `code-review`, the hooks |
| [`fixtures/brownfield`](fixtures/brownfield) | A small order service with two failing tests, a one-line README, no agent docs, and one concept called three names (`client`, `customer`, `account`) | Setup's known-failure baseline, `/onboard-repo` |
| [`fixtures/runs/tags`](fixtures/runs/tags) | An overlay on greenfield: the tags spec, five detailed tickets, the contract and the ledger, as they stand just after plan approval | Gate, resume and end-to-end cases start here, so they need no human input |
| [`fixtures/runs/brownfield-setup`](fixtures/runs/brownfield-setup) | An overlay on brownfield: the `docs/agents/` files setup would write, with both known failures recorded | `/onboard-repo` on its own |
| [`fixtures/runs/trigger-branch`](fixtures/runs/trigger-branch) | An overlay on greenfield: a React component and a Python script with deliberate traps, a ticket, and a review-findings file, committed on `feature/wip`, plus an uncommitted change | Every trigger query |

## Writing a case

A case names a fixture, optional `setup` shell commands (or a named setup: `seed_tags_run`, `budget`, `bare_remote`, `brownfield_setup_done`, `trigger_branch`), one or more `steps` (each a prompt; later steps continue the same session unless `new_session` is set; `kill_after_s` simulates a crash), and an `expect` block. The checks available in `expect`:

| Check | Passes when |
| --- | --- |
| `skills_fired`, `skills_not_fired` | the named skills were (not) invoked through the Skill tool |
| `order` | each pair of skills first fired in that order |
| `files_exist`, `files_absent` | paths (globs with `*`) exist or don't, in the workspace |
| `file_matches`, `file_not_matches` | a file matches a regex (prefix `(?is)` style flags allowed) |
| `file_order` | one string appears in a file before another |
| `transcript_matches`, `transcript_not_matches` | the agent's text matches a regex |
| `stream_matches`, `stream_not_matches` | anything in the raw event stream matches, including hook output |
| `no_writes_matching`, `write_order` | which files the agent edited, and in what order |
| `no_bash_matching` | no shell command the agent ran matches |
| `commands` | a command run in the workspace afterwards exits as expected |
| `commit_counts` | the number of commits whose subject matches a regex |
| `git` | `main_unchanged`, `no_new_commits`, `remote_has_branch` |

Add a case for every bug a run reveals: the eval that would have caught it is the regression test.

## Baseline, 2026-10-16

Claude Code 2.1.296, `--model sonnet`, one run per case unless noted. Use these as the starting point the SRD asks to confirm after the pilot, not as targets.

| Suite | Result | Notes |
| --- | --- | --- |
| Trigger | 38 of 39 over three runs | Every should-not-trigger case passes, including all casual-design-chat negatives for `to-spec` and `to-tickets` (SRD A1). One should-trigger miss remains: a `verify-before-done` query phrased as a question ("are the tests passing?", rate 0.33). Claude Code's built-in `code-review` and `verify` skills compete for the same requests, so SRD N2 is only partly met. Next step: run `skill-creator`'s description optimiser on `verify-before-done`. |
| Gate | 9 of 9 | Includes spec review before quality review, a one-way door parking instead of adding a dependency, `implement-spec` asking its execution mode, the allowlist hook refusing an off-list command, and the three other hooks. |
| Resume | 2 of 2 | `resume-after-kill` (killed mid-ticket, resumed in a new session, one commit per ticket) and `resume-halted-run`. |
| End-to-end | 3 of 3 | A five-ticket feature from resume to a finished run with audits and a pushed branch, never merged; setup's known-failure baseline on the brownfield fixture; `/onboard-repo` committing nothing. |
| Upstream regression | 3 of 3 | Grilling rounds with no autonomy prep outside `/ship`; `tdd` writes the test first; `code-review` keeps two axes (invoked by name). |

What the live runs fixed, so the suites keep guarding it: `/ship` skipping its gates when resumed from the ledger alone, ledger timestamps misread across time zones, a turn ending on a background subagent wait, and eval-harness gaps (laptop sleep, stalled streams, usage-limit hits mistaken for failures).

A run that hits your usage limit ends with "You've hit your session limit" in its transcript; that is not a skill failure, so re-run it after the limit resets.
