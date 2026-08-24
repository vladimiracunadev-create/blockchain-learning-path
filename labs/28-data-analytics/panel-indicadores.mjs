// Panel de indicadores on-chain: resumir una cadena en números que alguien
// que no lee bloques crudos pueda usar para tomar decisiones.
//
// El riesgo pedagógico de este laboratorio no es técnico, es de LECTURA: los
// números que produce se parecen mucho a métricas de negocio ("usuarios",
// "ingresos") pero NO LO SON. "Direcciones activas" cuenta claves
// criptográficas, no personas — una sola persona puede controlar cientos de
// direcciones, y una dirección puede ser un contrato que actúa por miles de
// personas. "Volumen" suma TODAS las transferencias, incluidas las que un
// mismo actor se envía a sí mismo (cambio, reorganización de fondos entre sus
// propias cuentas) — no es "dinero que cambió de dueño". Publicar este panel
// sin esas advertencias es la forma más común de convertir un dato correcto
// en una conclusión falsa.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { writeFileSync } from "node:fs";
import { transaccionesDe, logsDe, aHumano, diaDe, minutoDe, cadenaCuentas } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const ADVERTENCIA =
  "Estos indicadores describen actividad OBSERVADA en la cadena, no comportamiento de " +
  "personas: el volumen incluye auto-transferencias y cambio entre direcciones del mismo " +
  "actor, \"direcciones activas\" cuenta claves, no usuarios, y ninguna cifra de este panel " +
  "identifica a una persona real.";

/** Transferencias de token con importe ya en unidades humanas. */
function transferenciasTokenDe(bloques) {
  return logsDe(bloques)
    .filter((log) => log.decodificado != null)
    .map((log) => ({
      hashTransaccion: log.hashTransaccion,
      de: log.decodificado.de,
      para: log.decodificado.para,
      importe: aHumano(log.decodificado.valor, log.decodificado.decimales)
    }));
}

// =============================================================================
// 1. Indicadores agregados de toda la ventana cubierta
// =============================================================================

/**
 * Resumen de indicadores sobre un tramo de la cadena de cuentas.
 *
 * "direccionesNuevas" es una heurística de VENTANA, no un registro histórico:
 * se comparan los emisores de la primera mitad del rango de bloques con los
 * de la segunda mitad. Una dirección que ya operaba antes del primer bloque
 * de este tramo aparecería aquí como "nueva" sin serlo — ese es el límite:
 * sin el estado previo a bloque 0 no hay forma de saberlo con certeza.
 *
 * "concentracionTop5" (cuota del top-5 tenedores) se calcula sobre el saldo
 * NETO de token que deja la ventana (recibido menos enviado), no sobre el
 * saldo real en cadena — de nuevo, sin el estado previo no se puede conocer
 * el saldo real, solo el movimiento neto observado.
 */
export function calcularIndicadores(bloques) {
  const transacciones = transaccionesDe(bloques);
  const transferenciasToken = transferenciasTokenDe(bloques);

  const direcciones = new Set();
  for (const tx of transacciones) {
    direcciones.add(tx.de);
    direcciones.add(tx.para);
  }

  const numeros = bloques.map((b) => b.numero);
  const minNumero = numeros.length === 0 ? 0 : Math.min(...numeros);
  const maxNumero = numeros.length === 0 ? 0 : Math.max(...numeros);
  const corte = minNumero + Math.floor((maxNumero - minNumero) / 2);
  const emisoresPrimeraMitad = new Set(transacciones.filter((t) => t.numeroBloque <= corte).map((t) => t.de));
  const emisoresSegundaMitad = new Set(transacciones.filter((t) => t.numeroBloque > corte).map((t) => t.de));
  const direccionesNuevas = [...emisoresSegundaMitad].filter((d) => !emisoresPrimeraMitad.has(d)).sort();

  const volumenTotal = transferenciasToken.reduce((suma, t) => suma + t.importe, 0);
  const comisionTotal = transacciones.reduce((suma, t) => suma + t.comision, 0);
  const comisionMedia = transacciones.length === 0 ? 0 : comisionTotal / transacciones.length;
  const gasMedio = transacciones.length === 0 ? 0 : transacciones.reduce((s, t) => s + t.gasUsado, 0) / transacciones.length;

  const dias = bloques.map((b) => diaDe(b.marcaTiempo)).sort();
  const primerDia = dias[0] ?? null;
  const ultimoDia = dias.at(-1) ?? null;

  // La "transacción de mayor importe" se calcula solo entre las transferencias
  // de TOKEN: son el mismo activo y por tanto comparables entre sí. Mezclar
  // aquí el valor nativo (otra unidad, otro activo) daría una comparación sin
  // sentido, aunque ambas cuenten como "transacciones totales" más arriba.
  const mayorTransaccion = transferenciasToken.reduce(
    (max, t) => (max == null || t.importe > max.importe ? { hash: t.hashTransaccion, importe: t.importe } : max),
    null
  );

  const balanceNeto = new Map();
  for (const t of transferenciasToken) {
    balanceNeto.set(t.de, (balanceNeto.get(t.de) ?? 0) - t.importe);
    balanceNeto.set(t.para, (balanceNeto.get(t.para) ?? 0) + t.importe);
  }
  const tenedoresPositivos = [...balanceNeto.values()].filter((v) => v > 0).sort((a, b) => b - a);
  const totalPositivo = tenedoresPositivos.reduce((s, v) => s + v, 0);
  const top5 = tenedoresPositivos.slice(0, 5).reduce((s, v) => s + v, 0);
  const concentracionTop5 = totalPositivo === 0 ? 0 : top5 / totalPositivo;

  return {
    transaccionesTotales: transacciones.length,
    transferenciasToken: transferenciasToken.length,
    direccionesActivas: direcciones.size,
    direccionesNuevas: direccionesNuevas.length,
    volumenTotal,
    comisionTotal,
    comisionMedia,
    gasMedio,
    bloquesCubiertos: bloques.length,
    primerDia,
    ultimoDia,
    mayorTransaccion,
    concentracionTop5
  };
}

