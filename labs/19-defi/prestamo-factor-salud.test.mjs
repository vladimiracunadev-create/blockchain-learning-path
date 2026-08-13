import test from "node:test";
import assert from "node:assert/strict";
import { evaluarPosicion, margenDeCaida, liquidar } from "./prestamo-factor-salud.mjs";

const base = { cantidadColateral: 1, precioColateral: 2_000, deuda: 1_200, umbralLiquidacion: 0.8 };

test("calcula factor de salud y precio de liquidación del ejemplo del módulo", () => {
  const p = evaluarPosicion(base);
  assert.ok(Math.abs(p.factorSalud - 1.3333) < 0.0001);
  assert.equal(p.precioLiquidacion, 1_500);
  assert.equal(p.liquidable, false);
});

test("una posición sin deuda tiene salud infinita y no es liquidable", () => {
  const p = evaluarPosicion({ ...base, deuda: 0 });
  assert.equal(p.factorSalud, Infinity);
  assert.equal(p.liquidable, false);
  assert.equal(p.precioLiquidacion, 0);
});

test("el factor de salud cruza 1 exactamente en el precio de liquidación", () => {
  const justo = evaluarPosicion({ ...base, precioColateral: 1_500 });
  assert.ok(Math.abs(justo.factorSalud - 1) < 1e-12);
  assert.equal(justo.liquidable, false);
  assert.equal(evaluarPosicion({ ...base, precioColateral: 1_499 }).liquidable, true);
});

test("pedir el máximo LTV deja el precio de liquidación pegado al precio actual", () => {
  const maxima = evaluarPosicion({ ...base, deuda: 1_500, ltvMaximo: 0.75 });
  assert.equal(maxima.precioLiquidacion, 1_875);
  assert.ok(margenDeCaida({ ...base, deuda: 1_500 }) < 0.07);
});

test("el margen de caída del ejemplo es del 25 %", () => {
  assert.ok(Math.abs(margenDeCaida(base) - 0.25) < 1e-12);
});

test("rechaza parámetros incoherentes", () => {
  assert.throws(() => evaluarPosicion({ ...base, cantidadColateral: 0 }));
  assert.throws(() => evaluarPosicion({ ...base, deuda: -1 }));
  assert.throws(() => evaluarPosicion({ ...base, ltvMaximo: 0.9, umbralLiquidacion: 0.8 }));
});

test("la liquidación mejora el factor de salud y paga al liquidador", () => {
  const l = liquidar({ ...base, precioColateral: 1_400 });
  assert.equal(l.deudaPagada, 600);
  assert.ok(Math.abs(l.beneficioLiquidador - 30) < 1e-9);
  assert.ok(l.factorSaludDespues > l.factorSaludAntes);
  assert.ok(l.factorSaludAntes < 1);
});

test("no se puede liquidar una posición sana", () => {
  assert.throws(() => liquidar(base), /no es liquidable/);
});
