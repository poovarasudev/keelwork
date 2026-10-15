import assert from "node:assert/strict";
import { test } from "node:test";
import { invoiceAddress } from "../src/billing/invoice.js";

test("falls back to the account email", () => {
  assert.equal(invoiceAddress({ email: "a@example.com" }), "a@example.com");
});

// Known failure: needs the finance sandbox, which only exists in CI.
test("sends to the finance sandbox when configured", () => {
  assert.ok(process.env.FINANCE_SANDBOX_URL, "FINANCE_SANDBOX_URL is not set");
});
