// ECDSA sobre secp256k1: la curva de Bitcoin y de las cuentas EOA de Ethereum.
//
// Lo que este archivo hace visible:
//   1. Una clave pública es un punto de la curva: Q = d·G (d = clave privada).
//   2. Una firma ECDSA es el par (r, s); con un bit extra `v` se puede RECUPERAR
//      la clave pública desde la firma. Ethereum no guarda la clave pública del
//      remitente en la transacción: la recupera de (r, s, v). Esa es la razón de
//      que "firmar" y "ser la dirección" sean la misma cosa.
//   3. El nonce k de la firma NO puede repetirse ni ser predecible: con dos firmas
//      que compartan k se despeja la clave privada. Se deriva de forma
//      determinista (RFC 6979) para no depender de un generador aleatorio.
//   4. Maleabilidad: (r, s) y (r, n − s) validan el mismo mensaje. Ethereum exige
//      s ≤ n/2 ("low-s", EIP-2) para que una firma tenga una única forma válida.
//
// ⚠️ Material didáctico: BigInt no es de tiempo constante. Nunca uses este código
// con claves reales. Las claves de los laboratorios son de prueba y se declaran así.

import { createHmac } from "node:crypto";
import { bytesAEntero, concatenar, enteroABytes, rellenar } from "./bytes.mjs";
import { keccak256 } from "./keccak.mjs";

export const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
export const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;
export const MITAD_N = N >> 1n;

const mod = (a, m = P) => ((a % m) + m) % m;

function potencia(base, exponente, modulo) {
  let resultado = 1n;
  let b = mod(base, modulo);
  let e = exponente;
  while (e > 0n) {
    if (e & 1n) resultado = (resultado * b) % modulo;
    b = (b * b) % modulo;
    e >>= 1n;
  }
  return resultado;
}

/** Inverso modular por pequeño teorema de Fermat (el módulo es primo). */
export const inverso = (a, m = P) => potencia(a, m - 2n, m);

// --- Aritmética de puntos en coordenadas Jacobianas (X, Y, Z) -------------------
// El punto afín es (X/Z², Y/Z³). Evita una inversión por cada suma.
const INFINITO = { X: 0n, Y: 1n, Z: 0n };
const esInfinito = (p) => p.Z === 0n;

function duplicar(p) {
  if (esInfinito(p) || p.Y === 0n) return INFINITO;
  const A = mod(p.X * p.X);
  const B = mod(p.Y * p.Y);
  const C = mod(B * B);
  const D = mod(2n * (mod((p.X + B) ** 2n) - A - C));
  const E = mod(3n * A);
  const F = mod(E * E);
  const X = mod(F - 2n * D);
  return { X, Y: mod(E * (D - X) - 8n * C), Z: mod(2n * p.Y * p.Z) };
}

function sumar(p, q) {
  if (esInfinito(p)) return q;
  if (esInfinito(q)) return p;
  const Z1Z1 = mod(p.Z * p.Z);
  const Z2Z2 = mod(q.Z * q.Z);
  const U1 = mod(p.X * Z2Z2);
  const U2 = mod(q.X * Z1Z1);
  const S1 = mod(p.Y * q.Z * Z2Z2);
  const S2 = mod(q.Y * p.Z * Z1Z1);
  if (U1 === U2) return S1 === S2 ? duplicar(p) : INFINITO;
  const H = mod(U2 - U1);
  const I = mod((2n * H) ** 2n);
  const J = mod(H * I);
  const r = mod(2n * (S2 - S1));
  const V = mod(U1 * I);
  const X = mod(r * r - J - 2n * V);
  return { X, Y: mod(r * (V - X) - 2n * S1 * J), Z: mod(((p.Z + q.Z) ** 2n - Z1Z1 - Z2Z2) * H) };
}

function multiplicar(punto, escalar) {
  let resultado = INFINITO;
  let sumando = punto;
  let k = mod(escalar, N);
  while (k > 0n) {
    if (k & 1n) resultado = sumar(resultado, sumando);
    sumando = duplicar(sumando);
    k >>= 1n;
  }
  return resultado;
}

function aAfin(p) {
  if (esInfinito(p)) throw new Error("El punto en el infinito no tiene coordenadas afines");
  const zInverso = inverso(p.Z);
  const z2 = mod(zInverso * zInverso);
  return { x: mod(p.X * z2), y: mod(p.Y * z2 * zInverso) };
}

const desdeAfin = ({ x, y }) => ({ X: x, Y: y, Z: 1n });
const G = desdeAfin({ x: GX, y: GY });

function validarClavePrivada(d) {
  if (typeof d !== "bigint" || d <= 0n || d >= N) throw new Error("Clave privada fuera del rango [1, n−1]");
}

/** Clave pública sin comprimir (64 bytes, X‖Y, sin el prefijo 0x04). */
export function clavePublica(clavePrivada) {
  validarClavePrivada(clavePrivada);
  const { x, y } = aAfin(multiplicar(G, clavePrivada));
  return concatenar(rellenar(enteroABytes(x), 32), rellenar(enteroABytes(y), 32));
}

