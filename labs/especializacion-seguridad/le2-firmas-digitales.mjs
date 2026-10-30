// LE2 · Firmas digitales: explicar, verificar y romper una firma (en el laboratorio)
//
// Prerrequisitos: LE1, clases 3–4.
// Pregunta que responde: ¿QUÉ prueba exactamente una firma, y qué NO prueba?
//
// Una firma prueba una sola cosa: que quien la produjo conocía la clave privada de
// una dirección en el momento de firmar ESOS bytes. No prueba identidad legal, no
// prueba intención, no prueba que el contexto sea el que el usuario creía, y no
// caduca. De esas ausencias nacen todos los incidentes de autorizaciones:
// el firmante firmó algo válido, pero no entendió o no controló lo que firmaba.

import { aHex, bytesAEntero, concatenar, deHex, enteroABytes, rellenar, utf8 } from "./nucleo/bytes.mjs";
import { keccak256 } from "./nucleo/keccak.mjs";
import { aChecksum } from "./nucleo/direcciones.mjs";
import {
  N, MITAD_N, clavePublica, direccionDePublica, firmarHash, firmarHashConNonce, inverso, recuperarPublica
} from "./nucleo/secp256k1.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

// --- 1. Mensajes personales (EIP-191, versión 0x45) ---------------------------------
// El prefijo existe para que una firma de "texto" jamás pueda ser, byte por byte,
// una transacción válida: separa los dominios de lo que se firma.
export function hashMensajePersonal(mensaje) {
  const cuerpo = utf8(mensaje);
  return keccak256(concatenar(utf8(`\x19Ethereum Signed Message:\n${cuerpo.length}`), cuerpo));
}

const direccionDeFirmante = (publica) => aChecksum(aHex(direccionDePublica(publica)));

/** Firma un mensaje y devuelve la firma compacta de 65 bytes (r‖s‖v, con v = 27/28). */
export function firmarMensaje(mensaje, clavePrivada) {
  const hash = hashMensajePersonal(mensaje);
  const { r, s, v } = firmarHash(hash, clavePrivada);
  const firma = aHex(concatenar(rellenar(enteroABytes(r), 32), rellenar(enteroABytes(s), 32), Uint8Array.of(27 + v)));
  return { mensaje, hash: aHex(hash), firma, firmante: direccionDeFirmante(clavePublica(clavePrivada)) };
}

/** Quién firmó. Recuperar no es lo mismo que verificar: hay que COMPARAR con quien se esperaba. */
export function recuperarFirmante(mensaje, firmaHex) {
  const bytes = deHex(firmaHex);
  if (bytes.length !== 65) return null;
  const publica = recuperarPublica(hashMensajePersonal(mensaje), {
    r: bytesAEntero(bytes.slice(0, 32)), s: bytesAEntero(bytes.slice(32, 64)), v: bytes[64] - 27
  });
  return publica ? direccionDeFirmante(publica) : null;
}

export function verificarFirma(mensaje, firmaHex, direccionEsperada) {
  const firmante = recuperarFirmante(mensaje, firmaHex);
  return {
    valida: firmante !== null && firmante.toLowerCase() === direccionEsperada.toLowerCase(),
    firmante,
    nota: "Valida = la dirección esperada controlaba la clave. No dice quién es la persona ni qué entendió."
  };
}

// --- 2. Maleabilidad -------------------------------------------------------------------
/** (r, s, v) y (r, n − s, v ⊕ 1) validan el mismo mensaje. Ethereum solo acepta la primera. */
export function crearGemelaMaleable(firmaHex) {
  const bytes = deHex(firmaHex);
  const s = bytesAEntero(bytes.slice(32, 64));
  const gemela = concatenar(bytes.slice(0, 32), rellenar(enteroABytes(N - s), 32), Uint8Array.of(bytes[64] === 27 ? 28 : 27));
  return aHex(gemela);
}

export function analizarMaleabilidad(mensaje, firmaHex, direccionEsperada) {
  const bytes = deHex(firmaHex);
  const gemelaHex = crearGemelaMaleable(firmaHex);
  const gemela = deHex(gemelaHex);
  const publicaGemela = recuperarPublica(hashMensajePersonal(mensaje), {
    r: bytesAEntero(gemela.slice(0, 32)), s: bytesAEntero(gemela.slice(32, 64)), v: gemela[64] - 27
  }, { exigirLowS: false });
  return {
    originalEsLowS: bytesAEntero(bytes.slice(32, 64)) <= MITAD_N,
    gemelaValidaMatematicamente: publicaGemela !== null && direccionDeFirmante(publicaGemela).toLowerCase() === direccionEsperada.toLowerCase(),
    gemelaAceptadaPorEthereum: recuperarFirmante(mensaje, gemelaHex) !== null,
    leccion: "Si identificas una transacción por el hash de su firma en vez de por su contenido, la gemela te engaña."
  };
}

