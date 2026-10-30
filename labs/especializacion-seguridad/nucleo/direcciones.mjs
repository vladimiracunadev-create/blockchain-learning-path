// Direcciones de Ethereum y su suma de verificación (EIP-55).
//
// La dirección es un resumen de 20 bytes de la clave pública, no la clave. EIP-55
// reutiliza las mayúsculas/minúsculas como suma de verificación: detecta un error
// de tipeo sin añadir caracteres. Una dirección en minúsculas es válida pero NO
// ofrece esa protección, y una con mayúsculas incorrectas debe rechazarse.

import { aHex, deHex } from "./bytes.mjs";
import { keccak256 } from "./keccak.mjs";
import { clavePublica, direccionDePublica } from "./secp256k1.mjs";

export function aChecksum(direccion) {
  const minusculas = direccion.toLowerCase().replace(/^0x/, "");
  if (!/^[0-9a-f]{40}$/.test(minusculas)) throw new Error(`Dirección inválida: ${direccion}`);
  const resumen = aHex(keccak256(minusculas)).slice(2);
  let salida = "0x";
  for (let i = 0; i < 40; i += 1) salida += parseInt(resumen[i], 16) >= 8 ? minusculas[i].toUpperCase() : minusculas[i];
  return salida;
}

/** ¿Es una dirección sintácticamente válida y, si trae mayúsculas, con checksum correcto? */
export function esDireccionValida(direccion) {
  if (!/^0x[0-9a-fA-F]{40}$/.test(direccion)) return false;
  const cuerpo = direccion.slice(2);
  if (cuerpo === cuerpo.toLowerCase() || cuerpo === cuerpo.toUpperCase()) return true;
  return aChecksum(direccion) === direccion;
}

export const direccionDeClavePrivada = (clavePrivada) => aChecksum(aHex(direccionDePublica(clavePublica(clavePrivada))));

/** Dirección normalizada (minúsculas) para comparar sin depender del checksum. */
export const normalizar = (direccion) => direccion.toLowerCase();

export const direccionABytes = (direccion) => deHex(direccion);
