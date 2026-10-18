# Hooks

Keelwork's **ballast** (Layer 4): the few rules that must hold whether or not the agent remembers them, run by the harness instead of the prompt. They ship for Claude Code only (see the SRD's open question on other harnesses).

| Hook | Event | What it does |
| --- | --- | --- |
| [`session-start.sh`](session-start.sh) | `SessionStart` (startup, resume, clear, compact) | Prints a reminder under ten lines: build requests start with grilling, unattended work goes through `/ship`, "done" needs verify output. If a `/ship` run is in progress it names the ledger, and after compaction tells the agent to re-read it. |
| [`allowlist.sh`](allowlist.sh) | `PreToolUse` on `Bash` | While a `/ship` ledger says `Status: running`, refuses any shell command that doesn't match the run contract's **Command allowlist** (SRD N6), and always refuses pushing to or merging into the main branch, force pushes and branch deletion. A refusal exits 2 with the reason, telling the agent to park the ticket. Outside a running `/ship` run it never blocks. |
| [`post-edit.sh`](post-edit.sh) | `PostToolUse` on `Edit`, `Write`, `MultiEdit`, `NotebookEdit` | Runs the repo's **lint** command on the edited file and its **typecheck** command, both from `docs/agents/commands.md`. A failure exits 2, so the output reaches the agent in the same turn. A repo without that file is left alone. |
| [`stop-guard.sh`](stop-guard.sh) | `Stop` | While a `/ship` ledger says `Status: running` and `Stop guard: on` and still has a `ready` or `in-progress` ticket, blocks the session from ending. It never blocks outside a running `/ship` run, and lets a stuck session go after three blocks with an unchanged ledger. |

[`lib.sh`](lib.sh) holds the shared parsing. The hooks need only `bash`, `sed`, `awk` and `grep`; they use `jq`, `python3` or `node` to read the hook's JSON input when one is installed.

## Turning them off

- `KEELWORK_POST_EDIT=off` disables the post-edit checks; `KEELWORK_POST_EDIT_TYPECHECK=off` keeps lint but skips the typecheck (useful on a repo whose typecheck is slow).
- The allowlist can't be switched off during a running `/ship` run; that is the point of it. Widen it instead, by adding the command to the run's contract at preflight.
- The stop guard is opt-in per run: `/ship` asks at preflight and records `Stop guard: on` or `off` in the ledger.
- The session reminder has no switch; it is a few lines of context.

## Installing without the plugin

The Claude Code plugin loads [`hooks.json`](hooks.json) automatically. If you installed the skills with skills.sh instead, copy this folder into your project (for example to `.claude/keelwork-hooks/`) and add the hooks to `.claude/settings.json`, pointing at that folder:

```json
{
  "hooks": {
    "SessionStart": [
      { "matcher": "startup|resume|clear|compact", "hooks": [{ "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/keelwork-hooks/session-start.sh\"", "timeout": 10 }] }
    ],
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/keelwork-hooks/allowlist.sh\"", "timeout": 10 }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write|MultiEdit|NotebookEdit", "hooks": [{ "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/keelwork-hooks/post-edit.sh\"", "timeout": 300 }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/keelwork-hooks/stop-guard.sh\"", "timeout": 10 }] }
    ]
  }
}
```

The reminder names commands with the plugin's `/keelwork:` prefix; without the plugin, the same skills are `/ship`, `/grill-with-docs` and so on.

## Verified

On Claude Code 2.1.296: the plugin's `hooks/hooks.json` loads with no `hooks` entry in `plugin.json`; the session-start output reaches the model's context; and the Stop hook's `{"decision":"block","reason":...}` output keeps the session going, with the reason passed to the agent. Re-check after a major Claude Code upgrade with `bash evals/hooks.test.sh` (the scripts) and the `hooks` cases in `evals/suites/gate.json` (the harness).
