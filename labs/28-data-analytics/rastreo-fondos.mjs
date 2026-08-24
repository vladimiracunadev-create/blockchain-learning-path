// Laboratorio 8: rastrear el recorrido de los fondos en un caso simulado.
//
// Tres preguntas distintas que se confunden con frecuencia:
//   1. ¿Existe un CAMINO entre A y B? → `caminoMasCorto` (BFS: el camino con
//      menos saltos, no el de menor importe ni el más reciente).
//   2. ¿A dónde PUEDE haber llegado el dinero que salió de A? → `rastrearAdelante`.
//      ¿De dónde PUDO venir el dinero que llegó a B? → `rastrearAtras`.
//      Ambas responden "alcanzable en N saltos", que es una cota de POSIBILIDAD,
//      no de certeza: que un nodo sea alcanzable no prueba que ESE fondo en
//      particular pasó por ahí (un nodo puede recibir de mil orígenes distintos).
//   3. ¿Qué FRACCIÓN de un fondo concreto llegó a cada dirección aguas abajo?
//      → `propagarMarca` (taint): reparte el "color" de una entrada de fondos
//      proporcionalmente al importe de cada salida posterior.
//
// El taint proporcional NO es el único criterio posible, y esa es la lección
// central del laboratorio: el mismo grafo de transferencias da resultados
// DISTINTOS según el criterio de reparto elegido quando una dirección mezcla
// fondos de origen diverso (una entrada "marcada" y otra "limpia") y luego
// hace varias salidas:
//   · Proporcional (el que implementamos aquí): cada salida hereda la misma
//     fracción de "marca" que tenía el saldo mezclado en el momento de salir.
//     Es el criterio que usan la mayoría de las herramientas comerciales de
//     rastreo, pero mezcla artificialmente fondos que en la práctica pueden no
//     haberse mezclado nunca a nivel de UTXO real.
//   · FIFO ("primero en entrar, primero en salir"): la salida se paga primero
//     con los fondos más antiguos disponibles en el saldo.
//   · LIFO ("último en entrar, primero en salir"): lo contrario.
//   · Haircut: se aplica un "recorte" fijo (p. ej. si un 1% del saldo está
//     marcado, se considera marcado un 1% de CADA salida, redondeando a favor
//     de la marca) — parecido al proporcional pero con reglas de redondeo
//     distintas que en la práctica cambian el resultado en los bordes.
// Que el CRITERIO cambie el resultado es precisamente por qué un rastreo de
// fondos es un INDICADOR probabilístico y no una prueba: dos analistas
// honestos, con los mismos datos, pueden llegar a porcentajes de "fondos
// marcados" distintos solo por haber elegido un criterio de reparto distinto.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Camino más corto (en número de saltos, no en importe) entre `origen` y
 * `destino`, siguiendo el SENTIDO de las transferencias (solo de→para).
 * Devuelve el array de direcciones del camino (incluye origen y destino), o
 * `null` si no hay camino.
 */
export function caminoMasCorto(grafo, origen, destino) {
  if (!grafo.nodos.has(origen) || !grafo.nodos.has(destino)) return null;
  if (origen === destino) return [origen];

  const salientesPorNodo = new Map();
  for (const direccion of grafo.nodos) salientesPorNodo.set(direccion, []);
  for (const arista of grafo.aristas.values()) salientesPorNodo.get(arista.de).push(arista.para);
  for (const lista of salientesPorNodo.values()) lista.sort();

  const previo = new Map([[origen, null]]);
  const cola = [origen];
  while (cola.length > 0) {
    const actual = cola.shift();
    if (actual === destino) break;
    for (const siguiente of salientesPorNodo.get(actual) ?? []) {
      if (!previo.has(siguiente)) {
        previo.set(siguiente, actual);
        cola.push(siguiente);
      }
    }
  }

  if (!previo.has(destino)) return null;
  const camino = [];
  let paso = destino;
  while (paso !== null) {
    camino.unshift(paso);
    paso = previo.get(paso);
  }
  return camino;
}

