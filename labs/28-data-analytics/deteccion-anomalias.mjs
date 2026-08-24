// Detección de anomalías en transferencias on-chain, y por qué "funciona en el
// dataset de práctica" no es lo mismo que "funciona en producción".
//
// La pregunta que este laboratorio ataca no es "¿cómo marco valores raros?"
// (eso es una línea de código) sino "¿cómo sé si mi detector es BUENO?". Un
// detector que marca el 100% de las transferencias tiene recall perfecto y es
// inútil; uno que no marca nada tiene precisión perfecta y también es inútil.
// Hacen falta las dos métricas a la vez, y hace falta poder EXPLICAR cada
// marca para poder corregirla.
//
// ⚠️ Límite pedagógico central: `evaluar()` solo puede calcularse aquí porque
// `cadena-sintetica.mjs` PLANTA las anomalías y las declara en
// `verdadDeCampo.anomalas`. En una cadena real nadie te entrega esa lista: se
// puede medir la PRECISIÓN de un detector (revisando a mano lo que marcó),
// pero NO el RECALL, porque no hay forma de saber cuántas anomalías reales se
// quedaron sin marcar. Cualquier cifra de "recall" sobre datos reales que no
// venga de una auditoría exhaustiva es, como mucho, una estimación optimista.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { transaccionesDe, logsDe, aHumano, cadenaCuentas } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

// =============================================================================
// 1. Estadística descriptiva (implementada a mano, sin dependencias)
// =============================================================================

/**
 * Media, desviación típica (poblacional), mediana y cuartiles de una lista de
 * valores numéricos.
 *
 * Por qué se calculan ambas familias (media/desviación Y mediana/IQR): la
 * media y la desviación están DEFINIDAS a partir de todos los valores, así
 * que un solo valor extremo las arrastra hacia sí mismo — la propia anomalía
 * infla la media y ensancha la desviación, y eso ESCONDE a la anomalía (su
 * z-score baja porque el "centro" se movió hacia ella). La mediana y los
 * cuartiles son posicionales (dependen del ORDEN, no de la magnitud), así que
 * un valor extremo no puede arrastrarlos: por eso la regla de Tukey (IQR)
 * suele resistir mejor que el z-score cuando hay varias anomalías juntas.
 */
export function estadisticas(valores) {
  const n = valores.length;
  if (n === 0) return { media: 0, desviacion: 0, mediana: 0, q1: 0, q3: 0, iqr: 0 };

  const media = valores.reduce((suma, v) => suma + v, 0) / n;
  const varianza = valores.reduce((suma, v) => suma + (v - media) ** 2, 0) / n;
  const desviacion = Math.sqrt(varianza);

  const ordenados = [...valores].sort((a, b) => a - b);
  // Interpolación lineal entre las dos posiciones vecinas (método usado por
  // la mayoría de hojas de cálculo): evita que el cuartil "salte" a un solo
  // dato cuando el tamaño de la muestra no es múltiplo de 4.
  const percentil = (p) => {
    if (ordenados.length === 1) return ordenados[0];
    const indice = (ordenados.length - 1) * p;
    const base = Math.floor(indice);
    const resto = indice - base;
    const siguiente = ordenados[Math.min(base + 1, ordenados.length - 1)];
    return ordenados[base] + (siguiente - ordenados[base]) * resto;
  };

  const mediana = percentil(0.5);
  const q1 = percentil(0.25);
  const q3 = percentil(0.75);
  return { media, desviacion, mediana, q1, q3, iqr: q3 - q1 };
}

/**
 * Z-score de cada valor: cuántas desviaciones típicas se aleja de la media.
 * Con desviación 0 (todos los valores iguales) no hay "raro" posible: se
 * devuelve 0 para cada uno en vez de dividir por cero (que daría NaN).
 */
export function puntuarZ(valores) {
  const { media, desviacion } = estadisticas(valores);
  if (desviacion === 0) return valores.map(() => 0);
  return valores.map((v) => (v - media) / desviacion);
}

// =============================================================================
// 2. Dos métodos de detección univariante
// =============================================================================

/** Marca como anómalo lo que se aleja más de `umbral` desviaciones típicas. */
export function detectarPorZ(observaciones, { umbral = 3 } = {}) {
  const puntuaciones = puntuarZ(observaciones);
  return observaciones.map((valor, indice) => ({
    indice,
    valor,
    puntuacion: puntuaciones[indice],
    anomalo: Math.abs(puntuaciones[indice]) > umbral
  }));
}

