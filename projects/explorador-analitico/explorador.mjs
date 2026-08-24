#!/usr/bin/env node
// Explorador analítico de actividad blockchain — proyecto final del módulo 28.
//
// Integra en una sola herramienta lo aprendido en los once laboratorios previos:
// importa un dataset, consulta bloques, transacciones y direcciones, filtra por
// fecha, activo y dirección, calcula indicadores, construye el grafo, aplica los
// detectores de patrones y anomalías, dibuja los resultados y exporta un informe.
//
// NO reimplementa nada: cada capacidad viene del laboratorio donde se enseñó, y
// aquí solo se compone. Si un cálculo cambia en su laboratorio, cambia aquí.
//
// ⚠️ QUÉ ES Y QUÉ NO ES ESTO
// Es material EDUCATIVO sobre datos SINTÉTICOS. No es una herramienta certificada
// para acusar, bloquear ni identificar a nadie. Los patrones que marca son
// INDICADORES compatibles con explicaciones legítimas, no pruebas. Una dirección
// no es una persona. Todo informe que genera lleva sus limitaciones impresas, y
// eso no es un adorno legal: es parte del método.
//
// Uso:
//   node projects/explorador-analitico/explorador.mjs
//   node projects/explorador-analitico/explorador.mjs --desde 20 --hasta 40 --activo token
//   node projects/explorador-analitico/explorador.mjs --direccion 0x9002ed11…
//   node projects/explorador-analitico/explorador.mjs --informe informe.md
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { writeFileSync } from "node:fs";
import { ejecutadoDirectamente } from "../../labs/run-directo.mjs";
import {
  DECIMALES_TOKEN,
  ROLES,
  SIMBOLO_TOKEN,
  aHumano,
  dataset,
  diaDe
} from "../../labs/28-data-analytics/cadena-sintetica.mjs";
import { transferenciasDeCadena, construirGrafo, grados, topPorGrado, componentesConexas, aCsv }
  from "../../labs/28-data-analytics/grafo-direcciones.mjs";
import { detectarFanIn, detectarFanOut, detectarPeelChain, detectarTransferenciasRapidas }
  from "../../labs/28-data-analytics/patrones-fan.mjs";
import { detectarAnomalias, evaluar, explicar } from "../../labs/28-data-analytics/deteccion-anomalias.mjs";
import { calcularIndicadores, serieTemporal, renderizarPanelTexto, renderizarPanelHtml, exportarCsv }
  from "../../labs/28-data-analytics/panel-indicadores.mjs";
import { balancesDesdeEventos, topTenedores } from "../../labs/28-data-analytics/eventos-token.mjs";

/**
 * Filtro de consulta. Todos los campos son opcionales; los que no se indican no
 * restringen. Se aplica SIEMPRE sobre las transferencias ya extraídas, nunca
 * sobre la fuente: así el filtro es explicable y reproducible.
 *
 * @typedef {object} Filtro
 * @property {number} [desde]      Bloque inicial (inclusive).
 * @property {number} [hasta]      Bloque final (inclusive).
 * @property {string} [dia]        Día exacto en formato YYYY-MM-DD.
 * @property {"token"|"nativo"|"todos"} [activo]
 * @property {string} [direccion]  Participa como origen o como destino.
 */

/** Aplica un filtro a una lista de transferencias. Devuelve una lista nueva. */
export function filtrar(transferencias, { desde, hasta, dia, activo = "todos", direccion } = {}) {
  const objetivo = direccion?.toLowerCase();
  return transferencias.filter((t) => {
    if (desde != null && t.numeroBloque < desde) return false;
    if (hasta != null && t.numeroBloque > hasta) return false;
    if (dia && diaDe(t.marcaTiempo) !== dia) return false;
    if (activo !== "todos" && t.tipo !== activo) return false;
    if (objetivo && t.de.toLowerCase() !== objetivo && t.para.toLowerCase() !== objetivo) return false;
    return true;
  });
}

/**
 * Perfil de una dirección: lo que se puede afirmar mirando SOLO la cadena.
 * Nótese lo que NO devuelve: ni nombre, ni país, ni "tipo de titular". Esa
 * información no está en los datos y no se puede inventar.
 */
