---
name: onboard-repo
description: "Bootstrap context in an existing repo in one session: a short AGENTS.md, a seeded GLOSSARY.md, retroactive ADRs, and a checklist for you to review before anything is committed."
disable-model-invocation: true
---

# Onboard Repo

Give an existing repo the context a fresh agent session needs on day one: agent instructions, a seeded glossary, and ADRs for decisions already baked into the code. Everything you write is a **draft for human review**. A confidently wrong glossary misleads every later session, so every inferred fact carries an `(unverified)` mark until the human confirms it, and nothing is committed before that review.

`docs/agents/domain.md` and `docs/agents/commands.md` should exist. If they don't, tell the user to run `/setup-keelwork` first and stop: the glossary layout and the commands come from there.

## Process

### 1. Survey

Read the repo without changing it: the directory layout, manifests and lockfiles, entry points (routes, handlers, CLI commands, jobs), the data model (schema files, migrations, ORM models, core types), tests and CI, the README and any existing docs, and the last ~50 commit messages. On a large repo, split the survey across exploration subagents by area and have each save its notes to a file outside the repo.

Keep an **evidence list** as you go: every fact you'll later write down, with the file, line or commit it came from. A fact with no evidence doesn't get written.

### 2. Agent instructions

Call the Skill tool with "writing-for-agents", then draft the agent instructions file. Edit `CLAUDE.md` if it exists, else `AGENTS.md` if that exists; if neither exists, ask the user which to create. Never create one beside the other. Add to the file; leave existing sections and the `## Agent skills` block as they are.

Keep it short and pointer-based: a line or two on what the repo is, then pointers to where things live and to `docs/agents/commands.md`, then only what an agent can't find by looking (unwritten conventions, the reason behind a surprising layout, gotchas). Restating what a manifest or the directory tree already says is a cache that goes stale; leave it out. Mark every inferred line `(unverified)`.

### 3. Glossary

Call the Skill tool with "domain-modeling", then seed `GLOSSARY.md` in the layout `docs/agents/domain.md` names. Mine the terms from the code: entity and type names, tables, routes, UI copy, and the words commit messages use. Where the code uses several words for one concept (`customer`, `client`, `account`), pick the canonical one, list the others under `_Avoid_`, and add the choice to the review checklist as a question. Where one word means several things, record it under *Flagged ambiguities*.

Mark every definition `(unverified)`. Don't resolve an ambiguity by guessing: it goes to the human.

### 4. Retroactive ADRs

Find decisions already in the code that pass the ADR test in `domain-modeling` (hard to reverse, surprising without context, the result of a real trade-off): the datastore, the framework, the architecture's shape, the auth provider, a deliberate deviation from the obvious path. Write each in `docs/adr/` (or where `docs/agents/domain.md` says) with `Status: proposed` frontmatter and a line naming its evidence: `(unverified: inferred from <file or commit>)`.

You can see *what* was decided but rarely *why*. Write the why only where the code, a comment, a commit or a design doc states it; otherwise write "Reason not recorded" and ask in the checklist. A repo that used the Superpowers skills keeps its design docs in `docs/superpowers/specs/`: mine them for decisions as well as reasons, citing the spec as evidence.

### 5. Review checklist

Write `docs/agents/onboarding-review.md`, one checkbox per claim the human has to confirm, grouped by file:

```markdown
# Onboarding review

Nothing below is committed yet. Tick what's right, correct what isn't, then tell the agent you're done.

## GLOSSARY.md
- [ ] **Order**: "A customer's request for one or more products." Evidence: `src/orders/model.ts:12`
- [ ] Canonical term **Customer** over `client` and `account`? (`client` in `api/`, `account` in `billing/`)

## docs/adr/0001-postgres-for-everything.md
- [ ] Decision correct? Reason not recorded: why Postgres over the existing Redis?

## CLAUDE.md
- [ ] "Feature flags live in `config/flags.ts` and are read once at boot." Evidence: `src/boot.ts:40`
```

Then show the user the checklist path and a short summary: files drafted, claims to confirm, open questions. Stop there.

### 6. After the review

When the user says the review is done, apply their corrections, remove the `(unverified)` mark from every confirmed claim, set each confirmed ADR to `Status: accepted`, delete what they rejected, and delete `docs/agents/onboarding-review.md`. Show the final diff. Commit only if the user asks.
