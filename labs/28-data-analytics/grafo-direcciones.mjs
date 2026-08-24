// Laboratorio 7: construir un GRAFO de direcciones a partir de transferencias.
//
// Un grafo es la estructura natural para leer una cadena como una red de pagos:
//   · NODO  = una dirección que aparece como origen o destino de al menos una
//     transferencia.
//   · ARISTA = una relación origen→destino observada. Aquí se AGREGA: si el
//     mismo par (origen, destino) transfiere varias veces, es UNA arista con un
//     contador `veces` y un `importeTotal`, no una arista por transacción. Esa
//     agregación es la que hace legible un grafo con miles de movimientos.
//   · GRADO = cuántas aristas tocan un nodo (entrada, salida, total). Un grado
//     de salida altísimo es, con enorme frecuencia, un SERVICIO (un exchange,
//     una nómina, un contrato de reparto) que concentra tráfico legítimo de
//     mucha gente: el grado NO es una señal de culpabilidad, es una señal de
//     ROL. Confundir "concentra tráfico" con "es sospechoso" es el error de
//     lectura más común al abrir un grafo de direcciones por primera vez.
//   · CAMINO = una secuencia de aristas que conecta un nodo con otro siguiendo
//     el sentido de las transferencias (ver rastreo-fondos.mjs, laboratorio 8).
//   · COMUNIDAD / COMPONENTE CONEXA = un grupo de nodos unidos entre sí por
//     algún camino (ignorando el sentido de la arista). Aquí solo calculamos
//     COMPONENTES CONEXAS (una noción exacta y barata); una "comunidad" en el
//     sentido de clustering (grupos densamente conectados entre sí y poco con
//     el resto) es un problema más difícil que este laboratorio no resuelve:
//     lo nombramos para que el alumno sepa que existe y que no es lo mismo.
//
// Decisión de qué transferencias entran al grafo: los importes de TOKEN viven
// en los LOGS del evento Transfer (`log.decodificado`), no en `tx.valor` (que
// vale 0 para transacciones de tipo "token": el valor nativo movido es cero,
// todo el valor lo mueve el token). Si el grafo solo mirara `tx.valor` se
// perdería casi todo el tráfico de esta cadena sintética. Por eso
// `transferenciasDeCadena` combina DOS fuentes: los logs de token y las
// transacciones nativas con valor > 0.
//
// Límite pedagógico: agregar aristas por par (origen, destino) BORRA el orden
// temporal y el detalle de cada envío individual. Para preguntas que dependen
// del tiempo (¿en qué orden llegó el dinero?, ¿cuánto tardó en salir?) hace
// falta la lista de transferencias sin agregar, que es la que usa el
// laboratorio 8.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { logsDe, transaccionesDe, TOPIC_TRANSFER } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Extrae la lista de transferencias (sin agregar) de una cadena de cuentas:
 * una entrada por cada movimiento de valor, sea nativo o de token.
 *
 * Cada transferencia: { de, para, importe, tipo, hash, numeroBloque, marcaTiempo }.
 */
export function transferenciasDeCadena(bloques) {
  const transferencias = [];

  for (const log of logsDe(bloques)) {
    if (log.topics[0] !== TOPIC_TRANSFER) continue; // solo eventos Transfer
    transferencias.push({
      de: log.decodificado.de,
      para: log.decodificado.para,
      importe: log.decodificado.valor,
      tipo: "token",
      hash: log.hashTransaccion,
      numeroBloque: log.numeroBloque,
      marcaTiempo: null
    });
  }

  for (const tx of transaccionesDe(bloques)) {
    if (tx.tipo !== "nativo" || tx.valor <= 0) continue;
    transferencias.push({
      de: tx.de,
      para: tx.para,
      importe: tx.valor,
      tipo: "nativo",
      hash: tx.hash,
      numeroBloque: tx.numeroBloque,
      marcaTiempo: tx.marcaTiempo
    });
  }

  // La marca de tiempo del log no se guarda en el core: la recuperamos por
  // número de bloque a partir de la propia lista de bloques.
  const marcaPorBloque = new Map(bloques.map((b) => [b.numero, b.marcaTiempo]));
  for (const t of transferencias) {
    if (t.marcaTiempo == null) t.marcaTiempo = marcaPorBloque.get(t.numeroBloque) ?? null;
  }

  // Orden determinista: por bloque y luego por hash, para que dos ejecuciones
  // produzcan siempre la misma lista sin depender del orden de inserción.
  transferencias.sort((a, b) => a.numeroBloque - b.numeroBloque || a.hash.localeCompare(b.hash));
  return transferencias;
}

