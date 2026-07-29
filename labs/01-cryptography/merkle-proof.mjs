import { createHash } from "node:crypto";

const hash = (value) => createHash("sha256").update(value).digest("hex");

export function buildProof(values, targetIndex) {
  if (targetIndex < 0 || targetIndex >= values.length) throw new RangeError("Índice inválido");
  let index = targetIndex;
  let level = values.map(hash);
  const proof = [];
  while (level.length > 1) {
    if (level.length % 2) level.push(level.at(-1));
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
    proof.push({ hash: level[siblingIndex], side: index % 2 === 0 ? "right" : "left" });
    level = Array.from({ length: level.length / 2 }, (_, i) => hash(level[i * 2] + level[i * 2 + 1]));
    index = Math.floor(index / 2);
  }
  return { root: level[0], proof };
}

export function verifyProof(value, proof, root) {
  const result = proof.reduce(
    (current, item) => item.side === "left" ? hash(item.hash + current) : hash(current + item.hash),
    hash(value)
  );
  return result === root;
}
