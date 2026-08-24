// Laboratorio 2: una transacción, dos modelos incompatibles.
//
// Qué enseña: UTXO (Bitcoin) y cuentas (Ethereum/EVM) no son "el mismo dato con
// otro nombre de campo". Son dos formas distintas de representar quién tiene
// qué, y cada una obliga a leer la comisión, el orden y el saldo de una manera
// diferente. Confundirlas produce errores sistemáticos, no anecdóticos: contar
// la salida de cambio como un pago, o leer el campo `valor` de una transacción
// de token (que vale 0) como si fuera el importe transferido.
//
// Por qué importa: casi todo error de un analista que llega de un mundo (por
// ejemplo, cuentas bancarias) al otro (UTXO) viene de asumir que el modelo que
// ya conoce es el único posible.
//
// Límite pedagógico: se describen los dos modelos con la misma forma que usan
// Bitcoin y Ethereum en la práctica, pero sin cubrir SegWit, EIP-1559 con
// tarifa base + prioridad, ni contratos con lógica arbitraria: eso queda para
// módulos posteriores.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { comisionUTXO, aHumano } from "./cadena-sintetica.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Describe una transacción UTXO: entradas, salidas, cuál salida es cambio
 * (heurística: la que vuelve a una dirección que también aparece en una
 * entrada) y la comisión, que NO es un campo del dato sino que se DEDUCE.
 */
export function describirTxUTXO(tx) {
  if (tx.esCoinbase) {
    return {
      txid: tx.txid,
      esCoinbase: true,
      entradas: [],
      salidas: tx.vout.map((v) => ({ direccion: v.direccion, valor: v.valor })),
      comision: 0,
      satPorVByte: 0,
      nota: "La coinbase no gasta UTXO previos: crea la recompensa del bloque. No paga comisión; al " +
        "contrario, recibe además las comisiones de las demás transacciones del bloque."
    };
  }

  const direccionesEntrada = new Set(tx.vin.map((v) => v.direccion));
  const salidas = tx.vout.map((v) => ({
    n: v.n,
    direccion: v.direccion,
    valor: v.valor,
    // Heurística didáctica, no infalible en una cadena real: una salida que
    // vuelve a una dirección que también gastó en esta misma transacción es,
    // con altísima probabilidad, el cambio — pero un usuario podría reutilizar
    // esa dirección como destino legítimo de otra persona. Aquí, con una sola
    // entrada por transacción, la heurística es exacta.
    esProbableCambio: direccionesEntrada.has(v.direccion)
  }));
  const comision = comisionUTXO(tx);

  return {
    txid: tx.txid,
    esCoinbase: false,
    entradas: tx.vin.map((v) => ({ direccion: v.direccion, valorGastado: v.valorGastado })),
    salidas,
    // La comisión se deduce: entradas − salidas. No aparece como campo en el
    // dato crudo, así que un extractor que solo copia campos la pierde.
    comision,
    satPorVByte: tx.tamanoVBytes === 0 ? 0 : Math.round((comision / tx.tamanoVBytes) * 100) / 100,
    nota: "La salida marcada 'esProbableCambio' vuelve al mismo remitente: no es un pago a otra parte. " +
      "Sumarla al 'valor transferido a terceros' sobreestima el movimiento económico real."
  };
}

/**
 * Describe una transacción de cuentas: de/para/valor/nonce/gas/comisión, y el
 * caso que rompe la intuición de quien viene de UTXO: en una transferencia de
 * token, el campo `valor` de la transacción vale 0 porque el activo que se
 * mueve no es la moneda nativa — el importe real vive en el LOG emitido.
 */
export function describirTxCuentas(tx, { logs = [] } = {}) {
  const comision = tx.gasUsado * tx.precioGas;
  const logsDeEstaTx = logs.filter((l) => l.hashTransaccion === tx.hash);

  if (tx.tipo === "token") {
    const log = logsDeEstaTx[0];
    return {
      hash: tx.hash,
      tipo: "token",
      de: tx.de,
      para: tx.para,
      // Confirma explícitamente el punto de confusión: aquí NO está el importe.
      valorCampoNativo: tx.valor,
      importeToken: log ? log.decodificado.valor : null,
      simbolo: log ? log.decodificado.simbolo : null,
      nonce: tx.nonce,
      gasUsado: tx.gasUsado,
      precioGas: tx.precioGas,
      comision,
      estado: tx.estado === 1 ? "correcta" : "revertida",
      nota: "El campo `valor` de la transacción es 0: es una transacción de la moneda nativa que vale cero " +
        "porque solo lleva una LLAMADA al contrato del token. El importe transferido está decodificado en " +
        "`importeToken`, leído del log Transfer, no de la transacción."
    };
  }

  return {
    hash: tx.hash,
    tipo: "nativo",
    de: tx.de,
    para: tx.para,
    valor: tx.valor,
    valorHumano: aHumano(tx.valor, 18),
    nonce: tx.nonce,
    gasUsado: tx.gasUsado,
    precioGas: tx.precioGas,
    // La comisión SÍ es gasUsado × precioGas: a diferencia de UTXO, aquí es un
    // cálculo directo con dos campos presentes en el propio dato, no una resta
    // entre entradas y salidas.
    comision,
    estado: tx.estado === 1 ? "correcta" : "revertida",
    nota: "El nonce de `de` identifica el ORDEN de sus transacciones: un nonce repetido o saltado es " +
      "inválido. No cumple ningún papel de identidad, es una cuenta de secuencia por remitente."
  };
}

