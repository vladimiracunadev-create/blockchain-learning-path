import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { conciliar } from "../../labs/30-conciliacion/conciliar.mjs";

const cargar = async (base, nombre) => JSON.parse(await readFile(new URL(nombre, base), "utf8"));

export async function auditarAurora(base = new URL("./data/", import.meta.url)) {
  const [ledger, wallets, exchange, transactions] = await Promise.all([
    cargar(base, "ledger.json"), cargar(base, "wallets.json"), cargar(base, "exchange-export.json"), cargar(base, "transactions.json")
  ]);
  const reconciliation = conciliar({ ledger, wallets, exchange });
  const onChain = transactions.filter((tx) => tx.state === "on-chain" && tx.txid);
  const offChain = transactions.filter((tx) => tx.state === "off-chain" && !tx.txid);
  const discrepancies = reconciliation.rows.filter((row) => row.difference !== 0).map((row) => ({ type: row.difference > 0 ? "surplus" : "shortfall", asset: row.asset, amount: row.difference }));
  const pending = transactions.filter((tx) => tx.state === "pending");
  for (const tx of pending) discrepancies.push({ type: "timing", asset: tx.asset, amount: tx.amount, reference: tx.id });
  return {
    company: "Aurora Custody SpA (ficticia)",
    asOf: ledger.asOf,
    principle: reconciliation.principle,
    obligations: reconciliation.rows.map(({ asset, liabilities }) => ({ asset, amount: liabilities })),
    assets: reconciliation.rows.map(({ asset, onChain: chain, exchange: thirdParty, assets: total }) => ({ asset, onChain: chain, offChainAtExchange: thirdParty, total })),
    operations: { onChain, offChain, pending },
    discrepancies,
    conclusion: "Snapshot educativo: no constituye auditoría financiera ni conclusión de solvencia de una entidad real."
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await auditarAurora();
  console.log(`# ${report.company} — ${report.asOf}`);
  console.log(report.principle);
  console.log("\nObligaciones"); console.table(report.obligations);
  console.log("Activos"); console.table(report.assets);
  console.log("Discrepancias"); console.table(report.discrepancies);
  console.log(report.conclusion);
}
