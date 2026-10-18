# Autonomy prep

Read this only when the invoking skill says the session is a `/ship` run. After the grilling, an agent will build the result unattended overnight, and any decision left open becomes either a guess or a parked ticket. Autonomy prep closes those decisions while the human is still here.

Add these branches to the design tree and ask them in the normal rounds, with a recommended answer each. Skip a branch only when the feature plainly has nothing on it, and say so in one line rather than silently.

- **Errors**: for each operation that can fail (network, validation, conflict, timeout), what the user sees and what state is left behind. Retries, and whether a partial failure rolls back.
- **Empty states**: what each list, view or result shows with zero items, the first time, and after the last item is removed.
- **Permissions**: who may do each action, what everyone else sees (hidden, disabled, or a 403), and whether any existing role changes.
- **Migrations**: schema or stored-data changes, backfills for existing rows, and whether the change must be reversible. Each one is a one-way door, so settle it now.
- **Naming**: the domain terms for every new concept, checked against `GLOSSARY.md`, so tickets and code use one word for each.
- **Out of scope**: an explicit list of what this feature will not do, so the unattended run doesn't build it and the reviews can flag it as scope creep.
- **Other one-way doors**: a new dependency, a public API or route change, anything touching auth or payments, any data deletion. Decide each now, or mark it as a deliberate parking point for the morning.

The session is done when every branch above is either decided or recorded as out of scope.
