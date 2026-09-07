import test from "node:test";
import assert from "node:assert/strict";
import { auditarAurora } from "./auditar.mjs";

test("el caso final separa activos, obligaciones y operaciones", async () => {
  const report = await auditarAurora();
  assert.equal(report.obligations.length, 3);
  assert.equal(report.assets.length, 3);
  assert.equal(report.operations.onChain.length, 1);
  assert.equal(report.operations.offChain.length, 1);
});

test("hace visible el déficit USDC y el depósito pendiente", async () => {
  const report = await auditarAurora();
  assert.ok(report.discrepancies.some((d) => d.asset === "USDC" && d.type === "shortfall"));
  assert.ok(report.discrepancies.some((d) => d.reference === "dep-9003" && d.type === "timing"));
});

test("la conclusión no presenta el snapshot como auditoría completa", async () => {
  const report = await auditarAurora();
  assert.match(report.conclusion, /no constituye auditoría financiera/);
});