// --- Nonce determinista (RFC 6979, HMAC-SHA256) ---------------------------------
function nonceDeterminista(clavePrivada, hashMensaje) {
  const x = rellenar(enteroABytes(clavePrivada), 32);
  const h1 = rellenar(enteroABytes(bytesAEntero(hashMensaje) % N), 32);
  let V = new Uint8Array(32).fill(0x01);
  let K = new Uint8Array(32).fill(0x00);
  const hmac = (clave, ...partes) => new Uint8Array(createHmac("sha256", clave).update(concatenar(...partes)).digest());
  K = hmac(K, V, Uint8Array.of(0x00), x, h1);
  V = hmac(K, V);
  K = hmac(K, V, Uint8Array.of(0x01), x, h1);
  V = hmac(K, V);
  for (;;) {
    V = hmac(K, V);
    const candidato = bytesAEntero(V);
    if (candidato >= 1n && candidato < N) return candidato;
    K = hmac(K, V, Uint8Array.of(0x00));
    V = hmac(K, V);
  }
}

/**
 * Firma un hash de 32 bytes. Devuelve { r, s, v } con v ∈ {0, 1} (paridad de y de R),
 * en forma "low-s". `v` es lo que permite recuperar la clave pública.
 */
export function firmarHash(hashMensaje, clavePrivada) {
  validarClavePrivada(clavePrivada);
  if (hashMensaje.length !== 32) throw new Error("Se firma un hash de exactamente 32 bytes");
  return firmarHashConNonce(hashMensaje, clavePrivada, nonceDeterminista(clavePrivada, hashMensaje));
}

/**
 * ⚠️ SOLO PARA DEMOSTRAR EL FALLO. Firma con un nonce `k` elegido por quien llama.
 * Repetir `k` en dos mensajes distintos con la misma clave permite despejar la
 * clave privada (laboratorio LE2). Nunca expongas esta función en una wallet.
 */
export function firmarHashConNonce(hashMensaje, clavePrivada, k) {
  validarClavePrivada(clavePrivada);
  if (k <= 0n || k >= N) throw new Error("Nonce fuera del rango [1, n−1]");
  const z = bytesAEntero(hashMensaje);
  const R = aAfin(multiplicar(G, k));
  const r = mod(R.x, N);
  if (r === 0n) throw new Error("r = 0: reintenta con otro mensaje");
  let s = mod(inverso(k, N) * (z + r * clavePrivada), N);
  let v = Number(R.y & 1n);
  if (s > MITAD_N) {
    // (r, n − s) también valida; se elige la forma canónica y se invierte la paridad.
    s = N - s;
    v ^= 1;
  }
  return { r, s, v };
}

/** Verifica una firma contra una clave pública conocida (sin recuperar nada). */
export function verificarHash(hashMensaje, { r, s }, publica) {
  if (r <= 0n || r >= N || s <= 0n || s >= N) return false;
  const z = bytesAEntero(hashMensaje);
  const w = inverso(s, N);
  const u1 = mod(z * w, N);
  const u2 = mod(r * w, N);
  const Q = desdeAfin({ x: bytesAEntero(publica.slice(0, 32)), y: bytesAEntero(publica.slice(32)) });
  const punto = sumar(multiplicar(G, u1), multiplicar(Q, u2));
  if (esInfinito(punto)) return false;
  return mod(aAfin(punto).x, N) === r;
}

/**
 * ecrecover: de (hash, r, s, v) a la clave pública que firmó. Devuelve null si la
 * firma es inválida. `exigirLowS` replica la regla de Ethereum (EIP-2).
 */
export function recuperarPublica(hashMensaje, { r, s, v }, { exigirLowS = true } = {}) {
  if (v !== 0 && v !== 1) return null;
  if (r <= 0n || r >= N || s <= 0n || s >= N) return null;
  if (exigirLowS && s > MITAD_N) return null;
  const x = r; // los casos r + n < p son despreciables (probabilidad ≈ 2⁻¹²⁸)
  const alfa = mod(x * x * x + 7n);
  let y = potencia(alfa, (P + 1n) / 4n, P);
  if (mod(y * y) !== alfa) return null; // x no está en la curva
  if (Number(y & 1n) !== v) y = P - y;
  const R = desdeAfin({ x, y });
  const z = bytesAEntero(hashMensaje);
  const rInverso = inverso(r, N);
  const sR = multiplicar(R, mod(s * rInverso, N));
  const zG = multiplicar(G, mod(-z * rInverso, N));
  const Q = sumar(sR, zG);
  if (esInfinito(Q)) return null;
  const { x: qx, y: qy } = aAfin(Q);
  return concatenar(rellenar(enteroABytes(qx), 32), rellenar(enteroABytes(qy), 32));
}

/** Dirección de Ethereum: los últimos 20 bytes de keccak256(clavePública de 64 bytes). */
export function direccionDePublica(publica) {
  return keccak256(publica).slice(12);
}
