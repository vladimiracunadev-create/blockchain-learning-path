// RedLab: una red EVM-lite determinista para los laboratorios LE3–LE8.
//
// Qué es: un libro de estado (cuentas, nonces, tokens, registros de eventos) que
// aplica las MISMAS reglas de validación que una cadena real para lo que enseña
// el curso: firma → remitente recuperado, nonce exacto, saldo suficiente, chain
// id, y el procesamiento de autorizaciones de EIP-7702.
//
// Qué NO es: una EVM. No ejecuta bytecode. Los "contratos delegados" son objetos
// JavaScript registrados en una dirección. Eso es suficiente para estudiar quién
// puede ordenar qué, y evita que el laboratorio sirva de herramienta ofensiva:
// nada de lo que aquí se escribe se puede desplegar ni enviar a una red real.
//
// Simplificaciones declaradas (cada una se repite en la guía del laboratorio):
//   - Un bloque por transacción; marca de tiempo = reloj de la red (+12 s por bloque).
//   - Precio efectivo del gas = maxFee (no hay base fee ni propina separada).
//   - Los datos de llamada son JSON en UTF-8, no ABI. La EVM real usa selectores
//     de 4 bytes (keccak256 de la firma) y palabras de 32 bytes.

import { aHex, deHex, deUtf8, utf8 } from "./bytes.mjs";
import { keccak256, keccak256Hex } from "./keccak.mjs";
import { aChecksum } from "./direcciones.mjs";
import { direccionDePublica, firmarHash, recuperarPublica } from "./secp256k1.mjs";
import {
  PREFIJO_DELEGACION, TIPO_EIP7702, decodificarTransaccion, destinoDeDelegacion, esDelegacion,
  palabra32, recuperarAutoridad
} from "./transacciones.mjs";

export const TOPIC_TRANSFER = keccak256Hex("Transfer(address,address,uint256)");
export const DIRECCION_CERO = "0x0000000000000000000000000000000000000000";
export const GAS_BASE = 21000n;
export const GAS_POR_AUTORIZACION = 25000n;
export const REEMBOLSO_CUENTA_EXISTENTE = 12500n;
const NONCE_MAXIMO = (1n << 64n) - 1n;

export class TransaccionRechazada extends Error {}
export class Revertida extends Error {}

const clave = (direccion) => direccion.toLowerCase();

/** ABI simplificada del laboratorio: JSON en UTF-8. Los bigint viajan como cadenas. */
export const codificarLlamada = (fn, args = {}) =>
  aHex(utf8(JSON.stringify({ fn, args }, (_, v) => (typeof v === "bigint" ? v.toString() : v))));
export const decodificarLlamada = (datos) => (datos === "0x" ? { fn: null, args: {} } : JSON.parse(deUtf8(deHex(datos))));

export class RedLab {
  constructor({ chainId = 31337n, reloj = 1_761_768_000 } = {}) {
    this.chainId = BigInt(chainId);
    this.reloj = reloj;
    this.cuentas = new Map();
    this.implementaciones = new Map(); // dirección (min.) → contrato delegado simulado
    this.tokens = new Map();
    this.bloques = [];
    this.transacciones = new Map(); // hash → { tx, recibo }
    this.registros = [];
    this.trazaEth = []; // movimientos de ETH internos y externos, para análisis posterior
  }

  // --- Estado de cuentas --------------------------------------------------------
  cuenta(direccion) {
    const k = clave(direccion);
    if (!this.cuentas.has(k)) this.cuentas.set(k, { saldo: 0n, nonce: 0n, codigo: "0x", almacenamiento: {} });
    return this.cuentas.get(k);
  }

  existe(direccion) {
    const c = this.cuentas.get(clave(direccion));
    return Boolean(c && (c.saldo > 0n || c.nonce > 0n || c.codigo !== "0x"));
  }

  fondear(direccion, wei) {
    this.cuenta(direccion).saldo += BigInt(wei);
  }

  saldo(direccion) { return this.cuenta(direccion).saldo; }
  nonce(direccion) { return this.cuenta(direccion).nonce; }
  codigo(direccion) { return this.cuenta(direccion).codigo; }

  /** Registra un contrato que otras cuentas podrán adoptar como delegado. */
  desplegarDelegado(direccion, implementacion) {
    this.implementaciones.set(clave(direccion), implementacion);
    this.cuenta(direccion).codigo = "0x6080604052"; // marcador de "tiene código"
  }

