import test from "node:test";
import assert from "node:assert/strict";
import {
  clasificarCodigo, crearClienteRpc, crearTransporteHttp, crearTransporteSimulado, decodificarTransferencias,
  explorarDireccion, explorarTransaccion, historialDeToken, lineaDeTiempo
} from "./le6-explorador-transacciones.mjs";
import { DELEGADO_LAB, TOKEN_LAB, escenarioDelegadoHostil } from "./le4-delegacion-eip7702.mjs";
import { ejecutarEscenarioTransferencias } from "./le3-transferencias-simuladas.mjs";

function entorno() {
  const e = escenarioDelegadoHostil();
  return { e, cliente: crearClienteRpc(crearTransporteSimulado(e.red)) };
}

test("explora una transacción tipo 4 y recupera la autoridad, distinta del remitente", async () => {
  const { e, cliente } = entorno();
  const tx = await explorarTransaccion(cliente, e.delegacion.txHash);
  assert.equal(tx.tipo, 4);
  assert.equal(tx.de, e.patrocinador.direccion);
  assert.equal(tx.autorizaciones[0].autoridad, e.dueno.direccion);
  assert.notEqual(tx.autorizaciones[0].autoridad, tx.de);
  assert.ok(tx.advertencias.some((a) => /necesariamente el remitente/.test(a)));
  assert.ok(tx.advertencias.some((a) => /pagó el gas de una delegación ajena/.test(a)));
});

test("«firmó» no es «aplicó»: el efecto vigente se contrasta con el código actual de la cuenta", async () => {
  const { e, cliente } = entorno();
  const tx = await explorarTransaccion(cliente, e.delegacion.txHash);
  assert.match(tx.autorizaciones[0].efectoVigenteHoy, /^sí/);
});

test("una autorización ya sin efecto (código vacío) se informa como no vigente", async () => {
  const { e, cliente } = entorno();
  e.red.cuenta(e.dueno.direccion).codigo = "0x";
  const tx = await explorarTransaccion(cliente, e.delegacion.txHash);
  assert.match(tx.autorizaciones[0].efectoVigenteHoy, /^no/);
});

test("clasifica EOA, EOA delegada y contrato por su código", () => {
  assert.equal(clasificarCodigo("0x").tipo, "EOA");
  assert.equal(clasificarCodigo(`0xef0100${DELEGADO_LAB.slice(2)}`).tipo, "EOA delegada (EIP-7702)");
  assert.equal(clasificarCodigo("0x6080604052").tipo, "contrato");
});

test("explorar una dirección delegada revela su delegado, saldo y nonce", async () => {
  const { e, cliente } = entorno();
  const info = await explorarDireccion(cliente, e.dueno.direccion);
  assert.equal(info.tipo, "EOA delegada (EIP-7702)");
  assert.equal(info.delegadoA.toLowerCase(), DELEGADO_LAB.toLowerCase());
  assert.equal(info.nonce, 1n);
});

test("decodifica los eventos Transfer del barrido sin suponer nada sobre el token", async () => {
  const { e, cliente } = entorno();
  const tx = await explorarTransaccion(cliente, e.barrido.txHash);
  assert.equal(tx.transferenciasToken.length, 1);
  assert.equal(tx.transferenciasToken[0].monto, 500_000_000n);
  assert.equal(tx.transferenciasToken[0].de, e.dueno.direccion);
  assert.equal(tx.transferenciasToken[0].a, e.patrocinador.direccion);
});

test("el historial de un token combina entradas y salidas sin duplicar", async () => {
  const { e, cliente } = entorno();
  const historial = await historialDeToken(cliente, TOKEN_LAB, e.dueno.direccion);
  assert.equal(historial.length, 1);
});

test("una transacción inexistente devuelve null en lugar de inventar datos", async () => {
  const { cliente } = entorno();
  assert.equal(await explorarTransaccion(cliente, "0x" + "ab".repeat(32)), null);
});

test("la línea de tiempo lista los bloques en orden con su marca de tiempo", async () => {
  const { cliente } = entorno();
  const filas = await lineaDeTiempo(cliente, 1, 10);
  assert.equal(filas.length, 3);
  assert.deepEqual(filas.map((f) => f.bloque), [1, 2, 3]);
  assert.ok(filas[0].timestamp < filas[2].timestamp);
});

test("sobre el escenario de transferencias, el explorador reproduce el saldo de tokens", async () => {
  const { red, billeteras } = ejecutarEscenarioTransferencias();
  const cliente = crearClienteRpc(crearTransporteSimulado(red));
  const historial = await historialDeToken(cliente, TOKEN_LAB, billeteras.carol.direccion);
  const neto = historial.reduce((suma, t) => suma + (t.a === billeteras.carol.direccion ? t.monto : -t.monto), 0n);
  assert.equal(neto, red.saldoToken(TOKEN_LAB, billeteras.carol.direccion));
});

test("decodificarTransferencias ignora registros que no son Transfer ERC-20", () => {
  assert.deepEqual(decodificarTransferencias([{ address: "0x1", topics: ["0xdead"], data: "0x00", logIndex: "0x0" }]), []);
});

test("un método no soportado falla de forma explícita", async () => {
  const { cliente } = entorno();
  await assert.rejects(() => cliente.llamar("debug_traceTransaction", []), /no soportado/);
});

// --- Transporte HTTP: sin red real, con fetch simulado ------------------------------------------------
test("el transporte HTTP exige http(s) y rechaza credenciales en la URL", () => {
  assert.throws(() => crearTransporteHttp("file:///etc/passwd"), /http o https/);
  assert.throws(() => crearTransporteHttp("https://usuario:clave@nodo.example"), /credenciales/);
});

test("el transporte HTTP envía JSON-RPC 2.0 y devuelve result", async () => {
  let recibido;
  const fetchImpl = async (url, opciones) => {
    recibido = { url: String(url), cuerpo: JSON.parse(opciones.body) };
    return { ok: true, json: async () => ({ jsonrpc: "2.0", id: 1, result: "0x1" }) };
  };
  const transporte = crearTransporteHttp("https://nodo.example/rpc", { fetchImpl });
  assert.equal(await transporte("eth_chainId", []), "0x1");
  assert.equal(recibido.cuerpo.jsonrpc, "2.0");
  assert.equal(recibido.cuerpo.method, "eth_chainId");
});

test("el transporte HTTP propaga errores HTTP y errores JSON-RPC", async () => {
  const http500 = crearTransporteHttp("https://nodo.example", { fetchImpl: async () => ({ ok: false, status: 500 }) });
  await assert.rejects(() => http500("eth_chainId"), /HTTP 500/);
  const rpcError = crearTransporteHttp("https://nodo.example", { fetchImpl: async () => ({ ok: true, json: async () => ({ error: { message: "límite de uso" } }) }) });
  await assert.rejects(() => rpcError("eth_chainId"), /límite de uso/);
});