function alcanzables(grafo, inicio, { saltosMaximos = Infinity, direccionAristas }) {
  const vecinosDe = new Map();
  for (const direccion of grafo.nodos) vecinosDe.set(direccion, []);
  for (const arista of grafo.aristas.values()) {
    if (direccionAristas === "adelante") vecinosDe.get(arista.de).push(arista.para);
    else vecinosDe.get(arista.para).push(arista.de);
  }
  for (const lista of vecinosDe.values()) lista.sort();

  const saltosPorNodo = new Map([[inicio, 0]]);
  const cola = [inicio];
  while (cola.length > 0) {
    const actual = cola.shift();
    const saltos = saltosPorNodo.get(actual);
    if (saltos >= saltosMaximos) continue;
    for (const siguiente of vecinosDe.get(actual) ?? []) {
      if (!saltosPorNodo.has(siguiente)) {
        saltosPorNodo.set(siguiente, saltos + 1);
        cola.push(siguiente);
      }
    }
  }

  saltosPorNodo.delete(inicio);
  return [...saltosPorNodo.entries()]
    .map(([direccion, saltos]) => ({ direccion, saltos }))
    .sort((a, b) => a.saltos - b.saltos || a.direccion.localeCompare(b.direccion));
}

/** Direcciones alcanzables SIGUIENDO el sentido de las transferencias desde `origen`. */
export function rastrearAdelante(grafo, origen, { saltosMaximos = Infinity } = {}) {
  if (!grafo.nodos.has(origen)) return [];
  return alcanzables(grafo, origen, { saltosMaximos, direccionAristas: "adelante" });
}

/** Direcciones desde las que se PUDO llegar a `destino`, en contra del sentido de las transferencias. */
export function rastrearAtras(grafo, destino, { saltosMaximos = Infinity } = {}) {
  if (!grafo.nodos.has(destino)) return [];
  return alcanzables(grafo, destino, { saltosMaximos, direccionAristas: "atras" });
}

/**
 * Propaga una "marca" (taint) proporcional al importe desde `origen`, sobre
 * la lista SIN AGREGAR de transferencias (necesita el orden temporal, que el
 * grafo agregado no conserva).
 *
 * Modelo: cada dirección tiene un "saldo marcado" acumulado (inicialmente 0,
 * salvo `origen` que se considera 100% marcado desde el principio). Cuando una
 * dirección recibe una transferencia, su saldo marcado crece en la PROPORCIÓN
 * marcada del importe entrante (si el remitente está 40% marcado y envía 100,
 * el receptor gana 40 de marca). Cuando una dirección envía, no se descuenta
 * su marca (simplificación: se asume que el saldo no marcado es infinito para
 * cubrir el resto del envío) — es una aproximación DELIBERADAMENTE simple para
 * que el criterio "proporcional al importe" sea auditable a mano; un rastreo
 * de producción llevaría también el saldo total para calcular la fracción
 * exacta en cada momento.
 *
 * Devuelve un Map<direccion, fraccionMarcada> con fraccionMarcada en [0, 1],
 * limitado a `saltosMaximos` desde `origen`.
 */
