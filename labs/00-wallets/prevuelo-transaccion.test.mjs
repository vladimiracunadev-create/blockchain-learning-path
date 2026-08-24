import test from "node:test";
import assert from "node:assert/strict";
import {
  APROBACION_ILIMITADA,
  ESCENARIOS,
  aUnidadesHumanas,
  pareceEnvenenada,
  prevuelo,
  veredicto
} from "./prevuelo-transaccion.mjs";

test("convierte unidades mínimas a humanas con los decimales del activo", () => {
  assert.equal(aUnidadesHumanas("1500000000000000000", 18), "1.5");
  assert.equal(aUnidadesHumanas("1000000", 6), "1");
  assert.equal(aUnidadesHumanas("1", 8), "0.00000001");
});

test("los decimales equivocados cambian el monto en órdenes de magnitud", () => {
  // El mismo crudo leído con 6 decimales en vez de 18: el error clásico.
  assert.notEqual(aUnidadesHumanas("1500000000000000000", 6), aUnidadesHumanas("1500000000000000000", 18));
});

test("detecta una dirección envenenada (mismo prefijo y sufijo, otro cuerpo)", () => {
  const buena = "0xB3f4000000000000000000000000000000000D1f";
  const mala = "0xB3f49900000000000000000000000000000e0D1f";
  assert.equal(pareceEnvenenada(mala, buena), true);
  assert.equal(pareceEnvenenada(buena, buena), false, "la dirección correcta no es un envenenamiento");
});

test("el escenario legítimo pasa todos los controles y termina en FIRMAR", () => {
  const { solicitud, expectativa } = ESCENARIOS[0];
  const controles = prevuelo(solicitud, expectativa);
  assert.ok(controles.every((c) => c.ok), JSON.stringify(controles.filter((c) => !c.ok)));
  assert.equal(veredicto(controles), "FIRMAR");
});

test("un approve ilimitado a un contrato desconocido termina en NO FIRMAR", () => {
  const { solicitud, expectativa } = ESCENARIOS[1];
  const controles = prevuelo(solicitud, expectativa);
  assert.equal(veredicto(controles), "NO FIRMAR");
  const aprobacion = controles.find((c) => c.control === "aprobación");
  assert.equal(aprobacion.ok, false);
  assert.match(aprobacion.detalle, /ILIMITADA/);
});

test("la dirección envenenada dispara su control específico", () => {
  const { solicitud, expectativa } = ESCENARIOS[2];
  const controles = prevuelo(solicitud, expectativa);
  assert.equal(veredicto(controles), "NO FIRMAR");
  assert.ok(controles.some((c) => c.control === "address poisoning" && !c.ok));
});

test("una red distinta de la esperada bloquea la firma aunque el resto coincida", () => {
  const { solicitud, expectativa } = ESCENARIOS[0];
  const controles = prevuelo({ ...solicitud, red: "mainnet" }, expectativa);
  assert.equal(veredicto(controles), "NO FIRMAR");
  assert.equal(controles.find((c) => c.control === "red").ok, false);
});

test("una comisión por encima del tope del usuario bloquea la firma", () => {
  const { solicitud, expectativa } = ESCENARIOS[0];
  const controles = prevuelo({ ...solicitud, comisionMaximaCruda: "99000000000000000" }, expectativa);
  assert.equal(controles.find((c) => c.control === "comisión").ok, false);
});

test("una aprobación acotada y esperada sí pasa el control", () => {
  const { solicitud, expectativa } = ESCENARIOS[1];
  const acotada = { ...solicitud, contrato: expectativa.contrato, destino: expectativa.destino, aprobacionCruda: "2000000000000000000" };
  const controles = prevuelo(acotada, expectativa);
  assert.equal(controles.find((c) => c.control === "aprobación").ok, true);
});

test("la aprobación ilimitada es exactamente 2**256 - 1", () => {
  assert.equal(APROBACION_ILIMITADA, 2n ** 256n - 1n);
});
