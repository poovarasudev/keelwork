import { createCustomer } from "../customers.js";
import { cancelOrder, placeOrder } from "../orders.js";

export const routes = {
  "POST /customers": (body) => createCustomer(body.name, body.email),
  "POST /orders": (body) => placeOrder(body.customerId, body.items),
  "POST /orders/cancel": (body) => cancelOrder(body.orderId),
};
