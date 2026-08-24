// Laboratorio 9: detectar patrones estructurales — fan-in, fan-out,
// transferencias rápidas y cadena de pelado (peel chain) — y medir qué tan
// buenos son los detectores frente a una verdad de campo conocida.
//
// Ética obligatoria, repetida aquí porque es el eje del laboratorio: cada uno
// de estos patrones es un INDICADOR estructural, no una prueba de nada.
//   · Fan-in (muchos orígenes → un destino) se ve IGUAL en un exchange
//     recibiendo depósitos de sus usuarios que en un punto de recolección de
//     fondos ilícitos. La forma del grafo no distingue esos dos casos.
//   · Fan-out (un origen → muchos destinos) se ve IGUAL en una nómina pagando
//     a empleados que en un reparto para dificultar el rastreo.
//   · Una transferencia rápida (entra y sale casi de inmediato) se ve IGUAL en
//     un bot de arbitraje legítimo que en un intento de "lavar" la traza.
//   · Una cadena de pelado se ve IGUAL en alguien reenviando cambio entre sus
//     propias wallets que en un intento deliberado de fragmentar un rastro.
// Una DIRECCIÓN no es una PERSONA: varias direcciones pueden pertenecer a la
// misma entidad, y una sola dirección puede ser compartida (un contrato, un
// pool). El agrupamiento de direcciones en "entidades" es una aproximación
// HEURÍSTICA, nunca una identificación.
//
// Distinción que hay que mantener siempre al leer una detección:
//   HECHO        — lo que el código midió exactamente (p. ej. "9 direcciones
//                  distintas enviaron a X entre los bloques 20 y 28").
//   INDICADOR    — ese hecho, interpretado como señal de un patrón conocido
//                  (p. ej. "eso es un fan-in").
//   INFERENCIA   — una lectura razonable pero no probada del indicador (p. ej.
//                  "X podría ser un servicio de custodia").
//   HIPÓTESIS    — una posibilidad a investigar, no una conclusión (p. ej. "X
//                  podría estar recolectando fondos de una operación
//                  coordinada"). Solo investigación adicional fuera de la
//                  cadena (KYC, orden judicial, contexto) puede acercar una
//                  hipótesis a un hecho.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Fan-in: un destino que recibe de al menos `minimoOrigenes` direcciones
 * distintas dentro de una ventana de `ventanaBloques` bloques.
 * Devuelve una lista de { destino, origenes, hashes, bloqueInicio, bloqueFin }.
 */
export function detectarFanIn(transferencias, { minimoOrigenes = 5, ventanaBloques = 20 } = {}) {
  return detectarFan(transferencias, {
    minimo: minimoOrigenes,
    ventanaBloques,
    clave: (t) => t.para,
    contraparte: (t) => t.de,
    campoResultado: "destino",
    campoLista: "origenes"
  });
}

/**
 * Fan-out: un origen que envía a al menos `minimoDestinos` direcciones
 * distintas dentro de una ventana de `ventanaBloques` bloques.
 */
export function detectarFanOut(transferencias, { minimoDestinos = 5, ventanaBloques = 20 } = {}) {
  return detectarFan(transferencias, {
    minimo: minimoDestinos,
    ventanaBloques,
    clave: (t) => t.de,
    contraparte: (t) => t.para,
    campoResultado: "origen",
    campoLista: "destinos"
  });
}

// Motor compartido de fan-in / fan-out: agrupa transferencias por el nodo
// central (`clave`) dentro de ventanas deslizantes de bloques y reporta los
// grupos que alcanzan el mínimo de contrapartes distintas.
function detectarFan(transferencias, { minimo, ventanaBloques, clave, contraparte, campoResultado, campoLista }) {
  const porNodo = new Map();
  for (const t of transferencias) {
    const nodo = clave(t);
    if (!porNodo.has(nodo)) porNodo.set(nodo, []);
    porNodo.get(nodo).push(t);
  }

  const resultados = [];
  for (const [nodo, lista] of porNodo) {
    const ordenada = [...lista].sort((a, b) => a.numeroBloque - b.numeroBloque);
    for (let i = 0; i < ordenada.length; i++) {
      const inicioVentana = ordenada[i].numeroBloque;
      const finVentana = inicioVentana + ventanaBloques;
      const enVentana = ordenada.filter((t) => t.numeroBloque >= inicioVentana && t.numeroBloque <= finVentana);
      const contrapartesDistintas = new Set(enVentana.map(contraparte));
      if (contrapartesDistintas.size >= minimo) {
        resultados.push({
          [campoResultado]: nodo,
          [campoLista]: [...contrapartesDistintas].sort(),
          hashes: enVentana.map((t) => t.hash).sort(),
          bloqueInicio: inicioVentana,
          bloqueFin: Math.max(...enVentana.map((t) => t.numeroBloque))
        });
        break; // una detección por nodo evita reportar la misma ventana varias veces
      }
    }
  }

  resultados.sort((a, b) => (a[campoResultado] < b[campoResultado] ? -1 : 1));
  return resultados;
}

