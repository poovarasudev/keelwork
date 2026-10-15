import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function freshDb() {
  process.env.SHOP_DB = join(mkdtempSync(join(tmpdir(), "shop-")), "shop.json");
}
