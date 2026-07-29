import test from "node:test";
import assert from "node:assert/strict";
import { merkleRoot } from "./merkle-tree.mjs";

test("la raíz es determinista y detecta cambios", () => {
  assert.equal(merkleRoot(["a", "b"]), merkleRoot(["a", "b"]));
  assert.notEqual(merkleRoot(["a", "b"]), merkleRoot(["a", "B"]));
});
