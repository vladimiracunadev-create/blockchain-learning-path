// Normalización y almacenamiento: el primer paso de CUALQUIER pipeline de
// analítica on-chain, y el que más silenciosamente se hace mal.
//
// Una cadena expone sus datos en la forma que le conviene a la CADENA, no a
// quien analiza: importes en unidades mínimas, marcas de tiempo Unix, campos
// que cambian de un cliente RPC a otro. "Normalizar" es traducir eso a un
// registro plano, tipado y estable que el resto de laboratorios pueda
// consultar sin volver a mirar el formato de origen.
//
// El problema que este laboratorio ataca de frente es la IDEMPOTENCIA: un
// indexador real relee bloques por reintentos de red, por reorganizaciones de
// cadena (el bloque que creías final se sustituye por otro) o porque el
// proceso se reinicia a mitad de una importación. Si insertar el mismo hash
// dos veces duplica el registro, cada uno de esos eventos normales corrompe
// las métricas aguas abajo (el laboratorio 5 contaría el doble de volumen).
// La defensa es tratar el hash de la transacción como CLAVE PRIMARIA: la
// segunda inserción con el mismo hash no es un error, es un no-op.
//
// SQL / NoSQL / grafos — por qué aquí se modela como tablas:
//   - Un modelo RELACIONAL (SQL) encaja bien porque cada transacción es un
//     hecho con forma fija y las consultas típicas ("todas las tx de esta
//     dirección", "todas las de este rango de bloques") son filtros sobre
//     columnas: eso es exactamente un índice secundario en una tabla.
//   - Un modelo de DOCUMENTOS (NoSQL) encajaría mejor si cada transacción
//     tuviera estructura variable (distintos tipos de evento con campos
//     distintos) o si no hiciera falta hacer JOIN entre entidades.
//   - Un modelo de GRAFO encaja cuando la pregunta central es sobre RELACIONES
//     entre direcciones (caminos, comunidades, distancia entre dos nodos) más
//     que sobre agregados por columna; el laboratorio de flujos de fondos usa
//     esa forma. Aquí, con consultas por dirección y por rango de bloques, un
//     almacén tabular en memoria (Map de mapas) representa bien la idea sin
//     arrastrar una base de datos real, que sería ruido para el objetivo
//     pedagógico.
//
// Límite pedagógico: este "almacén" vive en memoria y se pierde al terminar
// el proceso. Un indexador real persiste en disco y necesita transacciones
// para que la idempotencia sobreviva a un cierre a mitad de escritura; eso
// queda fuera del alcance de este laboratorio.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { diaDe, transaccionesDe } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const ESTADOS_CONOCIDOS = new Set([0, 1]);
// Direcciones de cuenta EVM: 0x + 40 hex. No validamos checksum (mayúsculas
// mezcladas) porque la cadena sintética no lo usa; en producción sí importa.
const RE_DIRECCION = /^0x[0-9a-fA-F]{40}$/;
// El hash de una transacción de la cadena sintética se genera con `hashDe`,
// que produce el prefijo + 40 caracteres hexadecimales (no 64, a diferencia
// de un hash SHA-256 completo): ver `cadena-sintetica.mjs`.
const RE_HASH = /^0x[0-9a-fA-F]{40}$/;

/**
 * Convierte una transacción cruda de `cadena-sintetica.mjs` en un registro
 * plano y tipado. Los importes se guardan como STRING (no Number): un
 * importe con muchos dígitos puede superar `Number.MAX_SAFE_INTEGER` y
 * perder precisión en silencio, que es exactamente el tipo de error que no
 * se nota hasta que el balance final no cuadra.
 */
export function normalizarTransaccion(tx) {
  const marcaTiempoISO = new Date(tx.marcaTiempo * 1000).toISOString();
  return {
    hash: tx.hash,
    numeroBloque: tx.numeroBloque,
    indiceEnBloque: tx.indiceEnBloque,
    marcaTiempo: tx.marcaTiempo,
    marcaTiempoISO,
    dia: diaDe(tx.marcaTiempo),
    de: tx.de,
    para: tx.para,
    // String: preserva precisión exacta y evita que un consumidor sume
    // importes de tipos distintos (nativo vs. token) como si fueran lo mismo.
    valor: String(tx.valor),
    nonce: tx.nonce,
    gasUsado: tx.gasUsado,
    precioGas: tx.precioGas,
    comision: String(tx.comision),
    estado: tx.estado,
    tipo: tx.tipo
  };
}

/**
 * Lista de problemas encontrados en un registro ya normalizado. Devuelve un
 * array vacío si el registro es válido: no lanza, porque en un ETL real se
 * quiere seguir cargando el resto del lote y solo apartar lo inválido.
 */
