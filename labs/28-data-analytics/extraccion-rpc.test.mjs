import test from "node:test";
import assert from "node:assert/strict";
import { nodoSimulado, ErrorRPC } from "./rpc-simulado.mjs";
import {
  extraerRango,
  extraerConReintentos,
  extractorConCheckpoint,
  detectarReorganizacion
} from "./extraccion-rpc.mjs";

test("extraerRango recupera un rango completo aunque exceda maximoPorPagina", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 5 });
  const alturaMax = nodo.alturaActual();
  const resultado = extraerRango(nodo, { desde: 0, hasta: alturaMax, porPagina: 5 });
  assert.equal(resultado.bloques.length, alturaMax + 1);
  assert.deepEqual(resultado.bloques.map((b) => b.numero), Array.from({ length: alturaMax + 1 }, (_, i) => i));
  assert.ok(resultado.paginas > 1, "debe haber paginado más de una vez");
});

test("pedir un rango mayor que la página, sin paginar, devuelve menos de lo pedido (el error de interpretación)", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 4 });
  const directo = nodo.obtenerRango(0, 20);
  assert.ok(directo.length <= 4, "el nodo trunca: no devuelve todo lo pedido de una sola llamada");
  assert.notEqual(directo.length, 21);
});

test("extraerRango con un solo bloque de rango no pagina de más", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 10 });
  const resultado = extraerRango(nodo, { desde: 3, hasta: 3, porPagina: 10 });
  assert.equal(resultado.bloques.length, 1);
  assert.equal(resultado.bloques[0].numero, 3);
});

test("extraerConReintentos supera un fallo transitorio y devuelve el resultado", () => {
  let llamadas = 0;
  const resultado = extraerConReintentos(() => {
    llamadas += 1;
    if (llamadas < 3) throw new ErrorRPC("fallo simulado", -32000);
    return "ok";
  }, { intentos: 5 });
  assert.equal(resultado, "ok");
  assert.equal(llamadas, 3);
});

test("extraerConReintentos agota los intentos y propaga el último ErrorRPC", () => {
  assert.throws(
    () =>
      extraerConReintentos(() => {
        throw new ErrorRPC("siempre falla", -32000);
      }, { intentos: 3 }),
    ErrorRPC
  );
});

test("extraerConReintentos no reintenta un error que no es transitorio", () => {
  let llamadas = 0;
  assert.throws(() =>
    extraerConReintentos(() => {
      llamadas += 1;
      throw new Error("rango inválido: no es un ErrorRPC");
    }, { intentos: 5 })
  );
  assert.equal(llamadas, 1, "un error no transitorio no debe reintentarse");
});

test("extractorConCheckpoint permite reanudar sin releer lo ya extraído", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 6 });
  const primera = extractorConCheckpoint(nodo, { desde: 0, hasta: 15, porPagina: 6 });
  assert.ok(primera.bloques.length > 0);
  assert.ok(primera.checkpoint.ultimaAlturaLeida < 15 || primera.bloques.length === 16);

  const segunda = extractorConCheckpoint(nodo, {
    desde: 0,
    hasta: 15,
    porPagina: 6,
    checkpointInicial: primera.checkpoint
  });
  const numerosPrimera = new Set(primera.bloques.map((b) => b.numero));
  for (const b of segunda.bloques) {
    assert.ok(!numerosPrimera.has(b.numero), `el bloque ${b.numero} no debería releerse`);
  }
  const total = [...primera.bloques, ...segunda.bloques];
  assert.deepEqual(total.map((b) => b.numero).sort((a, b2) => a - b2), Array.from({ length: 16 }, (_, i) => i));
});

test("extractorConCheckpoint ya completado no vuelve a pedir bloques (borde)", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 50 });
  const resultado = extractorConCheckpoint(nodo, {
    desde: 0,
    hasta: 5,
    checkpointInicial: { ultimaAlturaLeida: 5 }
  });
  assert.equal(resultado.bloques.length, 0);
});

test("detectarReorganizacion identifica por hash (no por número) los bloques que cambiaron", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 100 });
  const alturaMax = nodo.alturaActual();
  const almacenados = nodo.obtenerRango(0, alturaMax).map((b) => ({ numero: b.numero, hash: b.hash }));
  const alturaReorg = alturaMax - 3;
  nodo.reorganizar(alturaReorg);

  const deteccion = detectarReorganizacion(almacenados, nodo);
  assert.equal(deteccion.huerfanos.length, 4); // alturaReorg .. alturaMax
  for (const h of deteccion.huerfanos) {
    assert.ok(h.numero >= alturaReorg);
    assert.notEqual(h.hashAlmacenado, h.hashVigente); // mismo número, hash distinto: la prueba de reorg
  }
  assert.equal(deteccion.vigentes.length, almacenados.length - 4);
});

test("detectarReorganizacion sin reorganización no marca ningún bloque como huérfano", () => {
  const nodo = nodoSimulado({ maximoPorPagina: 100 });
  const almacenados = nodo.obtenerRango(0, nodo.alturaActual()).map((b) => ({ numero: b.numero, hash: b.hash }));
  const deteccion = detectarReorganizacion(almacenados, nodo);
  assert.equal(deteccion.huerfanos.length, 0);
  assert.match(deteccion.nota, /ningún bloque/i);
});
