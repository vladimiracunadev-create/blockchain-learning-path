// Práctica 09 — Propagación P2P con retrasos.
//
// Simula cómo un bloque recorre una red de nodos que se hablan entre sí (gossip)
// cuando los enlaces tienen latencia. La pregunta que responde: si dos mineros
// encuentran un bloque casi a la vez, ¿por qué la red se parte temporalmente en
// dos y cuánto tarda en volver a estar de acuerdo?
//
// No hay red real: el tiempo se simula con una cola de eventos ordenada. Eso hace
// el resultado DETERMINISTA, que es lo que permite comprobarlo con una prueba.
//
// Uso: node labs/02-consensus/p2p-propagation.mjs
import { ejecutadoDirectamente } from "../run-directo.mjs";

// Una red es un grafo: cada nodo conoce a unos vecinos y cada enlace tarda un
// tiempo en entregar. `enlaces` es {desde: {hasta: msDeRetraso}}.
export function crearRed(enlaces) {
  return {
    nodos: Object.keys(enlaces),
    vecinos: (nodo) => Object.entries(enlaces[nodo] ?? {})
  };
}

// Propaga un mensaje desde `origen` y devuelve, para cada nodo, el instante en
// que lo recibió por primera vez.
//
// El modelo es el de una red real: un nodo reenvía a sus vecinos la primera vez
// que ve el mensaje, y descarta los duplicados. Sin ese descarte, el mensaje
// circularía para siempre entre los nodos.
export function propagar(red, origen, tiempoInicial = 0) {
  const recibidoEn = new Map([[origen, tiempoInicial]]);
  // Cola de eventos ordenada por tiempo: así el "reloj" avanza solo, sin esperas
  // reales y sin depender de la velocidad de la máquina.
  const pendientes = [{ nodo: origen, tiempo: tiempoInicial }];

  while (pendientes.length > 0) {
    pendientes.sort((a, b) => a.tiempo - b.tiempo);
    const actual = pendientes.shift();

    for (const [vecino, retraso] of red.vecinos(actual.nodo)) {
      const llegada = actual.tiempo + retraso;
      // Solo cuenta la PRIMERA vez que llega: un camino más lento no reemplaza
      // a uno más rápido, igual que en la red real.
      if (!recibidoEn.has(vecino) || llegada < recibidoEn.get(vecino)) {
        recibidoEn.set(vecino, llegada);
        pendientes.push({ nodo: vecino, tiempo: llegada });
      }
    }
  }
  return recibidoEn;
}

// Momento en que el ÚLTIMO nodo se entera. Es la métrica que importa: la red no
// está sincronizada hasta que el más lento recibe el bloque.
export function tiempoDeConvergencia(red, origen) {
  return Math.max(...propagar(red, origen).values());
}

// Dos bloques distintos emitidos casi a la vez desde puntos distintos: cada nodo
// se queda con el que le llegó ANTES. Ahí nace la bifurcación temporal.
export function carreraDeBloques(red, { origenA, origenB, ventajaDeB = 0 }) {
  const llegadasA = propagar(red, origenA, 0);
  const llegadasB = propagar(red, origenB, ventajaDeB);

  const preferencia = new Map();
  for (const nodo of red.nodos) {
    const a = llegadasA.get(nodo) ?? Infinity;
    const b = llegadasB.get(nodo) ?? Infinity;
    // Empate: gana el primero por convención estable, para que el resultado sea
    // reproducible. En la red real lo decide el orden de llegada de los paquetes.
    preferencia.set(nodo, a <= b ? "A" : "B");
  }

  const conA = [...preferencia.values()].filter((v) => v === "A").length;
  return {
    preferencia,
    particion: { A: conA, B: red.nodos.length - conA },
    // Si todos prefieren lo mismo, no hubo bifurcación en absoluto.
    huboBifurcacion: conA !== 0 && conA !== red.nodos.length
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const red = crearRed({
    minero1: { relay: 20 },
    relay: { minero1: 20, nodoA: 30, nodoB: 45, minero2: 80 },
    nodoA: { relay: 30 },
    nodoB: { relay: 45 },
    minero2: { relay: 80 }
  });

  console.log("Llegada del bloque desde minero1 (ms):");
  console.table(Object.fromEntries(propagar(red, "minero1")));
  console.log("Convergencia:", tiempoDeConvergencia(red, "minero1"), "ms\n");

  for (const ventaja of [0, 60, 200]) {
    const r = carreraDeBloques(red, { origenA: "minero1", origenB: "minero2", ventajaDeB: ventaja });
    console.log(
      `minero2 sale ${ventaja} ms más tarde →`,
      `A: ${r.particion.A} nodos, B: ${r.particion.B} nodos`,
      r.huboBifurcacion ? "· la red se parte" : "· sin bifurcación"
    );
  }
}
