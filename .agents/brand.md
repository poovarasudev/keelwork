# Keelwork brand kit

Source of truth for the name, voice, palette and naming rules. Written from the original brand kit of 2026-10-15.

## Brand core

Keelwork gives coding agents a keel: the part of a ship that keeps it steady and on course with no one at the wheel. That is the promise of the fork: long unattended runs that stay on course, with the human setting direction at the start and reviewing in the morning.

**Plugin description (one line):** Disciplined agent workflows for Claude Code: grill the plan, ship overnight, review at dawn.

**Taglines**

1. Steady agents. Shipped by morning.
2. Set the course. Sleep. Review at dawn.
3. The keel under your coding agent.

**Brand story**

A ship without a keel goes wherever the wind pushes it. Coding agents are the same: fast, capable, and easily blown off course.

Keelwork gives them a keel. You set the course in one focused session, and the agent sails through the night with clear orders. Anything that needs your decision is set aside for you, and a report is ready in the morning.

Built on Matt Pocock's skills, steadied with ideas from Superpowers and pm-skills.

## The five layers as a ship

Each SRD layer maps onto a part of a ship, which gives the README and talks one picture to explain the whole fork.

| Layer | Name | Part of the ship | What it adds |
| --- | --- | --- | --- |
| 1 | Keel | The keel | Repo onboarding, a known test baseline, verify-before-done |
| 2 | Sails | The sails | `/ship`, from approved plan to reviewed PR, unattended |
| 3 | Hull | The hull | Stack-aware review, plus security and performance audits |
| 4 | Ballast | The ballast | Hooks that hold the rules even when the agent forgets |
| 5 | Compass | The compass | Optional idea discovery and red-teaming before you build |

Read it bottom to top: the keel (Layer 1) is laid first and every later layer depends on it, while ballast hooks (Layer 4) steady all four.

**Status:** all five layers have shipped. The README's layer table maps each one to its skills and hooks; a future layer is marked *(planned)* there until the change that ships it.

## The KEEL loop

The KEEL loop is Keelwork's method name, in the same spirit as AI-DLC or BMAD. Each letter maps to a block of steps in the `/ship` flow.

| Phase | `/ship` steps | What happens |
| --- | --- | --- |
| **K**now | 1-4: discovery, red-team, design brainstorming, grill | Understand what to build and why |
| **E**laborate | 5-7: autonomy contract, spec, detailed tickets, execution mode | Turn it into orders a crew can follow without asking |
| **E**xecute | 8-9: per-ticket loop, audits, PR | The agent works through the tickets overnight, unattended |
| **L**earn | 10: morning report | Review the work, answer parked questions, update the autonomy contract |

The human is present for Know and Elaborate, absent for Execute, and back for Learn.

## Morning report template

Each section has a plain heading, so a client can read the report without any context. The sections follow SRD requirement A8.

```markdown
# Morning Report · run 2026-10-16-a

## Shipped
Tickets completed, with commits and verify output.

## Parked: needs your decision
Each item lists the exact question to answer.

## Decisions made: to skim
Decisions the agent made on its own, with the reason for each.

## Review findings
Whole-branch review, security audit, performance audit.

## Suggested rule updates
New entries proposed for the autonomy contract.
```

## Visual theme

The palette is a calm night sea with brass fittings: dark and steady, with one warm accent and one alert colour.

| Role | Colour | Hex |
| --- | --- | --- |
| Primary | Deep-sea navy | `#0B2545` |
| Accent | Brass | `#C9A227` |
| Secondary | Sea foam | `#8DA9C4` |
| Background | Sailcloth | `#F4F1EA` |
| Alert (parked items, decisions needed) | Signal red | `#C0392B` |

**Logo:** a simple hull cross-section where the keel is one bold vertical stroke, so hull and keel together form a "K". It works as a single-colour monogram for the GitHub avatar and favicon.

- [`assets/keelwork-logo.svg`](../assets/keelwork-logo.svg): full-colour mark on a navy tile.
- [`assets/keelwork-monogram.svg`](../assets/keelwork-monogram.svg): single-colour monogram, takes `currentColor`. Use it for the GitHub avatar and favicon.

**Type:** a sturdy slab serif for headings (for example Roboto Slab), a clean sans-serif for body text, and a monospace font for commands.

## Naming rules

Four rules keep the name distinct and the fork easy to sync.

1. **Always "Keelwork", one word.** Never shorten it to "Keel" in product copy: KEEL is already the name of a runtime trust layer for agentic AI, and a "Keel Safety Guardrails" skill exists. The full word is what keeps search results yours. (Layer 1 is called "Keel" inside the five-layer picture only, always next to Sails, Hull, Ballast and Compass.)
2. **Rename the plugin, not the skills.** Upstream skill names such as `setup-matt-pocock-skills`, `grilling` and `to-spec` stay unchanged, so monthly merges stay routine (G4, N3).
3. **Keep "Matt" and "Pocock" out of the brand.** Credit him and the MIT source in the README instead; his name in the product name could imply endorsement.
4. **Keep the prefix short.** Plugin skills are namespaced, so every command carries it: `/keelwork:ship`, `/keelwork:ship resume`.

## What the rebrand deliberately did not touch

Everything below is upstream-owned. Editing it would make every upstream merge conflict, so it keeps upstream wording until a skill is genuinely changed by Keelwork. Every such change is logged in [`FORK-CHANGES.md`](../FORK-CHANGES.md).

- Skill folders, `name:` frontmatter, and `SKILL.md` bodies under `skills/` (so `ask-matt` and `setup-matt-pocock-skills` keep their names and headings).
- The `docs/` pages. Their links to `https://aihero.dev/skills-<name>` and to upstream issues still resolve and still describe the upstream skills accurately.
- `CHANGELOG.md` history up to 1.3.1, and `.agents/adr/0001` and `0002`, which are records of upstream decisions.
- `LICENSE`: the upstream copyright line stays (MIT requires it). Keelwork's line is added beneath it.

## Open checklist

- [x] GitHub owner is `poovarasudev` (README, `.agents/install-block.md`, `.claude-plugin/plugin.json`, `package.json`, `.changeset/config.json`). Create the `poovarasudev/keelwork` repo so the install commands resolve.
- [x] Check the GitHub org, npm, plugin marketplace and keelwork.dev / .com before announcing the name. Checked 2026-10-16:
  - npm `keelwork`: free. Claim it (an empty placeholder package) if the name matters, even though the plugin doesn't publish there.
  - GitHub org `keelwork`: free. `poovarasudev/keelwork` doesn't exist yet; create it so the install commands resolve.
  - Claude Code's official marketplace (`anthropics/claude-plugins-official`): no `keelwork` entry.
  - `keelwork.dev`: unregistered.
  - `keelwork.com`: **already registered** (created 2026-03-07, registrar IONOS). Use `keelwork.dev`, or approach the owner before announcing.
- [ ] Register `keelwork.dev` and claim the npm name and GitHub org, if wanted.
- [x] Replace this document's "planned" markers as each layer ships.
