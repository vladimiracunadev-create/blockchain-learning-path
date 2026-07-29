import test from "node:test";
import assert from "node:assert/strict";
import { selectUtxos } from "./utxo-selection.mjs";

test("conserva entradas = salidas + comisión", () => {
  const result = selectUtxos([{ id: "a", value: 10 }, { id: "b", value: 20 }], 22, 3);
  assert.equal(result.total, result.target + result.fee + result.change);
});

test("rechaza fondos insuficientes", () => {
  assert.throws(() => selectUtxos([{ id: "a", value: 10 }], 10, 1));
});
