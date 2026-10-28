# Autonomy contract

The contract is the run's standing orders: what the agent may decide alone, what it must park for the human, and the limits it works within. Draft it at step 5, walk the user through each section with a recommended default, and write the agreed version to `.ship/<run-id>/contract.md`.

A **two-way door** is a decision that is cheap to walk back: decide it, log it in the ledger's *Decisions* with the reason, and keep going. A **one-way door** is expensive or impossible to reverse: park the ticket that needs it, with the exact question for the human, and move on to the next ready ticket.

Project-specific entries live in `docs/agents/autonomy-contract.md` in the target repo, using the same sections as the template below. Copy them into every run's contract. The morning report proposes new entries; the team adds the ones it agrees with.

## Template

```markdown
# Autonomy contract · run <run-id>

## Two-way doors: decide and log
- Names of private functions, variables, files and test cases (domain terms come from `GLOSSARY.md`)
- Internal structure inside the files a ticket lists
- Test layout and fixtures
- Error and log message wording, within what the spec says
- The order of steps inside a ticket
- Which of two equivalent standard-library or existing-dependency APIs to use
- A reviewer finding that is wrong for this codebase (rejected with a reason, per `review-feedback`)

## One-way doors: always park
- Database schema changes and migrations
- Public API changes: exported signatures other code depends on, HTTP routes, CLI flags, event and message shapes, config keys
- Adding, removing or upgrading a dependency
- Anything touching authentication, authorization, sessions or secrets
- Anything touching payments or billing
- Deleting data, or deleting files a ticket doesn't list
- Running a command that isn't on the allowlist
- Building something the spec lists as out of scope
- A change to a file no ticket lists, outside the current ticket's directory

## Project entries
<copied from docs/agents/autonomy-contract.md, or "None.">

## Budget
- Max tickets this run: 8
- Max fix rounds per ticket: 3
- Time limit: 8 hours from `Started` in the ledger

## Command allowlist
- The commands in `docs/agents/commands.md`
- Read-only shell: `ls`, `cat`, `head`, `tail`, `grep`, `rg`, `find`, `wc`, `sed -n`, `diff`, `pwd`, `cd`, `echo`, `test`, `date`, `sort`, `uniq`, `mkdir -p .ship/`
- Read-only git: `git status`, `git diff`, `git log`, `git show`, `git rev-parse`, `git merge-base`, `git branch --show-current`
- Branch work on the feature branch only: `git add`, `git commit`, `git restore` (on files the current ticket lists), `git stash`
- <per-run additions agreed with the user, e.g. a code generator or a local database reset script>
- At the finish only: `git push -u origin <feature branch>`, and the tracker's PR command (`gh pr create`, `glab mr create`)

## Finish action
<push-branch | open-pr>

## Halt conditions
- No ticket is ready
- A regression that the fix rounds couldn't fix
- Parked tickets exceed half the plan
- The budget runs out
```

## Notes on the defaults

- The allowlist is enforced, not advisory: during a running `/ship` run the plugin's allowlist hook refuses any shell command whose start doesn't match a backticked entry (an entry allows itself plus any arguments after it; `<placeholders>` end the match), and always refuses pushing to or merging into the main branch, force pushes and branch deletion. Name each extra command the run needs at preflight, or the ticket that needs it will park.
- The one-way list is the floor: a team can add entries, never remove these. Removing one would let an unattended run make a decision nobody can take back.
- A two-way decision that turns out wrong costs rework the human sees in the morning and can undo. A parked ticket costs a day. When unsure which kind a decision is, it is a one-way door.
- The budget defaults are a starting point for the pilot. Raise or lower them per run; the ledger records what each run used, so the numbers can be tuned from evidence.
