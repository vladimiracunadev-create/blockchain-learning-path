import test from "node:test";
import assert from "node:assert/strict";
import { cadenaUTXO, cadenaCuentas } from "./cadena-sintetica.mjs";
import {
  anatomiaBloqueUTXO,
  anatomiaBloqueCuentas,
  resumenBloqueUTXO,
  resumenBloqueCuentas,
  CAMPOS_AUSENTES_EN_UN_BLOQUE
} from "./anatomia-bloque.mjs";

const utxo = cadenaUTXO({ bloques: 10 });
const { bloques: cuentas } = cadenaCuentas({ bloques: 10 });

test("anatomiaBloqueUTXO describe todos los campos estructurales", () => {
  const campos = anatomiaBloqueUTXO(utxo[2]).map((c) => c.campo);
  assert.deepEqual(campos, [
    "altura",
    "hash",
    "hashPrevio",
    "marcaTiempo",
    "confirmaciones",
    "numeroDeTransacciones",
    "tamanoTotalVBytes"
  ]);
});

test("cada entrada de anatomiaBloqueUTXO trae valor y explicación no vacíos", () => {
  for (const entrada of anatomiaBloqueUTXO(utxo[1])) {
    assert.ok(entrada.valor !== undefined && entrada.valor !== null);
    assert.ok(entrada.significa.length > 20);
  }
});

test("anatomiaBloqueUTXO explica que la marca de tiempo la declara el minero, no un reloj fiable", () => {
  const marca = anatomiaBloqueUTXO(utxo[0]).find((c) => c.campo === "marcaTiempo");
  assert.match(marca.significa, /declara/i);
  assert.match(marca.significa, /no.*reloj|reloj.*auditado/i);
});

test("anatomiaBloqueUTXO explica que las confirmaciones son probabilidad, no certeza", () => {
  const confs = anatomiaBloqueUTXO(utxo[0]).find((c) => c.campo === "confirmaciones");
  assert.match(confs.significa, /probabilidad/i);
  assert.match(confs.significa, /nunca una garantía|no.*garantía/i);
});

test("anatomiaBloqueCuentas distingue gasUsado (trabajo) de comisión (dinero)", () => {
  const gas = anatomiaBloqueCuentas(cuentas[1]).find((c) => c.campo === "gasUsado");
  assert.match(gas.significa, /no.*dinero|trabajo computacional/i);
});

test("resumenBloqueUTXO calcula comisión total como suma de comisiones deducidas, sin incluir la coinbase", () => {
  const bloque = utxo.find((b) => b.transacciones.length > 1) ?? utxo[1];
  const resumen = resumenBloqueUTXO(bloque);
  const normales = bloque.transacciones.filter((tx) => !tx.esCoinbase);
  const esperado = normales.reduce((suma, tx) => {
    const entradas = tx.vin.reduce((s, v) => s + (v.valorGastado ?? 0), 0);
    const salidas = tx.vout.reduce((s, v) => s + v.valor, 0);
    return suma + (entradas - salidas);
  }, 0);
  assert.equal(resumen.comisionTotal, esperado);
  assert.equal(resumen.transaccionesNoCoinbase, normales.length);
});

test("resumenBloqueUTXO no descuenta el cambio del valor movido bruto (caso borde a corregir en el lab 2)", () => {
  const bloque = utxo.find((b) => b.transacciones.some((tx) => !tx.esCoinbase && tx.vout.length > 1));
  const resumen = resumenBloqueUTXO(bloque);
  const sumaTotalVout = bloque.transacciones
    .filter((tx) => !tx.esCoinbase)
    .reduce((suma, tx) => suma + tx.vout.reduce((s, v) => s + v.valor, 0), 0);
  // El resumen del bloque 1 declara explícitamente "bruto": incluye la salida
  // de cambio, que vuelve al mismo remitente y no es un pago a otra parte.
  assert.equal(resumen.valorMovidoBruto, sumaTotalVout);
});

test("resumenBloqueCuentas calcula la ocupación de gas como gasUsado / limiteGas", () => {
  const resumen = resumenBloqueCuentas(cuentas[3]);
  assert.equal(resumen.ocupacionGas, Math.round((cuentas[3].gasUsado / cuentas[3].limiteGas) * 10000) / 10000);
  assert.ok(resumen.ocupacionGas >= 0 && resumen.ocupacionGas < 1);
});

test("un bloque vacío de transacciones no coinbase da comisión total cero sin lanzar error", () => {
  const bloqueSinNormales = { ...utxo[0], transacciones: utxo[0].transacciones.filter((tx) => tx.esCoinbase) };
  const resumen = resumenBloqueUTXO(bloqueSinNormales);
  assert.equal(resumen.comisionTotal, 0);
  assert.equal(resumen.comisionPromedioPorVByte, 0);
});

test("CAMPOS_AUSENTES_EN_UN_BLOQUE advierte que el bloque no revela identidad ni motivo del pago", () => {
  const texto = CAMPOS_AUSENTES_EN_UN_BLOQUE.join(" ");
  assert.match(texto, /identidad/i);
  assert.match(texto, /motivo/i);
  assert.ok(CAMPOS_AUSENTES_EN_UN_BLOQUE.length >= 3);
});
