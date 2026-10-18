# Autonomy contract · run 2026-10-16-a

## Two-way doors: decide and log
- Names of private functions, variables, files and test cases (domain terms come from `GLOSSARY.md`)
- Internal structure inside the files a ticket lists
- Test layout and fixtures
- Error and log message wording, within what the spec says
- The order of steps inside a ticket

## One-way doors: always park
- Database schema changes and migrations
- Public API changes beyond what the tickets specify
- Adding, removing or upgrading a dependency
- Anything touching authentication, authorization, sessions or secrets
- Anything touching payments or billing
- Deleting data, or deleting files a ticket doesn't list
- Running a command that isn't on the allowlist
- Building something the spec lists as out of scope

## Project entries
None.

## Budget
- Max tickets this run: 8
- Max fix rounds per ticket: 3
- Time limit: 2 hours from `Started` in the ledger

## Command allowlist
- `npm test`, `node --test <file>`, `node --check <files>`
- Read-only shell: `ls`, `cat`, `head`, `tail`, `grep`, `rg`, `find`, `wc`, `sed -n`, `diff`, `pwd`, `cd`, `echo`, `test`, `date`, `sort`, `uniq`, `mkdir -p .ship/`
- Read-only git: `git status`, `git diff`, `git log`, `git show`, `git rev-parse`, `git merge-base`, `git branch --show-current`
- Branch work on the feature branch only: `git add`, `git commit`, `git restore` (on files the current ticket lists), `git stash`
- At the finish only: `git push -u origin <feature branch>`

## Finish action
push-branch

## Halt conditions
- No ticket is ready
- A regression that the fix rounds couldn't fix
- Parked tickets exceed half the plan
- The budget runs out
