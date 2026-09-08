import test from "node:test";
import assert from "node:assert/strict";
import { connect } from "node:net";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crearServidorDeContenido, escuchar } from "./servidor.mjs";

// Un bundle mínimo de mentira: las pruebas no dependen de haber construido el
// curso entero, así que corren igual en una máquina limpia.
const raiz = mkdtempSync(join(tmpdir(), "blp-bundle-"));
mkdirSync(join(raiz, "curriculum", "00-orientacion"), { recursive: true });
writeFileSync(join(raiz, "index.html"), "<h1>Blockchain Learning Path</h1>");
writeFileSync(join(raiz, "curriculum", "00-orientacion", "README.html"), "<h1>00 · Orientación</h1>");
writeFileSync(join(raiz, "busqueda.json"), '[{"t":"x"}]');
writeFileSync(join(raiz, "contenido.json"), '{"modulos":19}');
writeFileSync(join(raiz, "diagrama.mjs"), "export default true;");

async function conServidor(prueba) {
  const servidor = crearServidorDeContenido(raiz);
  const url = await escuchar(servidor);
  try {
    await prueba(url);
  } finally {
    servidor.closeAllConnections();
    await new Promise((resolve) => servidor.close(resolve));
  }
}

test("sirve la portada en la raíz", async () => {
  await conServidor(async (url) => {
    const respuesta = await fetch(url);
    assert.equal(respuesta.status, 200);
    assert.match(await respuesta.text(), /Blockchain Learning Path/);
  });
});

test("sirve una página de clase por la ruta absoluta de su unidad", async () => {
  await conServidor(async (url) => {
    const respuesta = await fetch(`${url}/curriculum/00-orientacion/README.html`);
    assert.equal(respuesta.status, 200);
    assert.match(await respuesta.text(), /Orientación/);
  });
});

test("el índice de búsqueda se sirve como JSON", async () => {
  await conServidor(async (url) => {
    const respuesta = await fetch(`${url}/busqueda.json`);
    assert.match(respuesta.headers.get("content-type"), /application\/json/);
    assert.deepEqual(await respuesta.json(), [{ t: "x" }]);
  });
});

test("sirve módulos JavaScript con un MIME que el navegador acepta", async () => {
  await conServidor(async (url) => {
    const respuesta = await fetch(`${url}/diagrama.mjs`);
    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers.get("content-type"), /text\/javascript/);
  });
});

// `fetch` normaliza los ".." en el cliente, así que el guard hay que probarlo
// con la ruta cruda, como la enviaría un atacante.
function peticionCruda(url, ruta) {
  const { hostname, port } = new URL(url);
  return new Promise((resolve, reject) => {
    const socket = connect(Number(port), hostname, () => {
      socket.write(`GET ${ruta} HTTP/1.1\r\nHost: ${hostname}\r\nConnection: close\r\n\r\n`);
    });
    let datos = "";
    socket.setEncoding("utf8");
    socket.on("data", (trozo) => { datos += trozo; });
    socket.on("error", reject);
    socket.on("end", () => resolve(Number(datos.split(" ")[1])));
  });
}

test("no sirve nada fuera del bundle", async () => {
  await conServidor(async (url) => {
    for (const ataque of ["/../../etc/passwd", "/..%2f..%2fpackage.json", "/curriculum/../../../secreto.txt"]) {
      assert.equal(await peticionCruda(url, ataque), 403, `debería bloquear ${ataque}`);
    }
  });
});

test("devuelve 404 con un mensaje útil, no una página en blanco", async () => {
  await conServidor(async (url) => {
    const respuesta = await fetch(`${url}/no-existe.html`);
    assert.equal(respuesta.status, 404);
    assert.match(await respuesta.text(), /Volver al inicio/);
  });
});

test("escucha solo en loopback", async () => {
  const servidor = crearServidorDeContenido(raiz);
  const url = await escuchar(servidor);
  assert.match(url, /^http:\/\/127\.0\.0\.1:\d+$/);
  servidor.closeAllConnections();
  await new Promise((resolve) => servidor.close(resolve));
});