/**
 * Regla de Tukey: anómalo lo que supera q3 + factor·IQR. Solo mira la cola
 * ALTA (importes y comisiones anómalamente grandes son el patrón de interés
 * de este laboratorio; un importe anómalamente pequeño no es sospechoso).
 */
export function detectarPorIQR(observaciones, { factor = 1.5 } = {}) {
  const { q3, iqr } = estadisticas(observaciones);
  const limite = q3 + factor * iqr;
  return observaciones.map((valor, indice) => ({
    indice,
    valor,
    limite,
    anomalo: valor > limite
  }));
}

function detectarUnaDimension(valores, metodo, umbral) {
  if (metodo === "zscore") return detectarPorZ(valores, { umbral: umbral ?? 3 });
  return detectarPorIQR(valores, { factor: umbral ?? 1.5 });
}

// =============================================================================
// 3. Detección combinada sobre transferencias (importe + comisión)
// =============================================================================

/**
 * `transferencias`: lista de objetos `{ hash, importe, comision, ... }`.
 * Se marca anómala una transferencia si SU IMPORTE o SU COMISIÓN destaca
 * frente al resto de la muestra — el patrón plantado en el dataset (ver
 * `cadena-sintetica.mjs`) es alto en ambas variables a la vez, pero exigir
 * las dos a la vez dejaría fuera detecciones legítimas de un solo eje.
 */
export function detectarAnomalias(transferencias, { metodo = "iqr", umbral } = {}) {
  const importes = transferencias.map((t) => t.importe);
  const comisiones = transferencias.map((t) => t.comision);
  const porImporte = detectarUnaDimension(importes, metodo, umbral);
  const porComision = detectarUnaDimension(comisiones, metodo, umbral);

  return transferencias.map((t, indice) => ({
    hash: t.hash,
    importe: t.importe,
    comision: t.comision,
    metodo,
    importeInfo: porImporte[indice],
    comisionInfo: porComision[indice],
    anomalo: porImporte[indice].anomalo || porComision[indice].anomalo
  }));
}

// =============================================================================
// 4. Evaluación honesta del detector
// =============================================================================

/**
 * Matriz de confusión y métricas derivadas.
 *
 * `detectados`: hashes que el detector marcó como anómalos.
 * `verdadPositiva`: hashes REALMENTE anómalos (solo existe porque el dataset
 * es sintético; ver la cabecera del archivo).
 * `universo`: todos los hashes evaluados (para poder contar verdaderos
 * negativos).
 *
 * Todas las divisiones están protegidas: sin detecciones o sin positivos la
 * métrica correspondiente es 0, nunca NaN — un detector mudo no debe romper
 * el informe, debe reportarse como lo que es (inútil).
 */
export function evaluar(detectados, verdadPositiva, universo) {
  const detectadosSet = new Set(detectados);
  const verdadSet = new Set(verdadPositiva);

  const verdaderosPositivos = [...detectadosSet].filter((h) => verdadSet.has(h)).length;
  const falsosPositivos = [...detectadosSet].filter((h) => !verdadSet.has(h)).length;
  const falsosNegativos = [...verdadSet].filter((h) => !detectadosSet.has(h)).length;
  const verdaderosNegativos = universo.length - verdaderosPositivos - falsosPositivos - falsosNegativos;

  const precision = verdaderosPositivos + falsosPositivos === 0
    ? 0
    : verdaderosPositivos / (verdaderosPositivos + falsosPositivos);
  const recall = verdaderosPositivos + falsosNegativos === 0
    ? 0
    : verdaderosPositivos / (verdaderosPositivos + falsosNegativos);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const tasaFalsosPositivos = falsosPositivos + verdaderosNegativos === 0
    ? 0
    : falsosPositivos / (falsosPositivos + verdaderosNegativos);

  return {
    verdaderosPositivos,
    falsosPositivos,
    falsosNegativos,
    verdaderosNegativos,
    precision,
    recall,
    f1,
    tasaFalsosPositivos
  };
}

/**
 * Recorre una lista de umbrales y devuelve, para cada uno, las métricas de
 * `evaluar()`. Deja ver el compromiso clásico: bajar el umbral marca más
 * cosas (sube recall) pero acierta menos de lo que marca (baja precisión).
 */
export function curvaUmbral(transferencias, verdadPositiva, umbrales, { metodo = "iqr" } = {}) {
  const universo = transferencias.map((t) => t.hash);
  return umbrales.map((umbral) => {
    const detecciones = detectarAnomalias(transferencias, { metodo, umbral });
    const detectados = detecciones.filter((d) => d.anomalo).map((d) => d.hash);
    return { umbral, ...evaluar(detectados, verdadPositiva, universo) };
  });
}