export function perfilDireccion(transferencias, direccion) {
  const objetivo = direccion.toLowerCase();
  const enviadas = transferencias.filter((t) => t.de.toLowerCase() === objetivo);
  const recibidas = transferencias.filter((t) => t.para.toLowerCase() === objetivo);
  const todas = [...enviadas, ...recibidas].sort((a, b) => a.numeroBloque - b.numeroBloque);
  const contrapartes = new Set([
    ...enviadas.map((t) => t.para),
    ...recibidas.map((t) => t.de)
  ]);
  const suma = (lista) => lista.reduce((total, t) => total + t.importe, 0);
  return {
    direccion,
    transferenciasEnviadas: enviadas.length,
    transferenciasRecibidas: recibidas.length,
    importeEnviado: suma(enviadas),
    importeRecibido: suma(recibidas),
    // Saldo NETO observado en la ventana consultada. No es "el saldo de la
    // dirección": fuera de la ventana puede haber más movimientos.
    saldoNetoObservado: suma(recibidas) - suma(enviadas),
    contrapartesDistintas: contrapartes.size,
    primerBloque: todas[0]?.numeroBloque ?? null,
    ultimoBloque: todas.at(-1)?.numeroBloque ?? null,
    primerDia: todas[0] ? diaDe(todas[0].marcaTiempo) : null,
    ultimoDia: todas.at(-1) ? diaDe(todas.at(-1).marcaTiempo) : null,
    // Papel narrativo del dataset sintético, si lo tiene. En datos reales esto
    // vendría de una lista de etiquetas EXTERNA, con su propia fiabilidad.
    etiquetaDelDataset: Object.entries(ROLES).find(([, v]) => v.toLowerCase() === objetivo)?.[0] ?? null
  };
}

/**
 * El detector de anomalías del laboratorio 10 puntúa importe Y comisión, pero
 * las transferencias que produce el grafo (laboratorio 7) no arrastran la
 * comisión, porque esta vive en la transacción y no en el evento. Aquí se vuelven
 * a unir por hash: sin este paso, la comisión sería `undefined` y toda la
 * dimensión de comisión se evaluaría como `NaN` en silencio.
 */
export function observacionesConComision(transferencias, comisionPorHash) {
  return transferencias.map((t) => ({
    ...t,
    comision: t.comision ?? comisionPorHash?.get(t.hash) ?? 0
  }));
}

