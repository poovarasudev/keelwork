# Rename the two skills that carried the author's name

ADR 0003 kept every upstream skill name, including `ask-matt` and `setup-matt-pocock-skills`, to keep upstream merges routine. In use, the two names read as someone else's product inside Keelwork, and they are the commands people type first.

## Decision

Rename them to `ask-keelwork` and `setup-keelwork`. Every other upstream skill keeps its name.

## Consequences

- `scripts/upstream-sync.sh` rewrites the two renamed paths in the upstream patch, and `scripts/check-repo.mjs` maps them back to the upstream baseline paths. Both live in the same two small tables, so a third rename means editing both.
- `FORK-CHANGES.md` lists the renames under **Renamed**.
- The renamed docs pages are Keelwork pages now, so their published URL is the page on GitHub, not `aihero.dev`.
- With the plugin installed the commands read `/keelwork:setup-keelwork` and `/keelwork:ask-keelwork`. The repeated word is the price of a name that still makes sense when installed through skills.sh, with no prefix.
- Anyone who typed `/setup-matt-pocock-skills` or `/ask-matt` must use the new names. The 1.5.0 release notes say so.
