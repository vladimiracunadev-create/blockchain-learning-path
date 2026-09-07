import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function construirGrafo(transactions) {
  const nodes = new Set();
  const edges = transactions.map((tx) => {
    if (!tx.txid || !tx.from || !tx.to || tx.amount <= 0) throw new Error("Transacción inválida");
    nodes.add(tx.from); nodes.add(tx.to);
    return { from: tx.from, to: tx.to, txid: tx.txid, amount: tx.amount, evidence: "on-chain" };
  });
  return { nodes: [...nodes], edges };
}

export function analizarVecindad(transactions, address) {
  const graph = construirGrafo(transactions);
  const edges = graph.edges.filter((edge) => edge.from === address || edge.to === address);
  return {
    address,
    txids: edges.map((edge) => edge.txid),
    counterparties: [...new Set(edges.flatMap((edge) => [edge.from, edge.to]).filter((a) => a !== address))],
    fact: `${edges.length} relaciones observadas en el dataset`,
    attribution: null,
    warning: "Una dirección no equivale a una persona; una heurística genera una hipótesis, no una identidad."
  };
}

export function registrarAtribucion({ address, subject, source, confidence }) {
  if (!source || !["baja", "media", "alta"].includes(confidence)) throw new Error("Toda atribución exige fuente y confianza");
  return { address, subject, source, confidence, kind: "inference", independentlyVerified: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const txs = JSON.parse(await readFile(new URL("./fixtures/transactions.json", import.meta.url), "utf8"));
  console.log(construirGrafo(txs));
  console.log(analizarVecindad(txs, "bc1qbeta"));
}
