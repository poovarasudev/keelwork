# SQL and migrations checklist

Each item: the trap → the fix. Any schema change is a one-way door in a `/ship` run, so a migration in an unattended diff should already have been decided in grilling.

## Queries

- SQL built by string concatenation or interpolation → parameters.
- `SELECT *` in application queries → name the columns.
- Queries inside loops (N+1) → one query with a join or an `IN` list, or the ORM's eager loading.
- List queries with no `LIMIT` or pagination → paginate.
- Filters, joins and sorts on columns with no index, on a table that will grow → add the index in a migration (check the schema first: primary keys and unique constraints are already indexed).
- `LIKE '%term%'` on large tables → a full-text index, or accept the scan knowingly.
- Multi-step writes that must succeed or fail together, run without a transaction → wrap them in one.
- Authorization done by filtering in application code after fetching every row → filter in the query (tenant id, owner id).

## Migrations

- A migration that isn't reversible, with no `down` and no note saying why → add `down`, or document the one-way step.
- Adding a `NOT NULL` column without a default to a populated table → add it nullable, backfill, then add the constraint.
- Renaming or dropping a column that running code still reads → expand-contract: add the new one, migrate readers, drop later.
- Long-locking operations on big tables (adding an index without `CONCURRENTLY` on Postgres, rewriting a column type) → the online variant, or schedule it.
- Data backfills inside a schema migration on large tables → a separate, batched job.
- Schema change with no matching update to the ORM models, types or fixtures → update them in the same change.

## Data safety

- `DELETE` or `UPDATE` without a `WHERE`, or with one that can match more than intended → tighten it, and test it against realistic data.
- Destructive operations (dropping a table or column, purging rows) → flag them; they need a human decision and a backup plan.
- Sensitive columns (passwords, tokens, personal data) stored in plain text → hash or encrypt them.