// --- 3. Repetición entre contextos (replay) ------------------------------------------------
// Una firma sobre "pagar 10" es válida donde quiera que se presente. Para que no se pueda
// reutilizar hay que firmar también el DOMINIO: cadena, contrato destino, nonce y caducidad.
export function construirMensajeConDominio({ chainId, contrato, nonce, accion, expira }) {
  return JSON.stringify({ dominio: "LE2", chainId: String(chainId), contrato: contrato.toLowerCase(), nonce: String(nonce), accion, expira });
}

export function crearVerificadorConDominio({ chainId, contrato, ahora }) {
  const noncesUsados = new Set();
  return {
    aceptar(mensajeJson, firmaHex, direccionEsperada) {
      const datos = JSON.parse(mensajeJson);
      const { valida } = verificarFirma(mensajeJson, firmaHex, direccionEsperada);
      if (!valida) return { aceptada: false, motivo: "firma no corresponde" };
      if (datos.chainId !== String(chainId)) return { aceptada: false, motivo: "otra cadena" };
      if (datos.contrato !== contrato.toLowerCase()) return { aceptada: false, motivo: "otro contrato" };
      if (datos.expira < ahora()) return { aceptada: false, motivo: "caducada" };
      if (noncesUsados.has(datos.nonce)) return { aceptada: false, motivo: "nonce ya consumido: repetición" };
      noncesUsados.add(datos.nonce);
      return { aceptada: true, motivo: null };
    }
  };
}

// --- 4. El fallo del nonce repetido ---------------------------------------------------------
// ECDSA: s = k⁻¹ (z + r·d). Si dos mensajes comparten k (y por tanto r), restar las dos
// ecuaciones elimina d y deja k expuesta; con k se despeja d. Ocurrió en consolas de
// videojuegos y en wallets Android con generadores aleatorios defectuosos.
export function firmarConNonceFijo(mensaje, clavePrivada, k) {
  const hash = hashMensajePersonal(mensaje);
  return { hash, ...firmarHashConNonce(hash, clavePrivada, k) };
}

/**
 * Recupera la clave privada desde dos firmas con el mismo r. Se prueban los signos de s porque
 * la normalización low-s pudo invertir cualquiera de ellos; la clave pública conocida decide.
 */
export function recuperarClaveDeNonceRepetido(firmaA, firmaB, publicaConocida) {
  if (firmaA.r !== firmaB.r) return null; // k distinto: no hay fuga
  const zA = bytesAEntero(firmaA.hash);
  const zB = bytesAEntero(firmaB.hash);
  for (const sA of [firmaA.s, N - firmaA.s]) {
    for (const sB of [firmaB.s, N - firmaB.s]) {
      const diferencia = (((sA - sB) % N) + N) % N;
      if (diferencia === 0n) continue;
      const k = (((zA - zB) % N + N) % N) * inverso(diferencia, N) % N;
      const d = ((((sA * k - zA) % N) + N) % N) * inverso(firmaA.r, N) % N;
      if (d !== 0n && aHex(clavePublica(d)) === aHex(publicaConocida)) return d;
    }
  }
  return null;
}

if (ejecutadoDirectamente(import.meta.url)) {
  const clave = 0xa11ce001n;
  const firmada = firmarMensaje("Autorizo la práctica LE2", clave);
  console.log("Firma:", firmada.firma.slice(0, 22) + "…");
  console.log("Verifica contra el firmante:", verificarFirma(firmada.mensaje, firmada.firma, firmada.firmante).valida);
  console.log("Mensaje alterado:", verificarFirma("Autorizo otra operación", firmada.firma, firmada.firmante).valida);
  console.log("Maleabilidad:", analizarMaleabilidad(firmada.mensaje, firmada.firma, firmada.firmante));
  const a = firmarConNonceFijo("transferir 1", clave, 1234567n);
  const b = firmarConNonceFijo("transferir 2", clave, 1234567n);
  console.log("Clave recuperada con nonce repetido:", recuperarClaveDeNonceRepetido(a, b, clavePublica(clave)) === clave);
  console.log("Una firma prueba control de una clave, no identidad ni comprensión.");
}
