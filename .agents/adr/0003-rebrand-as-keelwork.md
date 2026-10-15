# Rebrand the fork as Keelwork, renaming the plugin and not the skills

This repo began as a straight copy of Matt Pocock's skills (`mattpocock-skills`). It is now a fork with its own direction: long unattended runs that stay on course, with the human setting direction at the start and reviewing in the morning. That needs its own name, so users do not confuse it with upstream and upstream's name is not used to imply endorsement.

## Decision

- The product, plugin, package and marketplace are named **Keelwork**, always one word.
- Only the plugin is renamed. Upstream skill names (`setup-matt-pocock-skills`, `ask-matt`, `grilling`, `to-spec` and the rest) are unchanged, so that merging upstream stays routine.
- Credit goes in the README and the `LICENSE`, not in the name. The upstream copyright line stays; Keelwork's is added beneath it.
- Upstream-owned prose (`docs/` pages, `CHANGELOG.md` history, ADRs 0001 and 0002, skill bodies) is left as it is.

## Why not rename the skills too

A full rename touches around 500 lines across every docs page and every skill that points at `/setup-matt-pocock-skills`, and every upstream merge would conflict on them. The plugin namespace already gives users a Keelwork-flavoured prefix (`/keelwork:grill-me`), so the cost of keeping upstream names is low.

## Consequences

- `/keelwork:setup-matt-pocock-skills` still has "Matt Pocock" in its name. That is accepted, and is the one place his name appears in a command.
- The plugin is no longer in Claude Code's official marketplace. Installs go through this repo as a marketplace: `claude plugin marketplace add poovarasudev/keelwork`, then `claude plugin install keelwork@keelwork`. The wording is in [install-block.md](../install-block.md).
- The five layers (Keel, Sails, Hull, Ballast, Compass) are a roadmap, so the README marks each *(planned)* until it ships.
- ADR 0002 describes the upstream listing in the official marketplace. It is history, and does not describe how Keelwork is distributed.

## Update, 2026-10-15

All five layers shipped, so the README's *(planned)* markers are gone. The upstream skills Keelwork had to change to build them (`setup-matt-pocock-skills`, `to-spec`, `to-tickets`, `implement-spec`, `grilling`, `code-review`, `pr`, `ask-matt`) keep their names, as this decision requires; each edit is logged in [`FORK-CHANGES.md`](../../FORK-CHANGES.md). See [ADR 0004](./0004-build-the-layers-as-a-thin-fork.md).