export function validarRegistro(reg) {
  const problemas = [];
  if (reg == null || typeof reg !== "object") return ["registro nulo o no es un objeto"];

  for (const campo of ["hash", "de", "para", "valor", "comision", "dia"]) {
    if (reg[campo] == null || reg[campo] === "") problemas.push(`falta el campo "${campo}"`);
  }
  if (reg.hash != null && !RE_HASH.test(reg.hash)) problemas.push("hash con formato inválido");
  if (reg.de != null && !RE_DIRECCION.test(reg.de)) problemas.push("dirección «de» con formato inválido");
  if (reg.para != null && !RE_DIRECCION.test(reg.para)) problemas.push("dirección «para» con formato inválido");
  // Los importes viajan como string: se valida con BigInt, no con Number,
  // para no reintroducir el mismo problema de precisión que evitamos al
  // normalizar.
  if (reg.valor != null && !esEnteroNoNegativo(reg.valor)) problemas.push("valor negativo o no numérico");
  if (reg.comision != null && !esEnteroNoNegativo(reg.comision)) problemas.push("comisión negativa o no numérica");
  if (reg.estado != null && !ESTADOS_CONOCIDOS.has(reg.estado)) problemas.push(`estado desconocido: ${reg.estado}`);

  return problemas;
}

function esEnteroNoNegativo(texto) {
  try {
    return BigInt(texto) >= 0n;
  } catch {
    return false;
  }
}

/**
 * Almacén tabular en memoria con dos índices secundarios (por dirección y
 * por bloque) además de la clave primaria (hash). Modela lo mínimo que
 * necesita un ETL de bloques para ser consultable sin recorrer todo el
 * histórico en cada pregunta.
 */
export function crearAlmacen() {
  const porHash = new Map(); // clave primaria
  const porDireccion = new Map(); // dirección → Set de hashes (de + para)
  const porBloque = new Map(); // numeroBloque → Set de hashes

  const indexar = (indice, clave, hash) => {
    if (!indice.has(clave)) indice.set(clave, new Set());
    indice.get(clave).add(hash);
  };

  return {
    /**
     * Inserta un registro. Devuelve `true` si es una inserción nueva y
     * `false` si el hash ya existía: ESE es el contrato que hace el almacén
     * idempotente. Un reintento o una reentrega no duplica nada.
     */
    insertar(reg) {
      if (porHash.has(reg.hash)) return false;
      porHash.set(reg.hash, reg);
      indexar(porDireccion, reg.de, reg.hash);
      indexar(porDireccion, reg.para, reg.hash);
      indexar(porBloque, reg.numeroBloque, reg.hash);
      return true;
    },
    consultarPorDireccion(direccion) {
      const hashes = porDireccion.get(direccion);
      if (!hashes) return [];
      return [...hashes].map((h) => porHash.get(h));
    },
    consultarPorRangoBloques(desde, hasta) {
      const resultado = [];
      for (const [numero, hashes] of porBloque) {
        if (numero < desde || numero > hasta) continue;
        for (const h of hashes) resultado.push(porHash.get(h));
      }
      return resultado.sort((a, b) => a.numeroBloque - b.numeroBloque || a.indiceEnBloque - b.indiceEnBloque);
    },
    contar() {
      return porHash.size;
    }
  };
}

/**
 * Pipeline completo: normaliza cada transacción de la cadena, la valida y la
 * inserta si es válida. Devuelve un resumen que distingue tres destinos
 * posibles del dato — insertado, descartado por duplicado, descartado por
 * inválido — porque confundirlos oculta problemas distintos: un pico de
 * duplicados señala reintentos o reorgs; un pico de inválidos señala un
 * cambio de formato en el origen.
 */
export function cargarCadena(bloques, almacen = crearAlmacen()) {
  let insertados = 0;
  let duplicadosDescartados = 0;
  let invalidos = 0;

  for (const tx of transaccionesDe(bloques)) {
    const reg = normalizarTransaccion(tx);
    const problemas = validarRegistro(reg);
    if (problemas.length > 0) {
      invalidos++;
      continue;
    }
    const esNuevo = almacen.insertar(reg);
    if (esNuevo) insertados++;
    else duplicadosDescartados++;
  }

  return { insertados, duplicadosDescartados, invalidos, almacen };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaCuentas } = await import("./cadena-sintetica.mjs");
  const { bloques } = cadenaCuentas({});

  console.log("=== Carga inicial ===\n");
  const primeraCarga = cargarCadena(bloques);
  console.log(`insertados: ${primeraCarga.insertados}`);
  console.log(`duplicados descartados: ${primeraCarga.duplicadosDescartados}`);
  console.log(`inválidos: ${primeraCarga.invalidos}`);
  console.log(`total en el almacén: ${primeraCarga.almacen.contar()}`);

  console.log("\n=== Reintento del mismo lote (simula un reintento de red) ===\n");
  const segundaCarga = cargarCadena(bloques, primeraCarga.almacen);
  console.log(`insertados: ${segundaCarga.insertados} (debe ser 0)`);
  console.log(`duplicados descartados: ${segundaCarga.duplicadosDescartados} (debe igualar el total)`);
  console.log(`total en el almacén tras el reintento: ${segundaCarga.almacen.contar()} (no debe crecer)`);

  const totalAntes = primeraCarga.almacen.contar();
  const totalDespues = segundaCarga.almacen.contar();
  const idempotente = totalAntes === totalDespues && segundaCarga.insertados === 0;
  console.log(
    `\nCriterio de aceptación: ${idempotente ? "OK" : "FALLO"} — recargar el mismo lote no cambió el tamaño del almacén (${totalAntes} → ${totalDespues}).`
  );
}
