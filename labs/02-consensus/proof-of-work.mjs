import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

const difficulty = Math.min(Number(process.argv[2] ?? 4), 6);
const prefix = "0".repeat(difficulty);
const payload = "bloque educativo";
let nonce = 0;
let digest = "";
const started = performance.now();

do {
  digest = createHash("sha256").update(`${payload}:${nonce}`).digest("hex");
  nonce += 1;
} while (!digest.startsWith(prefix));

console.log({
  difficulty,
  nonce: nonce - 1,
  hash: digest,
  elapsedMs: Math.round(performance.now() - started)
});