// =============================================================================
// 5. Explicabilidad
// =============================================================================

/**
 * Explicación en lenguaje llano de por qué (o por qué no) se marcó una
 * transferencia. Un detector que solo dice "anómalo: sí/no" no se puede
 * defender ante quien lo cuestiona ni corregir cuando se equivoca; decir
 * QUÉ variable se desvió y CUÁNTO es lo mínimo para poder auditarlo.
 */
export function explicar(deteccion) {
  const motivos = [];
  const describir = (nombre, info) => {
    if (!info.anomalo) return;
    if (deteccion.metodo === "zscore") {
      motivos.push(`${nombre} con z-score ${info.puntuacion.toFixed(2)} (supera el umbral en valor absoluto)`);
    } else {
      motivos.push(`${nombre} de ${info.valor.toFixed(2)} supera el límite de Tukey (${info.limite.toFixed(2)})`);
    }
  };
  describir("el importe", deteccion.importeInfo);
  describir("la comisión", deteccion.comisionInfo);

  if (motivos.length === 0) return `${deteccion.hash}: no marcada; ni importe ni comisión se desvían de lo típico.`;
  return `${deteccion.hash}: marcada porque ${motivos.join(" y porque ")}.`;
}

// =============================================================================
// 6. Utilidad interna: construir transferencias a partir de la cadena
// =============================================================================

/**
 * Une cada log de transferencia de token con su transacción (por hash) para
 * obtener un registro `{ hash, importe, comision }` listo para detectar. El
 * importe se expresa en unidades humanas del token; la comisión queda en
 * unidades mínimas nativas (wei sintéticos) — son activos distintos, pero
 * para la detección solo importa que la escala sea CONSISTENTE entre sí
 * misma, no comparable entre variables.
 */
function transferenciasDesdeBloques(bloques) {
  const txPorHash = new Map(transaccionesDe(bloques).map((t) => [t.hash, t]));
  return logsDe(bloques)
    .filter((log) => log.decodificado != null)
    .map((log) => {
      const tx = txPorHash.get(log.hashTransaccion);
      return {
        hash: log.hashTransaccion,
        de: log.decodificado.de,
        para: log.decodificado.para,
        importe: aHumano(log.decodificado.valor, log.decodificado.decimales),
        comision: tx ? tx.comision : 0
      };
    })
    .sort((a, b) => a.hash.localeCompare(b.hash));
}

export { transferenciasDesdeBloques };

if (ejecutadoDirectamente(import.meta.url)) {
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDesdeBloques(bloques);
  const universo = transferencias.map((t) => t.hash);

  console.log("=== Detección de anomalías sobre transferencias de token (IQR, factor 1.5) ===\n");
  const detecciones = detectarAnomalias(transferencias, { metodo: "iqr", umbral: 1.5 });
  const detectados = detecciones.filter((d) => d.anomalo).map((d) => d.hash).sort();
  const metricas = evaluar(detectados, verdadDeCampo.anomalas, universo);
  console.table([metricas]);

  console.log("\nExplicación de cada marca:");
  for (const d of detecciones.filter((x) => x.anomalo)) console.log(" - " + explicar(d));

  console.log("\n=== Curva umbral (regla de Tukey): precisión y recall al mover el factor ===\n");
  console.table(
    curvaUmbral(transferencias, verdadDeCampo.anomalas, [0.5, 1, 1.5, 2, 3, 5]).map((f) => ({
      factor: f.umbral,
      precisión: f.precision.toFixed(2),
      recall: f.recall.toFixed(2),
      f1: f.f1.toFixed(2),
      "falsos positivos": f.falsosPositivos
    }))
  );

  console.log(
    "\n⚠️ El recall de esta tabla solo se puede calcular porque el dataset es SINTÉTICO y\n" +
    "declara sus 3 anomalías plantadas en `verdadDeCampo`. Sobre una cadena real no hay lista\n" +
    "de lo que un detector se dejó sin marcar: ahí solo se puede auditar la PRECISIÓN (revisar\n" +
    "a mano lo que se marcó), nunca el recall, salvo que se haga una auditoría exhaustiva aparte."
  );

  const ok = metricas.recall === 1 && metricas.precision > 0;
  console.log(`\nCriterio de aceptación: con factor 1.5 el detector encuentra las 3 anomalías plantadas (recall=1) con precisión > 0 → ${ok ? "OK" : "FALLÓ"}.`);
}