/**
 * Construye el grafo agregado a partir de una lista de transferencias.
 * Devuelve { nodos: Set<direccion>, aristas: Map<"de->para", {de,para,veces,importeTotal}> }.
 */
export function construirGrafo(transferencias) {
  const nodos = new Set();
  const aristas = new Map();

  for (const t of transferencias) {
    nodos.add(t.de);
    nodos.add(t.para);
    const clave = `${t.de}->${t.para}`;
    const existente = aristas.get(clave);
    if (existente) {
      existente.veces += 1;
      existente.importeTotal += t.importe;
    } else {
      aristas.set(clave, { de: t.de, para: t.para, veces: 1, importeTotal: t.importe });
    }
  }

  return { nodos, aristas };
}

/** Direcciones alcanzables en un salto desde `direccion`, en ambos sentidos. */
export function vecinos(grafo, direccion) {
  const salientes = [];
  const entrantes = [];
  for (const arista of grafo.aristas.values()) {
    if (arista.de === direccion) salientes.push(arista.para);
    if (arista.para === direccion) entrantes.push(arista.de);
  }
  salientes.sort();
  entrantes.sort();
  return { salientes, entrantes };
}

/**
 * Grado de cada nodo: nº de aristas distintas que entran, salen, y el total.
 * El grado cuenta ARISTAS (pares distintos), no transacciones: una dirección
 * que recibe 900 veces del mismo origen tiene grado de entrada 1, no 900.
 */
export function grados(grafo) {
  const resultado = new Map();
  for (const direccion of grafo.nodos) resultado.set(direccion, { entrada: 0, salida: 0, total: 0 });

  for (const arista of grafo.aristas.values()) {
    const origen = resultado.get(arista.de);
    origen.salida += 1;
    origen.total += 1;
    const destino = resultado.get(arista.para);
    destino.entrada += 1;
    destino.total += 1;
  }

  return resultado;
}

/** Las `n` direcciones con mayor grado total, ordenadas de mayor a menor. */
export function topPorGrado(grafo, n = 5) {
  const mapa = grados(grafo);
  return [...mapa.entries()]
    .map(([direccion, g]) => ({ direccion, ...g }))
    .sort((a, b) => b.total - a.total || a.direccion.localeCompare(b.direccion))
    .slice(0, n);
}

/**
 * Componentes conexas del grafo, IGNORANDO el sentido de las aristas (unión
 * no dirigida): dos direcciones están en la misma componente si existe algún
 * camino entre ellas en cualquier sentido. Es la aproximación más barata a
 * "grupo de direcciones relacionadas"; NO es un agrupamiento de comunidades
 * (eso exigiría medir densidad de conexión, no solo alcanzabilidad) y NO
 * implica que las direcciones pertenezcan a la misma persona: es una
 * heurística de conexión observada, nada más.
 */
