---
name: setup-keelwork
description: "Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, domain doc layout, and the test, lint, typecheck and build commands with a known-failure baseline. Run once before first use of the other engineering skills."
disable-model-invocation: true
---

# Setup Keelwork

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker**: where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels**: the strings used for the five canonical triage roles
- **Domain docs**: where `GLOSSARY.md` and ADRs live, and the consumer rules for reading them
- **Commands**: the test, lint, typecheck, build and verify commands, plus the tests that already fail (the **known failures**), in one config file

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config`: is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root: does either exist? Is there already an `## Agent skills` section in either?
- `GLOSSARY.md` and `GLOSSARY-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/`: does this skill's prior output already exist?
- `.scratch/`: a sign that a local-markdown issue tracker convention is already in use
- `docs/superpowers/` (its `specs/` and `plans/`) or a `.superpowers/` scratch folder: a sign the repo used the Superpowers skills, so the Superpowers layout fits. Also note whether Superpowers' skills are loaded in this session: `superpowers:*` names in your available skills, or, when it was installed without the plugin, names only Superpowers has, such as `using-superpowers`, `writing-plans` or `executing-plans`
- Is the `triage` skill installed? (a `triage` skill folder alongside this one, or `triage` in your available skills.) This decides whether Section B runs at all.
- The repo's commands: `package.json` scripts, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`, `go.mod`, CI workflow files, and the README's "development" section. These tell you the test, lint, typecheck and build commands.
- `docs/agents/commands.md`: does a known-failure baseline already exist?
- Monorepo signals: a `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`. These are present only in a genuinely large multi-package repo; their absence means single-context, which is almost every repo.

### 2. Present findings and ask

Summarise what's present and what's missing. Then take the sections in order. One section, one answer, then the next.

Lead each section with the recommended answer so the user can accept it in a word. Give a one-line explainer only when the choice genuinely branches; skip the section entirely when exploration already settled it (Section B when `triage` isn't installed, Section C when there's no monorepo).

**Section A: Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-tickets`, `triage`, and `to-spec` read from and write to it. They need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. The one exception: if exploration found `docs/superpowers/`, propose the Superpowers layout first, even with a GitHub or GitLab remote, because that is where the team already keeps its specs and plans, and splitting them across two places loses the history. Offer the remote's tracker as the alternative. Otherwise (or if the user prefers), offer:

- **GitHub**: issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab**: issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown**: issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Local markdown, Superpowers layout**: the same, but specs live in `docs/superpowers/specs/` and tickets in `docs/superpowers/plans/`, beside what Superpowers already wrote. Proposed first when exploration found `docs/superpowers/`
- **Other** (Jira, Linear, etc.): ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

Record the choice in `docs/agents/issue-tracker.md`. The GitHub and GitLab templates carry a "PRs as a request surface" flag, defaulted **off**. Leave it off and don't raise it: a user who wants external PRs in the triage queue can flip the flag in the file later.

**Section B: Triage label vocabulary.** Skip this section entirely if the `triage` skill isn't installed (exploration told you), since an uninstalled skill needs no labels.

If it is installed, ask exactly one question:

> Do you want to keep the default triage labels? (recommended: **yes**)

The defaults are the five canonical roles, each label string equal to its name: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. On **yes**, write them as-is. Only if the user says no, usually because their tracker already uses other names (e.g. `bug:triage` for `needs-triage`), collect the overrides so `triage` applies existing labels instead of creating duplicates.

**Section C: Domain docs.** Default to **single-context** (one `GLOSSARY.md` + `docs/adr/` at the repo root). This fits almost every repo; write it without asking.

Offer **multi-context** (a root `GLOSSARY-MAP.md` pointing to per-context `GLOSSARY.md` files) only when exploration found monorepo signals. Then confirm which layout they want.

**Section D: Commands and test baseline.** Propose the test, lint, typecheck, build and verify commands you found, as one list the user can accept in a word. Prefer the repo's own scripts (`npm test`) over the tool they wrap. Give lint a `{files}` placeholder where the linter accepts file arguments, so the post-edit hook can lint only what changed. Leave out a command the repo genuinely lacks; don't invent one.

Once the user confirms, run the **test** command once and record every test that fails as a **known failure**: the test file or id, and a one-line summary. Tell the user the count. These are the baseline, not blockers: later skills treat a failure on the list as pre-existing and a failure off it as a regression. If the suite can't run at all (missing services, missing env), say so, record the reason in place of the list, and carry on.

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to whichever of `CLAUDE.md` / `AGENTS.md` is being edited (see step 4 for selection rules)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, `docs/agents/commands.md`, and `docs/agents/triage-labels.md` (the last only when `triage` is installed)

Let them edit before writing.

### 4. Write

**Pick the file to edit:**

- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which one to create; don't pick for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa); always edit the one that's already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.

### Commands

[one-line summary: the verify command, and how many known failures]. See `docs/agents/commands.md`.

### Skill precedence

When a Keelwork skill names another skill, use Keelwork's (`keelwork:<name>` under the plugin), not another pack's skill of the same name or purpose.
```

With the Superpowers layout, the issue-tracker summary line also says that past specs in `docs/superpowers/specs/` are the design record to read before working in an area: this block is the one place every session sees it.

Always include `### Skill precedence`, whatever other skill packs the repo uses or doesn't: a pack added later then can't take over a Keelwork flow's steps.

Include the `### Triage labels` sub-block, and write `docs/agents/triage-labels.md`, only when `triage` is installed and Section B ran. When it isn't, both are omitted.

Then write the docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./issue-tracker-github.md): GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md): GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md): local-markdown issue tracker
- [issue-tracker-superpowers.md](./issue-tracker-superpowers.md): local-markdown issue tracker in the Superpowers layout
- [triage-labels.md](./triage-labels.md): label mapping (only if `triage` is installed)
- [domain.md](./domain.md): domain doc consumer rules + layout
- [commands.md](./commands.md): commands + known failures, filled from Section D

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later; re-running this skill is only necessary if they want to switch issue trackers, re-take the test baseline, or restart from scratch.

If the repo already has code but no `GLOSSARY.md`, ADRs or agent instructions, tell the user that `/onboard-repo` bootstraps that context in one session.

If Superpowers' skills are loaded in this session, tell the user both packs can stay on: Keelwork's flows use Keelwork's skills (the `### Skill precedence` block), and whatever Superpowers writes lands in the same `docs/superpowers/` tree, where the Superpowers layout already expects it. Only if they want one pack steering every session, Superpowers can be turned off for this repo alone, in Claude Code with `"enabledPlugins": { "superpowers@claude-plugins-official": false }` in `.claude/settings.json` (match the id to the installed plugin).
