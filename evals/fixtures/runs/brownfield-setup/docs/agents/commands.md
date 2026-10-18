# Commands

## Commands

- **test**: `npm test`
- **verify**: `npm test`

## Known failures

Baseline taken at the fixture's first commit by running **test** once.

- `test/pricing.test.js` "bulk discount rounds to the nearest cent": expected 905, got 904.
- `test/invoice.test.js` "sends to the finance sandbox when configured": FINANCE_SANDBOX_URL is not set.