// =============================================================================
// 2. Serie temporal agregada
// =============================================================================

/**
 * Serie temporal agregada. La **granularidad** debe corresponderse con la ventana
 * observada: esta cadena avanza un bloque cada 12 segundos, así que agregarla por
 * día devuelve un único punto y la serie deja de informar. Por eso el panel usa
 * "minuto" con este dataset, y usaría "dia" o "semana" con años de historia real.
 *
 * Cada punto trae la etiqueta en `periodo` y también en `dia` por compatibilidad
 * con los renderizadores y con `serieDiaria`.
 */
export function serieTemporal(bloques, { granularidad = "minuto" } = {}) {
  const etiquetar = granularidad === "dia" ? diaDe : minutoDe;
  const porPeriodo = new Map();
  for (const bloque of bloques) {
    const dia = etiquetar(bloque.marcaTiempo);
    if (!porPeriodo.has(dia)) porPeriodo.set(dia, { periodo: dia, dia, transacciones: 0, volumen: 0, comisiones: 0 });
    const entrada = porPeriodo.get(dia);
    entrada.transacciones += bloque.transacciones.length;
    entrada.comisiones += bloque.transacciones.reduce((s, t) => s + t.comision, 0);
    entrada.volumen += bloque.logs
      .filter((log) => log.decodificado != null)
      .reduce((s, log) => s + aHumano(log.decodificado.valor, log.decodificado.decimales), 0);
  }
  return [...porPeriodo.values()].sort((a, b) => a.dia.localeCompare(b.dia));
}

/** Serie agregada por día: la granularidad habitual con datos reales de años. */
export const serieDiaria = (bloques) => serieTemporal(bloques, { granularidad: "dia" });

// =============================================================================
// 3. Presentación: texto (terminal) y HTML (navegador)
// =============================================================================

const ANCHO_BARRA = 40;

function barraAscii(valor, maximo) {
  if (maximo <= 0) return "";
  const ancho = Math.round((valor / maximo) * ANCHO_BARRA);
  return "#".repeat(ancho).padEnd(ANCHO_BARRA, ".");
}

/** Panel legible en terminal, con un sparkline de barras ASCII por día. */
export function renderizarPanelTexto(indicadores, serie) {
  const lineas = [];
  lineas.push("=== Panel de indicadores on-chain (datos sintéticos) ===");
  lineas.push("");
  lineas.push(`Bloques cubiertos:        ${indicadores.bloquesCubiertos}`);
  lineas.push(`Ventana temporal:         ${indicadores.primerDia ?? "-"} a ${indicadores.ultimoDia ?? "-"}`);
  lineas.push(`Transacciones totales:    ${indicadores.transaccionesTotales}`);
  lineas.push(`Transferencias de token:  ${indicadores.transferenciasToken}`);
  lineas.push(`Direcciones activas:      ${indicadores.direccionesActivas}`);
  lineas.push(`Direcciones nuevas:       ${indicadores.direccionesNuevas}`);
  lineas.push(`Volumen total (token):    ${indicadores.volumenTotal.toFixed(2)}`);
  lineas.push(`Comisión total:           ${indicadores.comisionTotal.toLocaleString("es")}`);
  lineas.push(`Comisión media/tx:        ${indicadores.comisionMedia.toLocaleString("es")}`);
  lineas.push(`Gas medio/tx:             ${indicadores.gasMedio.toFixed(0)}`);
  lineas.push(
    `Mayor transferencia:      ${indicadores.mayorTransaccion ? indicadores.mayorTransaccion.importe.toFixed(2) + " (" + indicadores.mayorTransaccion.hash + ")" : "-"}`
  );
  lineas.push(`Concentración top-5:      ${(indicadores.concentracionTop5 * 100).toFixed(1)}%`);
  lineas.push("");
  lineas.push("Serie diaria (barra = volumen relativo al día de mayor volumen):");
  const maxVolumen = Math.max(0, ...serie.map((d) => d.volumen));
  for (const dia of serie) {
    lineas.push(`  ${dia.dia}  [${barraAscii(dia.volumen, maxVolumen)}]  vol=${dia.volumen.toFixed(2).padStart(10)}  tx=${String(dia.transacciones).padStart(3)}`);
  }
  lineas.push("");
  lineas.push(`ADVERTENCIA: ${ADVERTENCIA}`);
  return lineas.join("\n");
}

