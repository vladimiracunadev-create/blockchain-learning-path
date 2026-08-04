import test from "node:test";
import assert from "node:assert/strict";
import { connect } from "node:net";
import { createDashboardServer } from "./server.mjs";

// `server.close()` solo deja de aceptar conexiones NUEVAS: espera a que las ya
// abiertas terminen. `fetch` mantiene el socket vivo con keep-alive, así que sin
// `closeAllConnections()` el proceso de pruebas se queda colgado sin decir nada.
async function conServidor(prueba) {
  const server = createDashboardServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await prueba(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

test("sirve el panel", async () => {
  await conServidor(async (base) => {
    const home = await fetch(`${base}/`);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Blockchain Learning Path/);
  });
});

test("sirve los estáticos con su Content-Type", async () => {
  await conServidor(async (base) => {
    const css = await fetch(`${base}/style.css`);
    assert.equal(css.status, 200);
    assert.match(css.headers.get("content-type"), /text\/css/);
  });
});

// `fetch` normaliza "/../.." en el CLIENTE antes de enviar la petición, así que
// con fetch nunca se prueba el guard del servidor. Un atacante no usa fetch:
// abre un socket y escribe la ruta cruda. Eso es lo que hacemos aquí.
function peticionCruda(base, ruta) {
  const { hostname, port } = new URL(base);
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

test("bloquea el path traversal", async () => {
  await conServidor(async (base) => {
    const ataques = [
      "/../../package.json",          // ruta cruda con segmentos ..
      "/subdir/../../../LICENSE",     // .. escondido tras un directorio
      "/..%2f..%2fpackage.json"       // .. codificado, para esquivar filtros ingenuos
    ];
    for (const ataque of ataques) {
      assert.equal(await peticionCruda(base, ataque), 403, `debería bloquear ${ataque}`);
    }
  });
});

test("responde 404 a lo que no existe", async () => {
  await conServidor(async (base) => {
    assert.equal((await fetch(`${base}/no-existe.html`)).status, 404);
  });
});
