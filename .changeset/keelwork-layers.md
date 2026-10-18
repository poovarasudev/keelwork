---
"keelwork": minor
---

Ship Keelwork's five layers on top of the upstream skills.

- **Keel**: `/setup-matt-pocock-skills` now records the test, lint, typecheck, build and verify commands and a **known-failure** baseline in `docs/agents/commands.md`. New `/onboard-repo` drafts a short AGENTS.md, a seeded `GLOSSARY.md` and retroactive ADRs for an existing codebase, all marked unverified until you review them. New `verify-before-done` gates every "done" on fresh command output.
- **Sails**: new `/ship` takes one feature from idea to reviewed PR. You're there for discovery, design brainstorming, grilling, the autonomy contract and plan approval; then it runs every ticket unattended (implement, spec review, quality review, fix, verify, commit), parks what needs you, and leaves a morning report. `/ship resume` continues a run from its ledger. `to-spec` and `to-tickets` are now agent-callable with narrow descriptions, and each ticket is a detailed plan an implementer with no session history can finish. `/implement-spec` asks for the execution mode (subagent per ticket or inline) and runs the same per-ticket loop. `grilling` adds autonomy prep, only under `/ship`. New `brainstorming` (ported from Superpowers) is `/ship`'s design step.
- **Hull**: new `stack-review` (TypeScript, React, Node.js, Python, Go, SQL checklists, loaded only for the stacks a diff touches), which `code-review` now pulls in. New `security-audit` and `performance-audit` (adapted from pm-skills) audit a branch diff before a PR; critical findings block it. New `receiving-code-review` (ported from Superpowers) gives each review comment a verdict. `pr` can now finish a branch: full suite, whole-branch review, then open a PR or keep the branch, and clean up. It never merges.
- **Ballast**: the plugin ships Claude Code hooks: a short session reminder (also after compaction), a command allowlist enforced during `/ship` runs (never a push or merge to main, a force push or a branch deletion), lint and typecheck after every edit, and an optional `/ship` stop guard.
- **Compass**: `/brainstorm-ideas-new`, `/brainstorm-ideas-existing` and `/strategy-red-team` (ported from pm-skills) as the optional front end to `/ship`.

Also: `FORK-CHANGES.md` logs every edit to an upstream file, `.agents/upstream-sync.md` and `scripts/upstream-sync.sh` run the monthly sync, `evals/` holds fixtures and trigger, gate, resume, end-to-end and upstream-regression suites, and `scripts/check-repo.mjs` checks the repo's structural rules in CI.