/** Crea el explorador sobre el dataset sintético del módulo. */
export function crearExplorador({ semilla } = {}) {
  const datos = dataset(semilla == null ? {} : { semilla });
  const transferencias = transferenciasDeCadena(datos.cuentas);
  const comisionPorHash = new Map(
    datos.cuentas.flatMap((b) => b.transacciones).map((t) => [t.hash, t.comision])
  );
  const observacionesConComision = (lista) =>
    lista.map((t) => ({ ...t, comision: t.comision ?? comisionPorHash.get(t.hash) ?? 0 }));

  return {
    datos,
    /** Todas las transferencias (token + nativas) ya extraídas. */
    transferencias,

    /** Consulta de un bloque por número, con sus transacciones y eventos. */
    bloque(numero) {
      const bloque = datos.cuentas.find((b) => b.numero === numero);
      if (!bloque) return null;
      return {
        numero: bloque.numero,
        hash: bloque.hash,
        hashPrevio: bloque.hashPrevio,
        dia: diaDe(bloque.marcaTiempo),
        transacciones: bloque.transacciones.length,
        eventos: bloque.logs.length,
        gasUsado: bloque.gasUsado
      };
    },

    /** Consulta de una transacción por hash. */
    transaccion(hash) {
      return datos.cuentas.flatMap((b) => b.transacciones).find((t) => t.hash === hash) ?? null;
    },

    /** Búsqueda de transferencias con filtros combinables. */
    buscar(filtro = {}) {
      return filtrar(transferencias, filtro);
    },

    /** Perfil de una dirección dentro de la ventana filtrada. */
    direccion(dir, filtro = {}) {
      return perfilDireccion(filtrar(transferencias, filtro), dir);
    },

    /** Indicadores del panel (laboratorio 11) sobre los bloques del rango. */
    metricas({ desde, hasta } = {}) {
      const bloques = datos.cuentas.filter(
        (b) => (desde == null || b.numero >= desde) && (hasta == null || b.numero <= hasta)
      );
      return { indicadores: calcularIndicadores(bloques), serie: serieTemporal(bloques) };
    },

    /** Grafo de la ventana filtrada, con sus grados y componentes. */
    grafo(filtro = {}) {
      const grafo = construirGrafo(filtrar(transferencias, filtro));
      return {
        grafo,
        grados: grados(grafo),
        top: topPorGrado(grafo, 5),
        componentes: componentesConexas(grafo).length
      };
    },

    /** Los cuatro detectores de patrones más la detección de anomalías. */
    patrones(filtro = {}) {
      const seleccion = filtrar(transferencias, filtro);
      // `detectarAnomalias` puntúa TODAS las observaciones y marca cuáles se
      // salen de lo normal: hay que quedarse con las marcadas. Tratar la lista
      // completa como "detecciones" daría una precisión ridícula — un error real
      // y muy común al componer un detector con el resto de la tubería.
      const anomalias = detectarAnomalias(observacionesConComision(seleccion), { metodo: "iqr" })
        .filter((a) => a.anomalo);
      return {
        fanIn: detectarFanIn(seleccion, { minimoOrigenes: 5, ventanaBloques: 20 }),
        fanOut: detectarFanOut(seleccion, { minimoDestinos: 5, ventanaBloques: 20 }),
        peelChain: detectarPeelChain(seleccion, { minimoPasos: 3 }),
        // 24 segundos = dos bloques de esta cadena. Con el umbral por defecto de
        // 60 s la mitad de la actividad normal entra en el patrón: un umbral
        // flojo no "detecta más", ahoga al analista en falsos positivos.
        rapidas: detectarTransferenciasRapidas(seleccion, { segundosMaximos: 24 }),
        anomalias,
        // La evaluación solo es posible porque el dataset es sintético y sabemos
        // la verdad. En datos reales, este bloque NO se puede calcular.
        evaluacionAnomalias: evaluar(
          anomalias.map((a) => a.hash ?? a),
          datos.verdadDeCampo.anomalas,
          seleccion.map((t) => t.hash)
        )
      };
    },

    /** Tenencias del token reconstruidas desde los eventos. */
    tenedores(n = 5) {
      const balances = balancesDesdeEventos(datos.cuentas.flatMap((b) => b.logs));
      return topTenedores(balances, n);
    },

    /** Informe en Markdown, con sus limitaciones incluidas por diseño. */
    informe(filtro = {}) {
      return construirInforme(this, filtro);
    },

    /** Panel en texto y en HTML autocontenido, y serie en CSV. */
    paneles({ desde, hasta } = {}) {
      const { indicadores, serie } = this.metricas({ desde, hasta });
      return {
        texto: renderizarPanelTexto(indicadores, serie),
        html: renderizarPanelHtml(indicadores, serie),
        csv: exportarCsv(serie),
        grafoCsv: aCsv(construirGrafo(filtrar(transferencias, { desde, hasta })))
      };
    }
  };
}

/** Las limitaciones se escriben SIEMPRE, en todos los informes, sin excepción. */
export const LIMITACIONES = [
  "Los datos son **sintéticos y deterministas**: validan el método y el código, no describen ninguna cadena real.",
  "Una **dirección no es una persona**: puede ser un servicio con miles de clientes, un contrato o una de las muchas direcciones de alguien.",
  "Los patrones detectados (fan-in, fan-out, pelado, transferencias rápidas) son **indicadores**, no pruebas: un pagador de nóminas produce el mismo fan-out que un reparto ilícito.",
  "El **volumen sobreestima** la actividad económica: incluye auto-transferencias, movimientos internos y, en modelos UTXO, la salida de cambio.",
  "El rastreo de fondos depende del **criterio de atribución** elegido (proporcional, FIFO, LIFO, haircut): con otro criterio, el reparto cambia.",
  "El **recall solo es calculable aquí** porque conocemos la verdad de campo del dataset. En una cadena real nadie sabe qué se dejó de detectar.",
  "Todo detector produce **falsos positivos**, y su coste lo paga una persona real. La tasa se publica junto al resultado, nunca por separado.",
  "Este explorador es **material educativo**: no es una herramienta certificada para acusar, bloquear ni identificar a nadie."
];

