// LE6 · Explorador de transacciones públicas
//
// Prerrequisitos: LE3, LE4, clases 57–58 (extracción y análisis on-chain).
// Pregunta que responde: ¿cómo leo una transacción sin confiar en el explorador de otro?
//
// Un explorador es una vista. Para verificar un incidente hay que poder reconstruir esa
// vista desde el nodo: JSON-RPC → campos → decodificación. Este explorador hace tres cosas
// que los exploradores genéricos suelen ocultar en transacciones EIP-7702:
//   1. Recupera la AUTORIDAD de cada autorización desde su firma (el RPC solo entrega r, s, yParity).
//   2. Distingue «firmó» de «aplicó»: el RPC básico no dice qué tupla surtió efecto; se infiere
//      mirando el código actual de la cuenta (eth_getCode).
//   3. Decodifica los eventos Transfer de los registros, sin suponer que el token es honesto.
//
// Modo por defecto: red de laboratorio, sin red de internet. Modo en vivo (opcional y explícito):
//   node le6-explorador-transacciones.mjs --rpc https://<nodo-publico> --tx 0x<hash>
// No envíes nunca claves, frases semilla ni endpoints con credenciales: una URL con clave de
// API en la ruta se imprimiría en la bitácora.

import { aHex } from "./nucleo/bytes.mjs";
import { aChecksum } from "./nucleo/direcciones.mjs";
import { TOPIC_TRANSFER } from "./nucleo/red-lab.mjs";
import { destinoDeDelegacion, esDelegacion, recuperarAutoridad } from "./nucleo/transacciones.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const hex = (n) => `0x${BigInt(n).toString(16)}`;
const entero = (h) => BigInt(h);

// --- Transportes ---------------------------------------------------------------------------------
/** Servidor JSON-RPC simulado sobre una RedLab: mismas formas de respuesta que un nodo real. */
export function crearTransporteSimulado(red) {
  const bloquePorHash = (hash) => red.transacciones.get(hash);
  const aTx = ({ tx, bloque }) => ({
    hash: tx.hash, blockNumber: hex(bloque), from: tx.remitente, to: tx.destino, nonce: hex(tx.nonce), value: hex(tx.valor),
    input: tx.datos, type: hex(tx.tipo), chainId: hex(tx.chainId), gas: hex(tx.gasLimit), maxFeePerGas: hex(tx.maxFee),
    ...(tx.tipo === 4 ? {
      authorizationList: tx.autorizaciones.map((a) => ({
        chainId: hex(a.chainId), address: a.direccion, nonce: hex(a.nonce), yParity: hex(a.yParity), r: hex(a.r), s: hex(a.s)
      }))
    } : {})
  });
  const aLog = (r) => ({ address: r.direccion, topics: r.topics, data: r.data, blockNumber: hex(r.bloque), transactionHash: r.txHash, logIndex: hex(r.indiceLog) });

  return async function transporte(metodo, params = []) {
    switch (metodo) {
      case "eth_chainId": return hex(red.chainId);
      case "eth_blockNumber": return hex(red.bloques.length);
      case "eth_getBalance": return hex(red.saldo(params[0]));
      case "eth_getTransactionCount": return hex(red.nonce(params[0]));
      case "eth_getCode": return red.codigo(params[0]);
      case "eth_getTransactionByHash": return bloquePorHash(params[0]) ? aTx(bloquePorHash(params[0])) : null;
      case "eth_getTransactionReceipt": {
        const entrada = bloquePorHash(params[0]);
        if (!entrada) return null;
        return {
          transactionHash: params[0], blockNumber: hex(entrada.bloque), status: entrada.recibo.estado === "exito" ? "0x1" : "0x0",
          gasUsed: hex(entrada.recibo.gasUsado), logs: entrada.recibo.registros.map(aLog)
        };
      }
      case "eth_getBlockByNumber": {
        const numero = params[0] === "latest" ? red.bloques.length : Number(entero(params[0]));
        const bloque = red.bloques[numero - 1];
        return bloque ? { number: hex(bloque.numero), hash: bloque.hash, timestamp: hex(bloque.timestamp), transactions: bloque.transacciones } : null;
      }
      case "eth_getLogs": {
        const filtro = params[0] ?? {};
        const desde = filtro.fromBlock ? Number(entero(filtro.fromBlock)) : 1;
        const hasta = filtro.toBlock && filtro.toBlock !== "latest" ? Number(entero(filtro.toBlock)) : red.bloques.length;
        return [...red.transacciones.values()]
          .filter(({ bloque }) => bloque >= desde && bloque <= hasta)
          .flatMap(({ recibo }) => recibo.registros)
          .filter((r) => !filtro.address || r.direccion.toLowerCase() === filtro.address.toLowerCase())
          .filter((r) => (filtro.topics ?? []).every((t, i) => t === null || t === undefined
            || (Array.isArray(t) ? t : [t]).map((x) => x.toLowerCase()).includes(r.topics[i]?.toLowerCase())))
          .map(aLog);
      }
      default: throw new Error(`Método no soportado por el transporte simulado: ${metodo}`);
    }
  };
}

