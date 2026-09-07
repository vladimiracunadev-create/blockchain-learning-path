import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analizarVecindad, construirGrafo, registrarAtribucion } from "./grafo-transacciones.mjs";

const txs = JSON.parse(await readFile(new URL("./fixtures/transactions.json", import.meta.url), "utf8"));

test("construye un grafo reproducible desde txid y direcciones", () => {
  const graph = construirGrafo(txs);
  assert.equal(graph.nodes.length, 5);
  assert.equal(graph.edges.length, 4);
});

test("la vecindad informa hechos sin inventar una identidad", () => {
  const result = analizarVecindad(txs, "bc1qbeta");
  assert.equal(result.txids.length, 3);
  assert.equal(result.attribution, null);
});

test("una atribución exige procedencia y nivel de confianza", () => {
  assert.throws(() => registrarAtribucion({ address: "a", subject: "Persona X", confidence: "alta" }), /fuente/);
  assert.equal(registrarAtribucion({ address: "a", subject: "Entidad X", source: "registro judicial", confidence: "alta" }).kind, "inference");
});
