import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

function sumar(filas, campo, filtro = () => true) {
  const totales = {};
  for (const fila of filas.filter(filtro)) {
    if (!Number.isSafeInteger(fila[campo]) || fila[campo] < 0) throw new Error(`Importe inválido en ${fila.asset}`);
    totales[fila.asset] = (totales[fila.asset] ?? 0) + fila[campo];
  }
  return totales;
}

export function conciliar({ ledger, exchange, wallets, toleranciaSegundos = 60 }) {
  const tiempos = [ledger.asOf, exchange.asOf, wallets.asOf].map(Date.parse);
  if (tiempos.some(Number.isNaN)) throw new Error("Corte temporal inválido");
  const desfase = (Math.max(...tiempos) - Math.min(...tiempos)) / 1000;
  const liabilities = sumar(ledger.balances, "amount");
  const exchangeAssets = {};
  for (const fila of exchange.accounts) {
    if (![fila.available, fila.locked].every(Number.isSafeInteger)) throw new Error(`Export inválido en ${fila.asset}`);
    exchangeAssets[fila.asset] = (exchangeAssets[fila.asset] ?? 0) + fila.available + fila.locked;
  }
  const chainAssets = sumar(wallets.wallets, "balance");
  const assets = {};
  const rows = [];
  for (const asset of new Set([...Object.keys(liabilities), ...Object.keys(exchangeAssets), ...Object.keys(chainAssets)])) {
    assets[asset] = (exchangeAssets[asset] ?? 0) + (chainAssets[asset] ?? 0);
    const difference = assets[asset] - (liabilities[asset] ?? 0);
    rows.push({ asset, liabilities: liabilities[asset] ?? 0, exchange: exchangeAssets[asset] ?? 0, onChain: chainAssets[asset] ?? 0, assets: assets[asset], difference, status: difference >= 0 ? "covered" : "shortfall" });
  }
  return { principle: "Internal Ledger != Exchange Reality != Blockchain State", sameCutoff: desfase <= toleranciaSegundos, cutoffSkewSeconds: desfase, rows };
}

export async function cargarYConciliar(base = new URL("./fixtures/", import.meta.url)) {
  const cargar = async (nombre) => JSON.parse(await readFile(new URL(nombre, base), "utf8"));
  return conciliar({ ledger: await cargar("ledger.json"), exchange: await cargar("exchange-export.json"), wallets: await cargar("wallets.json") });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const resultado = await cargarYConciliar();
  console.log(resultado.principle);
  console.table(resultado.rows);
  console.log(`Corte comparable: ${resultado.sameCutoff ? "sí" : "no"} (desfase ${resultado.cutoffSkewSeconds}s)`);
}
