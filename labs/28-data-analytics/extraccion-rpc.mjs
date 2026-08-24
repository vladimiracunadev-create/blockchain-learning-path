// Laboratorio 3: extraer una cadena a través de un RPC, sin perder nada.
//
// Qué enseña: leer una cadena por RPC no es "pedir todo de una vez". Un
// proveedor real trunca las respuestas grandes, falla de forma transitoria de
// vez en cuando, y lo que ya se leyó puede dejar de ser válido si hay una
// reorganización. Un extractor ingenuo que ignora estos tres hechos pierde
// bloques en silencio, se cae ante el primer error de red, o cuenta como
// definitivos bloques que la propia cadena ya descartó.
//
// Por qué importa: es el paso 0 de cualquier pipeline de analítica on-chain.
// Un error aquí no se nota en el código — se nota semanas después, como un
// agujero inexplicable en las métricas.
//
// Límite pedagógico: el nodo simulado reproduce paginación, fallos
// transitorios y reorganización con la MISMA FORMA que un proveedor real,
// pero no reproduce latencia de red, límites de tarifa por contrato, ni la
// diversidad de formatos entre proveedores reales.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { ErrorRPC } from "./rpc-simulado.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Extrae TODOS los bloques de [desde, hasta] paginando correctamente: si el
 * nodo trunca la respuesta a `porPagina`, hay que seguir pidiendo desde donde
 * se cortó, no asumir que "pedí el rango completo" significa "lo recibí
 * completo". Este es exactamente el error que un extractor ingenuo comete.
 */
export function extraerRango(nodo, { desde, hasta, porPagina = 10 } = {}) {
  if (desde > hasta) throw new Error("Rango inválido: desde > hasta");
  const bloques = [];
  let cursor = desde;
  let paginas = 0;
  while (cursor <= hasta) {
    // Se pide como mucho `porPagina` bloques por vuelta: es el tamaño de lote
    // que el propio extractor decide manejar. El nodo puede truncar todavía
    // más (su `maximoPorPagina` interno), así que el avance real depende de
    // lo que llegó, nunca de lo que se pidió.
    const topeSolicitado = Math.min(hasta, cursor + porPagina - 1);
    const pagina = nodo.obtenerRango(cursor, topeSolicitado);
    paginas += 1;
    if (pagina.length === 0) break; // el nodo no tiene más bloques en el rango pedido
    bloques.push(...pagina);
    // Avanzar justo después del último bloque RECIBIDO, no del último pedido:
    // si `pagina.length < porPagina` habría que sospechar, pero el criterio
    // correcto de avance siempre es "dónde llegó realmente la respuesta".
    cursor = pagina.at(-1).numero + 1;
    // Salvaguarda: si el nodo no avanza (respuesta vacía o repetida), no
    // entrar en bucle infinito.
    if (pagina.at(-1).numero < desde) break;
  }
  return { bloques, paginas };
}

/**
 * Reintenta `fn` ante un `ErrorRPC` (fallo transitorio), hasta `intentos`
 * veces. Cualquier otro tipo de error se propaga de inmediato: reintentar un
 * error que no es transitorio (por ejemplo, un rango inválido) solo retrasa
 * el fallo, no lo evita.
 */
export function extraerConReintentos(fn, { intentos = 3 } = {}) {
  let ultimoError;
  for (let intento = 1; intento <= intentos; intento++) {
    try {
      return fn();
    } catch (error) {
      if (!(error instanceof ErrorRPC)) throw error;
      ultimoError = error;
    }
  }
  throw ultimoError;
}

/**
 * Extrae [desde, hasta] con checkpoint: si el proceso se interrumpe, se puede
 * reanudar desde `checkpoint.ultimaAlturaLeida + 1` en vez de releer todo
 * desde el principio. Cada página se lee con reintentos, porque un fallo
 * transitorio a mitad de extracción no debe tirar todo el trabajo ya hecho.
 */
export function extractorConCheckpoint(nodo, { desde, hasta, porPagina = 10, intentosPorPagina = 3, checkpointInicial } = {}) {
  const bloques = [];
  let cursor = checkpointInicial != null ? checkpointInicial.ultimaAlturaLeida + 1 : desde;
  if (cursor > hasta) {
    return { bloques, checkpoint: { ultimaAlturaLeida: checkpointInicial?.ultimaAlturaLeida ?? desde - 1 } };
  }
  while (cursor <= hasta) {
    const topeSolicitado = Math.min(hasta, cursor + porPagina - 1);
    const pagina = extraerConReintentos(() => nodo.obtenerRango(cursor, topeSolicitado), { intentos: intentosPorPagina });
    if (pagina.length === 0) break;
    bloques.push(...pagina);
    cursor = pagina.at(-1).numero + 1;
  }
  return {
    bloques,
    // El checkpoint solo guarda un NÚMERO, no el contenido: reanudar significa
    // "sigue pidiendo desde aquí", nunca "confía en que esto sigue siendo la
    // cadena vigente" — eso es justamente lo que detectarReorganizacion vigila.
    checkpoint: { ultimaAlturaLeida: cursor - 1 }
  };
}

