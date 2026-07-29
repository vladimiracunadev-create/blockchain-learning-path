import test from "node:test";
import assert from "node:assert/strict";
import { buildProof, verifyProof } from "./merkle-proof.mjs";

test("verifica inclusión sin revelar todos los elementos", () => {
  const values = ["a", "b", "c", "d", "e"];
  const { root, proof } = buildProof(values, 2);
  assert.equal(verifyProof("c", proof, root), true);
  assert.equal(verifyProof("C", proof, root), false);
});
