---
"keelwork": minor
---

`/setup-keelwork` offers a **Superpowers layout** for the local-markdown tracker: specs in `docs/superpowers/specs/` and tickets in `docs/superpowers/plans/<date>-<feature>/`, one file per ticket, beside what Superpowers already wrote. It is proposed first when the repo already has a `docs/superpowers/` folder, even with a GitHub remote, and Keelwork works whether Superpowers is installed, enabled or used: a Keelwork skill that names another skill means Keelwork's (a new **Skill precedence** line in the `## Agent skills` block, the session reminder, and a `/ship` run rule), so a Keelwork flow never hands a step to another pack's skill. Past specs count as the design record: agents read the ones touching an area, and `/onboard-repo` mines them for ADRs. `/to-tickets` now writes local tickets to the path the tracker file names, with `.scratch/` as the default.
