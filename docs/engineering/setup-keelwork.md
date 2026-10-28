## What it does

`setup-keelwork` answers four questions about one repo: where issues live, what the triage labels are called, where the domain docs sit, and which commands check the work. It records the answers as markdown files under `docs/agents/`, together with a **test baseline**: the tests that already fail, so later runs can tell a regression from old breakage.

Those files are the only thing that varies between repos. The skills themselves are identical everywhere; they read `docs/agents/issue-tracker.md` at run time and do what it says. That is why the set is not tied to GitHub, and why no skill file ever needs editing to point it somewhere else. Invoking it with "link the skills to a custom issue tracker" works with anything you can connect to programmatically, with zero changes to the skills.

It is a prompt-driven skill, not a deterministic script. It reads your `git remote`, your existing `CLAUDE.md`, your existing `GLOSSARY.md`, proposes what it found, and waits for you to confirm before writing anything.

## When to reach for it

You invoke this by typing `/setup-keelwork`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own. It is deliberately marked non-invokable, so no other skill can fire it for you.

Reach for it once per repo, before the first use of any other engineering skill. If [triage](https://aihero.dev/skills-triage), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets) or [wayfinder](https://aihero.dev/skills-wayfinder) start guessing where your issues go, or apply labels your tracker doesn't have, they have not been set up here yet. A repo already halfway through a project is a fine place to run it; the skill reads what is already there and no earlier work is wasted.

## Prerequisites

It writes into the repo you run it in:

| It writes | Where |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `commands.md`: test, lint, typecheck, build and verify commands, plus the known failures | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`, only when the `triage` skill is installed |
| An `## Agent skills` block, ending in a **Skill precedence** line: a Keelwork skill that names another skill means Keelwork's, whatever other packs are installed | whichever of `CLAUDE.md` / `AGENTS.md` already exists |

All of it is committed markdown. There is no user-level or global mode: the config lives in the repo, so every repo gets its own copy.

## The four decisions

It leads each section with the recommended answer, and skips whatever exploration already settled. Most runs are two confirmations and done.

| Decision | What it proposes | When it actually asks |
| --- | --- | --- |
| **Issue tracker** | the one matching your `git remote`, or the Superpowers layout when the repo has a `docs/superpowers/` folder | always: this is the one real choice |
| **Triage labels** | keep the five canonical names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) | only if the `triage` skill is installed |
| **Domain docs** | single-context: one `GLOSSARY.md` plus `docs/adr/` at the root | only if it spots monorepo signals, and then it offers a multi-context `GLOSSARY-MAP.md` |
| **Commands** | the test, lint, typecheck, build and verify commands it found in your scripts and CI | always, as one list to accept or correct; then it runs the tests once and records every failure as a **known failure** |

The tracker options:

| Option | Where issues live | Needs |
| --- | --- | --- |
| **GitHub** | the repo's GitHub Issues | the `gh` CLI |
| **GitLab** | the repo's GitLab Issues | the `glab` CLI |
| **Local markdown** | files under `.scratch/<feature>/` in this repo | nothing: no remote at all |
| **Local markdown, Superpowers layout** | specs in `docs/superpowers/specs/`, tickets in `docs/superpowers/plans/<date>-<feature>/` | nothing; proposed when the repo already has a `docs/superpowers/` folder |
| **Other** | wherever you say | one paragraph from you describing the workflow |

The first four ship as templates in the skill and work out of the box. Local markdown is a first-class option, not a fallback: a solo project with no remote is fully supported. One caveat is worth repeating: don't use local markdown if you're using GitHub Issues. They are alternatives, not layers. That holds for the Superpowers layout too: setup proposes it even with a GitHub remote because the repo already tracks its specs and plans in files, and choosing it means GitHub Issues is not the tracker.

"Other" is not a stub either. It is the reason Jira, Linear, Azure DevOps and Beads all work: you describe the workflow, the skill records your prose in `docs/agents/issue-tracker.md`, and the downstream skills follow the prose. The community has already done this: a Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) variant, a Gitea CLI shaped like `gh`, a hand-built local dashboard.

## The known-failure baseline

Most real repos have a few tests that fail before anyone touches them. Without a record of which, every later check has two bad options: block on failures nobody introduced, or learn to ignore red. The baseline removes the choice. Setup runs the **test** command once, writes each failing test into `docs/agents/commands.md` as a known failure, and from then on [verify-before-done](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/verify-before-done.md), [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) and the post-edit hook treat a failure on that list as pre-existing and a failure off it as a regression. Delete an entry when its test is fixed; re-run setup to re-take the baseline from scratch.

The commands themselves are the other half. Every Keelwork skill and hook reads them from this one file, so none of them guesses `npm test` versus `pnpm vitest` versus `make check`.

## Common questions

**Do I have to use GitHub?**

No. GitHub, GitLab and local markdown (under `.scratch/`, or in the Superpowers layout under `docs/superpowers/`) all ship as ready-made templates, and anything else works through the "other" path. This is the most-repeated question in the record, in roughly these words: *"hard locked to github"*, *"can I use GitLab / Jira"*, *"what about Azure DevOps"*. The answer every time is that the tracker is a setup answer, not a skill property.

**I've been using Superpowers. Do I lose my specs and plans?**

