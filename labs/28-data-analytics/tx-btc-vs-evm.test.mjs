import test from "node:test";
import assert from "node:assert/strict";
import { cadenaUTXO, cadenaCuentas, logsDe, transaccionesDe, comisionUTXO } from "./cadena-sintetica.mjs";
import { describirTxUTXO, describirTxCuentas, compararModelos } from "./tx-btc-vs-evm.mjs";

const utxo = cadenaUTXO({ bloques: 15 });
const { bloques: cuentas } = cadenaCuentas({ bloques: 30 });
const logs = logsDe(cuentas);
const txs = transaccionesDe(cuentas);

test("describirTxUTXO deduce la comisión como entradas menos salidas", () => {
  const tx = utxo.flatMap((b) => b.transacciones).find((t) => !t.esCoinbase);
  const d = describirTxUTXO(tx);
  assert.equal(d.comision, comisionUTXO(tx));
  assert.ok(d.comision > 0);
});

test("describirTxUTXO marca la salida de cambio y aclara que no es un pago a terceros", () => {
  const tx = utxo.flatMap((b) => b.transacciones).find((t) => !t.esCoinbase);
  const d = describirTxUTXO(tx);
  const cambio = d.salidas.find((s) => s.esProbableCambio);
  assert.ok(cambio, "debe existir una salida marcada como cambio");
  assert.equal(cambio.direccion, tx.vin[0].direccion);
  assert.match(d.nota, /no es un pago/i);
});

test("describirTxUTXO de la coinbase no paga comisión y no tiene entradas", () => {
  const coinbase = utxo[0].transacciones.find((t) => t.esCoinbase);
  const d = describirTxUTXO(coinbase);
  assert.equal(d.esCoinbase, true);
  assert.equal(d.comision, 0);
  assert.deepEqual(d.entradas, []);
});

test("describirTxCuentas calcula la comisión como gasUsado por precioGas", () => {
  const tx = txs.find((t) => t.tipo === "nativo");
  const d = describirTxCuentas(tx, { logs });
  assert.equal(d.comision, tx.gasUsado * tx.precioGas);
});

test("describirTxCuentas expone que en una tx de token el campo valor nativo es 0 y el importe vive en el log", () => {
  const tx = txs.find((t) => t.tipo === "token");
  const d = describirTxCuentas(tx, { logs });
  assert.equal(d.valorCampoNativo, 0);
  assert.equal(tx.valor, 0);
  const log = logs.find((l) => l.hashTransaccion === tx.hash);
  assert.equal(d.importeToken, log.decodificado.valor);
  assert.ok(d.importeToken > 0, "el importe real es mayor que 0 aunque el campo nativo sea 0");
  assert.match(d.nota, /log/i);
});

test("describirTxCuentas nativa no confunde valor con comisión", () => {
  const tx = txs.find((t) => t.tipo === "nativo" && t.valor > 0);
  const d = describirTxCuentas(tx, { logs });
  assert.notEqual(d.valor, d.comision);
  assert.equal(d.valor, tx.valor);
});

test("describirTxCuentas conserva el nonce como identificador de orden, no de identidad", () => {
  const tx = txs.find((t) => t.tipo === "nativo");
  const d = describirTxCuentas(tx, { logs });
  assert.equal(d.nonce, tx.nonce);
  assert.match(d.nota, /orden/i);
});

test("describirTxUTXO sin logs de token no falla (borde: transacción sin salidas de cambio detectables)", () => {
  const txSinCambio = {
    txid: "tx-sintetica",
    esCoinbase: false,
    vin: [{ txid: "prev", vout: 0, valorGastado: 1000, direccion: "bcrt1qedu000001" }],
    vout: [{ n: 0, valor: 900, direccion: "bcrt1qedu000002" }],
    tamanoVBytes: 150
  };
  const d = describirTxUTXO(txSinCambio);
  assert.equal(d.salidas.every((s) => !s.esProbableCambio), true);
  assert.equal(d.comision, 100);
});

test("compararModelos documenta las diferencias clave entre UTXO y cuentas", () => {
  const tabla = compararModelos();
  assert.ok(tabla.length >= 5);
  const aspectos = tabla.map((f) => f.aspecto);
  assert.ok(aspectos.some((a) => /saldo/i.test(a)));
  assert.ok(aspectos.some((a) => /orden/i.test(a)));
  assert.ok(aspectos.some((a) => /comisi/i.test(a)));
  assert.ok(aspectos.some((a) => /cambio/i.test(a)));
  for (const fila of tabla) {
    assert.ok(fila.utxo.length > 10);
    assert.ok(fila.cuentas.length > 10);
  }
});

test("la comisión sat/vB de describirTxUTXO es coherente con comisión y tamaño", () => {
  const tx = utxo.flatMap((b) => b.transacciones).find((t) => !t.esCoinbase);
  const d = describirTxUTXO(tx);
  const esperado = Math.round((d.comision / tx.tamanoVBytes) * 100) / 100;
  assert.equal(d.satPorVByte, esperado);
});
