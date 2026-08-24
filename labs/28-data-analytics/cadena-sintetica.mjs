// Cadena sintética determinista: la materia prima de TODOS los laboratorios del
// módulo 28 (Blockchain Data Analytics y minería de datos on-chain).
//
// Por qué sintética y no una cadena real:
//
//   1. **Reproducibilidad.** Un laboratorio que consulta una cadena pública da un
//      resultado distinto cada semana; el alumno no puede saber si su código está
//      mal o si el dato cambió. Aquí la misma semilla produce siempre los mismos
//      bloques, así que el criterio de aceptación es comprobable.
//   2. **Sin red y sin claves.** No hay peticiones a internet, no hay API keys, no
//      hay fondos, no hay datos personales. Nada de lo que se analiza aquí
//      corresponde a una persona real.
//   3. **Verdad de campo.** En una cadena real NO SE SABE qué transacción es
//      realmente anómala, así que no se puede medir precisión ni recall. Aquí sí:
//      el generador PLANTA los patrones y los declara en `verdadDeCampo`, que es
//      lo que permite evaluar honestamente un detector (laboratorio 10).
//
// ⚠️ Límite pedagógico que hay que repetir en clase: una cadena sintética valida
// el CÓDIGO y el MÉTODO, no las conclusiones sobre el mundo real. Los umbrales
// que aquí funcionan no se trasladan tal cual a datos reales.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { createHash } from "node:crypto";