No. When the repo has a `docs/superpowers/` folder, setup proposes the **Superpowers layout** first, even if your remote is GitHub, so new specs land beside the old ones in `docs/superpowers/specs/` instead of splitting your history across two places. One thing changes: Superpowers writes one plan file per feature, and Keelwork writes one file per ticket, in a folder (`docs/superpowers/plans/<date>-<feature>/01-<slug>.md`), because `/ship` and `/implement-spec` track each ticket's status and blockers in its own file. Your existing plans, any folders of your own such as `notes/`, and the git-ignored `.superpowers/` scratch space are left alone. Past specs count as the design record: the tracker file tells agents to read the ones touching an area before working in it, and [onboard-repo](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/onboard-repo.md) mines them for ADRs. And you don't have to turn Superpowers off. Keelwork's skills have names of their own (its `brainstorm` and `review-feedback` against Superpowers' `brainstorming` and `receiving-code-review`), so nothing collides however either pack is installed. On top of that, the **Skill precedence** line, the session reminder and `/ship`'s own rules all say a Keelwork flow uses Keelwork's skills, and Superpowers itself ranks your `CLAUDE.md` above its skills. Anything Superpowers still writes lands in `docs/superpowers/`, where this layout already expects it, and a Superpowers spec with no ticket folder yet is pointed at `/to-tickets`. Turning Superpowers off is there only if you want a single pack steering every session; setup shows the `enabledPlugins` line for `.claude/settings.local.json`, which turns it off for you in this repo without touching your collaborators. If you pick a tracker other than the Superpowers layout while Superpowers stays on, setup warns that its brainstorming and plan skills still write to `docs/superpowers/`.

**Do I need to re-run it after updating the skills?**

Asked directly after v1.1, the answer was yes. The skill's own closing message is softer: it tells you re-running is only needed to switch trackers or start over. Both are defensible and the reason for the gap is real: the seed templates change between versions, so a `docs/agents/issue-tracker.md` written by an older release can go stale against the skills now reading it. If a downstream skill starts doing something the docs describe differently, re-running is the cheap fix.

**It wrote to `CLAUDE.md`, but I'm on Codex.**

Known gap, still open. The file-selection rule is "edit `CLAUDE.md` if it exists, else `AGENTS.md`": it checks which file exists, not which [harness](https://www.aihero.dev/ai-coding-dictionary/harness) is running. A repo with a `CLAUDE.md` left over from Claude Code will get its `## Agent skills` block somewhere Codex never reads. Two workarounds are in circulation: move the block to `AGENTS.md` by hand, or keep `AGENTS.md` canonical and make `CLAUDE.md` a one-line pointer at it. If neither file exists, the skill asks you which to create rather than picking, which has confused people who expected it to just decide.

**It didn't create my triage labels.**

It doesn't. `docs/agents/triage-labels.md` is a *mapping*: it tells `/triage` which strings in your tracker correspond to the five canonical roles. It does not run `gh label create`. On a fresh GitHub repo the labels genuinely do not exist yet, and this has been filed as a bug more than once. Two follow-ons:

- If your tracker already uses the canonical names, the mapping is an identity table and there is nothing to configure. That is the intended common case, not a missing step.
- [wayfinder](https://aihero.dev/skills-wayfinder)'s `wayfinder:map` and `wayfinder:<type>` labels are not created here either, and `gh issue create --label <missing>` fails outright rather than creating the label. Create them by hand before the first wayfinder run on a GitHub repo.

**Can I configure the other skills' behaviour here ([grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) cadence, question format, tone)?**

No. It configures three things: tracker, labels, doc layout. There have been direct requests to make it the home for per-user preferences, and the standing answer is that skills stay opinionated: *"Config is death."* Preferences belong in your `CLAUDE.md` as plain instructions, which every skill already reads.

**Can I keep the config in `~/.claude` instead of committing it to every repo?**

Not today. There is an open request for exactly this from someone running the skills across many repos, and no user-level mode exists. Every repo carries its own `docs/agents/`.

**Isn't it strange to have a skill that configures the other skills?**

One long-standing complaint says yes, in these words: *"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* The trade is real and acknowledged: the alternative to a setup step is duplicating tracker instructions into every skill that touches issues. The output is inspectable, editable markdown, which is the mitigation: you can read every file it wrote and change it by hand, and day-to-day tweaks are exactly that, not another run.

## It's working if

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist, plus `triage-labels.md` if `triage` is installed.
- An `## Agent skills` section appears in the instruction file your harness actually reads, with a one-line summary pointing at each of those files.
- The tracker it proposed matches the remote you really use, and the label strings match labels that really exist in your tracker.
- Afterwards, `/to-tickets` publishes without asking you where issues live, and `/triage` applies labels rather than inventing them.
- Nothing in the skill files themselves changed. If setup edited a `SKILL.md`, something went wrong.

## Where it fits

`setup-keelwork` is the **run-once setup** for the engineering flow, the precondition everything else assumes rather than a step in the chain. Its neighbours are its readers: [triage](https://aihero.dev/skills-triage), which applies the label vocabulary written here; [to-spec](https://aihero.dev/skills-to-spec) and [to-tickets](https://aihero.dev/skills-to-tickets), which publish into the tracker named here; and [wayfinder](https://aihero.dev/skills-wayfinder), which reads the "Wayfinding operations" section of the same tracker file to know how maps and child [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) are stored. The domain-doc layout it records is the one [domain-modeling](https://aihero.dev/skills-domain-modeling) fills in later: it creates `GLOSSARY.md` and ADRs lazily, when a term or decision actually gets resolved, so an empty repo after setup is the expected state. For which skill to reach for next, [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes the whole set.
