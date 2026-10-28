## What it does

`pr` is the shape a pull request body should take: a **Summary** that shows the change, **Evidence** that it works, and a **Merge Danger** call on how risky it is to land. It tells the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) what the body should look like once it is writing one. Keelwork adds a second job, **finishing a branch**: a final full-suite run, a whole-branch review against the spec, then opening a PR or keeping the branch, and cleaning up. It never merges.

The summary is a picture, not a paragraph. Where a default PR body narrates the diff in prose, this one picks the **smallest view** that makes the key point clear (pseudocode, a call tree, a component tree, a file tree, a Mermaid diagram, or a shaped diff) and keeps the words around it brief. The reviewer already has the diff open; the body's job is to show them its shape before they read it.

## When to reach for it

Type `/pr`, or the agent reaches for it automatically whenever it is writing a PR body or wrapping up a branch.

| Your situation | Reach for |
| --- | --- |
| A branch is ready and needs a body a reviewer can scan | `pr` |
| The code is written but nobody has reviewed it yet | [code-review](https://aihero.dev/skills-code-review) first, then `pr` |
| The work is done and the branch needs checking and handing over | `pr`, finishing a branch |
| The PR is open and review comments are coming back | [review-feedback](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/review-feedback.md) |

## The template

Three sections, in this order:

- **Summary**: one or more small visuals, each placed next to the short text it supports. Use one, sometimes several, rarely all of them. Keep only the calls, files, props, and boundaries the reviewer needs.
- **Evidence**: a before and after. A screenshot is the strongest evidence when the change is visual and the [environment](https://www.aihero.dev/ai-coding-dictionary/environment) can take one; otherwise the exact test that failed and now passes, written as pseudocode, or the console output that changed.
- **Merge Danger**: whether the change is a **one-way door** or a **two-way door**, and its **blast radius**. A two-way door is cheap to walk back; a one-way door (a destructive migration, a public API removal, a hard-to-reverse decision) is not. Blast radius names what could break if the change is wrong: layout shift, consumers of an API, mobile responsiveness.

The door call is the leading idea. It turns "is this safe to merge?" from a gut feeling into a stated claim the reviewer can disagree with, and it tells them where to spend their [human review](https://www.aihero.dev/ai-coding-dictionary/human-review): a two-way door with a small blast radius can be skimmed; a one-way door deserves a slow read.

## Finishing a branch

When the job is to hand a finished branch over rather than just to write a body, `pr` runs four steps in order:

1. **Full suite**: test, lint, typecheck and build, through [verify-before-done](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/verify-before-done.md). A failure off the known-failure list stops here.
2. **Whole-branch review** against the spec with [code-review](https://aihero.dev/skills-code-review), its findings sorted by [review-feedback](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/review-feedback.md).
3. **Open a PR or keep the branch.** It asks you, unless [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) already decided in its autonomy contract. A PR body references every ticket it closes.
4. **Clean up** worktrees and scratch files, only once a PR is open or you have discarded the branch. It never deletes a branch with unmerged work, and never merges.

A caller that already ran steps 1 and 2 at the current commit (a `/ship` run, with its ledger as evidence) hands that over, and `pr` doesn't repeat them.

## Common questions

**Can I trust the agent's own door call?**

Not blindly, and that is the point of stating it. The agent that wrote the change is the one grading it, and a self-report is most comfortable exactly when it says "two-way, small blast radius". Reversibility is also often invisible in the diff: as one user put it, "rolling back a commit won't unsend a batch of emails", and a flagged rollout stays two-way only until the first write lands in the new format. The skill gives the agent a definition (destructive actions and hard-to-reverse decisions are one-way), not a checklist, so read the Merge Danger line hardest of all. Two things help: make sure the agent has the [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) or [spec](https://www.aihero.dev/ai-coding-dictionary/spec) in front of it, not just the diff, and write down the changes your repo always treats as one-way (schema migrations, anything that ships outward or deletes) where the agent will read them before it makes the call.

**Does it open the PR for me?**

When you ask it to finish a branch, yes: that is the job Keelwork added (see above). When it is only writing a body, no. [implement](https://aihero.dev/skills-implement) ends by committing to the current branch, and requests for a skill or option that opens the PR (a `/to-pr`, or `implement` opening a PR instead of committing) are still open proposals; one user's workaround is a one-sentence local override of `implement` telling it to open a PR. [implement-spec](https://aihero.dev/skills-implement-spec) is the exception: it opens a draft PR when your issue tracker closes work through PRs or when you ask for one. Because `pr` is model-invoked, any time you ask the agent to open a PR, this is the shape its description takes.

**Won't it just produce another wall of text and diagrams?**

That is the failure it is built against, and it can still happen. Users' complaint about agent PR bodies is consistent: "a long summary but all I need to know is what changed, how it was verified, what could break, and whether it's safe to merge." The skill tells the agent to skip preambles, keep prose brief, and pick the smallest view, usually one visual and rarely all of them. If you still get a stack of diagrams, the agent has ignored that; if the body is huge because the diff is huge, the problem is the size of the PR, and `pr` will not split it for you.

**My repo already has a PR template. Which one wins?**

Neither, by default: `pr` carries its own template and does not look for `.github/pull_request_template.md` or anything like it. Several users asked for the skill to honour the repo's template, and left alone, the agent is holding two competing instructions for the same document. Settle it in your repo's agent docs, for example by filling the repo template and putting Summary, Evidence and Merge Danger under it.

**Is the output HTML? Why doesn't the Mermaid diagram render?**

The output is a markdown PR body, not an HTML page. GitHub and GitLab render Mermaid blocks in a PR description, but a terminal does not, so the diagram looks like raw text while the agent is still showing it to you locally. Users on CLI harnesses have worked around that with an ASCII Mermaid renderer or by having the agent attach an HTML version to the PR. Mermaid is one of six views; a call tree, file tree or shaped diff reads the same everywhere.

**Can it sort through the review comments that come back?**

Not itself. That job now has its own skill: [review-feedback](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/review-feedback.md) checks each comment against the codebase and gives it a verdict, accepted with a fix or rejected with a reason.

**Does it keep the body up to date as the PR changes?**

No. It writes the body at one point in time, and a PR that changes under review leaves that body stale. Ask the agent to rewrite the body after a substantial change; it is writing a PR body again, so the same shape applies.

**My change has no UI. What goes in Evidence?**

Everything except the screenshot. The screenshot is the strongest evidence only when the change is visual; for a migration, a background job or a refactor, the evidence is the exact test that failed before and passes now, or the console output that changed. "Tests are green" on its own is a claim, not a before and after.

**Can it mark the body as written by an LLM?**

Not by itself. One user's approach is a standing instruction in the repo's agent docs that every issue, comment, and PR the agent writes ends with a disclosure line. That rule belongs in the repo, where it covers everything the agent posts, rather than in a template for one kind of document.

## It's working if

- You can tell what the PR changes from the Summary visual alone, before opening the diff.
- The body has no preamble: it starts at the Summary heading.
- The Evidence section shows a before and an after, not a claim that tests pass.
- Every PR states a door and a blast radius, and the one-way doors are the ones you slow down on.
- When it finishes a branch, the full-suite output and the review summary come before the PR link, and nothing is ever merged.

## Where it fits

`pr` sits between review and retro when the build goes up as a pull request: `to-spec → to-tickets → implement → code-review → pr → retro`. It is model-invoked, so it also fires on its own any time the agent writes a PR body outside that chain.

- [code-review](https://aihero.dev/skills-code-review) runs before it, because a PR body should describe a diff that has already been reviewed.
- [implement](https://aihero.dev/skills-implement) produces the commits the body describes.

[ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes across the whole set when you are unsure which skill the situation wants.