export function componentesConexas(grafo) {
  const adyacencia = new Map();
  const asegurar = (direccion) => {
    if (!adyacencia.has(direccion)) adyacencia.set(direccion, new Set());
    return adyacencia.get(direccion);
  };
  for (const direccion of grafo.nodos) asegurar(direccion);
  for (const arista of grafo.aristas.values()) {
    asegurar(arista.de).add(arista.para);
    asegurar(arista.para).add(arista.de);
  }

  const visitados = new Set();
  const componentes = [];
  for (const inicio of [...grafo.nodos].sort()) {
    if (visitados.has(inicio)) continue;
    const componente = [];
    const pendientes = [inicio];
    visitados.add(inicio);
    while (pendientes.length > 0) {
      const actual = pendientes.shift();
      componente.push(actual);
      for (const vecino of adyacencia.get(actual)) {
        if (!visitados.has(vecino)) {
          visitados.add(vecino);
          pendientes.push(vecino);
        }
      }
    }
    componente.sort();
    componentes.push(componente);
  }

  componentes.sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));
  return componentes;
}

/**
 * Exporta el grafo a formato DOT (Graphviz). Para visualizarlo: instalar
 * Graphviz y ejecutar `dot -Tpng grafo.dot -o grafo.png`, o pegar el texto en
 * un visor en línea como https://dreampuf.github.io/GraphvizOnline/ (offline
 * también funciona con cualquier editor DOT local; no hace falta subir datos
 * reales a un servicio externo — este dataset es sintético).
 */
export function aDot(grafo) {
  const lineas = ["digraph direcciones {"];
  for (const arista of [...grafo.aristas.values()].sort((a, b) => a.de.localeCompare(b.de) || a.para.localeCompare(b.para))) {
    lineas.push(`  "${arista.de}" -> "${arista.para}" [label="${arista.veces}x"];`);
  }
  lineas.push("}");
  return lineas.join("\n");
}

/**
 * Exporta el grafo a CSV de aristas (de,para,veces,importeTotal). Se abre con
 * cualquier hoja de cálculo o se carga en herramientas de grafos como
 * Gephi (Import > Edge table).
 */
export function aCsv(grafo) {
  const filas = ["de,para,veces,importeTotal"];
  for (const arista of [...grafo.aristas.values()].sort((a, b) => a.de.localeCompare(b.de) || a.para.localeCompare(b.para))) {
    filas.push(`${arista.de},${arista.para},${arista.veces},${arista.importeTotal}`);
  }
  return filas.join("\n");
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas } = await import("./cadena-sintetica.mjs");
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDeCadena(bloques);
  const grafo = construirGrafo(transferencias);

  console.log("=== Grafo de direcciones ===\n");
  console.log(`Transferencias consideradas: ${transferencias.length}`);
  console.log(`Nodos (direcciones): ${grafo.nodos.size}`);
  console.log(`Aristas (pares origen→destino agregados): ${grafo.aristas.size}\n`);

  console.log("Top 5 por grado total (¡grado alto = probable SERVICIO, no sospechoso!):");
  console.table(topPorGrado(grafo, 5));

  const componentes = componentesConexas(grafo);
  console.log(`\nComponentes conexas: ${componentes.length} (la mayor tiene ${componentes[0].length} direcciones)`);

  const gradosMapa = grados(grafo);
  const gradoColeccion = gradosMapa.get(verdadDeCampo.fanIn.destino);
  console.log(
    `\nLa dirección de colección del fan-in plantado tiene grado de entrada ${gradoColeccion?.entrada ?? 0}: ` +
      "concentra tráfico de muchos orígenes, exactamente como haría un exchange educativo legítimo."
  );

  console.log("\nMuestra de exportación DOT (primeras 3 líneas):");
  console.log(aDot(grafo).split("\n").slice(0, 3).join("\n"));

  const gradoOk = (gradoColeccion?.entrada ?? 0) >= verdadDeCampo.fanIn.origenes.length;
  console.log(
    `\nCriterio de aceptación: el grafo tiene ${grafo.nodos.size} nodos, ${grafo.aristas.size} aristas agregadas, ` +
      `y la dirección de colección alcanza grado de entrada >= ${verdadDeCampo.fanIn.origenes.length}: ${gradoOk ? "CUMPLE" : "NO CUMPLE"}.`
  );
}
