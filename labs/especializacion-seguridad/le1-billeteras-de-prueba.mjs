// LE1 · Billeteras de prueba
//
// Prerrequisitos: clases 3–4 (criptografía) y la guía «Wallets desde cero».
// Pregunta que responde: ¿qué ES una cuenta de Ethereum y qué prueba su dirección?
//
// Idea central: una cuenta EOA es solo un número secreto d (clave privada). De d se
// obtiene la clave pública Q = d·G, y de Q la dirección (últimos 20 bytes de
// keccak256(Q)). Nada de eso se "registra" en ninguna parte: cualquiera que conozca
// d ya ES esa cuenta. Por eso una billetera de PRUEBA se define aquí como una cuya
// clave se deriva de una etiqueta pública: su clave es conocida por construcción y
// por tanto no vale nada. Esa es la única clase de clave que debe tocar un laboratorio.

import { createHash, randomBytes } from "node:crypto";
import { aHex, bytesAEntero } from "./nucleo/bytes.mjs";
import { aChecksum, esDireccionValida, direccionDeClavePrivada } from "./nucleo/direcciones.mjs";
import { N, clavePublica } from "./nucleo/secp256k1.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const DOMINIO = "blockchain-learning-path/le1/billetera-de-prueba/v1:";

/**
 * Deriva una billetera de prueba a partir de una etiqueta pública ("alice", "custodio-hot-1").
 * Misma etiqueta → misma billetera, en cualquier equipo: eso hace reproducibles los
 * resultados esperados de los laboratorios, y a la vez prueba que NO es secreta.
 */
export function crearBilleteraDePrueba(etiqueta) {
  if (typeof etiqueta !== "string" || etiqueta.trim() === "") throw new Error("La etiqueta no puede estar vacía");
  const digest = createHash("sha256").update(DOMINIO + etiqueta).digest();
  // d ∈ [1, n−1]: se reduce módulo (n − 1) y se suma 1 para no caer nunca en 0.
  const clavePrivada = (bytesAEntero(digest) % (N - 1n)) + 1n;
  return {
    etiqueta,
    clavePrivada,
    clavePublica: aHex(clavePublica(clavePrivada)),
    direccion: direccionDeClavePrivada(clavePrivada),
    esDePrueba: true,
    aviso: "Clave derivada de una etiqueta pública: CONOCIDA por cualquiera. No enviar nunca valor real."
  };
}

/** ¿Es esta billetera realmente "de prueba"? Se puede recomputar desde su etiqueta, o no lo es. */
export function verificarEsDePrueba(billetera) {
  try {
    return crearBilleteraDePrueba(billetera.etiqueta).clavePrivada === billetera.clavePrivada;
  } catch {
    return false;
  }
}

/**
 * Billetera aleatoria para contrastar. Su clave sale del generador del sistema operativo
 * y NO se puede recomputar: ese es exactamente el rasgo que una clave real debe tener.
 */
export function crearBilleteraAleatoria() {
  let clavePrivada;
  do {
    clavePrivada = bytesAEntero(randomBytes(32));
  } while (clavePrivada === 0n || clavePrivada >= N);
  return {
    etiqueta: null,
    clavePrivada,
    clavePublica: aHex(clavePublica(clavePrivada)),
    direccion: direccionDeClavePrivada(clavePrivada),
    esDePrueba: false
  };
}

/** Familia de billeteras para un escenario (p. ej. custodio con hot/warm/cold). */
export function crearFamilia(prefijo, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) throw new Error("La cantidad debe estar entre 1 y 50");
  return Array.from({ length: cantidad }, (_, i) => crearBilleteraDePrueba(`${prefijo}-${i + 1}`));
}

/**
 * Una billetera NUNCA debe imprimirse con su clave. Este es el formato seguro para
 * bitácoras y capturas: dirección completa, clave censurada.
 */
export function describirParaBitacora(billetera) {
  return {
    etiqueta: billetera.etiqueta,
    direccion: billetera.direccion,
    clavePrivada: "••••••••",
    esDePrueba: billetera.esDePrueba
  };
}

/**
 * Qué detecta (y qué no) la suma de verificación EIP-55: un solo carácter cambiado
 * invalida la dirección casi siempre, pero una dirección escrita toda en minúsculas
 * no puede comprobarse. Devuelve cuántas de las 40 mutaciones de un carácter se detectan.
 */
export function medirDeteccionDeErrores(direccion) {
  const cuerpo = direccion.slice(2);
  let detectadas = 0;
  let total = 0;
  for (let i = 0; i < cuerpo.length; i += 1) {
    const original = cuerpo[i];
    if (/[0-9]/.test(original)) continue; // un dígito no tiene mayúscula: el cambio relevante es otro
    const mutante = original === original.toLowerCase() ? original.toUpperCase() : original.toLowerCase();
    const alterada = `0x${cuerpo.slice(0, i)}${mutante}${cuerpo.slice(i + 1)}`;
    total += 1;
    if (!esDireccionValida(alterada)) detectadas += 1;
  }
  return { mutaciones: total, detectadas };
}

export { aChecksum, esDireccionValida };

if (ejecutadoDirectamente(import.meta.url)) {
  console.log("LE1 · Billeteras de prueba (claves derivadas de etiquetas públicas)\n");
  for (const billetera of crearFamilia("custodio", 3)) {
    console.log(describirParaBitacora(billetera));
  }
  const alice = crearBilleteraDePrueba("alice");
  console.log("\n¿'alice' es de prueba?", verificarEsDePrueba(alice));
  console.log("¿Una aleatoria es de prueba?", verificarEsDePrueba(crearBilleteraAleatoria()));
  console.log("\nChecksum EIP-55 (mutaciones de mayúscula detectadas):", medirDeteccionDeErrores(alice.direccion));
  console.log("Una dirección no es una persona: es el resumen de una clave pública.");
}
