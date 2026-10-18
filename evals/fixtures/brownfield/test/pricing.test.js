import assert from "node:assert/strict";
import { test } from "node:test";
import { priceWithDiscount } from "../src/billing/pricing.js";

test("no discount under five line items", () => {
  assert.equal(priceWithDiscount(1000, 4), 1000);
});

// Known failure: the comment says "rounded to the nearest cent" but the code
// floors. 999 * 0.9 = 899.1 -> 899 either way; 1005 * 0.9 = 904.5 -> 905 expected.
test("bulk discount rounds to the nearest cent", () => {
  assert.equal(priceWithDiscount(1005, 5), 905);
});
