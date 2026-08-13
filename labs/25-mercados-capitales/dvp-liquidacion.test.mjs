import test from "node:test";
import assert from "node:assert/strict";
import { exposicionCiclo, liquidarDvP, liquidezNecesaria } from "./dvp-liquidacion.mjs";

test("T+2 sobre 500 M diarios deja 1 000 M de exposición pendiente", () => {
  const e = exposicionCiclo({ volumenDiario: 500_000_000, diasLiquidacion: 2 });
  assert.equal(e.exposicionPendiente, 1_000_000_000);
  assert.equal(e.esAtomica, false);
});

test("la liquidación atómica (T+0) no deja exposición", () => {
  const e = exposicionCiclo({ volumenDiario: 500_000_000, diasLiquidacion: 0 });
  assert.equal(e.exposicionPendiente, 0);
  assert.equal(e.esAtomica, true);
});

test("rechaza ciclos y volúmenes imposibles", () => {
  assert.throws(() => exposicionCiclo({ volumenDiario: 0, diasLiquidacion: 1 }));
  assert.throws(() => exposicionCiclo({ volumenDiario: 1, diasLiquidacion: -1 }));
  assert.throws(() => exposicionCiclo({ volumenDiario: 1, diasLiquidacion: 1.5 }));
});

test("con ambas patas disponibles el DvP transfiere títulos y dinero a la vez", () => {
  const r = liquidarDvP({
    vendedor: { titulos: 500, dinero: 0 },
    comprador: { titulos: 0, dinero: 200_000 },
    titulos: 100,
    precioUnitario: 985
  });
  assert.equal(r.liquidado, true);
  assert.equal(r.importe, 98_500);
  assert.equal(r.vendedor.titulos, 400);
  assert.equal(r.vendedor.dinero, 98_500);
  assert.equal(r.comprador.titulos, 100);
  assert.equal(r.comprador.dinero, 101_500);
});

test("si el vendedor no tiene títulos, el estado no cambia (fallo de entrega)", () => {
  const vendedor = { titulos: 50, dinero: 0 };
  const comprador = { titulos: 0, dinero: 200_000 };
  const r = liquidarDvP({ vendedor, comprador, titulos: 100, precioUnitario: 985 });
  assert.equal(r.liquidado, false);
  assert.deepEqual(r.vendedor, vendedor);
  assert.deepEqual(r.comprador, comprador);
  assert.match(r.motivo, /fallo de entrega/);
});

test("si el comprador no tiene efectivo, tampoco hay entrega parcial", () => {
  const r = liquidarDvP({
    vendedor: { titulos: 500, dinero: 0 },
    comprador: { titulos: 0, dinero: 1_000 },
    titulos: 100,
    precioUnitario: 985
  });
  assert.equal(r.liquidado, false);
  assert.equal(r.vendedor.titulos, 500);
  assert.equal(r.comprador.titulos, 0);
});

test("la conservación se cumple: nada se crea ni se destruye al liquidar", () => {
  const vendedor = { titulos: 500, dinero: 10_000 };
  const comprador = { titulos: 20, dinero: 200_000 };
  const r = liquidarDvP({ vendedor, comprador, titulos: 100, precioUnitario: 985 });
  assert.equal(r.vendedor.titulos + r.comprador.titulos, vendedor.titulos + comprador.titulos);
  assert.equal(r.vendedor.dinero + r.comprador.dinero, vendedor.dinero + comprador.dinero);
});

test("la liquidación atómica multiplica por 12,5 la liquidez frente a un neteo del 92 %", () => {
  const operaciones = Array.from({ length: 1_000 }, () => ({ importe: 500_000 }));
  const l = liquidezNecesaria({ operaciones, eficienciaNeteo: 0.92 });
  assert.equal(l.bruta, 500_000_000);
  assert.ok(Math.abs(l.neta - 40_000_000) < 1e-6);
  assert.ok(Math.abs(l.multiplicador - 12.5) < 1e-9);
});

test("sin neteo, bruta y neta coinciden", () => {
  const l = liquidezNecesaria({ operaciones: [{ importe: 100 }], eficienciaNeteo: 0 });
  assert.equal(l.multiplicador, 1);
  assert.equal(l.ahorroDelNeteo, 0);
  assert.throws(() => liquidezNecesaria({ operaciones: [], eficienciaNeteo: 0 }));
  assert.throws(() => liquidezNecesaria({ operaciones: [{ importe: 1 }], eficienciaNeteo: 1 }));
});
