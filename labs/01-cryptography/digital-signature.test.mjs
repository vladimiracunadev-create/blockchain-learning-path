import test from "node:test";
import assert from "node:assert/strict";
import { signMessage } from "./digital-signature.mjs";

test("una firma válida no autoriza un mensaje alterado", () => {
  const signed = signMessage("mensaje");
  assert.equal(signed.verify("mensaje"), true);
  assert.equal(signed.verify("otro"), false);
});
