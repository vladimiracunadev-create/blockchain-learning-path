import test from "node:test";
import assert from "node:assert/strict";
import { demo, reconcile } from "./entitlement.mjs";

test("token ownership does not override a suspended account", () => {
  assert.deepEqual(demo(), {
    ownsToken: true,
    entitlement: false,
    reasons: ["account suspended"],
  });
});

test("entitlement is granted only when ownership and game rules agree", () => {
  const result = reconcile({
    chainOwner: "0xa1",
    linkedWallet: "0xA1",
    accountActive: true,
    licenseActive: true,
    assetAllowed: true,
    metadataAvailable: true,
  });
  assert.deepEqual(result, { ownsToken: true, entitlement: true, reasons: [] });
});

test("reconciliation preserves every reason for denial", () => {
  const result = reconcile({
    chainOwner: "0xa1",
    linkedWallet: "0xb2",
    accountActive: true,
    licenseActive: false,
    assetAllowed: false,
    metadataAvailable: false,
  });
  assert.equal(result.entitlement, false);
  assert.deepEqual(result.reasons, [
    "wallet-linked-account mismatch",
    "license expired",
    "asset disabled by current rules",
    "metadata unavailable",
  ]);
});
