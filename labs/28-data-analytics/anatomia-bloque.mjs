// Laboratorio 1: anatomía de un bloque.
//
// Qué enseña: un bloque no es una "caja de transacciones" sin más. Cada campo
// cumple un papel concreto y tiene un límite de interpretación propio — la
// marca de tiempo la declara quien mina/propone (no es un reloj fiable), las
// confirmaciones son una probabilidad creciente de irreversibilidad (nunca una
// certeza), y el encadenamiento (hashPrevio) es lo único que hace que "cadena"
// no sea una metáfora. Un analista que trata estos campos como si fueran datos
// neutros y exactos saca conclusiones que el propio dato no sostiene.
//
// Por qué importa: casi todo pipeline de analítica on-chain empieza leyendo
// bloques crudos. Si el primer paso malinterpreta un campo, el error se
// arrastra a cada tabla derivada.
//
// Límite pedagógico: esto describe la FORMA de un bloque simulado con la
// misma forma que uno real, no la implementación de una blockchain real (no
// hay validación de prueba de trabajo/participación, ni verificación de firmas).
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { comisionUTXO } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Explica cada campo de un bloque UTXO (estilo Bitcoin).
 * Devuelve una lista de `{campo, valor, significa}`: el "significa" es la
 * parte pedagógica, no derivable solo con mirar el valor.
 */
export function anatomiaBloqueUTXO(bloque) {
  return [
    {
      campo: "altura",
      valor: bloque.altura,
      significa: "Posición del bloque en la cadena, contando desde el génesis (0). No es un identificador " +
        "único global fiable durante una reorganización: dos cadenas competidoras pueden tener, cada una, " +
        "un bloque distinto en la misma altura."
    },
    {
      campo: "hash",
      valor: bloque.hash,
      significa: "Huella del CONTENIDO de este bloque. Cambiar una sola transacción cambiaría este hash: " +
        "es la propiedad que hace detectable cualquier alteración retroactiva."
    },
    {
      campo: "hashPrevio",
      valor: bloque.hashPrevio,
      significa: "Hash del bloque anterior. Es el encadenamiento real: 'cadena de bloques' no es una carpeta " +
        "numerada, es cada bloque apuntando criptográficamente al que lo precede. Si este campo no coincide " +
        "con el hash del bloque que se creía anterior, no son la misma cadena."
    },
    {
      campo: "marcaTiempo",
      valor: bloque.marcaTiempo,
      significa: "Momento que DECLARA quien minó el bloque, no un reloj auditado por un tercero. Se acepta " +
        "dentro de un margen de tolerancia de la red; un analista que la trate como verdad absoluta (por " +
        "ejemplo para ordenar eventos al segundo exacto entre cadenas distintas) puede equivocarse."
    },
    {
      campo: "confirmaciones",
      valor: bloque.confirmaciones,
      significa: "Cuántos bloques se han apilado encima. Más confirmaciones dan más PROBABILIDAD de que el " +
        "bloque no sea revertido, nunca una garantía matemática de finalidad. Tratar 'confirmado' como " +
        "sinónimo de 'irreversible' es el error más común de quien procesa pagos on-chain."
    },
    {
      campo: "numeroDeTransacciones",
      valor: bloque.transacciones.length,
      significa: "Incluye la transacción coinbase (la que crea la recompensa del minero), que no tiene " +
        "entradas reales. Contar transacciones sin excluirla infla en uno el tráfico 'de usuarios'."
    },
    {
      campo: "tamanoTotalVBytes",
      valor: bloque.transacciones.reduce((suma, tx) => suma + tx.tamanoVBytes, 0),
      significa: "Peso en bytes virtuales de todas las transacciones. Es lo que limita cuántas transacciones " +
        "caben en un bloque y, junto con la demanda, determina la comisión de mercado — no el número de " +
        "transacciones por sí solo."
    }
  ];
}

/**
 * Explica cada campo de un bloque de cuentas (estilo Ethereum/EVM).
 */
export function anatomiaBloqueCuentas(bloque) {
  return [
    {
      campo: "numero",
      valor: bloque.numero,
      significa: "Equivalente a la 'altura' en UTXO: posición del bloque en la cadena. Igual que allí, no es " +
        "un identificador fiable durante una reorganización."
    },
    {
      campo: "hash",
      valor: bloque.hash,
      significa: "Huella del contenido del bloque (transacciones, logs, cabecera). Cambia si cambia cualquier " +
        "elemento incluido."
    },
    {
      campo: "hashPrevio",
      valor: bloque.hashPrevio,
      significa: "El encadenamiento con el bloque anterior — igual papel que en UTXO. Es lo primero que hay " +
        "que comparar para saber si un bloque ya leído sigue perteneciendo a la cadena vigente."
    },
    {
      campo: "marcaTiempo",
      valor: bloque.marcaTiempo,
      significa: "La declara quien propone el bloque. Igual que en UTXO: útil para ordenar y para agrupar por " +
        "día, no fiable como reloj de precisión absoluta ni como prueba legal de un instante exacto."
    },
    {
      campo: "gasUsado",
      valor: bloque.gasUsado,
      significa: "Suma del gas realmente consumido por todas las transacciones del bloque. Mide trabajo " +
        "computacional consumido, no dinero: el coste en la moneda nativa es gasUsado × precioGas de cada " +
        "transacción, y cada transacción puede haber pagado un precio de gas distinto."
    },
    {
      campo: "limiteGas",
      valor: bloque.limiteGas,
      significa: "Tope de gas que el bloque puede consumir. gasUsado / limiteGas es la 'ocupación' del " +
        "bloque: cerca del límite indica congestión de la red en ese momento, no volumen de dinero movido."
    },
    {
      campo: "numeroDeTransacciones",
      valor: bloque.transacciones.length,
      significa: "A diferencia de UTXO, aquí no hay coinbase que descontar: todas las transacciones del " +
        "bloque son transacciones de cuenta a cuenta (o llamadas a contrato)."
    },
    {
      campo: "numeroDeLogs",
      valor: bloque.logs.length,
      significa: "Eventos emitidos por contratos (por ejemplo, transferencias de token). Un bloque puede " +
        "tener más logs que transacciones si una sola transacción emite varios eventos; aquí, con una " +
        "transferencia de token por transacción, la relación es más directa."
    }
  ];
}

