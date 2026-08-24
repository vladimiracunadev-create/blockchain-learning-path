import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas, transaccionesDe } from "./cadena-sintetica.mjs";
import {
  direccionesActivas,
  direccionesNuevas,
  volumenPorDia,
  comisionesPorDia,
  resumenActividad,
  concentracion
} from "./metricas-actividad.mjs";

const A = "0x" + "1".repeat(40);
const B = "0x" + "2".repeat(40);
const C = "0x" + "3".repeat(40);

function tx({ hash, numeroBloque, indiceEnBloque = 0, de, para, valor, comision, dia }) {
  return { hash, numeroBloque, indiceEnBloque, de, para, valor: String(valor), comision: String(comision), dia };
}

test("direccionesActivas cuenta tanto remitentes como destinatarios sin duplicar", () => {
  const txs = [
    tx({ hash: "1", numeroBloque: 0, de: A, para: B, valor: 10, comision: 1, dia: "2026-01-01" }),
    tx({ hash: "2", numeroBloque: 0, de: B, para: A, valor: 5, comision: 1, dia: "2026-01-01" })
  ];
  const activas = direccionesActivas(txs);
  assert.equal(activas.size, 2);
  assert.ok(activas.has(A) && activas.has(B));
});

test("direccionesNuevas solo cuenta la primera aparición de cada dirección", () => {
  const txs = [
    tx({ hash: "1", numeroBloque: 0, de: A, para: B, valor: 10, comision: 1, dia: "2026-01-01" }),
    tx({ hash: "2", numeroBloque: 1, de: A, para: B, valor: 5, comision: 1, dia: "2026-01-01" }),
    tx({ hash: "3", numeroBloque: 2, de: A, para: C, valor: 5, comision: 1, dia: "2026-01-02" })
  ];
  const nuevas = direccionesNuevas(txs);
  // A y B aparecen por primera vez en el bloque 0; C, en el bloque 2.
  assert.equal(nuevas.size, 3);
});

test("una dirección que reaparece más tarde no se vuelve a contar como nueva", () => {
  const primerLote = [tx({ hash: "1", numeroBloque: 0, de: A, para: B, valor: 10, comision: 1, dia: "2026-01-01" })];
  const segundoLote = [
    ...primerLote,
    tx({ hash: "2", numeroBloque: 1, de: A, para: C, valor: 10, comision: 1, dia: "2026-01-01" })
  ];
  const nuevasPrimero = direccionesNuevas(primerLote);
  const nuevasSegundo = direccionesNuevas(segundoLote);
  // A y B ya eran nuevas en el primer lote; en el segundo solo se suma C.
  assert.equal(nuevasPrimero.size, 2);
  assert.equal(nuevasSegundo.size, 3);
});

test("volumenPorDia suma en BigInt sin perder precisión y agrupa por día", () => {
  const txs = [
    tx({ hash: "1", numeroBloque: 0, de: A, para: B, valor: "9007199254740993", comision: 0, dia: "2026-01-01" }),
    tx({ hash: "2", numeroBloque: 1, de: A, para: B, valor: "7", comision: 0, dia: "2026-01-01" }),
    tx({ hash: "3", numeroBloque: 2, de: A, para: B, valor: "3", comision: 0, dia: "2026-01-02" })
  ];
  const volumen = volumenPorDia(txs);
  // 9007199254740993 supera Number.MAX_SAFE_INTEGER: si se sumara como
  // Number, "+ 7" se perdería en el redondeo. Con BigInt no se pierde.
  assert.equal(volumen.get("2026-01-01"), 9_007_199_254_741_000n);
  assert.equal(volumen.get("2026-01-02"), 3n);
});

test("comisionesPorDia agrupa por día igual que volumenPorDia", () => {
  const txs = [
    tx({ hash: "1", numeroBloque: 0, de: A, para: B, valor: 1, comision: 100, dia: "2026-01-01" }),
    tx({ hash: "2", numeroBloque: 1, de: A, para: B, valor: 1, comision: 50, dia: "2026-01-01" })
  ];
  const comisiones = comisionesPorDia(txs);
  assert.equal(comisiones.get("2026-01-01"), 150n);
});

test("resumenActividad combina direcciones y series diarias sobre la cadena sintética", () => {
  const { bloques } = cadenaCuentas({});
  const txs = transaccionesDe(bloques).map((t) => ({
    ...t,
    valor: String(t.valor),
    comision: String(t.comision),
    dia: "2026-01-05"
  }));
  const resumen = resumenActividad(txs);
  assert.ok(resumen.direccionesActivas > 0);
  // Una dirección nueva no puede superar el total de direcciones activas.
  assert.ok(resumen.direccionesNuevas <= resumen.direccionesActivas);
  assert.equal(resumen.totalTransacciones, txs.length);
});

test("concentracion: una sola dirección con todo el saldo da HHI = 1", () => {
  const saldos = new Map([[A, 1000n], [B, 0n]]);
  const conc = concentracion(saldos, 5);
  assert.equal(conc.hhi, 1);
  assert.equal(conc.cuotaTopN, 1);
});

test("concentracion: saldo repartido por igual entre n direcciones da HHI = 1/n", () => {
  const saldos = new Map([[A, 100n], [B, 100n], [C, 100n]]);
  const conc = concentracion(saldos, 5);
  assert.ok(Math.abs(conc.hhi - 1 / 3) < 1e-9);
});

test("concentracion respeta el corte top-N y no falla con saldo total cero", () => {
  const saldos = new Map([[A, 50n], [B, 30n], [C, 20n]]);
  const top1 = concentracion(saldos, 1);
  assert.equal(top1.top.length, 1);
  assert.equal(top1.top[0].direccion, A);

  const vacio = concentracion(new Map([[A, 0n]]), 5);
  assert.equal(vacio.hhi, 0);
  assert.deepEqual(vacio.top, []);
});
