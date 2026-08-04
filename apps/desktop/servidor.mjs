// Servidor local que sirve el bundle del curso dentro de la app de escritorio.
//
// ¿Por qué un servidor y no `file://`? Porque el sitio usa rutas absolutas
// ("/curriculum/…"), `fetch` del índice de búsqueda y `localStorage` para el
// progreso. Bajo `file://` el origen es opaco: la búsqueda no carga y el
// progreso no persiste. Un http en 127.0.0.1 con puerto efímero da un origen
// normal sin abrir nada al exterior.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

export function crearServidorDeContenido(raizContenido) {
  const raiz = resolve(raizContenido);

  return createServer(async (peticion, respuesta) => {
    let camino = (peticion.url ?? "/").split("?")[0].split("#")[0];
    try {
      camino = decodeURIComponent(camino);
    } catch { /* ruta mal codificada: se usa tal cual y acabará en 404 */ }

    let archivo = resolve(join(raiz, camino === "/" ? "index.html" : camino.slice(1)));

    // Aunque el servidor solo escucha en loopback, el guard se mantiene: el
    // contenido HTML podría pedir cualquier ruta y no queremos que la app sirva
    // el disco entero.
    if (archivo !== raiz && !archivo.startsWith(raiz + sep)) {
      respuesta.writeHead(403).end("Forbidden");
      return;
    }

    try {
      if ((await stat(archivo)).isDirectory()) archivo = join(archivo, "index.html");
      const contenido = await readFile(archivo);
      respuesta.writeHead(200, {
        "Content-Type": TIPOS[extname(archivo)] ?? "application/octet-stream",
        "Cache-Control": "no-cache"
      });
      respuesta.end(contenido);
    } catch {
      respuesta.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        .end("<h1>404</h1><p>Ese contenido no está en la app.</p><p><a href=\"/\">Volver al inicio</a></p>");
    }
  });
}

// Puerto 0 = el sistema asigna uno libre. Fijar un puerto haría que dos
// ventanas abiertas a la vez chocaran.
export function escuchar(servidor) {
  return new Promise((cumplir) => {
    servidor.listen(0, "127.0.0.1", () => cumplir(`http://127.0.0.1:${servidor.address().port}`));
  });
}