/**
 * Transferencias rápidas: una dirección recibe fondos y los reenvía en menos
 * de `segundosMaximos`. Es la firma temporal de un "paso de tránsito": una
 * dirección que no retiene valor, solo lo revienvía.
 */
export function detectarTransferenciasRapidas(transferencias, { segundosMaximos = 60 } = {}) {
  const entradasPorDireccion = new Map();
  const salidasPorDireccion = new Map();
  for (const t of transferencias) {
    if (!entradasPorDireccion.has(t.para)) entradasPorDireccion.set(t.para, []);
    entradasPorDireccion.get(t.para).push(t);
    if (!salidasPorDireccion.has(t.de)) salidasPorDireccion.set(t.de, []);
    salidasPorDireccion.get(t.de).push(t);
  }

  const resultados = [];
  for (const [direccion, entradas] of entradasPorDireccion) {
    const salidas = salidasPorDireccion.get(direccion) ?? [];
    for (const entrada of entradas) {
      for (const salida of salidas) {
        if (salida.marcaTiempo == null || entrada.marcaTiempo == null) continue;
        const diferencia = salida.marcaTiempo - entrada.marcaTiempo;
        if (diferencia >= 0 && diferencia <= segundosMaximos) {
          resultados.push({
            direccion,
            hashEntrada: entrada.hash,
            hashSalida: salida.hash,
            segundos: diferencia
          });
        }
      }
    }
  }

  resultados.sort((a, b) => a.direccion.localeCompare(b.direccion) || a.segundos - b.segundos);
  return resultados;
}

/**
 * Cadena de pelado (peel chain): una secuencia de transferencias donde, en
 * cada paso, sale un importe PEQUEÑO hacia un destino y el RESTO grande
 * avanza hacia una dirección nueva que nadie ha usado antes en la cadena.
 * Requiere al menos `minimoPasos` pasos consecutivos para reportarse.
 */
export function detectarPeelChain(transferencias, { minimoPasos = 3 } = {}) {
  // Agrupamos las transferencias en pares "salida pequeña + resto" que
  // comparten el mismo origen y bloque: es la firma que planta el generador
  // (dos transferencias del mismo remitente en el mismo bloque, una menor).
  const porOrigenYBloque = new Map();
  for (const t of transferencias) {
    const clave = `${t.de}|${t.numeroBloque}`;
    if (!porOrigenYBloque.has(clave)) porOrigenYBloque.set(clave, []);
    porOrigenYBloque.get(clave).push(t);
  }

  const pasos = [];
  for (const lista of porOrigenYBloque.values()) {
    if (lista.length !== 2) continue;
    const [a, b] = [...lista].sort((x, y) => x.importe - y.importe);
    // El "resto" debe ser claramente mayor que el "pelado": si fueran
    // similares no habría un paso pequeño y uno grande, sería un reparto.
    if (b.importe <= a.importe) continue;
    pasos.push({ origen: a.de, numeroBloque: a.numeroBloque, pelado: a, resto: b });
  }

  // Encadenamos por DIRECCIÓN, no por posición en una lista global: el
  // destino del "resto" de un paso debe ser el origen de otro paso. Seguir el
  // orden global de bloques (en vez del grafo real de continuidad) rompería
  // una cadena real cada vez que el tráfico de fondo produjera, por azar, un
  // par (origen, bloque) ajeno a la cadena entre dos pasos reales.
  const pasoPorOrigen = new Map(pasos.map((p) => [p.origen, p]));
  const esInicioDeCadena = (paso) => {
    const posiblePrevio = pasos.find((p) => p.resto.para === paso.origen);
    return !posiblePrevio;
  };

  const cadenas = [];
  for (const paso of pasos.filter(esInicioDeCadena).sort((x, y) => x.numeroBloque - y.numeroBloque)) {
    const cadenaActual = [];
    let actual = paso;
    while (actual) {
      cadenaActual.push(actual);
      actual = pasoPorOrigen.get(actual.resto.para);
    }
    if (cadenaActual.length >= minimoPasos) cadenas.push(cadenaActual);
  }

  return cadenas.map((cadena) => ({
    pasos: cadena.length,
    direcciones: [cadena[0].origen, ...cadena.map((p) => p.resto.para)],
    hashesPelados: cadena.map((p) => p.pelado.hash),
    hashesResto: cadena.map((p) => p.resto.hash)
  }));
}