/**
 * Métricas derivadas de un bloque UTXO: lo que un analista normalmente quiere
 * saber y que NO es un campo directo del bloque, sino que hay que calcularlo.
 */
export function resumenBloqueUTXO(bloque) {
  const normales = bloque.transacciones.filter((tx) => !tx.esCoinbase);
  const comisionTotal = normales.reduce((suma, tx) => suma + comisionUTXO(tx), 0);
  // "Valor movido" cuenta TODAS las salidas, incluida la de cambio: el cambio
  // vuelve al mismo dueño, así que esta cifra sobreestima el dinero que
  // realmente cambió de manos económicas. Se declara así a propósito: es el
  // ejemplo que usa el laboratorio 2 para enseñar a corregirlo.
  const valorMovidoBruto = normales.reduce(
    (suma, tx) => suma + tx.vout.reduce((s, v) => s + v.valor, 0),
    0
  );
  return {
    altura: bloque.altura,
    transaccionesNoCoinbase: normales.length,
    comisionTotal,
    valorMovidoBruto,
    comisionPromedioPorVByte:
      normales.length === 0 ? 0 : comisionTotal / normales.reduce((s, tx) => s + tx.tamanoVBytes, 0)
  };
}

/**
 * Métricas derivadas de un bloque de cuentas.
 */
export function resumenBloqueCuentas(bloque) {
  const comisionTotal = bloque.transacciones.reduce((suma, tx) => suma + tx.comision, 0);
  const ocupacion = bloque.gasUsado / bloque.limiteGas;
  return {
    numero: bloque.numero,
    transacciones: bloque.transacciones.length,
    comisionTotal,
    ocupacionGas: Math.round(ocupacion * 10000) / 10000
  };
}

/**
 * Lo que un bloque NO contiene, y que el material didáctico repite porque es
 * la fuente número uno de sobre-interpretación en analítica on-chain.
 */
export const CAMPOS_AUSENTES_EN_UN_BLOQUE = [
  "La identidad real de quien controla una dirección (una dirección no es una persona).",
  "El motivo o la intención de un pago (un bloque registra QUÉ se movió, no POR QUÉ).",
  "Si una transacción es lícita o no: eso es una inferencia externa, nunca un campo del bloque.",
  "Relaciones entre direcciones que no aparecen en una transacción conjunta (dos direcciones del mismo " +
    "dueño que nunca interactúan entre sí son indistinguibles con solo este dato)."
];

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaUTXO, cadenaCuentas } = await import("./cadena-sintetica.mjs");
  const utxo = cadenaUTXO({ bloques: 5 });
  const { bloques: cuentas } = cadenaCuentas({ bloques: 5 });

  console.log("=== Anatomía de un bloque UTXO (altura 1) ===\n");
  console.table(anatomiaBloqueUTXO(utxo[1]).map(({ campo, valor, significa }) => ({
    campo,
    valor: typeof valor === "string" && valor.length > 24 ? `${valor.slice(0, 24)}…` : valor,
    significa: significa.length > 90 ? `${significa.slice(0, 90)}…` : significa
  })));

  console.log("\n=== Anatomía de un bloque de cuentas (número 1) ===\n");
  console.table(anatomiaBloqueCuentas(cuentas[1]).map(({ campo, valor, significa }) => ({
    campo,
    valor,
    significa: significa.length > 90 ? `${significa.slice(0, 90)}…` : significa
  })));

  console.log("\n=== Resúmenes derivados (no son campos del bloque, se calculan) ===\n");
  console.table(utxo.slice(0, 3).map(resumenBloqueUTXO));
  console.table(cuentas.slice(0, 3).map(resumenBloqueCuentas));

  console.log("\n=== Lo que un bloque NUNCA contiene ===\n");
  for (const campo of CAMPOS_AUSENTES_EN_UN_BLOQUE) console.log(`- ${campo}`);

  console.log(
    "\nCriterio de aceptación: anatomiaBloqueUTXO y anatomiaBloqueCuentas describen todos los campos " +
      "estructurales de su bloque, y resumenBloqueUTXO/resumenBloqueCuentas calculan comisión total y " +
      "ocupación sin que esos valores existan como campo directo del bloque."
  );
}
