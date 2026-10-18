import { createServer } from "node:http";
import { routes } from "./api/routes.js";

createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const handler = routes[`${req.method} ${req.url}`];
    if (!handler) {
      res.writeHead(404).end();
      return;
    }
    try {
      res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(handler(JSON.parse(raw || "{}"))));
    } catch (err) {
      res.writeHead(400).end(JSON.stringify({ error: err.message }));
    }
  });
}).listen(process.env.PORT ?? 3000);
