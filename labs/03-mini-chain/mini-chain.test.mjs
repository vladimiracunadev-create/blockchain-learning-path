import test from "node:test";
import assert from "node:assert/strict";
import { MiniChain } from "./mini-chain.mjs";

test("mina y detecta manipulación", () => {
  const chain = new MiniChain(2);
  chain.append(["A→B:1"]);
  assert.equal(chain.isValid(), true);
  chain.blocks[1].transactions[0] = "A→B:100";
  assert.equal(chain.isValid(), false);
});
