// We keep everything in one JSON file instead of Postgres: the shop runs on a
// single small VM and the ops team didn't want to run a database. Revisit if
// order volume passes ~10k/day.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FILE = process.env.SHOP_DB ?? "shop.json";

export function read() {
  if (!existsSync(FILE)) return { clients: [], orders: [], nextOrderId: 1 };
  return JSON.parse(readFileSync(FILE, "utf8"));
}

export function write(data) {
  writeFileSync(FILE, JSON.stringify(data));
}
