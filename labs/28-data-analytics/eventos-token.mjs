// Eventos de token: cómo leer transferencias de un token ERC-20 (o
// equivalente) directamente de los LOGS de la cadena, sin depender de que
// alguien más ya los haya decodificado por ti.
//
// Por qué esto hace falta: en una cadena de cuentas, mover un token no deja
// rastro en el campo `valor` de la transacción (que vale 0 en una llamada a
// contrato) — el movimiento real vive en un EVENTO que el contrato emite.
// Ese evento se transmite como `topics` (hasta 4 valores indexados de 32
// bytes, el primero es la firma del evento) y `datos` (el resto de
// argumentos, sin indexar, concatenados también en palabras de 32 bytes).
// El evento `Transfer(address indexed from, address indexed to, uint256
// value)` del estándar ERC-20 pone `from` en `topics[1]`, `to` en
// `topics[2]` y `value` en `datos`.
//
// El error de interpretación más común aquí es leer `value` como si ya
// viniera en unidades humanas: son unidades MÍNIMAS, y hay que dividir por
// 10^decimales (6 para el token sintético EDUSD) para obtener el número que
// un humano reconocería. Tratar "4000000" como "4 millones de EDUSD" en vez
// de "4 EDUSD" infla cualquier métrica que dependa de él por un factor de
// 10^decimales.
//
// Límite pedagógico: `balancesDesdeEventos` es una RECONSTRUCCIÓN a partir
// de los eventos vistos, no una lectura del estado real del contrato. Si
// falta un evento (un log no indexado, un tramo de bloques no escaneado) o
// si el token cobra una comisión interna que reduce lo que el destinatario
// recibe frente a lo que el remitente envió, el saldo reconstruido diverge
// del saldo real. Un indexador de producción contrasta contra `balanceOf`
// en la cadena para detectar esa divergencia; aquí no hay cadena real contra
// la que contrastar.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { TOPIC_TRANSFER, DECIMALES_TOKEN, SIMBOLO_TOKEN, aHumano } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Recorta un topic (0x + 64 hex = 32 bytes) a una dirección EVM (0x + 40
 * hex): los primeros 12 bytes de relleno con ceros se descartan porque una
 * dirección ocupa 20 bytes, no 32.
 */
function direccionDesdeTopic(topic) {
  const hex = topic.slice(2); // quita "0x"
  return `0x${hex.slice(-40)}`;
}

/**
 * Decodifica a mano un log de evento `Transfer(address,address,uint256)`.
 * Lanza si el log no corresponde a ese evento (`topics[0]` no coincide):
 * decodificar como Transfer un log que no lo es produciría un `de`/`para`
 * inventado a partir de bytes que no significan eso.
 */
export function decodificarTransfer(log) {
  if (!esTransferDeToken(log)) {
    throw new Error(`el log no es un evento Transfer (topic0 = ${log.topics?.[0]})`);
  }
  const de = direccionDesdeTopic(log.topics[1]);
  const para = direccionDesdeTopic(log.topics[2]);
  // `datos` es el importe en hex de 32 bytes. BigInt() interpreta un string
  // "0x..." como hexadecimal directamente; parsear con Number perdería
  // precisión en importes grandes, el mismo problema que en el laboratorio 4.
  const valor = BigInt(log.datos);
  return {
    de,
    para,
    valor,
    simbolo: SIMBOLO_TOKEN,
    decimales: DECIMALES_TOKEN,
    valorHumano: aHumano(valor, DECIMALES_TOKEN)
  };
}

/** ¿Es este log un evento Transfer de token? Solo mira la firma del evento (topic0). */
export function esTransferDeToken(log) {
  return Array.isArray(log?.topics) && log.topics[0] === TOPIC_TRANSFER;
}

/**
 * Reconstruye tenencias sumando entradas y restando salidas a partir de una
 * lista de logs. Devuelve un Map dirección → BigInt (puede ser negativo si
 * los logs no cubren el historial completo de esa dirección: es una señal
 * de que faltan eventos, no un saldo real negativo).
 */
export function balancesDesdeEventos(logs) {
  const balances = new Map();
  const ajustar = (direccion, delta) => balances.set(direccion, (balances.get(direccion) ?? 0n) + delta);

  for (const log of logs) {
    if (!esTransferDeToken(log)) continue;
    const { de, para, valor } = decodificarTransfer(log);
    ajustar(de, -valor);
    ajustar(para, valor);
  }
  return balances;
}

/** Los N mayores tenedores por saldo reconstruido, de mayor a menor. */
export function topTenedores(balances, n = 10) {
  return [...balances.entries()]
    .sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0))
    .slice(0, n)
    .map(([direccion, saldo]) => ({ direccion, saldo, saldoHumano: aHumano(saldo, DECIMALES_TOKEN) }));
}

/**
 * Resumen del token a partir de sus eventos: número de transferencias,
 * remitentes y destinatarios únicos, e importe total transferido (bruto,
 * incluye auto-transferencias — la misma advertencia del laboratorio 5
 * aplica aquí).
 */
export function resumenToken(logs) {
  const transferencias = logs.filter(esTransferDeToken);
  const remitentes = new Set();
  const destinatarios = new Set();
  let importeTotal = 0n;

  for (const log of transferencias) {
    const { de, para, valor } = decodificarTransfer(log);
    remitentes.add(de);
    destinatarios.add(para);
    importeTotal += valor;
  }

  return {
    transferencias: transferencias.length,
    remitentesUnicos: remitentes.size,
    destinatariosUnicos: destinatarios.size,
    importeTotal,
    importeTotalHumano: aHumano(importeTotal, DECIMALES_TOKEN),
    simbolo: SIMBOLO_TOKEN
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas, logsDe } = await import("./cadena-sintetica.mjs");
  const { bloques } = cadenaCuentas({});
  const logs = logsDe(bloques);

  console.log("=== Contraste: decodificación manual vs. campo `decodificado` ===\n");
  const primerLog = logs.find(esTransferDeToken);
  const decodificado = decodificarTransfer(primerLog);
  const coincide =
    decodificado.de === primerLog.decodificado.de &&
    decodificado.para === primerLog.decodificado.para &&
    decodificado.valor === BigInt(primerLog.decodificado.valor);
  console.log(`de:    manual=${decodificado.de} vs. dato=${primerLog.decodificado.de}`);
  console.log(`para:  manual=${decodificado.para} vs. dato=${primerLog.decodificado.para}`);
  console.log(`valor: manual=${decodificado.valor} vs. dato=${primerLog.decodificado.valor}`);
  console.log(`coinciden: ${coincide ? "sí" : "NO"}`);

  const resumen = resumenToken(logs);
  console.log("\n=== Resumen del token EDUSD ===\n");
  console.log(`transferencias: ${resumen.transferencias}`);
  console.log(`remitentes únicos: ${resumen.remitentesUnicos}`);
  console.log(`destinatarios únicos: ${resumen.destinatariosUnicos}`);
  console.log(`importe total transferido (bruto): ${resumen.importeTotalHumano} ${resumen.simbolo}`);

  const balances = balancesDesdeEventos(logs);
  const top5 = topTenedores(balances, 5);
  console.log("\n=== Top 5 tenedores reconstruidos (puede incluir saldos negativos: ver advertencia) ===\n");
  console.table(top5.map((t) => ({ dirección: t.direccion, saldo: `${t.saldoHumano} ${SIMBOLO_TOKEN}` })));

  console.log(
    `\nCriterio de aceptación: ${coincide ? "OK" : "FALLO"} — la decodificación manual coincide con el campo "decodificado" del generador.`
  );
}
