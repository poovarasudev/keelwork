# Node.js checklist

Each item: the trap → the fix.

## Errors and process

- Async route handlers whose rejections the framework doesn't catch (an unhandled rejection crashes or hangs the request) → wrap them, or use the framework's async support.
- Errors returned to the client with stack traces or internal messages → log the detail, send a generic message and a status code.
- `process.exit` in library code, or on errors a caller could handle → throw instead.
- A missing `error` listener on streams, sockets or event emitters → handle `error`.

## The event loop

- Sync filesystem, crypto or `child_process` calls (`readFileSync`, `execSync`) on a request path → the async versions.
- CPU-heavy work (big JSON, image or regex work over user input) on the main thread → a worker, a queue, or a size limit.
- Regexes over user input that can backtrack catastrophically (nested quantifiers) → rewrite, or bound the input length.
- Unbounded in-memory caches, arrays or maps that grow per request → bound them, or use a real cache.

## Input and output

- Request bodies, query strings and headers used without validation → validate at the edge with the repo's validator.
- User input reaching `exec`, `spawn` with `shell: true`, file paths, or dynamic `require` / `import` → avoid it, or use argument arrays and path allowlists (resolve, then check it's inside the base directory).
- Outbound requests with no timeout → set one.
- Outbound requests to user-supplied URLs (SSRF) → allowlist hosts, and block private address ranges.

## Config and resources

- Secrets read from code or committed files → environment or the repo's secret store; never logged.
- Env vars read deep in the code with no check at startup → read and validate config once, at boot.
- Database connections, file handles or timers that aren't closed on error paths → `finally`, or the library's pool.
- New dependencies for what a few lines of standard library would do → question them (a new dependency is a one-way door in a `/ship` run).
