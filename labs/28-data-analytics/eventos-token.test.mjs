import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas, logsDe, TOPIC_TRANSFER, DECIMALES_TOKEN } from "./cadena-sintetica.mjs";
import {
  decodificarTransfer,
  esTransferDeToken,
  balancesDesdeEventos,
  topTenedores,
  resumenToken
} from "./eventos-token.mjs";

const DE = "0x" + "1".repeat(40);
const PARA = "0x" + "2".repeat(40);

function logTransfer({ de = DE, para = PARA, valor = 4_000_000n, topic0 = TOPIC_TRANSFER } = {}) {
  return {
    hashTransaccion: "0x" + "a".repeat(64),
    numeroBloque: 1,
    indiceLog: 0,
    direccion: "0x" + "7".repeat(40),
    topics: [topic0, `0x${de.slice(2).padStart(64, "0")}`, `0x${para.slice(2).padStart(64, "0")}`],
    datos: `0x${valor.toString(16).padStart(64, "0")}`
  };
}

test("decodificarTransfer extrae de/para/valor recortando el relleno de 32 bytes", () => {
  const log = logTransfer({ valor: 4_000_000n });
  const dec = decodificarTransfer(log);
  assert.equal(dec.de, DE);
  assert.equal(dec.para, PARA);
  assert.equal(dec.valor, 4_000_000n);
});

test("el importe con 6 decimales no se lee como entero de unidades humanas", () => {
  // 4_000_000 unidades mínimas con DECIMALES_TOKEN = 6 son 4 EDUSD, no 4 millones.
  const log = logTransfer({ valor: 4_000_000n });
  const dec = decodificarTransfer(log);
  assert.equal(DECIMALES_TOKEN, 6);
  assert.equal(dec.valorHumano, 4);
  assert.notEqual(dec.valorHumano, 4_000_000);
});

test("esTransferDeToken exige que topics[0] sea exactamente TOPIC_TRANSFER", () => {
  const logValido = logTransfer();
  const logOtroEvento = logTransfer({ topic0: "0x" + "9".repeat(64) });
  assert.equal(esTransferDeToken(logValido), true);
  assert.equal(esTransferDeToken(logOtroEvento), false);
});

test("decodificarTransfer lanza si el log no es un evento Transfer", () => {
  const logOtroEvento = logTransfer({ topic0: "0x" + "9".repeat(64) });
  assert.throws(() => decodificarTransfer(logOtroEvento));
});

test("balancesDesdeEventos suma entradas y resta salidas correctamente", () => {
  const logs = [
    logTransfer({ de: DE, para: PARA, valor: 100n }),
    logTransfer({ de: PARA, para: DE, valor: 40n })
  ];
  const balances = balancesDesdeEventos(logs);
  assert.equal(balances.get(DE), -60n);
  assert.equal(balances.get(PARA), 60n);
});

test("balancesDesdeEventos ignora logs que no son Transfer de token", () => {
  const logs = [logTransfer({ de: DE, para: PARA, valor: 10n }), logTransfer({ topic0: "0x" + "0".repeat(64) })];
  const balances = balancesDesdeEventos(logs);
  assert.equal(balances.size, 2);
});

test("topTenedores ordena de mayor a menor saldo y respeta el corte n", () => {
  const balances = new Map([
    [DE, 500n],
    [PARA, 900n],
    ["0x" + "3".repeat(40), 100n]
  ]);
  const top = topTenedores(balances, 2);
  assert.equal(top.length, 2);
  assert.equal(top[0].direccion, PARA);
  assert.equal(top[1].direccion, DE);
});

test("resumenToken cuenta transferencias, participantes únicos e importe total con decimales aplicados", () => {
  const logs = [
    logTransfer({ de: DE, para: PARA, valor: 1_000_000n }),
    logTransfer({ de: PARA, para: DE, valor: 2_000_000n })
  ];
  const resumen = resumenToken(logs);
  assert.equal(resumen.transferencias, 2);
  assert.equal(resumen.remitentesUnicos, 2);
  assert.equal(resumen.destinatariosUnicos, 2);
  assert.equal(resumen.importeTotal, 3_000_000n);
  assert.equal(resumen.importeTotalHumano, 3);
});

test("la decodificación manual coincide con el campo `decodificado` de la cadena sintética", () => {
  const { bloques } = cadenaCuentas({});
  const logs = logsDe(bloques).filter(esTransferDeToken);
  assert.ok(logs.length > 0);
  for (const log of logs.slice(0, 20)) {
    const dec = decodificarTransfer(log);
    assert.equal(dec.de, log.decodificado.de);
    assert.equal(dec.para, log.decodificado.para);
    assert.equal(dec.valor, BigInt(log.decodificado.valor));
  }
});