/**
 * Compara bloques ya almacenados contra el nodo vigente por HASH, no por
 * número. Un número de bloque coincide siempre; lo que delata una
 * reorganización es que el hash del bloque con ese número cambió. Devuelve
 * los bloques huérfanos (a retirar) y una nota de por qué NO hay que sumar
 * sus transacciones a ninguna métrica.
 */
export function detectarReorganizacion(almacenados, nodo) {
  const huerfanos = [];
  const vigentes = [];
  for (const guardado of almacenados) {
    let actual;
    try {
      actual = nodo.obtenerBloque(guardado.numero);
    } catch (error) {
      if (error instanceof ErrorRPC) continue; // fallo transitorio: no es prueba de reorg, hay que reintentar aparte
      throw error;
    }
    if (actual.hash !== guardado.hash) {
      huerfanos.push({ numero: guardado.numero, hashAlmacenado: guardado.hash, hashVigente: actual.hash });
    } else {
      vigentes.push(guardado.numero);
    }
  }
  return {
    huerfanos,
    vigentes,
    nota: huerfanos.length === 0
      ? "Ningún bloque almacenado quedó huérfano: los hashes coinciden con la cadena vigente."
      : "Los bloques huérfanos deben RETIRARSE de cualquier agregado (comisiones totales, volumen, conteo " +
        "de transacciones). Sus transacciones nunca se confirmaron en la cadena definitiva: contarlas sería " +
        "contar dinero que no se movió."
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { nodoSimulado } = await import("./rpc-simulado.mjs");

  console.log("=== Extracción paginada: pedir más de lo que cabe en una página ===\n");
  const nodo1 = nodoSimulado({ maximoPorPagina: 6 });
  const alturaMax = nodo1.alturaActual();
  const directo = nodo1.obtenerRango(0, alturaMax);
  const completo = extraerRango(nodo1, { desde: 0, hasta: alturaMax, porPagina: 6 });
  console.log(`obtenerRango(0, ${alturaMax}) directo devuelve ${directo.length} bloques (truncado a maximoPorPagina).`);
  console.log(`extraerRango pagina y recupera ${completo.bloques.length} bloques en ${completo.paginas} páginas.`);

  console.log("\n=== Reintentos ante fallo transitorio ===\n");
  const nodo2 = nodoSimulado({ tasaFallo: 0.6 });
  let intentosGastados = 0;
  const bloque = extraerConReintentos(() => {
    intentosGastados += 1;
    return nodo2.obtenerBloque(0);
  }, { intentos: 8 });
  console.log(`Bloque 0 obtenido tras ${intentosGastados} intento(s): hash ${bloque.hash.slice(0, 18)}…`);

  console.log("\n=== Extracción con checkpoint y reanudación ===\n");
  const nodo3 = nodoSimulado({ maximoPorPagina: 8 });
  const primeraTanda = extractorConCheckpoint(nodo3, { desde: 0, hasta: 20, porPagina: 8 });
  console.log(`Primera tanda: ${primeraTanda.bloques.length} bloques, checkpoint en ${primeraTanda.checkpoint.ultimaAlturaLeida}.`);
  const segundaTanda = extractorConCheckpoint(nodo3, {
    desde: 0,
    hasta: 20,
    porPagina: 8,
    checkpointInicial: primeraTanda.checkpoint
  });
  console.log(`Reanudación: ${segundaTanda.bloques.length} bloques adicionales (no relee lo ya leído).`);

  console.log("\n=== Detección de reorganización ===\n");
  const nodo4 = nodoSimulado({ maximoPorPagina: 100 });
  const almacenados = nodo4.obtenerRango(0, nodo4.alturaActual()).map((b) => ({ numero: b.numero, hash: b.hash }));
  nodo4.reorganizar(nodo4.alturaActual() - 3);
  const deteccion = detectarReorganizacion(almacenados, nodo4);
  console.log(`Bloques huérfanos detectados: ${deteccion.huerfanos.map((h) => h.numero).join(", ")}`);
  console.log(deteccion.nota);

  console.log(
    "\nCriterio de aceptación: extraerRango recupera un rango completo aunque exceda maximoPorPagina; " +
      "extraerConReintentos supera un fallo transitorio sin perder el bloque; extractorConCheckpoint reanuda " +
      "sin releer; detectarReorganizacion identifica por hash (no por número) los bloques que hay que retirar."
  );
}