/** Transporte HTTP opcional. Solo http(s); sin credenciales en la URL; sin reintentos silenciosos. */
export function crearTransporteHttp(url, { fetchImpl = globalThis.fetch } = {}) {
  const destino = new URL(url);
  if (!["http:", "https:"].includes(destino.protocol)) throw new Error("Solo se admiten URL http o https");
  if (destino.username || destino.password) throw new Error("No pongas credenciales en la URL: acabarían en tu bitácora");
  let id = 0;
  return async function transporte(metodo, params = []) {
    const respuesta = await fetchImpl(destino, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: (id += 1), method: metodo, params })
    });
    if (!respuesta.ok) throw new Error(`El nodo respondió HTTP ${respuesta.status}`);
    const cuerpo = await respuesta.json();
    if (cuerpo.error) throw new Error(`RPC ${metodo}: ${cuerpo.error.message}`);
    return cuerpo.result;
  };
}

export function crearClienteRpc(transporte) {
  return { llamar: transporte };
}

// --- Exploración ---------------------------------------------------------------------------------------
const direccionDeTopic = (topic) => aChecksum(`0x${topic.slice(26)}`);

export function decodificarTransferencias(registros) {
  return registros
    .filter((r) => r.topics.length === 3 && r.topics[0] === TOPIC_TRANSFER)
    .map((r) => ({ token: r.address, de: direccionDeTopic(r.topics[1]), a: direccionDeTopic(r.topics[2]), monto: entero(r.data), indiceLog: Number(entero(r.logIndex)) }));
}

/** Clasifica una cuenta por su código: el dato que distingue EOA, contrato y EOA delegada. */
export function clasificarCodigo(codigo) {
  if (codigo === "0x" || codigo === "0x0") return { tipo: "EOA", delegadoA: null };
  if (esDelegacion(codigo)) return { tipo: "EOA delegada (EIP-7702)", delegadoA: destinoDeDelegacion(codigo) };
  return { tipo: "contrato", delegadoA: null };
}

export async function explorarDireccion(cliente, direccion) {
  const [saldo, nonce, codigo] = await Promise.all([
    cliente.llamar("eth_getBalance", [direccion, "latest"]),
    cliente.llamar("eth_getTransactionCount", [direccion, "latest"]),
    cliente.llamar("eth_getCode", [direccion, "latest"])
  ]);
  return { direccion, saldoWei: entero(saldo), nonce: entero(nonce), codigo, ...clasificarCodigo(codigo) };
}

