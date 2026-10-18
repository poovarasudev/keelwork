import { read, write } from "./db.js";
import { priceWithDiscount } from "./billing/pricing.js";

// Money is always integer cents. Never floats.
export function placeOrder(clientId, items) {
  const data = read();
  if (!data.clients.some((c) => c.id === clientId)) throw new Error("unknown customer");
  const subtotal = items.reduce((sum, i) => sum + i.unitCents * i.qty, 0);
  const order = {
    id: data.nextOrderId++,
    clientId,
    items,
    totalCents: priceWithDiscount(subtotal, items.length),
    status: "placed",
  };
  data.orders.push(order);
  write(data);
  return order;
}

export function cancelOrder(id) {
  const data = read();
  const order = data.orders.find((o) => o.id === id);
  if (!order) throw new Error("no such order");
  if (order.status === "shipped") throw new Error("already shipped");
  order.status = "cancelled";
  write(data);
  return order;
}
