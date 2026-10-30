// LE3 · Simular transferencias entre direcciones controladas
//
// Prerrequisitos: LE1, LE2, clases 5–6 (EVM) y 13–14 (transacciones).
// Pregunta que responde: ¿qué pasa, byte a byte, cuando una wallet "envía" valor?
//
// Una transacción no mueve monedas: es una instrucción firmada que la red valida y,
// si cumple las reglas, aplica a un libro de estado. Este laboratorio construye la
// instrucción, la firma, la decodifica como lo haría un nodo (recuperando el remitente
// de la firma) y comprueba el invariante que NO puede romperse: el valor se conserva.

import { aHex } from "./nucleo/bytes.mjs";
import { RedLab, TransaccionRechazada, codificarLlamada } from "./nucleo/red-lab.mjs";
import { TIPO_EIP1559, decodificarTransaccion, firmarTransaccion } from "./nucleo/transacciones.mjs";
import { crearFamilia } from "./le1-billeteras-de-prueba.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

export const ETH = 10n ** 18n;
export const GWEI = 10n ** 9n;
export const TOKEN_LAB = "0x00000000000000000000000000000000005d7e57";
const EMISOR_LAB = "0x000000000000000000000000000000000000e515";

export function crearEscenario() {
  const [alice, bob, carol] = crearFamilia("transferencias", 3);
  const red = new RedLab();
  for (const billetera of [alice, bob, carol]) red.fondear(billetera.direccion, 10n * ETH);
  red.crearToken({ direccion: TOKEN_LAB, simbolo: "USDT-LAB", decimales: 6, emisor: EMISOR_LAB });
  red.emitirToken(TOKEN_LAB, alice.direccion, 1_000_000_000n); // 1 000 USDT-LAB
  return { red, alice, bob, carol };
}

function enviarTx(red, desde, campos) {
  const tx = {
    tipo: TIPO_EIP1559, chainId: red.chainId, nonce: red.nonce(desde.direccion), maxPrioridad: GWEI,
    maxFee: 20n * GWEI, gasLimit: 100_000n, valor: 0n, ...campos
  };
  const firmada = firmarTransaccion(tx, desde.clavePrivada);
  return { firmada, recibo: red.enviar(firmada.crudo) };
}

export const transferirEth = (red, desde, a, monto) => enviarTx(red, desde, { destino: a, valor: monto });

export const transferirToken = (red, desde, a, monto) =>
  enviarTx(red, desde, { destino: TOKEN_LAB, datos: codificarLlamada("transfer", { a, monto: monto.toString() }) });

/** Todo el valor del libro: ETH en cuentas + comisión quemada, y tokens en circulación. */
export function medirValor(red, direcciones) {
  const eth = direcciones.reduce((suma, d) => suma + red.saldo(d), 0n);
  const comisiones = [...red.transacciones.values()].reduce((suma, { tx, recibo }) => suma + recibo.gasUsado * tx.maxFee, 0n);
  const tokens = direcciones.reduce((suma, d) => suma + red.saldoToken(TOKEN_LAB, d), 0n);
  return { eth, comisiones, tokens };
}

/** Invariante: ETH final + comisiones = ETH inicial, y los tokens ni se crean ni se destruyen al transferir. */
export function verificarConservacion(antes, despues) {
  return {
    ethConservado: despues.eth + despues.comisiones === antes.eth + antes.comisiones,
    tokensConservados: despues.tokens === antes.tokens
  };
}

/** Línea de movimientos legible, reconstruida de recibos y registros (lo que mostraría un explorador). */
export function tablaDeMovimientos(red) {
  return [...red.transacciones.values()].map(({ tx, recibo, bloque }) => ({
    bloque,
    tx: `${tx.hash.slice(0, 12)}…`,
    de: tx.remitente,
    a: tx.destino,
    valorEth: tx.valor,
    transferenciasToken: recibo.registros.map((r) => ({ de: `0x${r.topics[1].slice(26)}`, a: `0x${r.topics[2].slice(26)}`, monto: BigInt(r.data) })),
    estado: recibo.estado,
    gas: recibo.gasUsado
  }));
}

export function ejecutarEscenarioTransferencias() {
  const { red, alice, bob, carol } = crearEscenario();
  const direcciones = [alice, bob, carol].map((b) => b.direccion);
  const antes = medirValor(red, direcciones);

  transferirEth(red, alice, bob.direccion, 2n * ETH);
  transferirToken(red, alice, carol.direccion, 250_000_000n);
  transferirEth(red, bob, carol.direccion, ETH / 2n);
  transferirToken(red, carol, bob.direccion, 50_000_000n);

  const despues = medirValor(red, direcciones);
  return { red, billeteras: { alice, bob, carol }, antes, despues, conservacion: verificarConservacion(antes, despues), movimientos: tablaDeMovimientos(red) };
}

/** Los cuatro errores de principiante, cada uno con el rechazo que la red debe producir. */
export function probarRechazos() {
  const { red, alice, bob } = crearEscenario();
  const resultados = {};
  const intento = (nombre, fn) => {
    try { fn(); resultados[nombre] = "aceptada"; } catch (e) { resultados[nombre] = e instanceof TransaccionRechazada ? e.message : `error: ${e.message}`; }
  };
  intento("nonce repetido", () => {
    const { firmada } = transferirEth(red, alice, bob.direccion, ETH);
    red.enviar(firmada.crudo);
  });
  intento("otra cadena", () => red.enviar(firmarTransaccion({
    tipo: TIPO_EIP1559, chainId: 1n, nonce: red.nonce(alice.direccion), maxFee: 20n * GWEI, gasLimit: 21_000n, destino: bob.direccion, valor: 1n
  }, alice.clavePrivada).crudo));
  intento("saldo insuficiente", () => transferirEth(red, bob, alice.direccion, 1_000n * ETH));
  intento("remitente declarado", () => {
    const { firmada } = transferirEth(red, alice, bob.direccion, 1n);
    return decodificarTransaccion(firmada.crudo).remitente === alice.direccion;
  });
  return resultados;
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { conservacion, movimientos, antes, despues } = ejecutarEscenarioTransferencias();
  console.log("LE3 · Transferencias entre direcciones controladas (red de laboratorio)\n");
  console.table(movimientos.map((m) => ({ bloque: m.bloque, tx: m.tx, estado: m.estado, valorEth: Number(m.valorEth) / 1e18, tokens: m.transferenciasToken.length })));
  console.log("ETH antes/después (+comisiones):", antes.eth, despues.eth, despues.comisiones);
  console.log("Conservación del valor:", conservacion);
  console.log("Rechazos esperados:", probarRechazos());
  console.log("Primer byte de una tx EIP-1559:", aHex(Uint8Array.of(TIPO_EIP1559)));
}
