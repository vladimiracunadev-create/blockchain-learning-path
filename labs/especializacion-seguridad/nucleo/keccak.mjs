// Keccak-256 tal como lo usa Ethereum (relleno 0x01, NO el 0x06 de SHA3-256).
//
// Esta es la diferencia que el laboratorio 05-evm solo menciona: Ethereum adoptó
// Keccak antes de que NIST fijara SHA-3 y cambiara un byte de relleno. Por eso
// `crypto.createHash("sha3-256")` de Node produce un resultado DISTINTO y no sirve
// para calcular direcciones, selectores ni topics de eventos.
//
// Implementación de referencia sobre lanes de 64 bits (BigInt). Es lenta a
// propósito de claridad: sigue paso a paso las funciones θ, ρ, π, χ, ι de la
// especificación de Keccak.

import { aHex, concatenar, utf8 } from "./bytes.mjs";

const MASCARA64 = (1n << 64n) - 1n;
const TASA = 136; // bytes absorbidos por bloque: (1600 − 2·256) / 8

const rotar = (x, n) => (n === 0 ? x : ((x << BigInt(n)) | (x >> BigInt(64 - n))) & MASCARA64);

/** Permutación Keccak-f[1600] sobre una matriz 5×5 de lanes: estado[x][y]. */
function permutar(estado) {
  let R = 1;
  for (let ronda = 0; ronda < 24; ronda += 1) {
    // θ: cada columna se mezcla con sus dos vecinas.
    const C = Array.from({ length: 5 }, (_, x) => estado[x][0] ^ estado[x][1] ^ estado[x][2] ^ estado[x][3] ^ estado[x][4]);
    const D = Array.from({ length: 5 }, (_, x) => C[(x + 4) % 5] ^ rotar(C[(x + 1) % 5], 1));
    for (let x = 0; x < 5; x += 1) for (let y = 0; y < 5; y += 1) estado[x][y] ^= D[x];

    // ρ y π: rotación por lane y transposición de posiciones.
    let [x, y] = [1, 0];
    let actual = estado[x][y];
    for (let t = 0; t < 24; t += 1) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      const siguiente = estado[x][y];
      estado[x][y] = rotar(actual, ((t + 1) * (t + 2)) / 2 % 64);
      actual = siguiente;
    }

    // χ: la única operación no lineal, fila por fila.
    for (let fila = 0; fila < 5; fila += 1) {
      const T = Array.from({ length: 5 }, (_, columna) => estado[columna][fila]);
      for (let columna = 0; columna < 5; columna += 1) {
        estado[columna][fila] = T[columna] ^ (~T[(columna + 1) % 5] & MASCARA64 & T[(columna + 2) % 5]);
      }
    }

    // ι: constante de ronda, generada por un registro de desplazamiento (LFSR).
    for (let j = 0; j < 7; j += 1) {
      R = ((R << 1) ^ ((R >> 7) * 0x71)) % 256;
      if (R & 2) estado[0][0] ^= 1n << BigInt((1 << j) - 1);
    }
  }
}

export function keccak256(entrada) {
  const datos = typeof entrada === "string" ? utf8(entrada) : entrada;
  // Relleno multi-tasa pad10*1 con el sufijo 0x01 propio de Keccak original.
  const relleno = TASA - (datos.length % TASA);
  const bloque = new Uint8Array(relleno);
  bloque[0] ^= 0x01;
  bloque[relleno - 1] ^= 0x80;
  const mensaje = concatenar(datos, bloque);

  const estado = Array.from({ length: 5 }, () => Array(5).fill(0n));
  for (let inicio = 0; inicio < mensaje.length; inicio += TASA) {
    for (let i = 0; i < TASA / 8; i += 1) {
      let lane = 0n;
      for (let b = 7; b >= 0; b -= 1) lane = (lane << 8n) | BigInt(mensaje[inicio + i * 8 + b]);
      estado[i % 5][Math.floor(i / 5)] ^= lane;
    }
    permutar(estado);
  }

  const salida = new Uint8Array(32);
  for (let i = 0; i < 4; i += 1) {
    const lane = estado[i % 5][Math.floor(i / 5)];
    for (let b = 0; b < 8; b += 1) salida[i * 8 + b] = Number((lane >> BigInt(8 * b)) & 0xffn);
  }
  return salida;
}

export const keccak256Hex = (entrada) => aHex(keccak256(entrada));

/** Selector de función: los 4 primeros bytes de keccak256 de la firma canónica. */
export const selector = (firma) => aHex(keccak256(firma).slice(0, 4));