function escaparHtml(texto) {
  return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Panel HTML autocontenido (sin CDN, sin scripts externos) para abrir en un navegador. */
export function renderizarPanelHtml(indicadores, serie) {
  const maxVolumen = Math.max(0, ...serie.map((d) => d.volumen));
  const filas = serie
    .map((d) => {
      const porcentaje = maxVolumen === 0 ? 0 : (d.volumen / maxVolumen) * 100;
      return `<tr><td>${escaparHtml(d.dia)}</td><td><div class="barra-fondo"><div class="barra" style="width:${porcentaje.toFixed(1)}%"></div></div></td><td>${d.volumen.toFixed(2)}</td><td>${d.transacciones}</td></tr>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Panel de indicadores on-chain</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, sans-serif; background: #0b0f14; color: #e6edf3; padding: 24px; }
  h1 { font-size: 1.3rem; }
  table { border-collapse: collapse; width: 100%; margin-top: 8px; }
  td, th { padding: 6px 10px; text-align: left; border-bottom: 1px solid #223; }
  .barra-fondo { background: #182233; width: 220px; height: 12px; border-radius: 4px; overflow: hidden; }
  .barra { background: #4c9aff; height: 100%; }
  .indicadores { list-style: none; padding: 0; }
  .indicadores li { padding: 3px 0; }
  .advertencia { margin-top: 20px; padding: 12px; background: #3a2a00; border: 1px solid #8a6d00; border-radius: 6px; }
</style>
</head>
<body>
<h1>Panel de indicadores on-chain (datos sintéticos)</h1>
<ul class="indicadores">
  <li>Bloques cubiertos: ${indicadores.bloquesCubiertos}</li>
  <li>Ventana temporal: ${escaparHtml(indicadores.primerDia ?? "-")} a ${escaparHtml(indicadores.ultimoDia ?? "-")}</li>
  <li>Transacciones totales: ${indicadores.transaccionesTotales}</li>
  <li>Transferencias de token: ${indicadores.transferenciasToken}</li>
  <li>Direcciones activas: ${indicadores.direccionesActivas}</li>
  <li>Direcciones nuevas: ${indicadores.direccionesNuevas}</li>
  <li>Volumen total (token): ${indicadores.volumenTotal.toFixed(2)}</li>
  <li>Comisión total: ${indicadores.comisionTotal.toLocaleString("es")}</li>
  <li>Concentración top-5 tenedores: ${(indicadores.concentracionTop5 * 100).toFixed(1)}%</li>
</ul>
<h2>Serie diaria</h2>
<table>
<thead><tr><th>Día</th><th>Volumen relativo</th><th>Volumen</th><th>Tx</th></tr></thead>
<tbody>
${filas}
</tbody>
</table>
<p class="advertencia">ADVERTENCIA: ${escaparHtml(ADVERTENCIA)}</p>
</body>
</html>
`;
}

// =============================================================================
// 4. Exportación
// =============================================================================

/** CSV de la serie temporal: cabecera + una fila por periodo. */
export function exportarCsv(serie) {
  const cabecera = "dia,transacciones,volumen,comisiones";
  const filas = serie.map((d) => `${d.dia},${d.transacciones},${d.volumen},${d.comisiones}`);
  return [cabecera, ...filas].join("\n") + "\n";
}

/**
 * Guarda contenido (HTML o CSV) en disco. Es la ÚNICA función de este módulo
 * que toca el sistema de archivos, y solo se ejecuta si alguien la llama
 * explícitamente con una ruta — nunca como efecto secundario de importar el
 * módulo o de calcular indicadores.
 */
export function guardarArchivo(ruta, contenido) {
  writeFileSync(ruta, contenido, "utf8");
  return ruta;
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { bloques } = cadenaCuentas({});
  const indicadores = calcularIndicadores(bloques);
  const serie = serieTemporal(bloques);

  console.log(renderizarPanelTexto(indicadores, serie));

  const csv = exportarCsv(serie);
  console.log(`\nCSV de la serie temporal: ${csv.trim().split("\n").length} líneas (cabecera + ${serie.length} periodos).`);

  const rutaHtml = process.argv[2];
  if (rutaHtml) {
    guardarArchivo(rutaHtml, renderizarPanelHtml(indicadores, serie));
    console.log(`Panel HTML guardado en: ${rutaHtml}`);
  } else {
    console.log('(pasa una ruta como argumento, p. ej. "node panel-indicadores.mjs panel.html", para guardar el HTML)');
  }

  const cuadra = indicadores.transaccionesTotales === bloques.reduce((s, b) => s + b.transacciones.length, 0);
  const serieCuadra = serie.reduce((s, d) => s + d.transacciones, 0) === indicadores.transaccionesTotales;
  console.log(`\nCriterio de aceptación: los totales de \`calcularIndicadores\` y \`serieTemporal\` cuadran con el dataset → ${cuadra && serieCuadra ? "OK" : "FALLÓ"}.`);
}
