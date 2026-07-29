import test from "node:test";
import assert from "node:assert/strict";
import { buildHashChain, verifyHashChain } from "./hash-chain.mjs";

test("detecta alteración de un registro", () => {
  const chain = buildHashChain(["uno", "dos"]);
  assert.equal(verifyHashChain(chain), true);
  chain[0].data = "alterado";
  assert.equal(verifyHashChain(chain), false);
});
