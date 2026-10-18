## What it does

`performance-audit` is a static review of what a branch's diff will do as data and traffic grow. [Agents](https://www.aihero.dev/ai-coding-dictionary/agent) write code that works on seed data; this finds what breaks at a hundred times the rows. It runs four checks: **N+1** queries and request waterfalls, over-fetching, missing or inefficient indexes, and caching opportunities.

It ranks by impact per effort, and it refutes before it reports: no "unused field" without checking for dynamic access, no "missing index" without reading the schema, no cache without a reason the path is hot and a rule for invalidating it. Critical findings block the PR.

## When to reach for it

Type `/performance-audit`, or the agent reaches for it when finishing a branch, before opening a PR, or when you ask whether changes will scale. [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) runs it at every finish.

| Your situation | Reach for |
| --- | --- |
| Will this change hold up as data grows? | `performance-audit` |
| A known slowdown you need to track down | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs), which builds a feedback loop first |
| Security, not speed | [security-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/security-audit.md) |

## The four checks

| Check | Looks for | Typical fix |
| --- | --- | --- |
| N+1 and waterfalls | A query per row in a loop; sequential awaits on independent calls; unbounded reads | One join or batch query; parallel calls; pagination |
| Over-fetching | Fields fetched but never used; `SELECT *` on wide tables | The minimal field set per route |
| Indexes | Filters, sorts and joins on growing tables with no index | A specific index definition |
| Caching | Hot paths returning rarely changing data | A cache plus its invalidation rule |

A finding is **critical** when it is unbounded work on a request path that grows with data: an N+1 on a list view, an unpaginated read of a growing table, a full scan on a hot query.

## Common questions

**Does it replace profiling?**

No. It reads code and queries, so it can say what will grow, not how fast things are today. The report ends with what needs runtime profiling to confirm.

## It's working if

- Each index recommendation is a concrete definition, checked against the existing schema.
- Each cache recommendation comes with its invalidation rule.
- The report names what is already efficient.
- An N+1 on a list view shows up as critical and stops the PR.

## Where it fits

A **pre-PR gate**, run by [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) at its finish beside [security-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/security-audit.md). Its findings go through [receiving-code-review](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/receiving-code-review.md) before anything is changed. [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
