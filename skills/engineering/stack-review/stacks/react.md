# React checklist

Each item: the trap → the fix.

## Hooks

- Hooks called conditionally, in loops, or after an early return → call them unconditionally at the top level.
- `useEffect` / `useCallback` / `useMemo` dependency arrays missing a value the body reads (a stale closure) → list every dependency, or restructure so the value isn't needed.
- An effect that derives state from props or other state → compute it during render instead.
- An effect that subscribes, starts a timer, or fetches, with no cleanup → return a cleanup; for fetches, ignore or abort stale responses.
- `useMemo` / `useCallback` wrapping cheap values with no memoised consumer → remove them (noise, not speed).

## State

- State that duplicates props or other state → derive it.
- Mutating state in place (`state.items.push`, `obj.x = 1`, then `setState(obj)`) → produce a new object or array.
- Several `setState` calls that must stay consistent → one reducer or one state object.
- Server data cached by hand in component state where the repo has a data-fetching library → use the library.

## Rendering

- List items keyed by array index where the list can reorder, insert or delete → a stable id.
- Components defined inside other components (remounted every render) → move them out.
- New object or function props passed to memoised children every render → stabilise them, or drop the memo.
- Loading, error and empty states missing for async data → render all three.

## Safety and accessibility

- `dangerouslySetInnerHTML` with anything user-controlled → sanitise it, or render text.
- URLs from user data put into `href` / `src` without a scheme check (`javascript:`) → allowlist the schemes.
- Clickable `div`s and `span`s → `button` or `a`; images without `alt`; form inputs without labels → fix the element.
- Focus not managed when a modal or dialog opens and closes → move focus in, and return it.
