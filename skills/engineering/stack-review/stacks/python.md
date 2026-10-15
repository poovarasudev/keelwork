# Python checklist

Each item: the trap → the fix.

## Language traps

- Mutable default arguments (`def f(items=[])`) → default to `None`, create inside.
- Bare `except:` or `except Exception: pass` → catch the specific exception; log or re-raise.
- `is` used to compare values (`x is "a"`, `n is 1`) → `==` (keep `is` for `None` and sentinels).
- Late-binding closures in loops (`lambda: i`) → bind the value as a default or use a factory.
- Modifying a list or dict while iterating over it → iterate over a copy, or build a new one.
- Shadowing built-ins (`list`, `id`, `type`, `input`) → rename.

## Types and data

- Public functions without type hints where the repo type-checks → add them.
- Dicts passed around as records with string keys → a `dataclass`, `TypedDict` or the repo's model type.
- Naive `datetime`s mixed with aware ones, or `datetime.now()` where UTC is meant → timezone-aware UTC.
- Float arithmetic for money → `Decimal`, or integer minor units.

## Resources and I/O

- Files, sockets, locks or DB sessions opened without `with` → a context manager.
- `open()` without an explicit `encoding` → `encoding="utf-8"`.
- `requests` / `httpx` calls with no timeout → set one.
- Blocking calls inside `async def` (`time.sleep`, sync DB or HTTP clients) → the async equivalents, or a thread executor.

## Security

- `eval`, `exec`, `pickle.loads`, or `yaml.load` (not `safe_load`) on untrusted data → avoid, or use the safe variant.
- `subprocess` with `shell=True` and interpolated input → an argument list.
- SQL built with f-strings or `%` → parameterised queries.
- Paths joined from user input without a containment check → resolve, then check the base directory.
- Secrets in code, or printed in logs and exceptions → environment or secret store; redact.

## Frameworks

- Django: queries in loops (use `select_related` / `prefetch_related`); a model change without a migration; raw SQL without params.
- FastAPI / Flask: request models not validated; blocking work in async endpoints; debug mode left on.
