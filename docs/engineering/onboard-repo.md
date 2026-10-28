## What it does

`onboard-repo` gives an existing codebase the context a fresh [agent](https://www.aihero.dev/ai-coding-dictionary/agent) [session](https://www.aihero.dev/ai-coding-dictionary/session) needs on day one, in one sitting: a short, pointer-based `AGENTS.md` (or an addition to your `CLAUDE.md`), a seeded `GLOSSARY.md` mined from the code's own nouns, and retroactive ADRs for decisions already baked into the code.

Everything it writes is a draft that you review before anything is committed. A confidently wrong glossary misleads every session after it, so every inferred fact carries an `(unverified)` mark and its evidence, and the skill stops at a checklist of claims for you to confirm or correct.

## When to reach for it

You invoke this by typing `/onboard-repo`, and the agent won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| An existing repo (a client codebase, an inherited project) with no agent context | `/onboard-repo`, once, after setup |
| A new, empty repo | nothing yet: [grill-with-docs](https://aihero.dev/skills-grill-with-docs) builds the glossary as you go |
| A glossary that exists but has drifted or bloated | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), asking it to tighten `GLOSSARY.md` |
| One fuzzy term to settle | [domain-modeling](https://aihero.dev/skills-domain-modeling) |

## Prerequisites

[setup-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/setup-keelwork.md) must have run first: the glossary layout comes from its `docs/agents/domain.md`, and the agent instructions point at its `docs/agents/commands.md`. It writes `GLOSSARY.md`, ADRs under `docs/adr/`, additions to `CLAUDE.md` or `AGENTS.md`, and a temporary `docs/agents/onboarding-review.md`.

## Unverified until reviewed

The skill can see *what* the code does far more reliably than *why*, and it can mistake an accident for a convention. So it separates the two jobs: the agent gathers and drafts, with evidence for every claim; you confirm. Each glossary definition, each line of agent instructions and each ADR is marked `(unverified)` with the file or commit it came from. Where the code uses several words for one concept (`customer`, `client`, `account`), it proposes a canonical term and puts the choice to you as a question rather than deciding it. Where an ADR's reason isn't written down anywhere, it says "Reason not recorded" instead of inventing one. A design doc counts as written down: in a repo that used the Superpowers skills, the specs in `docs/superpowers/specs/` are mined for decisions and their reasons, each cited as evidence.

When you finish the checklist, it applies your corrections, removes the marks from what you confirmed, accepts the ADRs, deletes the checklist, and shows you the diff. It commits only if you ask.

## Common questions

**Why not let it commit straight away? It saves a step.**

Because the cost of a wrong glossary isn't paid once: every later grilling, spec and ticket uses its vocabulary. The review is the single point where an inferred fact gets a human's yes, and it's cheapest right here, while the evidence is listed next to each claim.

**My AGENTS.md came out short. Is something missing?**

Probably not. The instructions are meant to be pointers to where things live, plus what an agent can't find by looking. Restating your directory tree or `package.json` scripts would be a copy that goes stale; the agent can read those itself.

## It's working if

- Every claim in the checklist names the file, line or commit it came from.
- The glossary uses the words your code and commits already use, and flags the places they disagree.
- ADRs say "Reason not recorded" where the reason isn't written down, rather than a plausible guess.
- Nothing is staged or committed until you say the review is done.

## Where it fits

`onboard-repo` is a **run-once setup**, right after [setup-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/setup-keelwork.md) on a brownfield repo and before the first feature. It drives [writing-for-agents](https://aihero.dev/skills-writing-for-agents) for the agent instructions and [domain-modeling](https://aihero.dev/skills-domain-modeling) for the glossary and ADRs. After it, the main flow (by hand, or via [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md)) starts with real context. [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