export function propagarMarca(transferencias, { origen, saltosMaximos = Infinity } = {}) {
  const marca = new Map([[origen, 1]]);
  const saltos = new Map([[origen, 0]]);

  for (const t of transferencias) {
    const marcaDe = marca.get(t.de);
    if (!marcaDe || marcaDe <= 0) continue;
    const saltoDe = saltos.get(t.de);
    if (saltoDe >= saltosMaximos) continue;

    const aporte = marcaDe * t.importe;
    if (!marca.has(t.para)) {
      marca.set(t.para, 0);
      saltos.set(t.para, saltoDe + 1);
    }
    // La fracción marcada del receptor se recalcula como si TODO lo recibido
    // hasta ahora fuese su saldo (ver limitación documentada arriba): se
    // acumula el aporte y se deja expresado en unidades de importe hasta el
    // final, cuando se normaliza a fracción [0,1] frente al total recibido.
    marca.set(t.para, (marca.get(t.para) ?? 0) + aporte);
    if (saltos.get(t.para) > saltoDe + 1 || !saltos.has(t.para)) saltos.set(t.para, saltoDe + 1);
  }

  // Normalizar: `origen` queda en 1 (100%); el resto de direcciones acumuló
  // "importe marcado" en unidades absolutas, así que se divide por el total
  // recibido por esa dirección para obtener una fracción en [0, 1].
  const recibidoTotal = new Map();
  for (const t of transferencias) recibidoTotal.set(t.para, (recibidoTotal.get(t.para) ?? 0) + t.importe);

  const resultado = new Map();
  for (const [direccion, valor] of marca) {
    if (direccion === origen) {
      resultado.set(direccion, 1);
      continue;
    }
    const total = recibidoTotal.get(direccion) ?? 0;
    resultado.set(direccion, total > 0 ? Math.min(1, valor / total) : 0);
  }
  return resultado;
}

/** Resumen legible de un rastreo hacia adelante: cuántos nodos por salto y el más lejano. */
export function resumenRastreo(alcanzablesLista) {
  const porSalto = new Map();
  for (const { saltos } of alcanzablesLista) porSalto.set(saltos, (porSalto.get(saltos) ?? 0) + 1);
  const saltoMaximo = alcanzablesLista.length > 0 ? Math.max(...alcanzablesLista.map((a) => a.saltos)) : 0;
  return {
    totalAlcanzables: alcanzablesLista.length,
    porSalto: [...porSalto.entries()].sort((a, b) => a[0] - b[0]).map(([saltos, cuantos]) => ({ saltos, cuantos })),
    saltoMaximo
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas } = await import("./cadena-sintetica.mjs");
  const { construirGrafo, transferenciasDeCadena } = await import("./grafo-direcciones.mjs");
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDeCadena(bloques);
  const grafo = construirGrafo(transferencias);

  console.log("=== Caso guiado: la cadena de pelado (peel chain) plantada ===\n");
  const [inicioPeel, ...restoPeel] = verdadDeCampo.peelChain.direcciones;
  const finPeel = restoPeel.at(-1);
  const camino = caminoMasCorto(grafo, inicioPeel, finPeel);
  console.log(`Camino más corto de ${inicioPeel} a ${finPeel}:`);
  console.log(camino ? camino.join(" -> ") : "sin camino");

  const adelante = rastrearAdelante(grafo, inicioPeel, { saltosMaximos: 10 });
  console.log(`\nDirecciones alcanzables desde el inicio de la cadena de pelado: ${adelante.length}`);
  console.table(resumenRastreo(adelante).porSalto);

  console.log("\n=== Caso guiado: propagación de marca desde una anomalía ===\n");
  const origenAnomalia = verdadDeCampo.roles.servicio;
  const marca = propagarMarca(transferencias, { origen: origenAnomalia, saltosMaximos: 5 });
  const marcados = [...marca.entries()].filter(([d, f]) => d !== origenAnomalia && f > 0);
  console.log(`Direcciones con marca > 0 tras la anomalía del servicio: ${marcados.length}`);
  console.log(
    "\nRecuerda: este porcentaje depende del criterio (proporcional). Con FIFO, LIFO o haircut el número " +
      "cambiaría. Por eso un rastreo de fondos es evidencia a INVESTIGAR, no una prueba cerrada."
  );

  console.log(
    `\nCriterio de aceptación: existe camino en la cadena de pelado (${camino ? "SÍ" : "NO"}) ` +
      `y la propagación de marca alcanza al menos 1 dirección aguas abajo (${marcados.length >= 1 ? "SÍ" : "NO"}).`
  );
}