  transferirEth(de, a, monto) {
    const origen = this.cuenta(de);
    if (origen.saldo < monto) throw new Revertida("saldo de ETH insuficiente");
    origen.saldo -= monto;
    this.cuenta(a).saldo += monto;
    this.trazaEth.push({ de, a, monto, txHash: null, timestamp: null });
  }

  // --- Tokens (ERC-20-lite con congelamiento del emisor) ------------------------
  crearToken({ direccion, simbolo, decimales = 6, emisor, congelable = true }) {
    this.tokens.set(clave(direccion), {
      direccion, simbolo, decimales, emisor, congelable, saldos: new Map(), bloqueadas: new Set()
    });
  }

  token(direccion) {
    const token = this.tokens.get(clave(direccion));
    if (!token) throw new Revertida(`token desconocido ${direccion}`);
    return token;
  }

  saldoToken(tokenDireccion, direccion) {
    return this.token(tokenDireccion).saldos.get(clave(direccion)) ?? 0n;
  }

  emitirToken(tokenDireccion, a, monto) {
    const token = this.token(tokenDireccion);
    token.saldos.set(clave(a), this.saldoToken(tokenDireccion, a) + BigInt(monto));
    this.#registrar(tokenDireccion, [TOPIC_TRANSFER, palabra32(DIRECCION_CERO), palabra32(a)], palabra32(BigInt(monto)));
  }

  transferirToken(tokenDireccion, de, a, monto) {
    const token = this.token(tokenDireccion);
    if (token.bloqueadas.has(clave(de)) || token.bloqueadas.has(clave(a))) {
      throw new Revertida(`${token.simbolo}: dirección congelada por el emisor`);
    }
    if (this.saldoToken(tokenDireccion, de) < monto) throw new Revertida(`${token.simbolo}: saldo insuficiente`);
    token.saldos.set(clave(de), this.saldoToken(tokenDireccion, de) - monto);
    token.saldos.set(clave(a), this.saldoToken(tokenDireccion, a) + monto);
    this.#registrar(tokenDireccion, [TOPIC_TRANSFER, palabra32(de), palabra32(a)], palabra32(monto));
  }

  /** El emisor congela una dirección. Solo existe donde el token lo implementa: ETH y BTC no. */
  congelar(tokenDireccion, direccion, solicitante) {
    const token = this.token(tokenDireccion);
    if (!token.congelable) throw new Revertida(`${token.simbolo} no tiene función de congelamiento`);
    if (clave(solicitante) !== clave(token.emisor)) throw new Revertida("solo el emisor puede congelar");
    token.bloqueadas.add(clave(direccion));
  }

