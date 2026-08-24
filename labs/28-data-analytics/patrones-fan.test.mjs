import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas } from "./cadena-sintetica.mjs";
import { transferenciasDeCadena } from "./grafo-direcciones.mjs";
import {
  detectarFanIn,
  detectarFanOut,
  detectarTransferenciasRapidas,
  detectarPeelChain,
  evaluarDetecciones
} from "./patrones-fan.mjs";

const { bloques, verdadDeCampo } = cadenaCuentas({});
const transferencias = transferenciasDeCadena(bloques);

test("detectarFanIn recupera el destino y los 9 orígenes plantados", () => {
  const detectado = detectarFanIn(transferencias, { minimoOrigenes: 9, ventanaBloques: 10 });
  const encontrado = detectado.find((g) => g.destino === verdadDeCampo.fanIn.destino);
  assert.ok(encontrado, "no se detectó el fan-in plantado");
  assert.equal(encontrado.origenes.length, verdadDeCampo.fanIn.origenes.length);
  assert.deepEqual(encontrado.origenes, [...verdadDeCampo.fanIn.origenes].sort());
});

test("detectarFanOut recupera el origen y los 8 destinos plantados", () => {
  const detectado = detectarFanOut(transferencias, { minimoDestinos: 8, ventanaBloques: 10 });
  const encontrado = detectado.find((g) => g.origen === verdadDeCampo.fanOut.origen);
  assert.ok(encontrado, "no se detectó el fan-out plantado");
  assert.equal(encontrado.destinos.length, verdadDeCampo.fanOut.destinos.length);
});

test("detectarFanIn con umbral inalcanzable no encuentra nada (caso borde: lista vacía)", () => {
  const detectado = detectarFanIn(transferencias, { minimoOrigenes: 1000, ventanaBloques: 10 });
  assert.deepEqual(detectado, []);
});

test("detectarFanIn sobre una lista vacía de transferencias no lanza error", () => {
  assert.deepEqual(detectarFanIn([], { minimoOrigenes: 2 }), []);
  assert.deepEqual(detectarFanOut([], { minimoDestinos: 2 }), []);
});

test("detectarTransferenciasRapidas encuentra los saltos de la cadena de pelado (entra y sale en el mismo intervalo corto)", () => {
  const rapidas = detectarTransferenciasRapidas(transferencias, { segundosMaximos: 24 });
  const direccionesPeel = new Set(verdadDeCampo.peelChain.direcciones);
  const encontradasEnPeel = rapidas.filter((r) => direccionesPeel.has(r.direccion));
  assert.ok(encontradasEnPeel.length > 0);
});

test("detectarTransferenciasRapidas con ventana de 0 segundos no confunde una recepción con su propio envío inmediato inexistente", () => {
  // Con una ventana absurdamente estricta puede seguir habiendo coincidencias
  // exactas, pero nunca debe reportar una transferencia como "rápida" consigo
  // misma: hashEntrada y hashSalida siempre deben ser transacciones distintas.
  const rapidas = detectarTransferenciasRapidas(transferencias, { segundosMaximos: 0 });
  for (const r of rapidas) assert.notEqual(r.hashEntrada, r.hashSalida);
});

test("detectarPeelChain reconstruye la cadena de pelado completa de 7 pasos, no fragmentos rotos por el tráfico de fondo", () => {
  const cadenas = detectarPeelChain(transferencias, { minimoPasos: 3 });
  const mayor = cadenas.reduce((max, c) => (c.pasos > max.pasos ? c : max), { pasos: 0 });
  assert.equal(mayor.pasos, verdadDeCampo.peelChain.hashes.length / 2);
  assert.equal(mayor.direcciones[0], verdadDeCampo.peelChain.direcciones[0]);
  assert.equal(mayor.direcciones.at(-1), verdadDeCampo.peelChain.direcciones.at(-1));
});

test("detectarPeelChain con minimoPasos muy alto descarta cadenas cortas (caso borde)", () => {
  const cadenas = detectarPeelChain(transferencias, { minimoPasos: 1000 });
  assert.deepEqual(cadenas, []);
});

test("evaluarDetecciones calcula precisión y recall correctamente sobre un caso conocido", () => {
  const detectado = ["a", "b", "c", "x"];
  const esperado = ["a", "b", "c", "d"];
  const resultado = evaluarDetecciones(detectado, esperado);
  assert.deepEqual(resultado.verdaderosPositivos, ["a", "b", "c"]);
  assert.deepEqual(resultado.falsosPositivos, ["x"]);
  assert.deepEqual(resultado.falsosNegativos, ["d"]);
  assert.equal(resultado.precision, 0.75);
  assert.equal(resultado.recall, 0.75);
});

test("subir el umbral de fan-in reduce falsos positivos a costa de recall (el compromiso central de la detección)", () => {
  const laxo = detectarFanIn(transferencias, { minimoOrigenes: 3, ventanaBloques: 60 }).flatMap((g) => g.hashes);
  const estricto = detectarFanIn(transferencias, { minimoOrigenes: 9, ventanaBloques: 10 }).flatMap((g) => g.hashes);
  const evalLaxo = evaluarDetecciones(laxo, verdadDeCampo.fanIn.hashes);
  const evalEstricto = evaluarDetecciones(estricto, verdadDeCampo.fanIn.hashes);
  assert.ok(evalEstricto.precision >= evalLaxo.precision);
  assert.ok(evalEstricto.falsosPositivos.length <= evalLaxo.falsosPositivos.length);
});

test("evaluarDetecciones sobre dos conjuntos vacíos no lanza error y da precisión y recall en 0", () => {
  const resultado = evaluarDetecciones([], []);
  assert.equal(resultado.precision, 0);
  assert.equal(resultado.recall, 0);
  assert.deepEqual(resultado.verdaderosPositivos, []);
});
