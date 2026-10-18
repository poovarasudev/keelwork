# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

`keelwork` is **not** in Claude Code's official marketplace. It installs from this repo, which is its own single-plugin marketplace (`.claude-plugin/marketplace.json`, marketplace name `keelwork`). Add the marketplace once, then install. The GitHub repo is `poovarasudev/keelwork` (see [brand.md](./brand.md)).

## Claude Code: the plugin

<canonical-block name="claude-code">

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

</canonical-block>

## Codex, and other agents: skills.sh

The plugin is Claude Code only. Everywhere else, [skills.sh](https://skills.sh) copies editable skill files into the project. Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add poovarasudev/keelwork
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take: make sure `setup-keelwork` is one of them.**

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: the upstream docs site rendered the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add poovarasudev/keelwork --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".

## Why the skill names did not change

`setup-keelwork`, `ask-keelwork` and the rest keep their upstream names so that merging upstream stays routine. The brand lives in the plugin name, not the skills. See [brand.md](./brand.md).
