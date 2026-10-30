// Transacciones tipo 2 (EIP-1559) y tipo 4 (EIP-7702) y autorizaciones de delegación.
//
// Este archivo contesta a "¿qué bytes firma exactamente la wallet?". Hay DOS
// firmas distintas en una transacción de tipo 4, y confundirlas es el error
// conceptual más caro de EIP-7702:
//
//   1. La firma de la TRANSACCIÓN: la produce quien paga el gas y la envía.
//      Hash = keccak256(0x04 ‖ rlp([chain_id, nonce, …, authorization_list])).
//   2. La firma de CADA AUTORIZACIÓN: la produce la cuenta que delega su código.
//      Hash = keccak256(0x05 ‖ rlp([chain_id, address, nonce])).
//
// Quien envía la transacción y quien firma la autorización pueden ser personas
// distintas. Una autorización es una firma desconectada: cualquiera que la tenga
// puede publicarla mientras su nonce siga vigente. Esa propiedad es la que hace
// que proteger la CLAVE (y no solo las transacciones) sea el núcleo de la custodia.

import { aHex, bytesAEntero, concatenar, deHex, enteroABytes, rellenar } from "./bytes.mjs";
import { keccak256 } from "./keccak.mjs";
import { codificarRlp, decodificarRlp } from "./rlp.mjs";
import { clavePublica, direccionDePublica, firmarHash, recuperarPublica } from "./secp256k1.mjs";
import { aChecksum } from "./direcciones.mjs";

export const TIPO_EIP1559 = 0x02;
export const TIPO_EIP7702 = 0x04;
export const MAGIA_AUTORIZACION = 0x05;
export const PREFIJO_DELEGACION = "0xef0100";

const aDireccion = (bytes) => aChecksum(aHex(bytes));
const bytesDeDireccion = (direccion) => deHex(direccion);
const enteroDe = (bytes) => bytesAEntero(bytes);

/** ¿Este código de cuenta es un designador de delegación EIP-7702 (0xef0100 ‖ dirección)? */
export const esDelegacion = (codigo) => /^0xef0100[0-9a-f]{40}$/i.test(codigo);
export const destinoDeDelegacion = (codigo) => (esDelegacion(codigo) ? aChecksum(`0x${codigo.slice(8)}`) : null);

// --- Autorizaciones -------------------------------------------------------------
export function hashAutorizacion({ chainId, direccion, nonce }) {
  const cuerpo = codificarRlp([BigInt(chainId), bytesDeDireccion(direccion), BigInt(nonce)]);
  return keccak256(concatenar(Uint8Array.of(MAGIA_AUTORIZACION), cuerpo));
}

/**
 * Firma una autorización. `chainId = 0` la hace válida en CUALQUIER cadena: es
 * legítimo para un usuario que quiere la misma delegación en todas, y peligroso
 * porque una firma robada sirve en todas las redes a la vez.
 */
export function firmarAutorizacion({ chainId, direccion, nonce }, clavePrivada) {
  const { r, s, v } = firmarHash(hashAutorizacion({ chainId, direccion, nonce }), clavePrivada);
  return { chainId: BigInt(chainId), direccion, nonce: BigInt(nonce), yParity: v, r, s };
}

/** Quién firmó la autorización (la "autoridad"), o null si la firma no es válida. */
export function recuperarAutoridad(autorizacion) {
  const publica = recuperarPublica(
    hashAutorizacion(autorizacion),
    { r: autorizacion.r, s: autorizacion.s, v: autorizacion.yParity }
  );
  return publica ? aDireccion(direccionDePublica(publica)) : null;
}

const autorizacionARlp = (a) => [a.chainId, bytesDeDireccion(a.direccion), a.nonce, a.yParity, a.r, a.s];

// --- Transacciones --------------------------------------------------------------
function camposSinFirma(tx) {
  const base = [
    BigInt(tx.chainId), BigInt(tx.nonce), BigInt(tx.maxPrioridad ?? 0), BigInt(tx.maxFee),
    BigInt(tx.gasLimit), bytesDeDireccion(tx.destino), BigInt(tx.valor ?? 0), deHex(tx.datos ?? "0x"), []
  ];
  return tx.tipo === TIPO_EIP7702 ? [...base, (tx.autorizaciones ?? []).map(autorizacionARlp)] : base;
}

export function hashParaFirmar(tx) {
  return keccak256(concatenar(Uint8Array.of(tx.tipo), codificarRlp(camposSinFirma(tx))));
}

/** Firma una transacción y devuelve los bytes crudos (lo que viaja a la red) y su hash. */
export function firmarTransaccion(tx, clavePrivada) {
  if (tx.tipo !== TIPO_EIP1559 && tx.tipo !== TIPO_EIP7702) throw new Error("Tipo de transacción no soportado");
  if (tx.tipo === TIPO_EIP7702 && !(tx.autorizaciones?.length > 0)) {
    throw new Error("EIP-7702 exige al menos una autorización: una lista vacía invalida la transacción");
  }
  const { r, s, v } = firmarHash(hashParaFirmar(tx), clavePrivada);
  const crudo = concatenar(Uint8Array.of(tx.tipo), codificarRlp([...camposSinFirma(tx), v, r, s]));
  return { crudo, hash: aHex(keccak256(crudo)) };
}

/** Decodifica una transacción cruda y recupera quién la firmó. No confía en ningún campo "from". */
export function decodificarTransaccion(crudo) {
  const tipo = crudo[0];
  if (tipo !== TIPO_EIP1559 && tipo !== TIPO_EIP7702) throw new Error(`Tipo 0x${tipo.toString(16)} no soportado`);
  const campos = decodificarRlp(crudo.slice(1));
  const esquema = tipo === TIPO_EIP7702 ? 13 : 12;
  if (campos.length !== esquema) throw new Error(`Una transacción de tipo ${tipo} lleva ${esquema} campos`);
  const [chainId, nonce, maxPrioridad, maxFee, gasLimit, destino, valor, datos, , ...resto] = campos;
  const listaAutorizaciones = tipo === TIPO_EIP7702 ? resto[0] : [];
  const [yParity, r, s] = tipo === TIPO_EIP7702 ? resto.slice(1) : resto;
  const tx = {
    tipo, chainId: enteroDe(chainId), nonce: enteroDe(nonce), maxPrioridad: enteroDe(maxPrioridad),
    maxFee: enteroDe(maxFee), gasLimit: enteroDe(gasLimit), destino: aDireccion(destino),
    valor: enteroDe(valor), datos: aHex(datos),
    autorizaciones: listaAutorizaciones.map(([cid, dir, nonceAut, par, ra, sa]) => ({
      chainId: enteroDe(cid), direccion: aDireccion(dir), nonce: enteroDe(nonceAut),
      yParity: Number(enteroDe(par)), r: enteroDe(ra), s: enteroDe(sa)
    }))
  };
  const publica = recuperarPublica(hashParaFirmar(tx), { r: enteroDe(r), s: enteroDe(s), v: Number(enteroDe(yParity)) });
  tx.remitente = publica ? aDireccion(direccionDePublica(publica)) : null;
  tx.hash = aHex(keccak256(crudo));
  return tx;
}

/** Palabra de 32 bytes (para topics y datos de eventos). */
export const palabra32 = (valor) => aHex(rellenar(typeof valor === "string" ? deHex(valor) : enteroABytes(valor), 32));

export { clavePublica };
