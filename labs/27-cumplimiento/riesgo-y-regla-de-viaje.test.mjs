import test from "node:test";
import assert from "node:assert/strict";
import { puntuarRiesgo, controlesPorNivel, reglaDeViaje, evaluarOperacion } from "./riesgo-y-regla-de-viaje.mjs";

test("una operación pequeña sin factores es de riesgo bajo", () => {
  const r = puntuarRiesgo({ importe: 400 });
  assert.equal(r.puntuacion, 0);
  assert.equal(r.nivel, "bajo");
});

test("el importe elevado se añade como factor automáticamente", () => {
  const r = puntuarRiesgo({ importe: 15_000, factores: ["clienteNuevo"] });
  assert.ok(r.factores.includes("importeElevado"));
  assert.equal(r.puntuacion, 30);
  assert.equal(r.nivel, "medio");
});

test("los factores no se cuentan dos veces", () => {
  const r = puntuarRiesgo({ importe: 15_000, factores: ["importeElevado"] });
  assert.equal(r.puntuacion, 20);
});

test("varios factores agravantes elevan el nivel a alto", () => {
  const r = puntuarRiesgo({ importe: 90_000, factores: ["jurisdiccionAltoRiesgo", "productoAnonimizante"] });
  assert.equal(r.nivel, "alto");
  assert.ok(r.puntuacion >= 60);
});

test("rechaza factores desconocidos en vez de ignorarlos en silencio", () => {
  assert.throws(() => puntuarRiesgo({ importe: 1, factores: ["inventado"] }), /no reconocidos/);
});

test("los controles crecen con el nivel, no son los mismos para todos", () => {
  assert.ok(controlesPorNivel("alto").length > controlesPorNivel("medio").length);
  assert.ok(controlesPorNivel("medio").length > controlesPorNivel("bajo").length);
  assert.throws(() => controlesPorNivel("altísimo"));
});

test("por debajo del umbral la Regla de Viaje no obliga a transmitir", () => {
  const r = reglaDeViaje({ importe: 400, destino: "proveedor-registrado" });
  assert.equal(r.aplica, false);
  assert.equal(r.transmisible, false);
});

test("entre proveedores registrados la información se transmite", () => {
  const r = reglaDeViaje({ importe: 15_000, destino: "proveedor-registrado" });
  assert.equal(r.aplica, true);
  assert.equal(r.transmisible, true);
  assert.equal(r.requiereRevisionManual, false);
});

test("con wallet autoalojada aplica pero no hay a quién transmitir", () => {
  const r = reglaDeViaje({ importe: 25_000, destino: "wallet-autoalojada" });
  assert.equal(r.aplica, true);
  assert.equal(r.transmisible, false);
  assert.equal(r.requiereRevisionManual, true);
  assert.match(r.accion, /prueba de titularidad/);
});

test("una contraparte no identificada detiene la operación", () => {
  const r = reglaDeViaje({ importe: 25_000, destino: "proveedor-no-identificado" });
  assert.equal(r.transmisible, false);
  assert.match(r.accion, /no ejecutar/);
});

test("valida importe y tipo de destino", () => {
  assert.throws(() => reglaDeViaje({ importe: 0, destino: "proveedor-registrado" }));
  assert.throws(() => reglaDeViaje({ importe: 100, destino: "buzon" }));
});

test("la evaluación completa bloquea el riesgo alto y la contraparte no identificada", () => {
  const alto = evaluarOperacion({
    importe: 90_000,
    destino: "proveedor-no-identificado",
    factores: ["jurisdiccionAltoRiesgo", "productoAnonimizante", "patronInusual"]
  });
  assert.equal(alto.bloqueada, true);

  const corriente = evaluarOperacion({ importe: 15_000, destino: "proveedor-registrado", factores: ["clienteNuevo"] });
  assert.equal(corriente.bloqueada, false);
  assert.ok(corriente.controles.includes("revisión periódica"));
});