  #registrar(direccion, topics, data) {
    this.registros.push({ direccion, topics, data, pendiente: true });
  }

  // --- Procesamiento de una transacción -----------------------------------------
  enviar(crudo) {
    const tx = decodificarTransaccion(crudo);
    if (tx.remitente === null) throw new TransaccionRechazada("firma inválida: no se puede recuperar el remitente");
    if (tx.chainId !== this.chainId) throw new TransaccionRechazada("chain id distinto: protección contra repetición entre redes");
    const remitente = this.cuenta(tx.remitente);
    if (tx.nonce !== remitente.nonce) {
      throw new TransaccionRechazada(`nonce ${tx.nonce} ≠ esperado ${remitente.nonce}`);
    }
    if (remitente.saldo < tx.gasLimit * tx.maxFee + tx.valor) throw new TransaccionRechazada("saldo insuficiente para gas y valor");
    if (remitente.codigo !== "0x" && !esDelegacion(remitente.codigo)) {
      throw new TransaccionRechazada("EIP-3607: una cuenta con código de contrato no puede originar transacciones");
    }

    // El nonce del remitente avanza ANTES de procesar las autorizaciones. Por eso,
    // si el remitente firma su propia autorización, esta debe llevar nonce + 1.
    remitente.nonce += 1n;
    this.registros.length = 0;
    const inicioTraza = this.trazaEth.length;

    const autorizaciones = tx.tipo === TIPO_EIP7702 ? this.#procesarAutorizaciones(tx.autorizaciones) : [];
    const reembolsos = BigInt(autorizaciones.filter((a) => a.aplicada && a.cuentaExistia).length) * REEMBOLSO_CUENTA_EXISTENTE;
    const gasUsado = GAS_BASE + GAS_POR_AUTORIZACION * BigInt(autorizaciones.length) - reembolsos;

    const instantanea = this.#clonarEstado();
    instantanea.trazaEth = this.trazaEth.length;
    let estado = "exito";
    let motivo = null;
    try {
      this.#ejecutar(tx);
    } catch (error) {
      if (!(error instanceof Revertida)) throw error;
      this.#restaurarEstado(instantanea);
      this.registros.length = 0;
      estado = "revertida";
      motivo = error.message;
    }
    this.cuenta(tx.remitente).saldo -= gasUsado * tx.maxFee;

    this.reloj += 12;
    for (const paso of this.trazaEth.slice(inicioTraza)) Object.assign(paso, { txHash: tx.hash, timestamp: this.reloj });
    const numero = this.bloques.length + 1;
    const hashBloque = keccak256Hex(`${numero}:${tx.hash}:${this.reloj}`);
    const registros = this.registros.map((registro, indiceLog) => ({
      direccion: registro.direccion, topics: registro.topics, data: registro.data,
      bloque: numero, txHash: tx.hash, indiceLog
    }));
    const recibo = { txHash: tx.hash, bloque: numero, estado, motivo, gasUsado, autorizaciones, registros };
    this.bloques.push({ numero, hash: hashBloque, timestamp: this.reloj, transacciones: [tx.hash] });
    this.transacciones.set(tx.hash, { tx, recibo, bloque: numero });
    return recibo;
  }

  /**
   * EIP-7702: cada tupla se procesa EN ORDEN y una tupla inválida se SALTA sin
   * hacer fallar la transacción. Por eso una lista con muchas autorizaciones del
   * mismo autor con nonces consecutivos solo puede aplicar una: la primera cuyo
   * nonce coincida con el del autor en ese instante.
   */
  #procesarAutorizaciones(lista) {
    return lista.map((auth, indice) => {
      const resultado = { indice, autoridad: null, aplicada: false, motivo: null, cuentaExistia: false };
      if (auth.chainId !== 0n && auth.chainId !== this.chainId) return { ...resultado, motivo: "chain id ajeno" };
      if (auth.nonce >= NONCE_MAXIMO) return { ...resultado, motivo: "nonce fuera de rango" };
      const autoridad = recuperarAutoridad(auth);
      if (!autoridad) return { ...resultado, motivo: "firma inválida o no canónica" };
      resultado.autoridad = autoridad;
      const cuenta = this.cuenta(autoridad);
      resultado.cuentaExistia = this.existe(autoridad);
      if (cuenta.codigo !== "0x" && !esDelegacion(cuenta.codigo)) return { ...resultado, motivo: "la autoridad ya es un contrato" };
      if (cuenta.nonce !== auth.nonce) return { ...resultado, motivo: `nonce de la autoridad ${cuenta.nonce} ≠ ${auth.nonce}` };
      cuenta.codigo = clave(auth.direccion) === DIRECCION_CERO ? "0x" : `${PREFIJO_DELEGACION}${clave(auth.direccion).slice(2)}`;
      cuenta.nonce += 1n;
      return { ...resultado, aplicada: true };
    });
  }

  #ejecutar(tx) {
    // Llamar a un token: transfer(a, monto) mueve saldo del remitente, como un ERC-20.
    if (this.tokens.has(clave(tx.destino))) {
      const llamada = decodificarLlamada(tx.datos);
      if (llamada.fn === "transfer") this.transferirToken(tx.destino, tx.remitente, llamada.args.a, BigInt(llamada.args.monto));
      return;
    }
    this.transferirEth(tx.remitente, tx.destino, tx.valor);
    const codigo = this.codigo(tx.destino);
    if (!esDelegacion(codigo)) return;
    const implementacion = this.implementaciones.get(clave(destinoDeDelegacion(codigo)));
    if (!implementacion) return; // delegar a una dirección sin código equivale a una cuenta vacía
    implementacion.ejecutar({
      red: this, cuenta: tx.destino, llamador: tx.remitente, valor: tx.valor,
      llamada: decodificarLlamada(tx.datos)
    });
  }

  #clonarEstado() {
    return {
      cuentas: new Map([...this.cuentas].map(([k, c]) => [k, { ...c, almacenamiento: structuredClone(c.almacenamiento) }])),
      tokens: new Map([...this.tokens].map(([k, t]) => [k, { ...t, saldos: new Map(t.saldos), bloqueadas: new Set(t.bloqueadas) }]))
    };
  }

  #restaurarEstado({ cuentas, tokens, trazaEth }) {
    this.cuentas = cuentas;
    this.tokens = tokens;
    this.trazaEth.length = trazaEth;
  }
}

