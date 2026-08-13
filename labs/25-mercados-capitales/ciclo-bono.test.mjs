import test from "node:test";
import assert from "node:assert/strict";
import { calendarioBono, repartirCupon, estrategiaReparto } from "./ciclo-bono.mjs";

const bono = { nominal: 1_000, cuponAnual: 0.04, frecuencia: 2, plazoAnios: 3, titulos: 100_000 };

test("el cupón semestral de un 4 % anual sobre 1 000 es de 20 por título", () => {
  const c = calendarioBono(bono);
  assert.equal(c.cuponPorTitulo, 20);
  assert.equal(c.pagos, 6);
});

test("solo el último flujo amortiza el nominal", () => {
  const c = calendarioBono(bono);
  assert.equal(c.flujos.filter((f) => f.amortizacionPorTitulo > 0).length, 1);
  assert.equal(c.flujos.at(-1).amortizacionPorTitulo, 1_000);
  assert.equal(c.flujos[0].amortizacionPorTitulo, 0);
});

test("el total devuelto es cupones más nominal", () => {
  const c = calendarioBono(bono);
  assert.equal(c.totalCupones, 20 * 6 * 100_000);
  assert.equal(c.totalDevuelto, c.totalCupones + 1_000 * 100_000);
});

test("un bono cupón cero solo paga al vencimiento", () => {
  const c = calendarioBono({ nominal: 1_000, cuponAnual: 0, frecuencia: 1, plazoAnios: 2, titulos: 1 });
  assert.equal(c.totalCupones, 0);
  assert.equal(c.totalDevuelto, 1_000);
});

test("rechaza parámetros no válidos", () => {
  assert.throws(() => calendarioBono({ ...bono, nominal: 0 }));
  assert.throws(() => calendarioBono({ ...bono, plazoAnios: 1.5 }));
  assert.throws(() => calendarioBono({ ...bono, frecuencia: 0 }));
  assert.throws(() => calendarioBono({ ...bono, cuponAnual: -0.01 }));
});

test("el reparto aplica retención distinta por residencia y cuadra el total", () => {
  const r = repartirCupon({
    cuponPorTitulo: 20,
    titulares: [
      { id: "A", titulos: 40_000, retencion: 0.04 },
      { id: "B", titulos: 35_000, retencion: 0.04 },
      { id: "C", titulos: 25_000, retencion: 0.35 }
    ]
  });
  assert.equal(r.brutoTotal, 2_000_000);
  assert.equal(r.retencionTotal, 40_000 * 20 * 0.04 + 35_000 * 20 * 0.04 + 25_000 * 20 * 0.35);
  assert.equal(r.netoTotal, r.brutoTotal - r.retencionTotal);
});

test("sin retención declarada el neto es el bruto", () => {
  const r = repartirCupon({ cuponPorTitulo: 20, titulares: [{ id: "A", titulos: 10 }] });
  assert.equal(r.retencionTotal, 0);
  assert.equal(r.netoTotal, 200);
});

test("rechaza repartos mal formados", () => {
  assert.throws(() => repartirCupon({ cuponPorTitulo: 0, titulares: [{ id: "A", titulos: 1 }] }));
  assert.throws(() => repartirCupon({ cuponPorTitulo: 1, titulares: [] }));
  assert.throws(() => repartirCupon({ cuponPorTitulo: 1, titulares: [{ id: "A", titulos: 0 }] }));
});

test("con pocos titulares cabe el reparto activo", () => {
  const e = estrategiaReparto({ titulares: 100 });
  assert.equal(e.cabeEnUnBloque, true);
  assert.equal(e.bloquesNecesarios, 1);
  assert.match(e.estrategia, /reparto activo/);
});

test("con muchos titulares hay que usar el patrón de reclamación", () => {
  const e = estrategiaReparto({ titulares: 8_000 });
  assert.equal(e.cabeEnUnBloque, false);
  assert.ok(e.bloquesNecesarios > 1);
  assert.match(e.estrategia, /reclamación/);
  assert.throws(() => estrategiaReparto({ titulares: 0 }));
});
