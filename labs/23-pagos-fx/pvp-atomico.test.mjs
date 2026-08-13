import test from "node:test";
import assert from "node:assert/strict";
import { liquidarSecuencial, liquidarAtomico, admiteAtomicidad } from "./pvp-atomico.mjs";

const patas = [
  { id: "EUR", moneda: "EUR", importe: 1_000_000, de: "Banco A", a: "Banco B", entorno: "cadena-A" },
  { id: "USD", moneda: "USD", importe: 1_080_000, de: "Banco B", a: "Banco A", entorno: "cadena-A" }
];

test("la liquidación secuencial completa no deja exposición", () => {
  const r = liquidarSecuencial({ patas });
  assert.equal(r.liquidado, true);
  assert.equal(r.perdidaDePrincipal, 0);
  assert.equal(r.entregadas.length, 2);
});

test("el fallo tras la primera pata produce pérdida del principal íntegro", () => {
  const r = liquidarSecuencial({ patas, falloTras: 1 });
  assert.equal(r.liquidado, false);
  assert.equal(r.perdidaDePrincipal, 1_000_000);
  assert.equal(r.expuesto.length, 1);
  assert.equal(r.expuesto[0].parte, "Banco A");
});

test("el fallo antes de entregar nada no expone a nadie", () => {
  const r = liquidarSecuencial({ patas, falloTras: 0 });
  assert.equal(r.liquidado, false);
  assert.equal(r.perdidaDePrincipal, 0);
});

test("con ambas patas depositadas la liquidación atómica ejecuta", () => {
  const r = liquidarAtomico({ patas, depositadas: ["EUR", "USD"] });
  assert.equal(r.liquidado, true);
  assert.equal(r.perdidaDePrincipal, 0);
});

test("si falta una pata revierte íntegro y devuelve lo depositado", () => {
  const r = liquidarAtomico({ patas, depositadas: ["EUR"] });
  assert.equal(r.liquidado, false);
  assert.equal(r.perdidaDePrincipal, 0);
  assert.equal(r.expuesto.length, 0);
  assert.equal(r.devoluciones.length, 1);
  assert.match(r.motivo, /faltan patas/);
});

test("el vencimiento del plazo devuelve sin exponer a nadie", () => {
  const r = liquidarAtomico({ patas, depositadas: ["EUR"], plazoSegundos: 3_600, transcurridoSegundos: 7_200 });
  assert.equal(r.liquidado, false);
  assert.equal(r.perdidaDePrincipal, 0);
  assert.match(r.motivo, /plazo vencido/);
});

test("ningún final atómico deja pérdida de principal", () => {
  const finales = [
    liquidarAtomico({ patas, depositadas: ["EUR", "USD"] }),
    liquidarAtomico({ patas, depositadas: ["USD"] }),
    liquidarAtomico({ patas, depositadas: [], transcurridoSegundos: 99_999 })
  ];
  assert.ok(finales.every((f) => f.perdidaDePrincipal === 0 && f.expuesto.length === 0));
});

test("solo admite atomicidad si ambas patas están en el mismo entorno", () => {
  assert.equal(admiteAtomicidad({ patas }).admite, true);
  const mixto = admiteAtomicidad({ patas: [patas[0], { ...patas[1], entorno: "banca-clasica" }] });
  assert.equal(mixto.admite, false);
  assert.equal(mixto.entornos.length, 2);
  assert.match(mixto.motivo, /puente/);
});

test("valida que un PvP tenga exactamente dos patas bien formadas", () => {
  assert.throws(() => liquidarSecuencial({ patas: [patas[0]] }));
  assert.throws(() => liquidarAtomico({ patas: [patas[0], { ...patas[1], importe: 0 }], depositadas: [] }));
});
