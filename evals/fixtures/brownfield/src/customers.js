// "client" in storage, "customer" in the API, "account" in billing. Same thing.
import { read, write } from "./db.js";

export function createCustomer(name, email) {
  const data = read();
  const client = { id: `c_${data.clients.length + 1}`, name, email };
  data.clients.push(client);
  write(data);
  return client;
}

export function findClient(id) {
  return read().clients.find((c) => c.id === id);
}
