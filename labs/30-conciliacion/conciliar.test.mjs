import test from "node:test";
import assert from "node:assert/strict";
import { cargarYConciliar, conciliar } from "./conciliar.mjs";

test("separa ledger, activos en exchange y saldos on-chain", async () => {
  const r = await cargarYConciliar();
  const btc = r.rows.find((fila) => fila.asset === "BTC");
  assert.deepEqual({ liabilities: btc.liabilities, exchange: btc.exchange, onChain: btc.onChain }, { liabilities: 200000000, exchange: 25000000, onChain: 180000000 });
  assert.equal(btc.difference, 5000000);
});

test("detecta un déficit por activo aunque el total nominal parezca grande", async () => {
  const r = await cargarYConciliar();
  assert.equal(r.rows.find((fila) => fila.asset === "USDC").status, "shortfall");
});

test("rechaza cortes temporales que no son comparables", () => {
  const base = { balances: [], accounts: [], wallets: [] };
  const r = conciliar({ ledger: { asOf: "2026-01-01T00:00:00Z", balances: [] }, exchange: { asOf: "2026-01-01T00:00:10Z", accounts: [] }, wallets: { asOf: "2026-01-01T00:03:00Z", wallets: [] } });
  assert.equal(r.sameCutoff, false);
  assert.equal(base.balances.length, 0);
});
