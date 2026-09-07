import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const combinar = (a, b) => hash([a, b].sort().join(""));

export function hoja({ customer, asset, balance, nonce }) {
  if (!customer || !asset || !nonce || !Number.isSafeInteger(balance) || balance < 0) throw new Error("Cliente inválido");
  return hash(`${customer}|${asset}|${balance}|${nonce}`);
}

export function construirArbol(customers) {
  if (!customers.length) throw new Error("El árbol necesita clientes");
  const levels = [customers.map(hoja)];
  while (levels.at(-1).length > 1) {
    const current = levels.at(-1);
    const next = [];
    for (let i = 0; i < current.length; i += 2) next.push(combinar(current[i], current[i + 1] ?? current[i]));
    levels.push(next);
  }
  return { root: levels.at(-1)[0], levels, totalLiabilities: customers.reduce((sum, c) => sum + c.balance, 0) };
}

export function pruebaInclusion(customers, index) {
  const tree = construirArbol(customers);
  if (!customers[index]) throw new Error("Índice fuera del árbol");
  let position = index;
  const proof = [];
  for (const level of tree.levels.slice(0, -1)) {
    const sibling = position % 2 === 0 ? position + 1 : position - 1;
    proof.push(level[sibling] ?? level[position]);
    position = Math.floor(position / 2);
  }
  return proof;
}

export function verificarInclusion(customer, proof, root) {
  return proof.reduce((current, sibling) => combinar(current, sibling), hoja(customer)) === root;
}

export function evaluarSnapshot({ customers, onChainAssets, otherVerifiedAssets = 0 }) {
  const tree = construirArbol(customers);
  const assets = onChainAssets + otherVerifiedAssets;
  return { ...tree, assets, difference: assets - tree.totalLiabilities, ratio: assets / tree.totalLiabilities, covered: assets >= tree.totalLiabilities };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const customers = JSON.parse(await readFile(new URL("./fixtures/customers.json", import.meta.url), "utf8"));
  const result = evaluarSnapshot({ customers, onChainAssets: 205000000, otherVerifiedAssets: 25000000 });
  console.log(`Merkle root: ${result.root}`);
  console.table({ assets: result.assets, liabilities: result.totalLiabilities, difference: result.difference, ratio: result.ratio });
  console.log("PoR demuestra un snapshot acotado; no sustituye una auditoría financiera completa.");
}
