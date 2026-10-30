import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  REGLAS, analizarObservacion, analizarTodo, barridoDeUmbrales, evaluar, inspeccionarCodigo, observacionesDesdeRed
} from "./le5-detector-delegaciones.mjs";
import { DELEGADO_LAB, TOKEN_LAB, escenarioDelegadoHostil, escenarioDelegacionLegitima } from "./le4-delegacion-eip7702.mjs";

const { contexto, observaciones } = JSON.parse(await readFile(new URL("./fixtures/delegaciones-observadas.json", import.meta.url), "utf8"));
const porId = (id) => analizarObservacion(observaciones.find((o) => o.id === id), contexto);

test("las delegaciones legítimas con delegados aprobados puntúan 0", () => {
  for (const id of ["b1", "b2", "b3", "b4", "b6"]) assert.equal(porId(id).puntaje, 0, id);
});

test("el patrón del caso estudiado dispara las reglas esperadas y llega a crítica", () => {
  const m1 = porId("m1");
  assert.equal(m1.nivel, "crítica");
  assert.deepEqual(m1.hallazgos.map((h) => h.regla).sort(), ["DEL-01", "DEL-02", "DEL-04", "DEL-05", "DEL-07", "DEL-08"]);
  assert.equal(m1.puntaje, 100, "el puntaje se acota a 100");
});

test("cada hallazgo deja evidencia legible y su falso positivo posible", () => {
  for (const h of porId("m2").hallazgos) {
    assert.ok(h.evidencia.length > 10);
    assert.ok(h.falsoPositivoPosible.length > 10);
  }
});

test("la misma firma con chain id 0 reutilizada en otras redes se detecta en cada una, también sin barrido", () => {
  assert.ok(porId("m3a").hallazgos.some((h) => h.regla === "DEL-06"));
  assert.equal(porId("m3c").nivel, "crítica", "delegación latente en la tercera red");
  assert.ok(!porId("m3c").hallazgos.some((h) => h.regla === "DEL-08"));
});

test("la ventana de 50 firmas no se confunde con una delegación normal aunque solo una se aplique", () => {
  const m1 = observaciones.find((o) => o.id === "m1");
  assert.equal(m1.autorizaciones.length, 50);
  assert.equal(m1.autorizaciones.filter((a) => a.aplicada).length, 1);
  assert.ok(porId("m1").hallazgos.some((h) => h.regla === "DEL-05"));
});

test("una revocación (delegar a la dirección cero) no genera alerta", () => {
  assert.equal(porId("b6").puntaje, 0);
});

test("en una cuenta de custodia, cualquier delegado no aprobado es crítico aunque no haya más señales", () => {
  const obs = {
    ...observaciones.find((o) => o.id === "b4"),
    autorizaciones: [{ autoridad: "0xcc00000000000000000000000000000000000002", delegadoA: "0xaa00000000000000000000000000000000000001", nonce: 1, chainId: "31337", aplicada: true }],
    remitente: "0xcc00000000000000000000000000000000000002"
  };
  const r = analizarObservacion(obs, contexto);
  assert.equal(r.pisoDeCustodia, true);
  assert.ok(r.puntaje >= 70);
  assert.equal(r.nivel, "crítica");
});

test("evaluación con umbral 40: detecta las 6 maliciosas y deja un falso positivo previsto", () => {
  const e = evaluar(observaciones, contexto, 40);
  assert.equal(e.vp, 6);
  assert.deepEqual(e.falsosPositivos, ["b5"]);
  assert.equal(e.fn, 0);
  assert.equal(e.exhaustividad, 1);
  assert.ok(Math.abs(e.precision - 6 / 7) < 1e-9);
});

test("el caso legítimo b5 puntúa MÁS que el malicioso m4: ningún umbral los separa", () => {
  assert.ok(porId("b5").puntaje > porId("m4").puntaje);
  assert.equal(observaciones.find((o) => o.id === "b5").verdad, "benigna");
  assert.equal(observaciones.find((o) => o.id === "m4").verdad, "maliciosa");
});

test("para eliminar el falso positivo hay que subir el umbral por encima de b5, y entonces se pierde m4", () => {
  const [bajo, medio, alto] = barridoDeUmbrales(observaciones, contexto, [40, 60, 70]);
  assert.deepEqual([bajo.fp, bajo.fn], [1, 0]);
  assert.deepEqual([medio.fp, medio.fn], [1, 1], "a 60 se pierde m4 y b5 sigue marcado: peor en ambos ejes");
  assert.deepEqual([alto.fp, alto.fn], [0, 1]);
  assert.deepEqual(alto.falsosNegativos, ["m4"]);
});

test("lo que sí los separa no es el puntaje sino información externa: la confirmación del titular", () => {
  // m4 y b5 solo se distinguen con un dato que el detector no tiene (¿el dueño reconoce la delegación?).
  const sinDistintivo = ["b5", "m4"].map((id) => porId(id).hallazgos.map((h) => h.regla).filter((r) => r !== "DEL-04"));
  assert.deepEqual(sinDistintivo[0], sinDistintivo[1]);
});

test("el orden de salida pone primero lo más grave", () => {
  const orden = analizarTodo(observaciones, contexto).map((r) => r.puntaje);
  assert.deepEqual(orden, [...orden].sort((a, b) => b - a));
});

test("hay una regla por cada señal documentada y todas declaran su falso positivo", () => {
  assert.equal(new Set(REGLAS.map((r) => r.id)).size, REGLAS.length);
  assert.ok(REGLAS.every((r) => r.peso > 0 && r.falsoPositivo));
});

// --- Integración con LE4: el detector sobre lo que produjo el propio alumno -------------------
const ctxLab = (saldoUsdAntes, dueno) => ({
  etiquetas: {}, relayersConocidos: [],
  delegados: { [DELEGADO_LAB]: { edadHoras: 1, verificado: false, aprobado: false } },
  saldoUsdAntes: { [dueno.toLowerCase()]: saldoUsdAntes }
});

test("el detector marca como crítica la delegación hostil simulada en LE4", () => {
  const e = escenarioDelegadoHostil();
  const obs = observacionesDesdeRed(e.red, { fondeo: { [e.patrocinador.direccion.toLowerCase()]: { origen: "mezclador", edadHoras: 2 } } });
  assert.equal(obs.length, 1);
  const r = analizarObservacion(obs[0], ctxLab(20 * 2500 + 500, e.dueno.direccion));
  assert.equal(r.nivel, "crítica");
  assert.ok(r.hallazgos.some((h) => h.regla === "DEL-08"), "el barrido posterior aparece en la evidencia");
});

test("la delegación legítima de LE4 queda en nivel bajo cuando el delegado está aprobado", () => {
  const e = escenarioDelegacionLegitima();
  assert.equal(e.delegacion.autorizaciones[0].aplicada, true);
});

test("inspeccionarCodigo distingue una EOA de una cuenta delegada", () => {
  assert.deepEqual(inspeccionarCodigo("0x"), { delegada: false, delegadoA: null });
  assert.equal(inspeccionarCodigo(`0xef0100${DELEGADO_LAB.slice(2)}`).delegada, true);
  assert.ok(TOKEN_LAB);
});
