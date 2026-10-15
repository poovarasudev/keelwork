# TypeScript checklist

Each item: the trap → the fix.

## Types that lie

- `any`, or `as` casts that silence a real mismatch (`as unknown as X`) → type the value properly, or narrow it with a guard.
- Non-null assertions (`!`) on values that can genuinely be absent → handle the absent case.
- `@ts-ignore` / `@ts-expect-error` without a comment saying why → fix the type, or explain the exception.
- Data from outside (HTTP bodies, `JSON.parse`, env vars, files, query params) typed by assertion, never validated → parse it at the boundary (a schema validator, or a hand-written guard).
- Optional properties used as if required after a refactor → check every caller of a changed type.

## Modelling

- A union of string literals checked with `if` chains that miss a case → a `switch` with an exhaustive `never` check.
- Booleans that encode a state machine (`isLoading && !isError && data`) → a discriminated union.
- Wide types on exported functions (`string` where a branded id or a literal union belongs) → narrow the public signature.
- `enum` where the repo uses union types (or the reverse) → follow the repo's convention.
- Mutable arrays or objects returned from a module's internal state → return a copy, or `readonly` types.

## Async

- A promise neither awaited, returned, nor deliberately voided → await it, or mark fire-and-forget explicitly and handle its rejection.
- `forEach` with an async callback (the loop doesn't wait) → `for...of` with `await`, or `Promise.all` over `map`.
- Independent awaits in sequence on a hot path → `Promise.all`.
- `try/catch` that swallows the error, or catches `unknown` and reads `.message` unchecked → narrow with `instanceof Error`, and rethrow or report.

## Module hygiene

- Import cycles introduced by the change → move the shared piece down a layer.
- Deep imports past a package's entry point → import from the public interface.
- Default exports where the repo uses named exports (or the reverse) → follow the repo.
- Dead exports left behind by the change → delete them.
