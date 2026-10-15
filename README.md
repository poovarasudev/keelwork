<p align="center">
  <picture>
    <img alt="Keelwork" src="./assets/keelwork-logo.svg" width="112">
  </picture>
</p>

# Keelwork

**Steady agents. Shipped by morning.**

Keelwork is a skills pack for Claude Code built on
[Matt Pocock's skills](https://github.com/mattpocock/skills).
Every upstream command still works exactly as before. Keelwork adds:

- **Keel**: repo onboarding, a known test baseline, verify-before-done
- **Sails**: `/ship`, from approved plan to reviewed PR, unattended
- **Hull**: stack-aware review, plus security and performance audits
- **Ballast**: hooks that hold the rules even when the agent forgets
- **Compass**: optional idea discovery and red-teaming before you build

| Layer | Skills and hooks |
| --- | --- |
| **Keel** | [`/onboard-repo`](./skills/engineering/onboard-repo/SKILL.md), [`verify-before-done`](./skills/engineering/verify-before-done/SKILL.md), and a test baseline recorded by [`/setup-matt-pocock-skills`](./skills/engineering/setup-matt-pocock-skills/SKILL.md) |
| **Sails** | [`/ship`](./skills/engineering/ship/SKILL.md), [`brainstorming`](./skills/engineering/brainstorming/SKILL.md), and agent-callable [`to-spec`](./skills/engineering/to-spec/SKILL.md) and [`to-tickets`](./skills/engineering/to-tickets/SKILL.md) with detailed ticket plans |
| **Hull** | [`stack-review`](./skills/engineering/stack-review/SKILL.md), [`security-audit`](./skills/engineering/security-audit/SKILL.md), [`performance-audit`](./skills/engineering/performance-audit/SKILL.md), [`receiving-code-review`](./skills/engineering/receiving-code-review/SKILL.md), and [`pr`](./skills/engineering/pr/SKILL.md) finishing a branch |
| **Ballast** | [Claude Code hooks](./hooks/README.md): a session reminder, post-edit lint and typecheck, and the `/ship` stop guard |
| **Compass** | [`/brainstorm-ideas-new`](./skills/productivity/brainstorm-ideas-new/SKILL.md), [`/brainstorm-ideas-existing`](./skills/productivity/brainstorm-ideas-existing/SKILL.md), [`/strategy-red-team`](./skills/productivity/strategy-red-team/SKILL.md) |

Every edit Keelwork makes to an upstream skill is logged in [`FORK-CHANGES.md`](./FORK-CHANGES.md), so the monthly upstream merge stays routine.

## How a run works

1. **Know**: grill the idea until the plan is solid
2. **Elaborate**: approve the autonomy contract and the ticket plan
3. **Execute**: the agent works overnight; anything that needs you is parked
4. **Learn**: read the morning report and answer parked questions

This is the KEEL loop, and [`/ship`](./skills/engineering/ship/SKILL.md) runs it end to end. You're there for steps 1 to 7: optional discovery and red-team, design brainstorming, a grilling session, the **autonomy contract** (what the agent may decide alone, and what it must park for you), and approving the ticket plan. Then it works unattended: each ticket goes through implement, spec review, quality review, fix, verify and commit, and anything that needs you is **parked** with the exact question while the run carries on. It finishes with the full suite, a whole-branch review, security and performance audits, and a pushed branch or an open PR. It never merges. In the morning you read `.ship/<run-id>/morning-report.md`, answer the parked questions, and `/ship resume`.

Prefer to stay at the wheel? Every upstream command still works by hand: [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) to Know, [`/to-spec`](./skills/engineering/to-spec/SKILL.md) and [`/to-tickets`](./skills/engineering/to-tickets/SKILL.md) to Elaborate, [`/implement-spec`](./skills/engineering/implement-spec/SKILL.md) to Execute, then review the result yourself to Learn.

## Installation (30-second setup)

Two ways in, two philosophies. **The [Claude Code plugin](https://code.claude.com/docs/en/plugins)** installs the whole set as a managed, read-only bundle that updates when Keelwork ships, so you subscribe rather than fork. **[skills.sh](https://skills.sh)** copies editable skill files into your project, so you can hack on them and make them your own. Pick one: installing both leaves you with every skill twice.

### 1. Get the skills

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add poovarasudev/keelwork
claude plugin install keelwork@keelwork
```

Or, from inside a session:

```
/plugin marketplace add poovarasudev/keelwork
/plugin install keelwork@keelwork
```

Plugin skills are namespaced, so every command carries the prefix: `/keelwork:grill-me`, `/keelwork:ship`.

</details>

<details>
<summary><strong>Codex, and other agents</strong></summary>

```bash
npx skills@latest add poovarasudev/keelwork
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take, so make sure `setup-matt-pocock-skills` is one of them.**

A native Codex plugin is on the roadmap (see [`.agents/adr/0002-ship-as-a-claude-code-plugin.md`](./.agents/adr/0002-ship-as-a-claude-code-plugin.md)).

</details>

<details>
<summary><strong>For tinkerers</strong></summary>

Use the same installer, on any agent, including Claude Code:

```bash
npx skills@latest add poovarasudev/keelwork
```

It writes the skills into your repo as ordinary files you own and can edit. Nothing updates behind your back; pull the latest changes when you want them with `npx skills update`.

</details>

### 2. Run `/setup-matt-pocock-skills`

In your agent, run it once per repo (with the plugin: `/keelwork:setup-matt-pocock-skills`). It will:

- Ask you which issue tracker you want to use (GitHub, Linear, or local files)
- Ask you what labels you apply to tickets when you triage them (`/triage` uses labels)
- Ask you where you want to save any docs we create
- Record your test, lint, typecheck and build commands, and run the tests once to note the ones that already fail, so later runs can tell a regression from the baseline

The skill keeps its upstream name on purpose, so merges from upstream stay routine.

### 3. Existing codebase? Run `/onboard-repo`

On a repo with code but no agent context, [`/onboard-repo`](./skills/engineering/onboard-repo/SKILL.md) drafts a short AGENTS.md, a seeded `GLOSSARY.md` and ADRs for decisions already in the code, every inferred fact marked unverified, and hands you a checklist to review before anything is committed.

### 4. You're ready to go.

## Why The Upstream Skills Exist

This section is carried over from the upstream README, where it is written in Matt Pocock's first person. "I" below means him. Keelwork keeps these skills as they are and builds on top of them.

They exist to fix common failure modes seen with Claude Code, Codex, and other coding agents.

### #1: The Agent Didn't Do What I Want

> "No-one knows exactly what they want"
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**The Problem**. The most common failure mode in software development is misalignment. You think the dev knows what you want. Then you see what they've built - and you realize it didn't understand you at all.

This is just the same in the AI age. There is a communication gap between you and the agent. The fix for this is a **grilling session** - getting the agent to ask you detailed questions about what you're building.

**The Fix** is to use:

- [`/grill-me`](./skills/productivity/grill-me/SKILL.md) - for non-code uses
- [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) - same as [`/grill-me`](./skills/productivity/grill-me/SKILL.md), but adds more goodies (see below)

These are upstream's most popular skills. They help you align with the agent before you get started, and think deeply about the change you're making. Use them _every_ time you want to make a change.

### #2: The Agent Is Way Too Verbose

> With a ubiquitous language, conversations among developers and expressions of the code are all derived from the same domain model.
>
> Eric Evans, [Domain-Driven-Design](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

**The Problem**: At the start of a project, devs and the people they're building the software for (the domain experts) are usually speaking different languages.

I felt the same tension with my agents. Agents are usually dropped into a project and asked to figure out the jargon as they go. So they use 20 words where 1 will do.

**The Fix** for this is a shared language. It's a document that helps agents decode the jargon used in the project.

<details>
<summary>
Example
</summary>

Here's an example [glossary](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md) (still named `CONTEXT.md` at that pinned commit, from before the skills renamed the convention), from my `course-video-manager` repo. Which one is easier to read?

- **BEFORE**: "There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)"
- **AFTER**: "There's a problem with the materialization cascade"

This concision pays off session after session.

</details>

This is built into [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md). It's a grilling session, but that helps you build a shared language with the AI, and document hard-to-explain decisions in ADR's.

It's hard to explain how powerful this is. It might be the single coolest technique in this repo. Try it, and see.

> [!TIP]
> A shared language has many other benefits than reducing verbosity:
>
> - **Variables, functions and files are named consistently**, using the shared language
> - As a result, the **codebase is easier to navigate** for the agent
> - The agent also **spends fewer tokens on thinking**, because it has access to a more concise language

### #3: The Code Doesn't Work

> "Always take small, deliberate steps. The rate of feedback is your speed limit. Never take on a task that’s too big."
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**The Problem**: Let's say that you and the agent are aligned on what to build. What happens when the agent _still_ produces crap?

It's time to look at your feedback loops. Without feedback on how the code it produces actually runs, the agent will be flying blind.

**The Fix**: You need the usual tranche of feedback loops: static types, browser access, and automated tests.

For automated tests, a red-green-refactor loop is critical. This is where the agent writes a failing test first, then fixes the test. This helps give the agent a consistent level of feedback that results in far better code.

I've built a **[`/tdd`](./skills/engineering/tdd/SKILL.md) skill** you can slot into any project. It encourages red-green-refactor and gives the agent plenty of guidance on what makes good and bad tests.

For debugging, I've also built a **[`/diagnosing-bugs`](./skills/engineering/diagnosing-bugs/SKILL.md)** skill that wraps best debugging practices into a disciplined loop, gated phase by phase.

### #4: We Built A Ball Of Mud

> "Invest in the design of the system _every day_."
>
> Kent Beck, [Extreme Programming Explained](https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658)

> "The best modules are deep. They allow a lot of functionality to be accessed through a simple interface."
>
> John Ousterhout, [A Philosophy Of Software Design](https://www.amazon.co.uk/Philosophy-Software-Design-2nd/dp/173210221X)

**The Problem**: Most apps built with agents are complex and hard to change. Because agents can radically speed up coding, they also accelerate software entropy. Codebases get more complex at an unprecedented rate.

**The Fix** for this is a radical new approach to AI-powered development: caring about the design of the code.

This is built in to every layer of these skills:

- [`/to-spec`](./skills/engineering/to-spec/SKILL.md) quizzes you about which modules you're touching before creating a spec

And crucially, [`/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.md) surveys a codebase for deepening opportunities and hands you the candidates. I recommend running it on your codebase once every few days. It is a survey, not a rescue: on a genuinely old codebase it will find real candidates, but it won't untangle the mud for you.

### Summary

Software engineering fundamentals matter more than ever. These skills are my best effort at condensing these fundamentals into repeatable practices, to help you ship the best apps of your career. Enjoy.

## Reference

These split on one axis: who can invoke them. **User-invoked** skills are reachable only when you type them (e.g. `/grill-me`); their job is to orchestrate. **Model-invoked** skills can be invoked by you _or_ reached for automatically by the agent when the task fits; they hold the reusable discipline. A user-invoked skill may invoke model-invoked skills, but never another user-invoked one.

### Engineering

Skills for daily code work.

**User-invoked**

- **[ask-matt](./skills/engineering/ask-matt/SKILL.md)**: Ask which skill or flow fits your situation. A router over the user-invoked skills in this repo.
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)**: Grilling session that also builds your project's domain model, sharpening terminology and updating `GLOSSARY.md` and ADRs inline.
- **[triage](./skills/engineering/triage/SKILL.md)**: Move issues through a state machine of triage roles.
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.md)**: Configure this repo for the engineering skills (issue tracker, triage labels, domain doc layout, and the test, lint, typecheck and build commands with a known-failure baseline). Run once per repo before using the other engineering skills.
- **[onboard-repo](./skills/engineering/onboard-repo/SKILL.md)**: Bootstrap context in an existing repo in one session: a short AGENTS.md, a seeded `GLOSSARY.md` and retroactive ADRs, all marked unverified and held for your review before anything is committed.
- **[ship](./skills/engineering/ship/SKILL.md)**: Take one feature from idea to reviewed PR: set the course with you, run the tickets unattended, and leave a morning report. `/ship resume` continues a run.
- **[implement](./skills/engineering/implement/SKILL.md)**: Build the work described by a spec or set of tickets, driving `/tdd` at pre-agreed seams and closing out with `/code-review` before committing.
- **[implement-spec](./skills/engineering/implement-spec/SKILL.md)**: Implement a whole spec on one integration branch. Asks whether to run a subagent per ticket or work inline, then puts every ticket through implement, spec review, quality review, fix, verify and commit, and closes out with `/code-review`.
- **[wayfinder](./skills/engineering/wayfinder/SKILL.md)**: Plan a huge chunk of work, more than one agent session can hold, as a shared map of decision tickets on the issue tracker, and resolve them one at a time until the way to the destination is clear.
- **[retro](./skills/engineering/retro/SKILL.md)**: Suggest improvements to the coding agent's environment (navigation, automated checks, coding standards, steering files, tooling) after a session, most severe first.

**Model-invoked**

- **[to-spec](./skills/engineering/to-spec/SKILL.md)**: Turn the current conversation into a spec and publish it to the issue tracker. No interview, just synthesizes what you've already discussed. Fires only when you ask for a spec, or from `/ship`.
- **[to-tickets](./skills/engineering/to-tickets/SKILL.md)**: Break a spec or plan into tracer-bullet tickets, each a detailed plan (acceptance criteria, files, interfaces, test cases, verify command) declaring its blocking edges. Fires only when you ask for tickets, or from `/ship`.
- **[prototype](./skills/engineering/prototype/SKILL.md)**: Build a throwaway prototype to answer a design question, either a single shareable HTML file for state/logic questions, or several radically different UI variations toggleable from one route.
- **[diagnosing-bugs](./skills/engineering/diagnosing-bugs/SKILL.md)**: Disciplined diagnosis loop for hard bugs and performance regressions: build a feedback loop that goes red on this bug → minimise → hypothesise → instrument → fix → regression-test.
- **[research](./skills/engineering/research/SKILL.md)**: Investigate a question against high-trust primary sources and capture the findings as a cited Markdown file in the repo, run as a background agent.
- **[tdd](./skills/engineering/tdd/SKILL.md)**: Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.
- **[domain-modeling](./skills/engineering/domain-modeling/SKILL.md)**: Actively build and sharpen a project's domain model: challenge terms against the glossary, stress-test with edge-case scenarios, and update `GLOSSARY.md` and ADRs inline.
- **[codebase-design](./skills/engineering/codebase-design/SKILL.md)**: Shared discipline and vocabulary for designing deep modules: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface.
- **[code-review](./skills/engineering/code-review/SKILL.md)**: Two-axis review of the diff since a fixed point: **Standards** (does it follow the repo's coding standards, plus a Fowler smell baseline and the matching stack checklists?) and **Spec** (does it faithfully implement the originating issue/spec?), run as parallel sub-agents so neither pollutes the other.
- **[pr](./skills/engineering/pr/SKILL.md)**: The shape a pull request body should take (a summary as the smallest visual, before/after evidence, a merge-danger call), plus finishing a branch: a final full-suite run, a whole-branch review, then open a PR or keep the branch, and clean up. Never merges.
- **[verify-before-done](./skills/engineering/verify-before-done/SKILL.md)**: Run the verify command and show its output before any claim that work is done, fixed or passing; failures on the known-failure list don't block, new ones do.
- **[brainstorming](./skills/engineering/brainstorming/SKILL.md)**: The design step of `/ship`: two or three approaches with trade-offs and the YAGNI cuts listed, then a design draft for grilling. Never fires on its own.
- **[stack-review](./skills/engineering/stack-review/SKILL.md)**: Stack-specific review checklists (TypeScript, React, Node.js, Python, Go, SQL), loaded only for the stacks a diff touches. `/code-review` pulls it in.
- **[security-audit](./skills/engineering/security-audit/SKILL.md)**: Static security audit of a branch diff before a PR: untrusted input traced to dangerous sinks, every finding refuted or backed by quoted code. Critical findings block the PR.
- **[performance-audit](./skills/engineering/performance-audit/SKILL.md)**: Static performance audit of a branch diff before a PR: N+1 queries, over-fetching, missing indexes and caching gaps, ranked by impact and effort. Critical findings block the PR.
- **[receiving-code-review](./skills/engineering/receiving-code-review/SKILL.md)**: Evaluate each review comment against the codebase and give it a verdict, accepted with a fix or rejected with a reason, instead of applying feedback blindly.
- **[wizard](./skills/engineering/wizard/SKILL.md)**: Generate an interactive bash wizard that walks a human through steps only they can perform: provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover.

### Productivity

General workflow tools, not code-specific.

**User-invoked**

- **[grill-me](./skills/productivity/grill-me/SKILL.md)**: Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved.
- **[handoff](./skills/productivity/handoff/SKILL.md)**: Compact the current conversation into a handoff document so another agent can continue the work.
- **[teach](./skills/productivity/teach/SKILL.md)**: Teach the user a new skill or concept over multiple sessions, using the current directory as a stateful teaching workspace.
- **[to-questionnaire](./skills/productivity/to-questionnaire/SKILL.md)**: Turn a decision you can't answer alone into a Markdown questionnaire for the one person who can, filled in async, or together over a meeting. It grills you about the send (who it's for, what you need back), not the subject.
- **[wait-what](./skills/productivity/wait-what/SKILL.md)**: Fire this the moment a message doesn't land. The agent re-pitches it with the context you're missing, in plain English, using your `GLOSSARY.md` vocabulary.
- **[brainstorm-ideas-new](./skills/productivity/brainstorm-ideas-new/SKILL.md)**: Brainstorm and rank feature ideas for a new product from product, design and engineering perspectives, then hand the chosen idea to `/ship`.
- **[brainstorm-ideas-existing](./skills/productivity/brainstorm-ideas-existing/SKILL.md)**: Brainstorm and rank ideas for a live product from the product trio's three perspectives, then hand the chosen idea to `/ship`.
- **[strategy-red-team](./skills/productivity/strategy-red-team/SKILL.md)**: Red-team an idea, plan or strategy: steelman then attack its load-bearing assumptions, with the cheapest test and kill criterion for each.

**Model-invoked**

- **[grilling](./skills/productivity/grilling/SKILL.md)**: Interview the user relentlessly about a plan, decision, or idea until every branch of the design tree is resolved. The reusable interview primitive behind `grill-me`, `grill-with-docs`, `triage`, `wayfinder`, `improve-codebase-architecture` and `ship`; under `/ship` it also settles errors, empty states, permissions, migrations, naming and scope.
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**: Writing documents for agents: skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer.

## Credits

Built on [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). Ports ideas from [obra/superpowers](https://github.com/obra/superpowers) (MIT)
and [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT). Ported files keep their original notices.

Keelwork is an independent fork. It is not endorsed by or affiliated with Matt Pocock.

## License

MIT. See [`LICENSE`](./LICENSE): the upstream copyright notice is kept alongside Keelwork's.
