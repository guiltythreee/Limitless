import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../out");
const prefix = "/tools/typing-next-preview";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname); }
  catch { response.writeHead(400).end("Bad request"); return; }
  if (pathname !== prefix && !pathname.startsWith(prefix + "/")) {
    response.writeHead(404).end("Not found");
    return;
  }
  let relative = pathname.slice(prefix.length).replace(/^\/+/, "");
  if (!relative) relative = "index.html";
  let target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) && target !== path.join(root, "index.html")) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    if (fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }
  const stream = fs.createReadStream(target);
  stream.on("error", () => {
    if (!response.headersSent) response.writeHead(404);
    response.end("Not found");
  });
  response.writeHead(200, { "content-type": mime[path.extname(target)] ?? "application/octet-stream" });
  stream.pipe(response);
});

server.listen(4173, "127.0.0.1");
