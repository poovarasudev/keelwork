# Go checklist

Each item: the trap → the fix.

## Errors

- Errors ignored (`_ = f()`, or an unchecked return) → handle or return them.
- Errors returned without context → wrap with `fmt.Errorf("doing x: %w", err)`.
- Errors compared with `==` after wrapping → `errors.Is` / `errors.As`.
- `panic` for ordinary failures in library code → return an error.

## Concurrency

- Goroutines with no way to stop (no context, no done channel) → pass a `context.Context` and return on `ctx.Done()`.
- Shared maps or slices written from several goroutines without a lock → a `sync.Mutex`, or confine them to one goroutine.
- A loop variable captured by a goroutine on Go versions before 1.22 → pass it as an argument.
- `sync.WaitGroup.Add` called inside the goroutine → call it before `go`.
- Unbuffered channel sends that can block forever when the receiver has returned → buffer, `select` on the context, or restructure.

## Resources

- `defer` inside a loop (nothing closes until the function returns) → close per iteration, or extract a function.
- HTTP response bodies not closed, or not drained before close → `defer resp.Body.Close()`.
- `http.Client{}` or `http.Get` with no timeout → a client with a timeout, or a context deadline.
- `context.Background()` deep inside request handling → thread the request's context through.

## API and style

- Exported identifiers without doc comments where the repo documents them → add them.
- Returning concrete types that callers mock, or accepting concrete types where a small interface would do → accept interfaces, return structs.
- Nil maps written to → initialise with `make`.
- Slices returned that alias internal state → copy them.
- SQL built with `fmt.Sprintf` → placeholders.