/** Construye el informe Markdown de una consulta. */
export function construirInforme(explorador, filtro = {}) {
  const seleccion = explorador.buscar(filtro);
  const { indicadores } = explorador.metricas(filtro);
  const { top, componentes } = explorador.grafo(filtro);
  const patrones = explorador.patrones(filtro);
  const describirFiltro = Object.entries(filtro).filter(([, v]) => v != null);
  const dias = [...new Set(seleccion.map((t) => diaDe(t.marcaTiempo)))].sort();

  const lineas = [
    "# Informe de actividad on-chain (dataset sintético)",
    "",
    `> Generado por el **Explorador analítico de actividad blockchain**, proyecto final del módulo 28.`,
    `> Dataset determinista con semilla \`${explorador.datos.semilla}\`. Sin red, sin claves y sin fondos.`,
    "",
    "## 1. Consulta",
    "",
    describirFiltro.length
      ? describirFiltro.map(([clave, valor]) => `- **${clave}:** \`${valor}\``).join("\n")
      : "- Sin filtros: toda la ventana disponible.",
    "",
    `- Transferencias seleccionadas: **${seleccion.length}**`,
    `- Días cubiertos: **${dias.length}**${dias.length ? ` (${dias[0]} → ${dias.at(-1)})` : ""}`,
    "",
    "## 2. Indicadores observados",
    "",
    "| Indicador | Valor |",
    "|---|---:|",
    `| Transacciones | ${indicadores.transaccionesTotales ?? seleccion.length} |`,
    `| Direcciones activas | ${indicadores.direccionesActivas ?? "—"} |`,
    `| Direcciones nuevas | ${indicadores.direccionesNuevas ?? "—"} |`,
    `| Volumen de ${SIMBOLO_TOKEN} | ${aHumano(seleccion.filter((t) => t.tipo === "token").reduce((s, t) => s + t.importe, 0), DECIMALES_TOKEN)} |`,
    `| Componentes conexas del grafo | ${componentes} |`,
    "",
    "## 3. Grafo: direcciones más conectadas",
    "",
    "| Dirección | Grado total | Lectura prudente |",
    "|---|---:|---|",
    ...top.map((n) => {
      const direccion = n.direccion ?? n.nodo ?? n[0];
      const grado = n.total ?? n.grado ?? n[1];
      return `| \`${String(direccion).slice(0, 14)}…\` | ${grado} | Grado alto es compatible con un **servicio**; no indica por sí solo nada ilícito |`;
    }),
    "",
    "## 4. Patrones detectados (indicadores, no conclusiones)",
    "",
    `- **Fan-in:** ${patrones.fanIn.length} caso(s)`,
    `- **Fan-out:** ${patrones.fanOut.length} caso(s)`,
    `- **Cadena de pelado:** ${patrones.peelChain.length} caso(s)`,
    `- **Transferencias rápidas:** ${patrones.rapidas.length} caso(s)`,
    `- **Anomalías por importe/comisión:** ${patrones.anomalias.length} caso(s)`,
    "",
    "### Calidad de la detección de anomalías",
    "",
    `- Precisión: **${(patrones.evaluacionAnomalias.precision ?? 0).toFixed(2)}** · Recall: **${(patrones.evaluacionAnomalias.recall ?? 0).toFixed(2)}**`,
    `- Falsos positivos: **${patrones.evaluacionAnomalias.falsosPositivos ?? 0}** — cada uno sería una persona revisada sin motivo.`,
    "",
    ...(patrones.anomalias.length
      ? ["### Por qué se marcó cada anomalía", "", ...patrones.anomalias.slice(0, 5).map((a) => `- ${explicar(a)}`), ""]
      : []),
    "## 5. Clasificación de las afirmaciones",
    "",
    "| Tipo | En este informe |",
    "|---|---|",
    "| **Hecho** | Los movimientos, importes y bloques listados: están en los datos y se pueden verificar |",
    "| **Indicador** | Los patrones de la sección 4: compatibles con varias explicaciones |",
    "| **Inferencia** | Cualquier lectura sobre el papel de una dirección; depende de supuestos declarados |",
    "| **Hipótesis** | Cualquier atribución a una persona u organización: **no la sostiene este informe** |",
    "",
    "## 6. Limitaciones",
    "",
    ...LIMITACIONES.map((l) => `- ${l}`),
    ""
  ];
  return lineas.join("\n");
}

