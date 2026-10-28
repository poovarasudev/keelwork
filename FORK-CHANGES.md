# Fork changes

Every edit Keelwork makes to a file it inherited from upstream, with the reason, so that an upstream sync can replay it. This is the fork rule from SRD N3: edits to upstream files stay few, small and logged here; Keelwork's own work lives in new files and folders that never conflict.

**Upstream:** [mattpocock/skills](https://github.com/mattpocock/skills)
**Baseline:** tag `v1.3.1`, commit `0b6cee10f260a2e048279cf737bfd3e37b1fce0b`

The sync process that uses this file is in [`.agents/upstream-sync.md`](.agents/upstream-sync.md). When you edit an upstream file, add or update its row here in the same change; `node scripts/check-repo.mjs` fails when a known upstream file has changed with no row.

## Renamed

| Upstream path | Now | Reason |
| --- | --- | --- |
| `skills/engineering/ask-matt/` | `skills/engineering/ask-keelwork/` | The command carried the author's first name. ADR 0005. |
| `skills/engineering/setup-matt-pocock-skills/` | `skills/engineering/setup-keelwork/` | The command carried the author's name. ADR 0005. |
| `docs/engineering/ask-matt.md` | `docs/engineering/ask-keelwork.md` | Follows the skill. |
| `docs/engineering/setup-matt-pocock-skills.md` | `docs/engineering/setup-keelwork.md` | Follows the skill. |

Every reference to the old names across the repo was updated in the same change. `scripts/upstream-sync.sh` rewrites these paths when it applies an upstream patch.

## Edits to upstream files

### Skills

| File | Change | Reason |
| --- | --- | --- |
| `skills/engineering/setup-keelwork/SKILL.md` | Description and intro mention commands; exploration reads the repo's scripts; new **Section D: Commands and test baseline**; `### Commands` added to the `## Agent skills` block; `commands.md` added to the seed list; the closing step points brownfield repos at `/onboard-repo`; exploration spots `docs/superpowers/` and a loaded Superpowers plugin; Section A offers the **Superpowers layout**, proposed ahead of the remote's tracker when that folder exists, and its template joins the seed list; the Superpowers summary line in the `## Agent skills` block names the specs as the design record; a **Skill precedence** sub-block in every `## Agent skills` block; the closing step notes when Superpowers' skills are loaded, says both packs can stay on, and shows the per-repo off switch only as an option. | SRD F1: record test, lint, typecheck and build commands and the known failures in one config file. Superpowers layout: a repo moving off Superpowers keeps its docs tree. |
| `skills/engineering/setup-keelwork/triage-labels.md` | Header column renamed from "Label in mattpocock/skills" to "Canonical label". | Rebrand: the column named the upstream repo. |
| `skills/engineering/to-spec/SKILL.md` | `disable-model-invocation` removed; description narrowed to explicit requests and `/ship`. | SRD A1: agent-callable so `/ship` can chain it, without firing during design talk. |
| `skills/engineering/to-spec/agents/openai.yaml` | `policy.allow_implicit_invocation: false` removed. | SRD A1, kept in sync with the frontmatter per `.agents/invocation.md`. |
| `skills/engineering/to-tickets/SKILL.md` | `disable-model-invocation` removed and description narrowed; each ticket planned in detail per the new `TICKET-PLAN.md`; acceptance criteria shown at the quiz; non-concrete criteria send the ticket back to grilling; the two inline templates replaced by a pointer to `TICKET-PLAN.md`; the "avoid file paths and snippets" rule replaced; local tickets go to the path `docs/agents/issue-tracker.md` names, `.scratch/` only by default. | SRD A1 and A2: detailed plans an implementer with no session history can finish. The path change lets the Superpowers layout template take effect. |
| `skills/engineering/to-tickets/agents/openai.yaml` | `policy.allow_implicit_invocation: false` removed. | SRD A1. |
| `skills/engineering/implement-spec/SKILL.md` | New **Execution mode** and **The per-ticket loop** sections; step 4 split into inline and subagent modes; step 5 merges only after both reviews; step 7 notes inline fixing. | SRD A3: ask the mode, never default to subagents silently; spec review before quality review; fix rounds capped. |
| `skills/productivity/grilling/SKILL.md` | One closing paragraph pointing at `AUTONOMY-PREP.md` when the caller says it's a `/ship` run. | SRD S5: autonomy prep under `/ship` only; supervised sessions unchanged. |
| `skills/engineering/code-review/SKILL.md` | Step 3 calls `stack-review` for the diff's stacks; the Standards sub-agent gets the stack checklists and reports item (c). | SRD Q1: `code-review` loads the matching stack checklist. |
| `skills/engineering/pr/SKILL.md` | Description extended; new **Finishing a branch** section (full suite, whole-branch review, open a PR or keep the branch, cleanup; never merges). | SRD Q5: name kept, behaviour extended. |
| `skills/engineering/ask-keelwork/SKILL.md` | New **The unattended flow: `/ship`** and **Gates underneath** sections; on-ramps for `/onboard-repo` and the discovery skills; `implement-spec` and `pr` descriptions updated; the precondition mentions the test baseline; local tickets may live where the tracker file says, such as the Superpowers layout. | CLAUDE.md: the router must map every user-reachable skill. |
| `skills/engineering/README.md` | Voice changed from first person; new skills listed; `to-spec` and `to-tickets` moved to Model-invoked; updated entries for setup, `implement-spec`, `code-review`, `pr`. | Rebrand, and CLAUDE.md's bucket README rule. |
| `skills/productivity/README.md` | Discovery skills listed; `grilling` entry mentions autonomy prep. | CLAUDE.md's bucket README rule. |
| `skills/misc/README.md` | Voice changed from first person. | Rebrand. |
| `skills/deprecated/README.md` | Voice changed from first person. | Rebrand. |
| `skills/in-progress/README.md` | "tell me" became "tell us"; install command points at `poovarasudev/keelwork`. | Rebrand. |

### Docs pages

| File | Change | Reason |
| --- | --- | --- |
| `docs/engineering/setup-keelwork.md` | Four decisions instead of three; `commands.md` in the writes table; new **The known-failure baseline** section; an author attribution removed; the Superpowers layout in the decisions table, the tracker table and the GitHub question; a new question for repos coming from Superpowers; Skill precedence in the writes table. | Re-sync for SRD F1; rebrand; the Superpowers layout option. |
| `docs/engineering/to-spec.md` | Invocation line rewritten (agent-callable, narrow); `/ship` in Where it fits. | Re-sync for SRD A1. |
| `docs/engineering/to-tickets.md` | Invocation line rewritten; new **Each ticket is a detailed plan** section; an It's-working-if bullet replaced; `/ship` in Where it fits; the local-markdown row names the tracker file's path. | Re-sync for SRD A1 and A2, and the Superpowers layout option. |
| `docs/engineering/implement-spec.md` | Execution mode in What it does; new **The per-ticket loop** section; It's-working-if bullets updated. | Re-sync for SRD A3. |
| `docs/engineering/pr.md` | What it does, When to reach for it and two questions rewritten; new **Finishing a branch** section; one It's-working-if bullet added. | Re-sync for SRD Q5 and Q4. |
| `docs/engineering/code-review.md` | New **Stack checklists** section; one bullet each in It's working if and Where it fits. | Re-sync for SRD Q1. |
| `docs/productivity/grilling.md` | New **Autonomy prep, under `/ship` only** section; `ship` in Where it fits. | Re-sync for SRD S5. |
| `docs/engineering/codebase-design.md` | Author attribution removed ("Matt's answer", "He has separately called"). | Rebrand: `.agents/writing-docs.md` forbids naming the author. |
| `docs/engineering/tdd.md` | Author attribution removed ("Matt's position"). | Rebrand. |
| `docs/engineering/triage.md` | Author attribution removed ("Matt has agreed"). | Rebrand. |
| `docs/productivity/teach.md` | Author attribution removed ("the composition Matt named"). | Rebrand. |

### Repo files

| File | Change | Reason |
| --- | --- | --- |
| `.agents/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `.out-of-scope/mainstream-issue-trackers-only.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `.out-of-scope/setup-skill-verify-mode.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/diagnosing-bugs.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/domain-modeling.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/grill-with-docs.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/implement.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/improve-codebase-architecture.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/prototype.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/research.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/resolving-merge-conflicts.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/retro.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/wayfinder.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/engineering/wizard.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/productivity/grill-me.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/productivity/handoff.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/productivity/to-questionnaire.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/productivity/wait-what.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `docs/productivity/writing-for-agents.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `skills/engineering/ask-keelwork/agents/openai.yaml` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `skills/engineering/setup-keelwork/agents/openai.yaml` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `skills/engineering/triage/SKILL.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `skills/engineering/wayfinder/SKILL.md` | Links and mentions of `ask-matt` / `setup-matt-pocock-skills` changed to `ask-keelwork` / `setup-keelwork`. | Rename, ADR 0005. |
| `README.md` | Keelwork opening, layer table, how a `/ship` run works, setup and onboarding steps, reference lists for every new skill, credits. | Brand kit and CLAUDE.md's README rule. |
| `CLAUDE.md` (and `AGENTS.md`, its symlink) | Keelwork intro, the docs-URL rule for Keelwork skills, the `FORK-CHANGES.md` rule, the validator note. | Brand kit; SRD N3. |
| `GLOSSARY.md` | Keelwork title, and terms for the KEEL loop, morning report, ledger, autonomy contract, doors, parking, known failures, execution mode and finish action. | Domain language for the fork. |
| `LICENSE` | Keelwork's copyright line added under upstream's. | SRD N5: upstream's MIT notice kept. |
| `CHANGELOG.md` | Heading renamed to `keelwork`. History below it is upstream's, unchanged. | Rebrand. |
| `.agents/install-block.md` | Install commands for the `keelwork` marketplace on `poovarasudev/keelwork`. | Rebrand. |
| `.agents/writing-docs.md` | Keelwork note on the two kinds of page; link rules for Keelwork pages; the maintainer's personal wiki dropped from the question hunt; issue search points at this repo. | Rebrand. |
| `.claude-plugin/plugin.json` | Name, description, author, URLs and keywords; every Keelwork skill added to `skills`. | Rebrand; CLAUDE.md's plugin rule. |
| `.claude-plugin/marketplace.json` | Marketplace and plugin renamed to `keelwork`. | Rebrand. |
| `.changeset/config.json` | Changelog repo set to `poovarasudev/keelwork`. | Rebrand. |
| `package.json`, `package-lock.json` | Package renamed to `keelwork`; description and repository URL. | Rebrand. |
| `.gitignore` | `.ship/` and `evals/results/` added; the eval fixtures' seeded `.ship/` run state un-ignored. | SRD N7; eval output and fixtures. |

## Keelwork-owned skills

These skills are Keelwork's, not upstream's. They never conflict on a sync; their docs pages are published on GitHub rather than aihero.dev (see `.agents/writing-docs.md`). Ported ones keep their source's MIT notice in their own `CREDITS.md`.

| Skill | Bucket | Source |
| --- | --- | --- |
| `ship` | engineering | Keelwork (discovery adapted from pm-skills; run loop draws on Superpowers) |
| `onboard-repo` | engineering | Keelwork |
| `verify-before-done` | engineering | Ported from Superpowers `verification-before-completion` |
| `brainstorm` | engineering | Ported from Superpowers `brainstorming` |
| `stack-review` | engineering | Keelwork |
| `security-audit` | engineering | Adapted from pm-skills `security-audit-static` |
| `performance-audit` | engineering | Adapted from pm-skills `performance-audit-static` |
| `review-feedback` | engineering | Ported from Superpowers `receiving-code-review` |
| `brainstorm-ideas-new` | productivity | Ported from pm-skills |
| `brainstorm-ideas-existing` | productivity | Ported from pm-skills |
| `strategy-red-team` | productivity | Ported from pm-skills |

## Keelwork-owned files beside upstream skills

New files placed inside upstream skill folders. They never conflict, but they only make sense together with the edits above.

- `skills/engineering/setup-keelwork/commands.md`: the commands and known-failures seed template.
- `skills/engineering/setup-keelwork/issue-tracker-superpowers.md`: the local-markdown tracker in the Superpowers layout.
- `skills/engineering/to-tickets/TICKET-PLAN.md`: the detailed ticket plan.
- `skills/productivity/grilling/AUTONOMY-PREP.md`: the `/ship`-only autonomy prep branches.

## Other Keelwork-owned files

`FORK-CHANGES.md`, `.agents/brand.md`, `.agents/upstream-sync.md`, `.agents/adr/0003-*` and later, `.changeset/keelwork-*.md`, `assets/`, `hooks/`, `evals/`, `scripts/check-repo.mjs`, `scripts/upstream-sync.sh`, `.github/workflows/check.yml`, and the docs pages of the Keelwork-owned skills.
