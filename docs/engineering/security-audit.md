## What it does

`security-audit` is a static security review of a branch's diff before it becomes a PR. It maps the entry points the change touches to the dangerous sinks they reach (SQL, shell, HTML, outbound fetches, file paths, logs, LLM prompts), inspects authorization, data access, sessions and output encoding, and checks the code against what the spec and ADRs say should be enforced.

It reports nothing it can't prove. Every candidate finding goes through a **refute** pass: the agent tries to disprove it, naming the attacker and the victim, and keeps it only when no cited check stops it. Every surviving finding quotes the line of code it accuses. Critical findings block the PR.

## When to reach for it

Type `/security-audit`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it when finishing a branch, before opening a PR, or when you ask for a security review of changes. [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) runs it at every finish.

| Your situation | Reach for |
| --- | --- |
| A branch is about to become a PR | `security-audit` |
| You want to know if the change scales | [performance-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/performance-audit.md) |
| You want standards and spec checked | [code-review](https://aihero.dev/skills-code-review) |

## Refute before reporting

A security review that lists every theoretical risk gets ignored. This one defaults to keeping a finding, then tries hard to kill it with evidence: a real validator or authorization check at the sink, a sink that isn't dangerous, a path that isn't reachable in production. A finding whose only victim is the attacker's own account is dropped, except for the classes that always reach someone else (SSRF, shared billing, data exposure, cross-tenant flows, server-side execution). Then every citation is re-opened to confirm the line is current and the quote is verbatim.

| Severity | Meaning | Effect |
| --- | --- | --- |
| Critical | Unauthenticated or cross-tenant access to data, money or execution | Blocks the PR |
| High | An authenticated user crosses a privilege or tenant boundary; secrets or personal data leak | Reported in the PR or morning report |
| Medium | A boundary that holds only by accident | Reported |
| Low | A defence-in-depth gap with no direct exploit | Reported |

## Common questions

**Is this a penetration test?**

No. It produces code-review findings, not confirmed exploits, and it reads only the code. It also ends with an OWASP Top 10 coverage list, so a category with no findings shows up as "no evidence found" rather than silently passing.

## It's working if

- Every finding has an Evidence line quoting real, current code.
- Findings name an attacker, a sink and an impact, step by step.
- The report says explicitly what is well built.
- A critical finding stops the PR, and the morning report says why.

## Where it fits

A **pre-PR gate**, run by [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) at its finish after the whole-branch [code-review](https://aihero.dev/skills-code-review), beside [performance-audit](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/performance-audit.md). Its findings are sorted by [review-feedback](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/review-feedback.md) before anything is fixed. [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
