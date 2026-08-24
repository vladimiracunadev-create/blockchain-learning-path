// Métricas de actividad on-chain: los indicadores que un panel de analítica
// muestra en su primera fila (direcciones activas, direcciones nuevas,
// volumen, comisiones) y las dos trampas de interpretación que casi siempre
// vienen sin avisar.
//
// ADVERTENCIA que hay que repetir en cada informe que use estas métricas:
//
//   1. Una DIRECCIÓN no es una PERSONA. Un mismo usuario puede controlar
//      cientos de direcciones (una wallet nueva por operación, un contrato
//      por producto); un exchange puede mover miles de usuarios detrás de
//      un puñado de direcciones. "Direcciones activas" mide direcciones,
//      no personas, y tratarlas como sinónimos es el error más citado en
//      analítica on-chain.
//   2. El VOLUMEN incluye auto-transferencias (una dirección que se paga a
//      sí misma para consolidar UTXOs o rotar de wallet fría) y CAMBIO (en
//      UTXO, la parte de una transacción que vuelve al remitente). Ninguna
//      de las dos es "actividad económica": sumarlas sobreestima cuánto
//      valor se está intercambiando realmente entre partes distintas.
//
// Estas métricas sirven para ver TENDENCIA y ESCALA relativa (¿esta semana
// hubo más actividad que la anterior?), no para estimar cuántas personas o
// cuánto valor económico real hay detrás.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Direcciones distintas que participaron (como remitente o destinatario) en
 * el conjunto de transacciones dado. No distingue "activo por enviar" de
 * "activo por recibir": para eso hacen falta dos conjuntos separados, que
 * el consumidor puede construir filtrando `de` y `para` por su cuenta.
 */
export function direccionesActivas(txs) {
  const activas = new Set();
  for (const tx of txs) {
    activas.add(tx.de);
    activas.add(tx.para);
  }
  return activas;
}

/**
 * Direcciones cuya PRIMERA aparición (como `de` o `para`, ordenando por
 * bloque e índice) cae dentro del conjunto de transacciones dado.
 *
 * "Dirección nueva" ≠ "usuario nuevo": una dirección puede ser nueva porque
 * el mismo usuario de siempre generó una wallet nueva (algo que el propio
 * diseño de muchas cadenas fomenta, por privacidad). Contar direcciones
 * nuevas como "usuarios nuevos" infla la métrica de crecimiento.
 */
export function direccionesNuevas(txs) {
  const primeraAparicion = new Map(); // dirección → {numeroBloque, indiceEnBloque}
  const ordenadas = [...txs].sort(
    (a, b) => a.numeroBloque - b.numeroBloque || a.indiceEnBloque - b.indiceEnBloque
  );
  for (const tx of ordenadas) {
    for (const direccion of [tx.de, tx.para]) {
      if (!primeraAparicion.has(direccion)) {
        primeraAparicion.set(direccion, { numeroBloque: tx.numeroBloque, indiceEnBloque: tx.indiceEnBloque });
      }
    }
  }
  return new Set(primeraAparicion.keys());
}

function agruparPorDia(txs) {
  const porDia = new Map();
  for (const tx of txs) {
    if (!porDia.has(tx.dia)) porDia.set(tx.dia, []);
    porDia.get(tx.dia).push(tx);
  }
  return porDia;
}

/**
 * Volumen (suma de `valor`) agrupado por día, como Map ordenado día → BigInt.
 * Usa BigInt para no perder precisión al sumar muchos importes grandes; el
 * consumidor decide cómo formatear la salida (p. ej. con `aHumano`).
 *
 * Incluye auto-transferencias y cambio: es una suma bruta, no una medida de
 * valor económico transferido entre partes distintas. Ver advertencia de
 * cabecera.
 */
export function volumenPorDia(txs) {
  const porDia = agruparPorDia(txs);
  const resultado = new Map();
  for (const [dia, lista] of [...porDia.entries()].sort()) {
    const total = lista.reduce((suma, tx) => suma + BigInt(tx.valor), 0n);
    resultado.set(dia, total);
  }
  return resultado;
}

/** Comisiones (suma de `comision`) agrupadas por día, mismo criterio que `volumenPorDia`. */
export function comisionesPorDia(txs) {
  const porDia = agruparPorDia(txs);
  const resultado = new Map();
  for (const [dia, lista] of [...porDia.entries()].sort()) {
    const total = lista.reduce((suma, tx) => suma + BigInt(tx.comision), 0n);
    resultado.set(dia, total);
  }
  return resultado;
}

