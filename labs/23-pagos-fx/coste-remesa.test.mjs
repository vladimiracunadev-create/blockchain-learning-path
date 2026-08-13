import test from "node:test";
import assert from "node:assert/strict";
import { costeRemesa, costePrefondeo, compararCorredores } from "./coste-remesa.mjs";

const tradicional = {
  importe: 200,
  comisionEnvio: 5,
  margenCambio: 0.025,
  comisionesIntermedias: 1.5,
  costeRetirada: 0.5
};

test("reproduce la descomposición del módulo: 12 USD, el 6 % del importe", () => {
  const r = costeRemesa(tradicional);
  assert.equal(r.total, 12);
  assert.equal(r.costeRelativo, 0.06);
  assert.equal(r.recibido, 188);
});

test("el coste oculto es mayor que la comisión anunciada", () => {
  const r = costeRemesa(tradicional);
  assert.equal(r.costeOculto, 6.5);
  assert.ok(r.costeOculto > r.componentes.comisionEnvio);
});

test("rechaza parámetros imposibles", () => {
  assert.throws(() => costeRemesa({ importe: 0 }));
  assert.throws(() => costeRemesa({ importe: 100, margenCambio: 1.2 }));
  assert.throws(() => costeRemesa({ importe: 100, comisionEnvio: 100 }));
});

test("un envío sin costes entrega el importe íntegro", () => {
  const r = costeRemesa({ importe: 500 });
  assert.equal(r.total, 0);
  assert.equal(r.recibido, 500);
});

test("con última milla barata gana el corredor on-chain", () => {
  const c = compararCorredores({
    tradicional,
    onchain: { importe: 200, comisionEnvio: 0.5, margenCambio: 0.004, costeRetirada: 1.5 }
  });
  assert.equal(c.ganador, "onchain");
  assert.ok(c.ahorro > 0);
});

test("con última milla cara gana la vía tradicional: el tramo que no se toca decide", () => {
  const c = compararCorredores({
    tradicional,
    onchain: { importe: 200, comisionEnvio: 0.5, margenCambio: 0.004, costeRetirada: 12 }
  });
  assert.equal(c.ganador, "tradicional");
  assert.ok(c.ahorro < 0);
});

test("calcula el coste anual del prefondeo y su reparto por operación", () => {
  const p = costePrefondeo({ saldoInmovilizado: 10_000_000, costeCapitalAnual: 0.06, operacionesAnuales: 500_000 });
  assert.equal(p.costeAnual, 600_000);
  assert.equal(p.costePorOperacion, 1.2);
});

test("menos operaciones encarecen cada una: por eso los corredores pequeños son caros", () => {
  const grande = costePrefondeo({ saldoInmovilizado: 10_000_000, costeCapitalAnual: 0.06, operacionesAnuales: 500_000 });
  const pequeno = costePrefondeo({ saldoInmovilizado: 10_000_000, costeCapitalAnual: 0.06, operacionesAnuales: 20_000 });
  assert.ok(pequeno.costePorOperacion > grande.costePorOperacion * 20);
  assert.throws(() => costePrefondeo({ saldoInmovilizado: 1, costeCapitalAnual: 0.06, operacionesAnuales: 0 }));
});
