import { createHash } from "node:crypto";

const hash = (value) => createHash("sha256").update(value).digest("hex");

export function merkleRoot(values) {
  if (values.length === 0) return hash("");
  let level = values.map((value) => hash(value));
  while (level.length > 1) {
    if (level.length % 2 === 1) level.push(level.at(-1));
    level = Array.from({ length: level.length / 2 }, (_, index) =>
      hash(level[index * 2] + level[index * 2 + 1])
    );
  }
  return level[0];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const transactions = ["A→B:2", "B→C:1", "C→D:0.5"];
  console.log({ transactions, root: merkleRoot(transactions) });
}