/**
 * Resumen agregado: cuenta de direcciones activas y nuevas, y las series
 * diarias de volumen y comisión. Pensado para alimentar directamente un
 * panel o una tabla de consola.
 */
export function resumenActividad(txs) {
  return {
    direccionesActivas: direccionesActivas(txs).size,
    direccionesNuevas: direccionesNuevas(txs).size,
    volumenPorDia: volumenPorDia(txs),
    comisionesPorDia: comisionesPorDia(txs),
    totalTransacciones: txs.length
  };
}

/**
 * Concentración de tenencias: cuota del top-N y el índice Herfindahl-Hirschman
 * (HHI) normalizado a [0, 1].
 *
 * Por qué HHI y no Gini aquí: HHI se calcula sin ordenar la distribución
 * completa (basta la cuota al cuadrado de cada participante) y su lectura es
 * directa — HHI = Σ(cuota_i²), con cuota_i = saldo_i / saldoTotal. Vale 1
 * cuando una sola dirección concentra todo el saldo y tiende a 1/n cuando el
 * saldo está repartido por igual entre n direcciones. Un HHI de 0.25 con 100
 * direcciones ya indica una concentración muy por encima de la uniforme
 * (que ahí sería 0.01).
 *
 * `saldos` es un Map o array de pares [direccion, saldo] con saldo en BigInt
 * o convertible a BigInt.
 */
export function concentracion(saldos, n = 5) {
  const pares = (saldos instanceof Map ? [...saldos.entries()] : [...saldos]).map(([direccion, saldo]) => [
    direccion,
    BigInt(saldo)
  ]);
  const total = pares.reduce((suma, [, saldo]) => suma + saldo, 0n);
  if (total === 0n) return { top: [], cuotaTopN: 0, hhi: 0, total: 0n };

  const ordenados = [...pares].sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0));
  const topN = ordenados.slice(0, n);
  const totalNumero = Number(total);

  const cuotaTopN = topN.reduce((suma, [, saldo]) => suma + Number(saldo) / totalNumero, 0);
  const hhi = ordenados.reduce((suma, [, saldo]) => {
    const cuota = Number(saldo) / totalNumero;
    return suma + cuota * cuota;
  }, 0);

  return {
    top: topN.map(([direccion, saldo]) => ({ direccion, saldo, cuota: Number(saldo) / totalNumero })),
    cuotaTopN,
    hhi,
    total
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas, transaccionesDe } = await import("./cadena-sintetica.mjs");
  const { normalizarTransaccion, validarRegistro } = await import("./normalizar-almacenar.mjs");

  const { bloques } = cadenaCuentas({});
  const txs = transaccionesDe(bloques)
    .map(normalizarTransaccion)
    .filter((reg) => validarRegistro(reg).length === 0);

  const resumen = resumenActividad(txs);
  console.log("=== Resumen de actividad ===\n");
  console.log(`transacciones válidas: ${resumen.totalTransacciones}`);
  console.log(`direcciones activas: ${resumen.direccionesActivas}`);
  console.log(`direcciones nuevas: ${resumen.direccionesNuevas}`);
  console.log(
    "\n⚠️ Recordatorio: 'direcciones' no son 'personas', y el volumen incluye auto-transferencias."
  );

  console.log("\n=== Volumen y comisiones por día (primeros 5 días) ===\n");
  const dias = [...resumen.volumenPorDia.keys()].slice(0, 5);
  console.table(
    dias.map((dia) => ({
      día: dia,
      "volumen (bruto)": resumen.volumenPorDia.get(dia).toString(),
      "comisiones (brutas)": resumen.comisionesPorDia.get(dia).toString()
    }))
  );

  // Concentración de comisiones pagadas por dirección, como ejemplo de saldo.
  const comisionPorDireccion = new Map();
  for (const tx of txs) {
    comisionPorDireccion.set(tx.de, (comisionPorDireccion.get(tx.de) ?? 0n) + BigInt(tx.comision));
  }
  const conc = concentracion(comisionPorDireccion, 5);
  console.log("\n=== Concentración del gasto en comisiones (top 5) ===\n");
  console.log(`cuota del top 5: ${(conc.cuotaTopN * 100).toFixed(1)}%`);
  console.log(`índice HHI: ${conc.hhi.toFixed(4)} (1 = una sola dirección concentra todo)`);

  const consistente = resumen.direccionesNuevas <= resumen.direccionesActivas;
  console.log(
    `\nCriterio de aceptación: ${consistente ? "OK" : "FALLO"} — las direcciones nuevas (${resumen.direccionesNuevas}) no superan a las activas (${resumen.direccionesActivas}).`
  );
}
