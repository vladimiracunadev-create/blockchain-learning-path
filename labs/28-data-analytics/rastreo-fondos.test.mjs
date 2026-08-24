import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas } from "./cadena-sintetica.mjs";
import { transferenciasDeCadena, construirGrafo } from "./grafo-direcciones.mjs";
import { caminoMasCorto, rastrearAdelante, rastrearAtras, propagarMarca, resumenRastreo } from "./rastreo-fondos.mjs";

const { bloques, verdadDeCampo } = cadenaCuentas({});
const transferencias = transferenciasDeCadena(bloques);
const grafo = construirGrafo(transferencias);

test("caminoMasCorto encuentra la ruta completa de la cadena de pelado plantada", () => {
  const [inicio, ...resto] = verdadDeCampo.peelChain.direcciones;
  const fin = resto.at(-1);
  const camino = caminoMasCorto(grafo, inicio, fin);
  assert.ok(camino !== null);
  assert.equal(camino[0], inicio);
  assert.equal(camino.at(-1), fin);
});

test("caminoMasCorto devuelve null cuando no existe camino entre dos direcciones", () => {
  const datos = [
    { de: "A", para: "B", importe: 1 },
    { de: "X", para: "Y", importe: 1 }
  ];
  const g = construirGrafo(datos);
  assert.equal(caminoMasCorto(g, "A", "Y"), null);
});

test("caminoMasCorto devuelve null si origen o destino no son nodos del grafo (caso borde)", () => {
  assert.equal(caminoMasCorto(grafo, "0xno-existe", verdadDeCampo.fanIn.destino), null);
});

test("caminoMasCorto entre un nodo y sí mismo es el camino trivial de un solo elemento", () => {
  const cualquiera = [...grafo.nodos][0];
  assert.deepEqual(caminoMasCorto(grafo, cualquiera, cualquiera), [cualquiera]);
});

test("rastrearAdelante respeta el límite de saltos y rastrearAtras invierte el sentido", () => {
  const [inicio] = verdadDeCampo.peelChain.direcciones;
  const unSalto = rastrearAdelante(grafo, inicio, { saltosMaximos: 1 });
  assert.ok(unSalto.every((r) => r.saltos <= 1));
  const finPeel = verdadDeCampo.peelChain.direcciones.at(-1);
  const atras = rastrearAtras(grafo, finPeel, { saltosMaximos: 10 });
  assert.ok(atras.some((r) => r.direccion === inicio));
});

test("rastrearAdelante de una dirección inexistente devuelve una lista vacía sin lanzar error", () => {
  assert.deepEqual(rastrearAdelante(grafo, "0xno-existe"), []);
});

test("propagarMarca asigna 100% de marca al origen y 0% a una dirección que nunca recibió nada de esa cadena", () => {
  const [inicio] = verdadDeCampo.peelChain.direcciones;
  const marca = propagarMarca(transferencias, { origen: inicio, saltosMaximos: 10 });
  assert.equal(marca.get(inicio), 1);
  assert.equal(marca.get("0xno-existe") ?? 0, 0);
});

test("propagarMarca alcanza a las direcciones sucesivas de la cadena de pelado plantada", () => {
  const [inicio, ...resto] = verdadDeCampo.peelChain.direcciones;
  const marca = propagarMarca(transferencias, { origen: inicio, saltosMaximos: 10 });
  for (const direccion of resto) {
    assert.ok((marca.get(direccion) ?? 0) > 0, `se esperaba marca positiva en ${direccion}`);
  }
});

test("el criterio de propagación cambia el resultado: limitar los saltos reduce las direcciones marcadas (por qué no es una prueba)", () => {
  const [inicio] = verdadDeCampo.peelChain.direcciones;
  const marcaCorta = propagarMarca(transferencias, { origen: inicio, saltosMaximos: 1 });
  const marcaLarga = propagarMarca(transferencias, { origen: inicio, saltosMaximos: 10 });
  const contarMarcados = (m) => [...m.values()].filter((f) => f > 0).length;
  assert.ok(contarMarcados(marcaLarga) >= contarMarcados(marcaCorta));
});

test("resumenRastreo agrupa por número de saltos y calcula el salto máximo", () => {
  const lista = [
    { direccion: "A", saltos: 1 },
    { direccion: "B", saltos: 1 },
    { direccion: "C", saltos: 2 }
  ];
  const resumen = resumenRastreo(lista);
  assert.equal(resumen.totalAlcanzables, 3);
  assert.equal(resumen.saltoMaximo, 2);
  assert.deepEqual(resumen.porSalto, [
    { saltos: 1, cuantos: 2 },
    { saltos: 2, cuantos: 1 }
  ]);
});

test("resumenRastreo sobre una lista vacía no lanza error", () => {
  const resumen = resumenRastreo([]);
  assert.equal(resumen.totalAlcanzables, 0);
  assert.equal(resumen.saltoMaximo, 0);
});