// --- Generador pseudoaleatorio determinista -----------------------------------
// `Math.random()` haría irreproducible el dataset (y el repositorio prohíbe la
// aleatoriedad no sembrada en material que se verifica en CI). mulberry32 es un
// PRNG de 32 bits, corto y suficiente para datos de práctica: NO es apto para
// criptografía, y esa distinción se enseña en el módulo 01.
export function prng(semilla) {
  let estado = semilla >>> 0;
  return function siguiente() {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const entero = (aleatorio, minimo, maximo) => minimo + Math.floor(aleatorio() * (maximo - minimo + 1));
const eleccion = (aleatorio, lista) => lista[entero(aleatorio, 0, lista.length - 1)];

// Hash determinista del contenido: el mismo papel que cumple en una cadena real
// (identificar un contenido exacto), calculado sobre la representación canónica.
export const hashDe = (prefijo, contenido) =>
  prefijo + createHash("sha256").update(JSON.stringify(contenido)).digest("hex").slice(0, 40);

// --- Parámetros del universo sintético ----------------------------------------
export const SEMILLA_POR_DEFECTO = 28_2026;
// Momento de inicio fijo (2026-01-05T00:00:00Z en segundos). No se usa la hora
// real del sistema: haría que el dataset cambiara en cada ejecución.
export const INICIO_SEGUNDOS = 1_767_571_200;
export const SEGUNDOS_POR_BLOQUE_UTXO = 600; // 10 minutos, al estilo de Bitcoin
export const SEGUNDOS_POR_BLOQUE_CUENTAS = 12; // 12 segundos, al estilo de Ethereum
export const DECIMALES_TOKEN = 6; // el token sintético «EDUSD» usa 6 decimales
export const SIMBOLO_TOKEN = "EDUSD";
// Firma del evento Transfer(address,address,uint256) de un token fungible: es el
// topic0 REAL del estándar ERC-20, útil para que el alumno lo reconozca luego.
export const TOPIC_TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Direcciones ficticias con papel narrativo. No corresponden a ninguna entidad
// real: son etiquetas de un caso de estudio inventado.
const direccionUTXO = (n) => `bcrt1qedu${String(n).padStart(6, "0")}`;
const direccionCuenta = (n) => `0x${String(n).padStart(4, "0")}${"ed11".repeat(9)}`;

export const ROLES = {
  // "Servicio" = una entidad que agrupa fondos de muchos usuarios (un exchange
  // educativo). Que una dirección concentre entradas NO prueba que sea un
  // servicio: es una HIPÓTESIS que en este dataset resulta ser cierta porque la
  // plantamos nosotros.
  servicio: direccionCuenta(9001),
  coleccion: direccionCuenta(9002), // destino del patrón fan-in
  distribuidor: direccionCuenta(9003), // origen del patrón fan-out
  contratoToken: direccionCuenta(7777), // el "contrato" del token EDUSD
  puente: direccionCuenta(9004) // punto de salida hacia otra cadena (conceptual)
};

// =============================================================================
// 1. Cadena estilo UTXO (Bitcoin)
// =============================================================================

/**
 * Genera una cadena con modelo UTXO: cada transacción GASTA salidas anteriores
 * (entradas) y CREA salidas nuevas. No existe el concepto de "saldo de una
 * cuenta": el saldo es la suma de las salidas no gastadas que uno puede gastar.
 *
 * La comisión no aparece como campo: se DEDUCE (suma de entradas − suma de
 * salidas). Descubrir eso es el objetivo del laboratorio 1.
 */
export function cadenaUTXO({ semilla = SEMILLA_POR_DEFECTO, bloques = 30 } = {}) {
  const aleatorio = prng(semilla);
  const direcciones = Array.from({ length: 24 }, (_, i) => direccionUTXO(i + 1));
  // Conjunto de salidas gastables: `${txid}:${indice}` → { valor, direccion }
  const utxos = new Map();
  const cadena = [];
  let hashPrevio = hashDe("0000", "genesis");

  for (let altura = 0; altura < bloques; altura++) {
    const marcaTiempo = INICIO_SEGUNDOS + altura * SEGUNDOS_POR_BLOQUE_UTXO;
    const transacciones = [];

    // Transacción coinbase: no tiene entradas reales (crea la recompensa). Es la
    // única fuente de monedas nuevas y la razón por la que su "comisión" no se
    // calcula igual que la del resto.
    const recompensa = 5_000_000_000; // en unidades mínimas (satoshis sintéticos)
    const destinoCoinbase = eleccion(aleatorio, direcciones);
    const coinbase = {
      txid: hashDe("cb", { altura, destinoCoinbase }),
      esCoinbase: true,
      vin: [{ coinbase: `altura:${altura}` }],
      vout: [{ n: 0, valor: recompensa, direccion: destinoCoinbase }],
      tamanoVBytes: 110
    };
    transacciones.push(coinbase);
    utxos.set(`${coinbase.txid}:0`, { valor: recompensa, direccion: destinoCoinbase });

    // Transacciones normales: gastan UTXO disponibles y generan cambio.
    const cuantas = entero(aleatorio, 1, 4);
    for (let i = 0; i < cuantas && utxos.size > 2; i++) {
      const disponibles = [...utxos.entries()];
      const [referencia, entrada] = disponibles[entero(aleatorio, 0, disponibles.length - 1)];
      const [txidPrevio, indicePrevio] = referencia.split(":");
      // Se gasta la salida entera: en UTXO no se puede gastar "un trozo".
      const destino = eleccion(aleatorio, direcciones.filter((d) => d !== entrada.direccion));
      const tamanoVBytes = entero(aleatorio, 140, 260);
      const comision = tamanoVBytes * entero(aleatorio, 1, 25); // sat/vB sintéticos
      const enviado = Math.floor(entrada.valor * (0.2 + aleatorio() * 0.6));
      const cambio = entrada.valor - enviado - comision;
      if (cambio <= 0) continue; // la entrada no alcanza: se descarta el intento

      const tx = {
        txid: hashDe("tx", { altura, i, referencia }),
        esCoinbase: false,
        vin: [{ txid: txidPrevio, vout: Number(indicePrevio), valorGastado: entrada.valor, direccion: entrada.direccion }],
        vout: [
          { n: 0, valor: enviado, direccion: destino },
          // La salida de cambio VUELVE al remitente. Confundir el cambio con un
          // pago es el error de lectura más común al analizar una cadena UTXO.
          { n: 1, valor: cambio, direccion: entrada.direccion }
        ],
        tamanoVBytes
      };
      utxos.delete(referencia);
      utxos.set(`${tx.txid}:0`, { valor: enviado, direccion: destino });
      utxos.set(`${tx.txid}:1`, { valor: cambio, direccion: entrada.direccion });
      transacciones.push(tx);
    }

    const bloque = {
      altura,
      hashPrevio,
      marcaTiempo,
      // Cuántos bloques se han apilado encima (se calcula al final).
      confirmaciones: 0,
      transacciones
    };
    bloque.hash = hashDe("00", { altura, hashPrevio, marcaTiempo, txids: transacciones.map((t) => t.txid) });
    hashPrevio = bloque.hash;
    cadena.push(bloque);
  }

  const punta = cadena.at(-1).altura;
  for (const bloque of cadena) bloque.confirmaciones = punta - bloque.altura + 1;
  return cadena;
}

/** Comisión de una transacción UTXO: entradas − salidas. La coinbase no paga. */
export function comisionUTXO(tx) {
  if (tx.esCoinbase) return 0;
  const entradas = tx.vin.reduce((suma, v) => suma + (v.valorGastado ?? 0), 0);
  const salidas = tx.vout.reduce((suma, v) => suma + v.valor, 0);
  return entradas - salidas;
}

// =============================================================================
// 2. Cadena estilo cuentas (Ethereum / EVM)
// =============================================================================

/**
 * Genera una cadena con modelo de cuentas: cada cuenta tiene SALDO y NONCE, y una
 * transacción resta de un saldo y suma a otro. Además hay transacciones que
 * llaman a un contrato y emiten EVENTOS (logs) — la fuente de datos que sostiene
 * la mayor parte de la analítica de tokens.
 *
 * Patrones plantados a propósito (ver `verdadDeCampo`):
 *   · fan-in     — 9 direcciones distintas envían a una misma dirección colectora.
 *   · fan-out    — una dirección reparte a 8 destinos en pocos bloques.
 *   · peel chain — una cadena de "pelado": pagos pequeños con el resto avanzando.
 *   · anomalías  — transferencias de importe atípico y gas atípico.
 */
export function cadenaCuentas({ semilla = SEMILLA_POR_DEFECTO, bloques = 60 } = {}) {
  const aleatorio = prng(semilla + 1);
  const usuarios = Array.from({ length: 30 }, (_, i) => direccionCuenta(i + 1));
  const cadena = [];
  const anomalas = new Set();
  const fanIn = { destino: ROLES.coleccion, origenes: [], hashes: [] };
  const fanOut = { origen: ROLES.distribuidor, destinos: [], hashes: [] };
  const peelChain = { hashes: [], direcciones: [] };
  let hashPrevio = hashDe("0x0000", "genesis-cuentas");
  const nonces = new Map();
  const siguienteNonce = (direccion) => {
    const n = nonces.get(direccion) ?? 0;
    nonces.set(direccion, n + 1);
    return n;
  };

  // Estado del "peel chain": el resto que va saltando de dirección en dirección.
  let restoPeel = 40_000 * 10 ** DECIMALES_TOKEN;
  let direccionPeel = direccionCuenta(120);
  peelChain.direcciones.push(direccionPeel);

  for (let numero = 0; numero < bloques; numero++) {
    const marcaTiempo = INICIO_SEGUNDOS + numero * SEGUNDOS_POR_BLOQUE_CUENTAS;
    const transacciones = [];
    const logs = [];

    const anadirTx = ({ de, para, valor, gasUsado, precioGas, tipo, tokenValor }) => {
      const indice = transacciones.length;
      const hash = hashDe("0x", { numero, indice, de, para, valor, tipo });
      const tx = {
        hash,
        numeroBloque: numero,
        indiceEnBloque: indice,
        marcaTiempo,
        de,
        para,
        // Valor del activo NATIVO en unidades mínimas (wei sintéticos).
        valor: tipo === "token" ? 0 : valor,
        nonce: siguienteNonce(de),
        gasUsado,
        precioGas,
        // La comisión efectiva es gasUsado × precioGas: por eso "gas" y "comisión"
        // no son sinónimos, y confundirlos es un error frecuente del módulo 05.
        comision: gasUsado * precioGas,
        estado: 1,
        tipo,
        entrada: tipo === "token" ? "0xa9059cbb" : "0x" // selector de transfer(address,uint256)
      };
      transacciones.push(tx);
      if (tipo === "token") {
        // Evento Transfer del token: la analítica de tokens NO lee el campo
        // `valor` de la transacción (que es 0), lee este log.
        logs.push({
          hashTransaccion: hash,
          numeroBloque: numero,
          indiceLog: logs.length,
          direccion: ROLES.contratoToken,
          topics: [TOPIC_TRANSFER, `0x${de.slice(2).padStart(64, "0")}`, `0x${para.slice(2).padStart(64, "0")}`],
          datos: `0x${BigInt(tokenValor).toString(16).padStart(64, "0")}`,
          // Campos ya decodificados: los laboratorios 6 y 7 hacen la decodificación
          // a mano y comprueban su resultado contra estos.
          decodificado: { de, para, valor: tokenValor, simbolo: SIMBOLO_TOKEN, decimales: DECIMALES_TOKEN }
        });
      }
      return tx;
    };

    // (a) Tráfico de fondo: transferencias corrientes entre usuarios.
    const cuantas = entero(aleatorio, 1, 5);
    for (let i = 0; i < cuantas; i++) {
      const de = eleccion(aleatorio, usuarios);
      const para = eleccion(aleatorio, [...usuarios.filter((u) => u !== de), ROLES.servicio]);
      const esToken = aleatorio() < 0.45;
      anadirTx({
        de,
        para,
        valor: entero(aleatorio, 1, 900) * 10 ** 15,
        tokenValor: entero(aleatorio, 5, 4_000) * 10 ** DECIMALES_TOKEN,
        gasUsado: esToken ? entero(aleatorio, 45_000, 65_000) : 21_000,
        precioGas: entero(aleatorio, 8, 40) * 10 ** 9,
        tipo: esToken ? "token" : "nativo"
      });
    }

    // (b) Fan-in plantado: entre los bloques 20 y 28, nueve direcciones distintas
    // envían al mismo destino. Es el patrón que un detector debe encontrar.
    if (numero >= 20 && numero <= 28) {
      const origen = direccionCuenta(200 + (numero - 20));
      const tx = anadirTx({
        de: origen,
        para: fanIn.destino,
        valor: 0,
        tokenValor: entero(aleatorio, 900, 1_400) * 10 ** DECIMALES_TOKEN,
        gasUsado: entero(aleatorio, 46_000, 52_000),
        precioGas: entero(aleatorio, 10, 22) * 10 ** 9,
        tipo: "token"
      });
      fanIn.origenes.push(origen);
      fanIn.hashes.push(tx.hash);
    }

    // (c) Fan-out plantado: en los bloques 32–39, el distribuidor reparte a ocho
    // destinos nuevos. Visto solo, no significa nada malo: un pagador de nóminas
    // se ve exactamente igual. El patrón es un INDICADOR, no una conclusión.
    if (numero >= 32 && numero <= 39) {
      const destino = direccionCuenta(300 + (numero - 32));
      const tx = anadirTx({
        de: fanOut.origen,
        para: destino,
        valor: 0,
        tokenValor: entero(aleatorio, 400, 700) * 10 ** DECIMALES_TOKEN,
        gasUsado: entero(aleatorio, 46_000, 52_000),
        precioGas: entero(aleatorio, 10, 20) * 10 ** 9,
        tipo: "token"
      });
      fanOut.destinos.push(destino);
      fanOut.hashes.push(tx.hash);
    }

    // (d) Peel chain: en cada bloque par entre el 42 y el 54 se "pela" una parte
    // pequeña hacia un destino y el resto sigue a una dirección nueva.
    if (numero >= 42 && numero <= 54 && numero % 2 === 0) {
      const pelado = entero(aleatorio, 800, 1_500) * 10 ** DECIMALES_TOKEN;
      const siguiente = direccionCuenta(400 + numero);
      const salida = anadirTx({
        de: direccionPeel,
        para: eleccion(aleatorio, usuarios),
        valor: 0,
        tokenValor: pelado,
        gasUsado: 51_000,
        precioGas: 12 * 10 ** 9,
        tipo: "token"
      });
      const resto = anadirTx({
        de: direccionPeel,
        para: siguiente,
        valor: 0,
        tokenValor: restoPeel - pelado,
        gasUsado: 51_000,
        precioGas: 12 * 10 ** 9,
        tipo: "token"
      });
      peelChain.hashes.push(salida.hash, resto.hash);
      peelChain.direcciones.push(siguiente);
      restoPeel -= pelado;
      direccionPeel = siguiente;
    }

    // (e) Anomalías plantadas: importe y comisión muy por encima de lo habitual.
    // Son las etiquetas positivas de la verdad de campo del laboratorio 10.
    if (numero === 15 || numero === 37 || numero === 51) {
      const tx = anadirTx({
        de: ROLES.servicio,
        para: ROLES.puente,
        valor: 0,
        tokenValor: entero(aleatorio, 180_000, 260_000) * 10 ** DECIMALES_TOKEN,
        gasUsado: entero(aleatorio, 180_000, 240_000),
        precioGas: entero(aleatorio, 180, 320) * 10 ** 9,
        tipo: "token"
      });
      anomalas.add(tx.hash);
    }

    const bloque = {
      numero,
      hash: hashDe("0x", { numero, hashPrevio, marcaTiempo, hashes: transacciones.map((t) => t.hash) }),
      hashPrevio,
      marcaTiempo,
      // Gas total consumido por el bloque: la suma del de sus transacciones.
      gasUsado: transacciones.reduce((suma, t) => suma + t.gasUsado, 0),
      limiteGas: 30_000_000,
      transacciones,
      logs
    };
    hashPrevio = bloque.hash;
    cadena.push(bloque);
  }

  return {
    bloques: cadena,
    // La verdad de campo NO existe en una cadena real. Se publica aquí solo para
    // poder MEDIR un detector; usarla como si fuera un dato observable sería
    // hacer trampa (y es un error habitual al evaluar modelos).
    verdadDeCampo: {
      anomalas: [...anomalas],
      fanIn,
      fanOut,
      peelChain,
      roles: ROLES
    }
  };
}

// =============================================================================
// 3. Utilidades compartidas por los laboratorios
// =============================================================================

/** Todas las transacciones de la cadena de cuentas, en orden de bloque e índice. */
export const transaccionesDe = (bloques) => bloques.flatMap((b) => b.transacciones);

/** Todos los logs (eventos) de la cadena de cuentas. */
export const logsDe = (bloques) => bloques.flatMap((b) => b.logs);

/** Unidades mínimas → unidades humanas, con los decimales del activo. */
export function aHumano(cantidad, decimales = DECIMALES_TOKEN) {
  const base = 10 ** decimales;
  return Math.round((Number(cantidad) / base) * 100) / 100;
}

/** Día (YYYY-MM-DD) de una marca de tiempo Unix en segundos, en UTC. */
export const diaDe = (marcaTiempo) => new Date(marcaTiempo * 1000).toISOString().slice(0, 10);

/**
 * Minuto (YYYY-MM-DD HH:MM) de una marca de tiempo Unix, en UTC.
 *
 * La granularidad de una serie temporal tiene que corresponderse con la ventana
 * observada. Esta cadena sintética avanza un bloque cada 12 segundos, así que 60
 * bloques son 12 minutos: agregarlos "por día" produce UN punto y una serie que
 * no enseña nada. En una cadena real, con años de historia, la agregación diaria
 * o semanal es la correcta. Elegir mal la granularidad es una de las formas más
 * silenciosas de construir un panel que parece informativo y no lo es.
 */
export const minutoDe = (marcaTiempo) => new Date(marcaTiempo * 1000).toISOString().slice(0, 16).replace("T", " ");

/**
 * Dataset completo del módulo. Es la única función que los laboratorios necesitan
 * llamar: devuelve las dos cadenas y la verdad de campo con la misma semilla.
 */
export function dataset({ semilla = SEMILLA_POR_DEFECTO } = {}) {
  const utxo = cadenaUTXO({ semilla });
  const { bloques, verdadDeCampo } = cadenaCuentas({ semilla });
  return { utxo, cuentas: bloques, verdadDeCampo, semilla };
}
