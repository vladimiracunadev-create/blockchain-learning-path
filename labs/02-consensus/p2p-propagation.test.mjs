import test from "node:test";
import assert from "node:assert/strict";
import { crearRed, propagar, tiempoDeConvergencia, carreraDeBloques } from "./p2p-propagation.mjs";

// Red en línea: A —10— B —10— C. Sirve para comprobar la aritmética a mano.
const linea = crearRed({
  A: { B: 10 },
  B: { A: 10, C: 10 },
  C: { B: 10 }
});

test("el mensaje llega a todos los nodos alcanzables", () => {
  const llegadas = propagar(linea, "A");
  assert.deepEqual([...llegadas.keys()].sort(), ["A", "B", "C"]);
});

test("el tiempo de llegada es la suma de los retrasos del camino", () => {
  const llegadas = propagar(linea, "A");
  assert.equal(llegadas.get("A"), 0);
  assert.equal(llegadas.get("B"), 10);
  assert.equal(llegadas.get("C"), 20);
});

test("cada nodo se queda con el camino MÁS RÁPIDO, no con el primero descubierto", () => {
  // A llega a C por dos vías: lenta directa (100) y rápida vía B (10+10=20).
  const red = crearRed({
    A: { C: 100, B: 10 },
    B: { C: 10 },
    C: {}
  });
  assert.equal(propagar(red, "A").get("C"), 20);
});

test("un nodo aislado nunca recibe el bloque", () => {
  const red = crearRed({ A: { B: 5 }, B: { A: 5 }, huerfano: {} });
  assert.equal(propagar(red, "A").has("huerfano"), false);
});

test("la convergencia la marca el nodo más lento", () => {
  assert.equal(tiempoDeConvergencia(linea, "A"), 20);
  assert.equal(tiempoDeConvergencia(linea, "B"), 10); // desde el centro es más rápido
});

test("dos bloques simultáneos parten la red en dos", () => {
  const resultado = carreraDeBloques(linea, { origenA: "A", origenB: "C", ventajaDeB: 0 });
  assert.equal(resultado.huboBifurcacion, true);
  assert.equal(resultado.preferencia.get("A"), "A");
  assert.equal(resultado.preferencia.get("C"), "B");
});

test("suficiente ventaja para el primero y no hay bifurcación", () => {
  // Si B sale tan tarde que A ya llegó a todos, nadie prefiere B.
  const resultado = carreraDeBloques(linea, { origenA: "A", origenB: "C", ventajaDeB: 1000 });
  assert.equal(resultado.huboBifurcacion, false);
  assert.equal(resultado.particion.A, 3);
});

test("la partición siempre suma el total de nodos", () => {
  for (const ventaja of [0, 5, 15, 50]) {
    const { particion } = carreraDeBloques(linea, { origenA: "A", origenB: "C", ventajaDeB: ventaja });
    assert.equal(particion.A + particion.B, 3, `falla con ventaja ${ventaja}`);
  }
});
