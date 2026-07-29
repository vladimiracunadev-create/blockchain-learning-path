import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = new URL(".", import.meta.url).pathname;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };

export function createDashboardServer() {
  return createServer(async (request, response) => {
    const relative = request.url === "/" ? "index.html" : request.url.slice(1);
    const file = normalize(join(root, relative));
    if (!file.startsWith(root)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    try {
      response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createDashboardServer().listen(4173, "127.0.0.1", () =>
    console.log("Panel disponible en http://127.0.0.1:4173")
  );
}