/**
 * Compara un conjunto detectado contra el conjunto esperado (verdad de campo)
 * usando un identificador (hash u otra clave) para cada elemento.
 * Devuelve { verdaderosPositivos, falsosPositivos, falsosNegativos, precision, recall }.
 *
 * Precisión y recall son el compromiso central de cualquier detector: subir
 * el umbral (exigir más orígenes, una ventana más corta) casi siempre REDUCE
 * los falsos positivos (sube precisión) pero también deja fuera casos reales
 * más débiles (baja recall). No existe un umbral que maximice ambos a la vez;
 * elegirlo es una decisión de política, no solo técnica.
 */
export function evaluarDetecciones(detectado, esperado) {
  const detectadoSet = new Set(detectado);
  const esperadoSet = new Set(esperado);
  const verdaderosPositivos = [...detectadoSet].filter((x) => esperadoSet.has(x));
  const falsosPositivos = [...detectadoSet].filter((x) => !esperadoSet.has(x));
  const falsosNegativos = [...esperadoSet].filter((x) => !detectadoSet.has(x));

  const precision = detectadoSet.size > 0 ? verdaderosPositivos.length / detectadoSet.size : 0;
  const recall = esperadoSet.size > 0 ? verdaderosPositivos.length / esperadoSet.size : 0;

  return {
    verdaderosPositivos: verdaderosPositivos.sort(),
    falsosPositivos: falsosPositivos.sort(),
    falsosNegativos: falsosNegativos.sort(),
    precision: Math.round(precision * 10000) / 10000,
    recall: Math.round(recall * 10000) / 10000
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas } = await import("./cadena-sintetica.mjs");
  const { transferenciasDeCadena } = await import("./grafo-direcciones.mjs");
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDeCadena(bloques);

  console.log("=== Fan-in / fan-out detectados ===\n");
  const fanIn = detectarFanIn(transferencias, { minimoOrigenes: 9, ventanaBloques: 10 });
  const fanOut = detectarFanOut(transferencias, { minimoDestinos: 8, ventanaBloques: 10 });
  console.log(`Fan-in detectados: ${fanIn.length} (esperado: destino ${verdadDeCampo.fanIn.destino})`);
  console.log(`Fan-out detectados: ${fanOut.length} (esperado: origen ${verdadDeCampo.fanOut.origen})`);

  console.log("\n=== Cadena de pelado detectada ===\n");
  const peel = detectarPeelChain(transferencias, { minimoPasos: 3 });
  console.log(`Cadenas de pelado detectadas: ${peel.length}, la mayor con ${peel[0]?.pasos ?? 0} pasos`);

  console.log("\n=== El compromiso precisión / recall ===\n");
  const evaluacionLaxa = evaluarDetecciones(
    detectarFanIn(transferencias, { minimoOrigenes: 3, ventanaBloques: 60 }).flatMap((g) => g.hashes),
    verdadDeCampo.fanIn.hashes
  );
  const evaluacionEstricta = evaluarDetecciones(
    detectarFanIn(transferencias, { minimoOrigenes: 9, ventanaBloques: 10 }).flatMap((g) => g.hashes),
    verdadDeCampo.fanIn.hashes
  );
  console.table([
    { umbral: "laxo (min 3 orígenes)", precision: evaluacionLaxa.precision, recall: evaluacionLaxa.recall },
    { umbral: "estricto (min 9 orígenes)", precision: evaluacionEstricta.precision, recall: evaluacionEstricta.recall }
  ]);
  console.log(
    "\nSubir el umbral no es gratis: gana precisión y casi siempre pierde recall. Ese compromiso, no un" +
      " umbral 'correcto' universal, es lo que hay que decidir con criterio en cada caso.\n"
  );

  console.log("Recuerda: fan-in, fan-out y peel chain son INDICADORES, no pruebas. Una dirección no es una persona.");

  const cumple =
    fanIn.some((g) => g.destino === verdadDeCampo.fanIn.destino && g.origenes.length >= 9) &&
    fanOut.some((g) => g.origen === verdadDeCampo.fanOut.origen && g.destinos.length >= 8) &&
    peel.length >= 1;
  console.log(`\nCriterio de aceptación: se recupera el fan-in de 9, el fan-out de 8 y la cadena de pelado: ${cumple ? "CUMPLE" : "NO CUMPLE"}.`);
}
