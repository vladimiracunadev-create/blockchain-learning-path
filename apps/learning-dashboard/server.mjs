import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ejecutadoDirectamente } from "../../labs/run-directo.mjs";

// `new URL(".", import.meta.url).pathname` devuelve "/C:/dev/..." en Windows:
// con barra inicial y separadores POSIX. Comparar eso contra una ruta nativa
// ("C:\dev\...") hace que el guard de más abajo rechace TODAS las peticiones con
// 403. `fileURLToPath` traduce la URL a la ruta del sistema operativo real.
const root = fileURLToPath(new URL(".", import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

// Nos quedamos solo con la ruta: la query y el fragmento no forman parte del
// nombre del archivo, y decodificamos para que "%2e%2e" no esquive el guard.
function rutaSolicitada(url) {
  const camino = url.split("?")[0].split("#")[0];
  try {
    return decodeURIComponent(camino);
  } catch {
    return camino;
  }
}

export function createDashboardServer() {
  return createServer(async (request, response) => {
    const camino = rutaSolicitada(request.url ?? "/");
    const relativo = camino === "/" ? "index.html" : camino.slice(1);
    const file = resolve(join(root, relativo));
    if (file !== resolve(root) && !file.startsWith(resolve(root) + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    try {
      const contenido = await readFile(file);
      response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      response.end(contenido);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
}

if (ejecutadoDirectamente(import.meta.url)) {
  createDashboardServer().listen(4173, "127.0.0.1", () =>
    console.log("Panel disponible en http://127.0.0.1:4173")
  );
}
