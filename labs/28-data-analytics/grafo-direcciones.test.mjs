import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas } from "./cadena-sintetica.mjs";
import {
  transferenciasDeCadena,
  construirGrafo,
  grados,
  vecinos,
  componentesConexas,
  topPorGrado,
  aDot,
  aCsv
} from "./grafo-direcciones.mjs";

const { bloques, verdadDeCampo } = cadenaCuentas({});
const transferencias = transferenciasDeCadena(bloques);
const grafo = construirGrafo(transferencias);

test("transferenciasDeCadena combina logs de token y transacciones nativas, no tx.valor de las de token", () => {
  const tipos = new Set(transferencias.map((t) => t.tipo));
  assert.ok(tipos.has("token"));
  assert.ok(tipos.has("nativo"));
  // Ninguna transferencia de tipo token puede venir con importe 0: si el
  // código hubiera leído tx.valor en vez del log, todas serían 0.
  for (const t of transferencias.filter((t) => t.tipo === "token")) {
    assert.ok(t.importe > 0);
  }
});

test("construirGrafo agrega varias transferencias del mismo par en UNA sola arista", () => {
  const repetidas = [
    { de: "A", para: "B", importe: 10 },
    { de: "A", para: "B", importe: 20 },
    { de: "A", para: "C", importe: 5 }
  ];
  const g = construirGrafo(repetidas);
  assert.equal(g.aristas.size, 2);
  const ab = g.aristas.get("A->B");
  assert.equal(ab.veces, 2);
  assert.equal(ab.importeTotal, 30);
});

test("grados cuenta aristas distintas, no transacciones repetidas", () => {
  const repetidas = [
    { de: "A", para: "B", importe: 10 },
    { de: "A", para: "B", importe: 10 },
    { de: "A", para: "B", importe: 10 }
  ];
  const g = construirGrafo(repetidas);
  const mapa = grados(g);
  assert.equal(mapa.get("A").salida, 1);
  assert.equal(mapa.get("B").entrada, 1);
});

test("la dirección de colección del fan-in plantado tiene grado de entrada alto", () => {
  const mapa = grados(grafo);
  const gradoColeccion = mapa.get(verdadDeCampo.fanIn.destino);
  assert.ok(gradoColeccion.entrada >= verdadDeCampo.fanIn.origenes.length);
});

test("vecinos devuelve listas vacías y ordenadas para un nodo real, y vacías para uno inexistente", () => {
  const { salientes } = vecinos(grafo, verdadDeCampo.fanOut.origen);
  assert.ok(salientes.length >= verdadDeCampo.fanOut.destinos.length);
  assert.deepEqual(salientes, [...salientes].sort());
  const inexistente = vecinos(grafo, "0xno-existe");
  assert.deepEqual(inexistente, { salientes: [], entrantes: [] });
});

test("un grafo vacío no lanza error y no tiene componentes ni nodos", () => {
  const vacio = construirGrafo([]);
  assert.equal(vacio.nodos.size, 0);
  assert.equal(vacio.aristas.size, 0);
  assert.deepEqual(componentesConexas(vacio), []);
  assert.deepEqual(topPorGrado(vacio, 5), []);
});

test("componentesConexas agrupa direcciones conectadas ignorando el sentido de la arista", () => {
  const datos = [
    { de: "A", para: "B", importe: 1 },
    { de: "C", para: "B", importe: 1 }, // B conecta A y C aunque el sentido difiera
    { de: "X", para: "Y", importe: 1 } // componente separada
  ];
  const g = construirGrafo(datos);
  const componentes = componentesConexas(g);
  assert.equal(componentes.length, 2);
  const conABC = componentes.find((c) => c.includes("A"));
  assert.deepEqual(conABC.sort(), ["A", "B", "C"]);
});

test("un grado alto es un indicador de rol (servicio), no una prueba de mala conducta (error de interpretación)", () => {
  const mapa = grados(grafo);
  const top = topPorGrado(grafo, 1)[0];
  assert.ok(top.total > 0);
  // El propio código de ejecución directa imprime esta advertencia; aquí solo
  // comprobamos que el dato (grado alto) no viene acompañado de ninguna
  // etiqueta de culpabilidad: la función topPorGrado no devuelve juicios, solo
  // conteos, que es justamente lo que hay que exigirle a un detector honesto.
  assert.ok(!("sospechoso" in top));
  assert.ok(mapa.get(top.direccion).total === top.total);
});

test("aDot y aCsv exportan todas las aristas del grafo en un formato legible", () => {
  const dot = aDot(grafo);
  const csv = aCsv(grafo);
  assert.match(dot, /^digraph direcciones \{/);
  assert.equal(dot.split("\n").length, grafo.aristas.size + 2); // cabecera + aristas + cierre
  const filasCsv = csv.split("\n");
  assert.equal(filasCsv[0], "de,para,veces,importeTotal");
  assert.equal(filasCsv.length, grafo.aristas.size + 1);
});
