import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { construirArbol, evaluarSnapshot, pruebaInclusion, verificarInclusion } from "./por.mjs";

const customers = JSON.parse(await readFile(new URL("./fixtures/customers.json", import.meta.url), "utf8"));

test("la raíz Merkle es determinista y compromete todos los saldos", () => {
  assert.equal(construirArbol(customers).root, construirArbol(customers).root);
  assert.notEqual(construirArbol(customers).root, construirArbol(customers.map((c, i) => i ? c : { ...c, balance: c.balance + 1 })).root);
});

test("un cliente verifica inclusión sin recibir la lista completa", () => {
  const tree = construirArbol(customers);
  assert.equal(verificarInclusion(customers[1], pruebaInclusion(customers, 1), tree.root), true);
});

test("una prueba no sirve para un saldo manipulado", () => {
  const tree = construirArbol(customers);
  assert.equal(verificarInclusion({ ...customers[1], balance: 1 }, pruebaInclusion(customers, 1), tree.root), false);
});

test("compara reservas y pasivos sin mezclar unidades", () => {
  const result = evaluarSnapshot({ customers, onChainAssets: 205000000, otherVerifiedAssets: 25000000 });
  assert.equal(result.totalLiabilities, 225000000);
  assert.equal(result.difference, 5000000);
  assert.equal(result.covered, true);
});
