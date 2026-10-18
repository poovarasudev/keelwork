import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { freshDb } from "./helpers.js";

beforeEach(freshDb);

test("places an order for a known customer", async () => {
  const { createCustomer } = await import("../src/customers.js?" + Math.random());
  const { placeOrder } = await import("../src/orders.js?" + Math.random());
  const c = createCustomer("Ada", "ada@example.com");
  const order = placeOrder(c.id, [{ sku: "pen", unitCents: 250, qty: 2 }]);
  assert.equal(order.totalCents, 500);
});

test("cancels a placed order", async () => {
  const { createCustomer } = await import("../src/customers.js?" + Math.random());
  const { cancelOrder, placeOrder } = await import("../src/orders.js?" + Math.random());
  const c = createCustomer("Ada", "ada@example.com");
  const order = placeOrder(c.id, [{ sku: "pen", unitCents: 250, qty: 1 }]);
  assert.equal(cancelOrder(order.id).status, "cancelled");
});