export async function explorarTransaccion(cliente, hash) {
  const tx = await cliente.llamar("eth_getTransactionByHash", [hash]);
  if (!tx) return null;
  const [recibo, bloque] = await Promise.all([
    cliente.llamar("eth_getTransactionReceipt", [hash]),
    cliente.llamar("eth_getBlockByNumber", [tx.blockNumber, false])
  ]);
  const advertencias = [];
  const autorizaciones = [];
  for (const [indice, a] of (tx.authorizationList ?? []).entries()) {
    const normal = { chainId: entero(a.chainId), direccion: a.address, nonce: entero(a.nonce), yParity: Number(entero(a.yParity)), r: entero(a.r), s: entero(a.s) };
    const autoridad = recuperarAutoridad(normal);
    const actual = autoridad ? await cliente.llamar("eth_getCode", [autoridad, "latest"]) : "0x";
    const vigente = autoridad && esDelegacion(actual) && destinoDeDelegacion(actual).toLowerCase() === a.address.toLowerCase();
    autorizaciones.push({
      indice, autoridad, delegadoA: a.address, nonce: normal.nonce, chainId: normal.chainId,
      // El RPC básico no informa si la tupla se aplicó: se contrasta con el código ACTUAL de la cuenta.
      efectoVigenteHoy: vigente ? "sí: la cuenta sigue delegada a este contrato" : "no verificable o ya sin efecto (pudo revocarse o no aplicarse)"
    });
  }
  if (autorizaciones.length) {
    advertencias.push("Transacción tipo 4: la autoridad que delega NO es necesariamente el remitente.");
    if (autorizaciones.some((a) => a.autoridad && a.autoridad.toLowerCase() !== tx.from.toLowerCase())) {
      advertencias.push("Hay autorizaciones firmadas por cuentas distintas del remitente: alguien pagó el gas de una delegación ajena.");
    }
    if (autorizaciones.filter((a) => a.autoridad).length > 0 && new Set(autorizaciones.map((a) => a.autoridad)).size < autorizaciones.length) {
      advertencias.push("Varias autorizaciones de la misma cuenta: solo las que coinciden con su nonce en orden pueden haberse aplicado.");
    }
    if (autorizaciones.some((a) => a.chainId === 0n)) advertencias.push("chain id 0: una autorización válida en cualquier red.");
  }
  return {
    hash, tipo: Number(entero(tx.type)), estado: recibo.status === "0x1" ? "éxito" : "revertida", bloque: Number(entero(tx.blockNumber)),
    timestamp: Number(entero(bloque.timestamp)), de: tx.from, a: tx.to, valorWei: entero(tx.value), nonce: Number(entero(tx.nonce)),
    gasUsado: entero(recibo.gasUsed), autorizaciones, transferenciasToken: decodificarTransferencias(recibo.logs), advertencias
  };
}

/** Historial de un token para una dirección: dos consultas (como emisor y como receptor). */
export async function historialDeToken(cliente, token, direccion) {
  const palabra = `0x${direccion.toLowerCase().slice(2).padStart(64, "0")}`;
  const [salientes, entrantes] = await Promise.all([
    cliente.llamar("eth_getLogs", [{ fromBlock: "0x1", toBlock: "latest", address: token, topics: [TOPIC_TRANSFER, palabra] }]),
    cliente.llamar("eth_getLogs", [{ fromBlock: "0x1", toBlock: "latest", address: token, topics: [TOPIC_TRANSFER, null, palabra] }])
  ]);
  const todos = decodificarTransferencias([...salientes, ...entrantes]);
  const unicos = new Map(todos.map((t) => [`${t.indiceLog}:${t.de}:${t.a}:${t.monto}`, t]));
  return [...unicos.values()];
}

export async function lineaDeTiempo(cliente, desde, hasta) {
  const filas = [];
  for (let n = desde; n <= hasta; n += 1) {
    const bloque = await cliente.llamar("eth_getBlockByNumber", [hex(n), false]);
    if (!bloque) break;
    for (const hash of bloque.transactions) filas.push({ bloque: n, timestamp: Number(entero(bloque.timestamp)), hash });
  }
  return filas;
}

if (ejecutadoDirectamente(import.meta.url)) {
  const argumentos = process.argv.slice(2);
  const valor = (bandera) => argumentos[argumentos.indexOf(bandera) + 1];
  if (argumentos.includes("--rpc")) {
    const cliente = crearClienteRpc(crearTransporteHttp(valor("--rpc")));
    const resultado = argumentos.includes("--tx")
      ? await explorarTransaccion(cliente, valor("--tx"))
      : await explorarDireccion(cliente, valor("--direccion"));
    console.log(JSON.stringify(resultado, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2));
  } else {
    const { escenarioDelegadoHostil } = await import("./le4-delegacion-eip7702.mjs");
    const e = escenarioDelegadoHostil();
    const cliente = crearClienteRpc(crearTransporteSimulado(e.red));
    console.log("LE6 · Explorador (red de laboratorio)\n");
    const tx = await explorarTransaccion(cliente, e.delegacion.txHash);
    console.log(JSON.stringify(tx, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2));
    console.log("\nCuenta delegada:", await explorarDireccion(cliente, e.dueno.direccion));
    console.log("\nLínea de tiempo:", await lineaDeTiempo(cliente, 1, 3));
    console.log(aHex(Uint8Array.of(4)), "= tipo 4: la autoridad no es el remitente.");
  }
}
