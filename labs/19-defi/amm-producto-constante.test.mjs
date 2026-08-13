import test from "node:test";
import assert from "node:assert/strict";
import { precioMarginal, comprarX, perdidaImpermanente, volumenParaCompensar } from "./amm-producto-constante.mjs";

test("el precio marginal es el cociente de reservas", () => {
  assert.equal(precioMarginal({ x: 100, y: 200_000 }), 2_000);
  assert.throws(() => precioMarginal({ x: 0, y: 1 }));
});

test("comprar 1 ETH en un pool de 100/200 000 cuesta 2 020,20 USDC por la curva", () => {
  const r = comprarX({ x: 100, y: 200_000, cantidadX: 1, comision: 0 });
  assert.ok(Math.abs(r.pagoCurva - 2_020.2020) < 0.001, `pago real: ${r.pagoCurva}`);
  assert.ok(Math.abs(r.impactoPrecio - 0.010101) < 1e-5);
  // k se conserva exactamente cuando no hay comisión.
  assert.ok(Math.abs(r.reservas.x * r.reservas.y - 100 * 200_000) < 1e-6);
});

test("el impacto crece más que proporcionalmente con el tamaño", () => {
  const pequena = comprarX({ x: 100, y: 200_000, cantidadX: 1, comision: 0 });
  const grande = comprarX({ x: 100, y: 200_000, cantidadX: 10, comision: 0 });
  assert.ok(grande.impactoPrecio > pequena.impactoPrecio * 10);
});

test("la comisión se cobra aparte de la curva", () => {
  const r = comprarX({ x: 100, y: 200_000, cantidadX: 1, comision: 0.003 });
  assert.ok(Math.abs(r.comisionPagada - r.pagoCurva * 0.003) < 1e-9);
  assert.ok(r.pagoTotal > r.pagoCurva);
});

test("no se puede vaciar la reserva ni comprar cantidades no positivas", () => {
  assert.throws(() => comprarX({ x: 100, y: 200_000, cantidadX: 100 }));
  assert.throws(() => comprarX({ x: 100, y: 200_000, cantidadX: 0 }));
});

test("duplicar el precio produce una pérdida impermanente del 5,7 %", () => {
  const il = perdidaImpermanente({ x: 10, y: 20_000, precioFinal: 4_000 });
  assert.ok(Math.abs(il.valorSiMantienes - 60_000) < 1e-6);
  assert.ok(Math.abs(il.valorEnPool - 56_568.542) < 0.01, `valor real: ${il.valorEnPool}`);
  assert.ok(Math.abs(il.perdidaRelativa + 0.0572) < 0.0005);
});

test("sin movimiento de precio no hay pérdida impermanente", () => {
  const il = perdidaImpermanente({ x: 10, y: 20_000, precioFinal: 2_000 });
  assert.ok(Math.abs(il.perdida) < 1e-9);
});

test("la pérdida impermanente es simétrica al invertir el movimiento de precio", () => {
  const sube = perdidaImpermanente({ x: 10, y: 20_000, precioFinal: 4_000 });
  const baja = perdidaImpermanente({ x: 10, y: 20_000, precioFinal: 1_000 });
  assert.ok(Math.abs(sube.perdidaRelativa - baja.perdidaRelativa) < 1e-9);
});

test("calcula los días de comisiones necesarios para compensar", () => {
  const r = volumenParaCompensar({ perdida: 600, comision: 0.003, volumenDiario: 200_000 });
  assert.equal(r.ingresoDiario, 600);
  assert.equal(r.dias, 1);
  assert.throws(() => volumenParaCompensar({ perdida: 1, volumenDiario: 0 }));
});