/**
 * Tabla de diferencias entre los dos modelos, pensada como referencia para el
 * analista que llega de uno y necesita razonar sobre el otro.
 */
export function compararModelos() {
  return [
    {
      aspecto: "Dónde vive el saldo",
      utxo: "No existe 'saldo de una dirección' como dato almacenado: es la suma de las salidas no gastadas " +
        "(UTXO) que esa dirección puede firmar.",
      cuentas: "Cada cuenta tiene un saldo explícito que las transacciones incrementan o decrementan."
    },
    {
      aspecto: "Qué identifica el orden",
      utxo: "Cada transacción declara qué UTXO concreto gasta (txid:índice). No hay 'secuencia por " +
        "dirección': dos transacciones pueden gastar UTXO distintos del mismo dueño sin relación de orden.",
      cuentas: "El nonce de la cuenta emisora fija un orden estricto: la transacción con nonce 5 no es " +
        "válida hasta que se confirmó la de nonce 4."
    },
    {
      aspecto: "Cómo se calcula la comisión",
      utxo: "Se DEDUCE: suma de entradas − suma de salidas. No es un campo explícito del dato crudo.",
      cuentas: "Es un cálculo directo con dos campos presentes: gasUsado × precioGas."
    },
    {
      aspecto: "Qué revela cada modelo al analista",
      utxo: "El grafo de gasto (qué salida financió cuál) es explícito y siempre trazable transacción a " +
        "transacción.",
      cuentas: "El saldo de cualquier cuenta en cualquier bloque es una consulta directa al estado, sin " +
        "reconstruir un grafo de gasto — pero solo con las transacciones no se ve el importe en tokens: " +
        "hace falta leer los logs."
    },
    {
      aspecto: "Reutilización de direcciones",
      utxo: "Reutilizar la misma dirección para recibir varios pagos facilita enlazar todos esos pagos con " +
        "un único dueño: es un problema de privacidad conocido del modelo.",
      cuentas: "Una cuenta es, por diseño, reutilizable indefinidamente: no hay una 'buena práctica' " +
        "equivalente de rotar de dirección en cada operación."
    },
    {
      aspecto: "La salida de cambio",
      utxo: "Existe como concepto explícito: gastar un UTXO obliga a devolver el sobrante como una nueva " +
        "salida al mismo dueño, y confundirla con un pago es el error de lectura más común del modelo.",
      cuentas: "No existe el concepto: una transacción resta exactamente el valor indicado del saldo, sin " +
        "sobrante que devolver."
    }
  ];
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { cadenaUTXO, cadenaCuentas, logsDe, transaccionesDe } = await import("./cadena-sintetica.mjs");
  const utxo = cadenaUTXO({ bloques: 15 });
  const { bloques: cuentas } = cadenaCuentas({ bloques: 30 });
  const logs = logsDe(cuentas);
  const txs = transaccionesDe(cuentas);

  const txUtxoNormal = utxo.flatMap((b) => b.transacciones).find((tx) => !tx.esCoinbase);
  const txCuentaNativa = txs.find((tx) => tx.tipo === "nativo");
  const txCuentaToken = txs.find((tx) => tx.tipo === "token");

  console.log("=== Transacción UTXO (no coinbase) ===\n");
  console.log(describirTxUTXO(txUtxoNormal));

  console.log("\n=== Transacción de cuentas: activo nativo ===\n");
  console.log(describirTxCuentas(txCuentaNativa, { logs }));

  console.log("\n=== Transacción de cuentas: transferencia de token (el campo valor es 0) ===\n");
  console.log(describirTxCuentas(txCuentaToken, { logs }));

  console.log("\n=== UTXO vs cuentas: tabla de diferencias ===\n");
  console.table(compararModelos());

  console.log(
    "\nCriterio de aceptación: describirTxUTXO deduce la comisión de entradas − salidas y marca la salida " +
      "de cambio; describirTxCuentas expone que valorCampoNativo es 0 en una transacción de token y que el " +
      "importe real vive en importeToken; compararModelos documenta las diferencias entre ambos modelos."
  );
}
