import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { ejecutadoDirectamente } from "../run-directo.mjs";

export const DIFICULTAD_MAXIMA = 6;

export function hashDeBloque(payload, nonce) {
  return createHash("sha256").update(`${payload}:${nonce}`).digest("hex");
}

// Prueba de trabajo: buscar por fuerza bruta un nonce cuyo hash empiece por
// `dificultad` ceros. No hay atajo — esa ausencia de atajo ES el mecanismo.
export function minar(payload, dificultad) {
  const objetivo = "0".repeat(dificultad);
  const inicio = performance.now();
  let nonce = 0;
  let hash = hashDeBloque(payload, nonce);
  while (!hash.startsWith(objetivo)) {
    nonce += 1;
    hash = hashDeBloque(payload, nonce);
  }
  return { dificultad, nonce, hash, objetivo, msTranscurridos: Math.round(performance.now() - inicio) };
}

export function verificar({ payload, nonce, dificultad }) {
  const hash = hashDeBloque(payload, nonce);
  return { valido: hash.startsWith("0".repeat(dificultad)), hash };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const dificultad = Math.min(Number(process.argv[2] ?? 4), DIFICULTAD_MAXIMA);
  console.log(minar("bloque educativo", dificultad));
}
