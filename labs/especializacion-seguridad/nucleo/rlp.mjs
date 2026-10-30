// RLP (Recursive Length Prefix): el formato binario con el que Ethereum serializa
// transacciones y autorizaciones EIP-7702.
//
// Entender RLP es lo que permite leer una transacción cruda sin confiar en un
// explorador: el hash que se firma y el hash que identifica la transacción salen
// de estos bytes exactos. Dos reglas explican casi todos los errores de principiante:
//   - el entero 0 se codifica como la cadena VACÍA (0x80), no como 0x00;
//   - los enteros no llevan ceros a la izquierda.

import { bytesAEntero, concatenar, enteroABytes, utf8 } from "./bytes.mjs";

function prefijoLongitud(longitud, base) {
  if (longitud < 56) return Uint8Array.of(base + longitud);
  const bytesLongitud = enteroABytes(longitud);
  return concatenar(Uint8Array.of(base + 55 + bytesLongitud.length), bytesLongitud);
}

/** Codifica bytes, enteros (number/bigint), cadenas UTF-8 o listas anidadas. */
export function codificarRlp(valor) {
  if (Array.isArray(valor)) {
    const cuerpo = concatenar(...valor.map(codificarRlp));
    return concatenar(prefijoLongitud(cuerpo.length, 0xc0), cuerpo);
  }
  let bytes;
  if (valor instanceof Uint8Array) bytes = valor;
  else if (typeof valor === "bigint" || typeof valor === "number") bytes = enteroABytes(valor);
  else if (typeof valor === "string") bytes = utf8(valor);
  else throw new Error(`Tipo no codificable en RLP: ${typeof valor}`);
  if (bytes.length === 1 && bytes[0] < 0x80) return bytes;
  return concatenar(prefijoLongitud(bytes.length, 0x80), bytes);
}

/** Decodifica RLP a bytes y listas de bytes. Falla ante cualquier byte sobrante. */
export function decodificarRlp(bytes) {
  const [valor, consumido] = leer(bytes, 0);
  if (consumido !== bytes.length) throw new Error("RLP con bytes sobrantes");
  return valor;
}

function leer(bytes, inicio) {
  if (inicio >= bytes.length) throw new Error("RLP truncado");
  const cabecera = bytes[inicio];
  if (cabecera < 0x80) return [bytes.slice(inicio, inicio + 1), inicio + 1];
  if (cabecera < 0xb8) return cortar(bytes, inicio + 1, cabecera - 0x80, false);
  if (cabecera < 0xc0) {
    const n = cabecera - 0xb7;
    return cortar(bytes, inicio + 1 + n, Number(bytesAEntero(bytes.slice(inicio + 1, inicio + 1 + n))), false);
  }
  if (cabecera < 0xf8) return cortar(bytes, inicio + 1, cabecera - 0xc0, true);
  const n = cabecera - 0xf7;
  return cortar(bytes, inicio + 1 + n, Number(bytesAEntero(bytes.slice(inicio + 1, inicio + 1 + n))), true);
}

function cortar(bytes, inicio, longitud, esLista) {
  const fin = inicio + longitud;
  if (fin > bytes.length) throw new Error("RLP truncado");
  if (!esLista) return [bytes.slice(inicio, fin), fin];
  const elementos = [];
  let cursor = inicio;
  while (cursor < fin) {
    const [elemento, siguiente] = leer(bytes, cursor);
    elementos.push(elemento);
    cursor = siguiente;
  }
  if (cursor !== fin) throw new Error("RLP con lista mal formada");
  return [elementos, fin];
}
