import test from "node:test";
import assert from "node:assert/strict";
import { selectorFor } from "./abi-selector.mjs";

test("reconoce vectores ABI canónicos", () => {
  assert.equal(selectorFor("transfer(address,uint256)"), "0xa9059cbb");
  assert.equal(selectorFor("balanceOf(address)"), "0x70a08231");
});
