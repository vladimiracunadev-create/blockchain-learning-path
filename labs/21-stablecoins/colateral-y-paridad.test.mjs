import test from "node:test";
import assert from "node:assert/strict";
import { evaluarPosicion, liquidarPosicion, simularParidad, coberturaReserva } from "./colateral-y-paridad.mjs";

const base = { cantidadColateral: 2, precioColateral: 2_000, emitido: 2_000, ratioMinimo: 1.5 };

test("reproduce el cálculo del módulo: ratio 200 % y liquidación en 1 500", () => {
  const p = evaluarPosicion(base);
  assert.equal(p.ratio, 2);
  assert.equal(p.precioLiquidacion, 1_500);
  assert.equal(p.liquidable, false);
  assert.ok(Math.abs(p.emisionMaxima - 2_666.6667) < 0.001);
});

test("emitir el máximo deja el precio de liquidación en el precio actual", () => {
  const { emisionMaxima } = evaluarPosicion(base);
  const maxima = evaluarPosicion({ ...base, emitido: emisionMaxima });
  assert.ok(Math.abs(maxima.precioLiquidacion - 2_000) < 1e-9);
});

test("rechaza un ratio mínimo que no sobrecolateraliza", () => {
  assert.throws(() => evaluarPosicion({ ...base, ratioMinimo: 1 }));
  assert.throws(() => evaluarPosicion({ ...base, cantidadColateral: 0 }));
});

test("la liquidación devuelve el sobrante al dueño cuando hay colateral suficiente", () => {
  const l = liquidarPosicion({ ...base, precioColateral: 1_400, penalizacion: 0.13 });
  assert.equal(l.deudaCancelada, 2_000);
  assert.equal(l.bajoAgua, false);
  assert.equal(l.deudaIncobrable, 0);
  assert.ok(l.sobranteParaElDueno > 0);
});

test("detecta deuda incobrable cuando la posición queda bajo agua", () => {
  const l = liquidarPosicion({ ...base, precioColateral: 900, penalizacion: 0.13 });
  assert.equal(l.bajoAgua, true);
  assert.ok(l.deudaIncobrable > 0);
  assert.equal(l.sobranteParaElDueno, 0);
});

test("no se puede liquidar una posición sana", () => {
  assert.throws(() => liquidarPosicion(base), /no es liquidable/);
});

test("con redención abierta el arbitraje devuelve el precio a la par", () => {
  const r = simularParidad({ precioMercado: 0.98, redencionAbierta: true });
  assert.equal(r.recuperada, true);
  assert.ok(r.precioFinal > 0.999);
});

test("con redención suspendida el descuento persiste", () => {
  const r = simularParidad({ precioMercado: 0.98, redencionAbierta: false });
  assert.equal(r.recuperada, false);
  assert.equal(r.precioFinal, 0.98);
  assert.ok(r.historial.every((h) => h.hayArbitraje === false));
});

test("un descuento menor que el coste de redención no genera arbitraje", () => {
  const r = simularParidad({ precioMercado: 0.9995, redencionAbierta: true, costeRedencion: 0.001 });
  assert.equal(r.historial[0].hayArbitraje, false);
});

test("la cobertura accesible distingue respaldo contable de respaldo disponible", () => {
  const c = coberturaReserva({
    circulante: 1_000,
    tramos: [
      { importe: 700, disponibilidad: 1 },
      { importe: 300, disponibilidad: 0 }
    ]
  });
  assert.equal(c.coberturaNominal, 1);
  assert.ok(Math.abs(c.coberturaAccesible - 0.7) < 1e-9);
  assert.equal(c.puedeAtenderRedencionTotal, false);
});

test("una reserva íntegramente disponible sí puede atender la redención", () => {
  const c = coberturaReserva({ circulante: 1_000, tramos: [{ importe: 1_050 }] });
  assert.equal(c.puedeAtenderRedencionTotal, true);
  assert.ok(c.coberturaAccesible > 1);
  assert.throws(() => coberturaReserva({ circulante: 0, tramos: [] }));
});