// --- Ejecución como proyecto ---------------------------------------------------
if (ejecutadoDirectamente(import.meta.url)) {
  const argumentos = process.argv.slice(2);
  const leer = (nombre) => {
    const i = argumentos.indexOf(`--${nombre}`);
    return i >= 0 ? argumentos[i + 1] : undefined;
  };
  const numero = (v) => (v == null ? undefined : Number(v));
  const filtro = {
    desde: numero(leer("desde")),
    hasta: numero(leer("hasta")),
    dia: leer("dia"),
    activo: leer("activo") ?? "todos",
    direccion: leer("direccion")
  };

  const explorador = crearExplorador();
  console.log("🔎 Explorador analítico de actividad blockchain — datos SINTÉTICOS, sin red ni fondos.\n");

  const seleccion = explorador.buscar(filtro);
  console.log(`Transferencias que cumplen el filtro: ${seleccion.length} de ${explorador.transferencias.length}`);

  const primerBloque = explorador.bloque(filtro.desde ?? 0);
  console.log(`Bloque ${primerBloque.numero}: ${primerBloque.transacciones} transacciones, ${primerBloque.eventos} eventos, día ${primerBloque.dia}`);

  const perfil = explorador.direccion(filtro.direccion ?? ROLES.coleccion, filtro);
  console.log(
    `\nPerfil de ${perfil.direccion.slice(0, 14)}…: recibió ${perfil.transferenciasRecibidas}, ` +
    `envió ${perfil.transferenciasEnviadas}, ${perfil.contrapartesDistintas} contrapartes distintas` +
    (perfil.etiquetaDelDataset ? ` (papel en el dataset: ${perfil.etiquetaDelDataset})` : "")
  );

  const { componentes, top } = explorador.grafo(filtro);
  console.log(`\nGrafo: ${componentes} componente(s) conexa(s). Direcciones más conectadas:`);
  for (const nodo of top.slice(0, 3)) {
    const direccion = nodo.direccion ?? nodo.nodo ?? nodo[0];
    console.log(`   · ${String(direccion).slice(0, 14)}… → grado ${nodo.total ?? nodo.grado ?? nodo[1]}`);
  }

  const patrones = explorador.patrones(filtro);
  console.log(
    `\nPatrones: fan-in ${patrones.fanIn.length} · fan-out ${patrones.fanOut.length} · ` +
    `pelado ${patrones.peelChain.length} · rápidas ${patrones.rapidas.length} · anomalías ${patrones.anomalias.length}`
  );
  console.log(
    `Calidad de las anomalías: precisión ${(patrones.evaluacionAnomalias.precision ?? 0).toFixed(2)}, ` +
    `recall ${(patrones.evaluacionAnomalias.recall ?? 0).toFixed(2)} ` +
    `(medible SOLO porque el dataset es sintético).`
  );

  const destino = leer("informe");
  const informe = explorador.informe(filtro);
  if (destino) {
    writeFileSync(destino, informe, "utf8");
    console.log(`\n📄 Informe exportado a ${destino} (${informe.split("\n").length} líneas).`);
  } else {
    console.log(`\n📄 Informe generado en memoria: ${informe.split("\n").length} líneas. Usa --informe ruta.md para exportarlo.`);
  }

  console.log("\n⚠️  " + LIMITACIONES[1]);
  console.log("⚠️  " + LIMITACIONES.at(-1));
  console.log("\nCriterio de aceptación: la consulta devuelve resultados, el informe incluye sus limitaciones y ninguna afirmación atribuye identidad.");
}
