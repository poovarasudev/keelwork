---
"keelwork": minor
---

Rename `pr` to `finishing-a-dev-branch`. The old name matched ordinary chat about pull requests; the new one fires when you say a branch is done. Behaviour is unchanged. With the plugin the command is `/keelwork:finishing-a-dev-branch`; anyone who typed `/pr` must use the new name.

Add `/quick-finishing-a-dev-branch`, the short hand-over: it runs the tests, commits everything pending, pushes the branch and asks whether to open a PR. No lint, typecheck, build or review; for those use `/finishing-a-dev-branch`.
