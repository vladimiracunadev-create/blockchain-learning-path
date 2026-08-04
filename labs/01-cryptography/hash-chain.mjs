import { createHash } from "node:crypto";
import { ejecutadoDirectamente } from "../run-directo.mjs";

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function buildHashChain(records) {
  let previousHash = "0".repeat(64);
  return records.map((data, index) => {
    const hash = sha256(JSON.stringify({ index, data, previousHash }));
    const record = { index, data, previousHash, hash };
    previousHash = hash;
    return record;
  });
}

export function verifyHashChain(chain) {
  return chain.every((record, index) => {
    const expectedPrevious = index === 0 ? "0".repeat(64) : chain[index - 1].hash;
    const expectedHash = sha256(JSON.stringify({
      index: record.index,
      data: record.data,
      previousHash: record.previousHash
    }));
    return record.previousHash === expectedPrevious && record.hash === expectedHash;
  });
}

if (ejecutadoDirectamente(import.meta.url)) {
  const chain = buildHashChain(["A paga 2 a B", "B paga 1 a C"]);
  console.table(chain);
  console.log("Cadena válida:", verifyHashChain(chain));
}
