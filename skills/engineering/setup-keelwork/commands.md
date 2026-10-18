# Commands

The commands the skills run to check this repo's work. Skills and hooks read them from here; none hard-codes its own. Keep each one on its own bullet, in the exact shape `- **<key>**: \`<command>\``, because the Keelwork hooks parse that shape.

## Commands

- **test**: `npm test`
- **lint**: `npx eslint {files}`
- **typecheck**: `npx tsc --noEmit`
- **build**: `npm run build`
- **verify**: `npm test`
- **lint-extensions**: `ts tsx js jsx`

`{files}` is replaced with the changed files, space-separated. A command without `{files}` runs on the whole project. Delete a bullet the repo has no command for; a skill that needs a missing command says so instead of guessing one.

- **test**: the full test suite.
- **lint**: the linter. With `{files}`, the post-edit hook lints just the files an edit touched; without it, the hook skips lint (a whole-project lint on every edit is too slow).
- **typecheck**: the type checker, whole project.
- **build**: the production build.
- **verify**: what proves a change is done when a ticket names no verify command of its own. Usually the test suite; some repos chain test, lint and typecheck.
- **lint-extensions** (optional): the file extensions the linter handles, space-separated. The post-edit hook lints only edited files with one of these extensions; without it, it lints every edited file.

## Known failures

Tests that already failed when this file was written, recorded so they read as the baseline rather than as regressions. A failure on this list is not a blocker; a failure not on this list is.

Baseline taken at commit `<sha>` on `<date>` by running **test** once.

- `<test file or test id>`: <one-line failure summary>

Write `None.` when the suite was green. Remove an entry once its test passes again.
