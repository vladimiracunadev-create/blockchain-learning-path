// Utilidades de bytes compartidas por los laboratorios LE1–LE8.
//
// Por qué existen: Node trae SHA-256 y HMAC, pero NO trae Keccak-256 ni
// recuperación de clave pública ECDSA. Para entender qué firma una wallet de
// Ethereum hay que construir esas piezas una vez, a la vista. Estas funciones son
// la capa más baja: convertir entre hexadecimal, bytes y enteros sin perder ceros.
//
// ⚠️ Material didáctico. No es una biblioteca criptográfica para producción: no
// es resistente a canales laterales (BigInt no es de tiempo constante). En
// producción se usan bibliotecas auditadas (noble-curves, libsecp256k1).

/** Hexadecimal (con o sin 0x) → Uint8Array. Longitud impar = entrada inválida. */
export function deHex(hex) {
  const limpio = hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
  if (limpio.length % 2 !== 0 || /[^0-9a-fA-F]/.test(limpio)) throw new Error(`Hexadecimal inválido: ${hex}`);
  const salida = new Uint8Array(limpio.length / 2);
  for (let i = 0; i < salida.length; i += 1) salida[i] = parseInt(limpio.slice(i * 2, i * 2 + 2), 16);
  return salida;
}

/** Uint8Array → "0x…" en minúsculas. */
export function aHex(bytes) {
  let texto = "0x";
  for (const b of bytes) texto += b.toString(16).padStart(2, "0");
  return texto;
}

export function concatenar(...partes) {
  const total = partes.reduce((suma, p) => suma + p.length, 0);
  const salida = new Uint8Array(total);
  let desplazamiento = 0;
  for (const parte of partes) {
    salida.set(parte, desplazamiento);
    desplazamiento += parte.length;
  }
  return salida;
}

/** Entero ≥ 0 → bytes big-endian mínimos (0 → cadena vacía, como exige RLP). */
export function enteroABytes(valor) {
  let n = BigInt(valor);
  if (n < 0n) throw new Error("No se codifican enteros negativos");
  const bytes = [];
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return Uint8Array.from(bytes);
}

/** Bytes big-endian → entero (cadena vacía → 0). */
export function bytesAEntero(bytes) {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n;
}

/** Relleno a la izquierda hasta `longitud` bytes (para r, s, direcciones, palabras de 32 bytes). */
export function rellenar(bytes, longitud) {
  if (bytes.length > longitud) throw new Error(`No cabe en ${longitud} bytes`);
  const salida = new Uint8Array(longitud);
  salida.set(bytes, longitud - bytes.length);
  return salida;
}

export function utf8(texto) {
  return new TextEncoder().encode(texto);
}

export function deUtf8(bytes) {
  return new TextDecoder().decode(bytes);
}

export function iguales(a, b) {
  return a.length === b.length && a.every((valor, indice) => valor === b[indice]);
}
