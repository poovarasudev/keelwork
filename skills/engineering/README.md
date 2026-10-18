# Engineering

Skills for daily code work.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[ask-keelwork](./ask-keelwork/SKILL.md)**: Ask which skill or flow fits your situation. A router over the user-invoked skills in this repo.
- **[grill-with-docs](./grill-with-docs/SKILL.md)**: Grilling session that also builds your project's domain model, sharpening terminology and updating `GLOSSARY.md` and ADRs inline.
- **[triage](./triage/SKILL.md)**: Move issues through a state machine of triage roles.
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- **[setup-keelwork](./setup-keelwork/SKILL.md)**: Configure this repo for the engineering skills (issue tracker, triage labels, domain doc layout, and the test, lint, typecheck and build commands with a known-failure baseline). Run once per repo.
- **[onboard-repo](./onboard-repo/SKILL.md)**: Bootstrap context in an existing repo in one session: a short AGENTS.md, a seeded `GLOSSARY.md` and retroactive ADRs, all marked unverified and held for your review before anything is committed.
- **[ship](./ship/SKILL.md)**: Take one feature from idea to reviewed PR: set the course with you, run the tickets unattended, and leave a morning report. `/ship resume` continues a run.
- **[implement](./implement/SKILL.md)**: Build the work described by a spec or set of tickets, driving `/tdd` at pre-agreed seams and closing out with `/code-review` before committing.
- **[implement-spec](./implement-spec/SKILL.md)**: Implement a whole spec on one integration branch. Asks whether to run a subagent per ticket or work inline, then puts every ticket through implement, spec review, quality review, fix, verify and commit, and closes out with `/code-review`.
- **[wayfinder](./wayfinder/SKILL.md)**: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on the issue tracker, resolved one at a time until the way to the destination is clear.
- **[retro](./retro/SKILL.md)**: Suggest improvements to the coding agent's environment (navigation, automated checks, coding standards, steering files, tooling) after a session, most severe first.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[to-spec](./to-spec/SKILL.md)**: Turn the current conversation into a spec and publish it to the issue tracker. Fires only when asked for a spec, or from `/ship`.
- **[to-tickets](./to-tickets/SKILL.md)**: Break a spec or plan into tracer-bullet tickets, each a detailed plan (acceptance criteria, files, interfaces, test cases, verify command) with its blocking edges. Fires only when asked for tickets, or from `/ship`.
- **[prototype](./prototype/SKILL.md)**: Build a throwaway prototype to answer a design question: a single shareable HTML file for state/logic, or several toggleable UI variations.

- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)**: Disciplined diagnosis loop for hard bugs and performance regressions: build a feedback loop that goes red on this bug → minimise → hypothesise → instrument → fix → regression-test.
- **[research](./research/SKILL.md)**: Investigate a question against high-trust primary sources and capture the findings as a cited Markdown file in the repo, run as a background agent.
- **[tdd](./tdd/SKILL.md)**: Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.
- **[domain-modeling](./domain-modeling/SKILL.md)**: Actively build and sharpen a project's domain model by challenging terms, stress-testing with scenarios, and updating `GLOSSARY.md` and ADRs inline.
- **[codebase-design](./codebase-design/SKILL.md)**: Shared discipline and vocabulary for designing deep modules: small interfaces, clean seams, testable through the interface.
- **[code-review](./code-review/SKILL.md)**: Two-axis review of the diff since a fixed point: **Standards** (does it follow the repo's coding standards, plus a Fowler smell baseline and the matching stack checklists?) and **Spec** (does it faithfully implement the originating issue/spec?), run as parallel sub-agents.
- **[pr](./pr/SKILL.md)**: The shape a pull request body should take (a summary as the smallest visual, before/after evidence, a merge-danger call), plus finishing a branch: a final full-suite run, a whole-branch review, then open a PR or keep the branch, and clean up. Never merges.
- **[verify-before-done](./verify-before-done/SKILL.md)**: Run the verify command and show its output before any claim that work is done, fixed or passing; failures on the known-failure list don't block, new ones do.
- **[brainstorming](./brainstorming/SKILL.md)**: The design step of `/ship`: two or three approaches with trade-offs and the YAGNI cuts listed, then a design draft for grilling. Never fires on its own.
- **[stack-review](./stack-review/SKILL.md)**: Stack-specific review checklists (TypeScript, React, Node.js, Python, Go, SQL), loaded only for the stacks a diff touches. `/code-review` pulls it in.
- **[security-audit](./security-audit/SKILL.md)**: Static security audit of a branch diff before a PR: untrusted input traced to dangerous sinks, every finding refuted or backed by quoted code. Critical findings block the PR.
- **[performance-audit](./performance-audit/SKILL.md)**: Static performance audit of a branch diff before a PR: N+1 queries, over-fetching, missing indexes and caching gaps, ranked by impact and effort. Critical findings block the PR.
- **[receiving-code-review](./receiving-code-review/SKILL.md)**: Evaluate each review comment against the codebase and give it a verdict, accepted with a fix or rejected with a reason, instead of applying feedback blindly.
- **[wizard](./wizard/SKILL.md)**: Generate an interactive bash wizard that walks a human through steps only they can perform: provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover.