// --- Contratos delegados de laboratorio -------------------------------------------
// Cada uno responde a la misma pregunta de diseño: ¿QUIÉN puede ordenar que la
// cuenta delegante actúe? La seguridad de una delegación es exactamente esa respuesta.

/**
 * Delegado legítimo mínimo: agrupa pagos en una sola transacción, pero solo si
 * la ordena la propia cuenta (msg.sender == address(this)). Es el patrón seguro.
 */
export const LoteSeguro = {
  nombre: "LoteSeguro",
  ejecutar({ red, cuenta, llamador, llamada }) {
    if (llamada.fn !== "ejecutarLote") return;
    if (clave(llamador) !== clave(cuenta)) throw new Revertida("solo la propia cuenta puede ordenar el lote");
    for (const pago of llamada.args.pagos) {
      if (pago.token) red.transferirToken(pago.token, cuenta, pago.a, BigInt(pago.monto));
      else red.transferirEth(cuenta, pago.a, BigInt(pago.monto));
    }
  }
};

/**
 * Delegado con patrocinio: un tercero paga el gas, pero cada instrucción lleva
 * la firma del dueño, ligada a (chainId, cuenta, nonceInterno). Sin ese nonce
 * interno, quien vea la instrucción podría repetirla.
 */
export const PatrocinioFirmado = {
  nombre: "PatrocinioFirmado",
  ejecutar({ red, cuenta, llamada }) {
    if (llamada.fn !== "ejecutarFirmado") return;
    const { pagos, nonceInterno, firma } = llamada.args;
    const almacenamiento = red.cuenta(cuenta).almacenamiento; // el estado vive en la cuenta delegante
    const esperado = BigInt(almacenamiento.nonceInterno ?? 0);
    if (BigInt(nonceInterno) !== esperado) throw new Revertida(`nonce interno ${nonceInterno} ≠ ${esperado}: instrucción repetida o fuera de orden`);
    const resumen = keccak256(utf8(JSON.stringify({ chainId: red.chainId.toString(), cuenta: clave(cuenta), nonceInterno: String(nonceInterno), pagos })));
    const publica = recuperarPublica(resumen, { r: BigInt(firma.r), s: BigInt(firma.s), v: firma.v });
    if (!publica || clave(aChecksum(aHex(direccionDePublica(publica)))) !== clave(cuenta)) {
      throw new Revertida("la instrucción no está firmada por el dueño de la cuenta");
    }
    almacenamiento.nonceInterno = String(esperado + 1n);
    for (const pago of pagos) {
      if (pago.token) red.transferirToken(pago.token, cuenta, pago.a, BigInt(pago.monto));
      else red.transferirEth(cuenta, pago.a, BigInt(pago.monto));
    }
  }
};

/** El dueño firma una instrucción de patrocinio (lo que haría una wallet con 'sign typed data'). */
export function firmarInstruccionPatrocinio({ chainId, cuenta, nonceInterno, pagos }, clavePrivada) {
  const resumen = keccak256(utf8(JSON.stringify({ chainId: chainId.toString(), cuenta: clave(cuenta), nonceInterno: String(nonceInterno), pagos })));
  const { r, s, v } = firmarHash(resumen, clavePrivada);
  return { r: r.toString(), s: s.toString(), v };
}

/**
 * ⚠️ SOLO PARA ENSEÑAR DETECCIÓN. Imita el rasgo del delegado hostil descrito en
 * los informes públicos del caso Binance: acepta órdenes únicamente de un
 * "operador" y vacía la cuenta. Opera solo sobre el estado simulado de RedLab:
 * no es bytecode, no se puede desplegar y no contiene ninguna lógica de ataque
 * más allá de dos transferencias que cualquier alumno ya escribe en LE3.
 */
export function crearBarredorSimulado(operador) {
  return {
    nombre: "BarredorSimulado",
    ejecutar({ red, cuenta, llamador, llamada }) {
      if (llamada.fn !== "barrer") return;
      if (clave(llamador) !== clave(operador)) throw new Revertida("solo el operador puede ordenar el barrido");
      for (const token of llamada.args.tokens ?? []) {
        const monto = red.saldoToken(token, cuenta);
        if (monto > 0n) red.transferirToken(token, cuenta, llamada.args.destino, monto);
      }
      red.transferirEth(cuenta, llamada.args.destino, red.saldo(cuenta));
    }
  };
}
