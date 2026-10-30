// LE4 · Implementar una delegación EIP-7702 en una red de laboratorio
//
// Prerrequisitos: LE1–LE3, clases 11–12 (cuentas y EVM) y 19–20 (seguridad).
// Pregunta que responde: ¿qué cambia en una cuenta cuando "delega", y qué NO cambia?
//
// EIP-7702 permite que una EOA (una cuenta de clave) adopte el CÓDIGO de un contrato:
// su "código" pasa a ser el designador 0xef0100 ‖ dirección-del-contrato. La cuenta
// sigue siendo la misma, con la misma clave, el mismo saldo y su propio almacenamiento;
// lo que cambia es QUIÉN puede ordenarle qué, según la lógica del contrato delegado.
//
// Tres hechos que este laboratorio demuestra con la red simulada:
//   1. La delegación PERSISTE hasta que se firma otra (no caduca ni se consume).
//   2. La autorización es una firma suelta: la puede enviar un tercero.
//   3. El nonce de la cuenta decide qué autorización vale; un nonce mal elegido la
//      deja inerte, y una lista de autorizaciones se procesa EN ORDEN.

import { RedLab, DIRECCION_CERO, LoteSeguro, PatrocinioFirmado, codificarLlamada, crearBarredorSimulado, firmarInstruccionPatrocinio } from "./nucleo/red-lab.mjs";
import { TIPO_EIP1559, TIPO_EIP7702, destinoDeDelegacion, esDelegacion, firmarAutorizacion, firmarTransaccion } from "./nucleo/transacciones.mjs";
import { crearFamilia } from "./le1-billeteras-de-prueba.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

export const ETH = 10n ** 18n;
const GWEI = 10n ** 9n;
export const DELEGADO_LAB = "0x00000000000000000000000000000000000de1e9";
export const TOKEN_LAB = "0x00000000000000000000000000000000005d7e57";

export function crearEntorno(implementacion = LoteSeguro) {
  const [dueno, patrocinador, tercero] = crearFamilia("delegacion", 3);
  const red = new RedLab();
  for (const b of [dueno, patrocinador, tercero]) red.fondear(b.direccion, 20n * ETH);
  red.desplegarDelegado(DELEGADO_LAB, implementacion);
  red.crearToken({ direccion: TOKEN_LAB, simbolo: "USDT-LAB", decimales: 6, emisor: "0x000000000000000000000000000000000000e515" });
  red.emitirToken(TOKEN_LAB, dueno.direccion, 500_000_000n);
  return { red, dueno, patrocinador, tercero };
}

export function enviar(red, remitente, campos) {
  const firmada = firmarTransaccion({
    tipo: TIPO_EIP1559, chainId: red.chainId, nonce: red.nonce(remitente.direccion), maxFee: 20n * GWEI,
    gasLimit: 3_000_000n, valor: 0n, ...campos
  }, remitente.clavePrivada);
  return red.enviar(firmada.crudo);
}

/** Publica una o varias autorizaciones. Quien las envía paga el gas; no tiene por qué ser la autoridad. */
export function publicarAutorizaciones(red, remitente, autorizaciones, destino = remitente.direccion) {
  return enviar(red, remitente, { tipo: TIPO_EIP7702, destino, autorizaciones });
}

/** La autoridad firma «adopto el código de `direccion`» válido para su nonce actual. */
export function autorizar(red, autoridad, direccion, { nonce, chainId } = {}) {
  return firmarAutorizacion({ chainId: chainId ?? red.chainId, direccion, nonce: nonce ?? red.nonce(autoridad.direccion) }, autoridad.clavePrivada);
}

export function estadoDeCuenta(red, direccion) {
  const codigo = red.codigo(direccion);
  return { direccion, codigo, delegada: esDelegacion(codigo), delegadoA: destinoDeDelegacion(codigo), nonce: red.nonce(direccion), saldo: red.saldo(direccion) };
}

// --- Escenario A · delegación legítima y su ciclo de vida ----------------------------------
export function escenarioDelegacionLegitima() {
  const { red, dueno, tercero } = crearEntorno(LoteSeguro);
  const antes = estadoDeCuenta(red, dueno.direccion);

  // El propio dueño envía: su autorización debe llevar nonce + 1 (la transacción consume el suyo antes).
  const delegacion = publicarAutorizaciones(red, dueno, [autorizar(red, dueno, DELEGADO_LAB, { nonce: red.nonce(dueno.direccion) + 1n })]);
  const despuesDeDelegar = estadoDeCuenta(red, dueno.direccion);

  const lote = enviar(red, dueno, {
    destino: dueno.direccion,
    datos: codificarLlamada("ejecutarLote", { pagos: [{ a: tercero.direccion, monto: ETH.toString() }, { token: TOKEN_LAB, a: tercero.direccion, monto: "100000000" }] })
  });
  const intrusion = enviar(red, tercero, {
    destino: dueno.direccion, datos: codificarLlamada("ejecutarLote", { pagos: [{ a: tercero.direccion, monto: (5n * ETH).toString() }] })
  });

  const revocacion = publicarAutorizaciones(red, dueno, [autorizar(red, dueno, DIRECCION_CERO, { nonce: red.nonce(dueno.direccion) + 1n })]);
  const despuesDeRevocar = estadoDeCuenta(red, dueno.direccion);
  return { antes, delegacion, despuesDeDelegar, lote, intrusion, revocacion, despuesDeRevocar };
}

// --- Escenario B · patrocinio: otro paga el gas, el dueño firma cada instrucción ------------
export function escenarioPatrocinio() {
  const { red, dueno, patrocinador, tercero } = crearEntorno(PatrocinioFirmado);
  publicarAutorizaciones(red, dueno, [autorizar(red, dueno, DELEGADO_LAB, { nonce: red.nonce(dueno.direccion) + 1n })]);
  const pagos = [{ a: tercero.direccion, monto: ETH.toString() }];
  const firma = firmarInstruccionPatrocinio({ chainId: red.chainId, cuenta: dueno.direccion, nonceInterno: 0, pagos }, dueno.clavePrivada);
  const datos = codificarLlamada("ejecutarFirmado", { pagos, nonceInterno: 0, firma });
  const primera = enviar(red, patrocinador, { destino: dueno.direccion, datos });
  const repeticion = enviar(red, patrocinador, { destino: dueno.direccion, datos });
  return { primera, repeticion, saldoPatrocinador: red.saldo(patrocinador.direccion), nonceDueno: red.nonce(dueno.direccion) };
}

// --- Escenario C · la ventana de nonces --------------------------------------------------------
/**
 * Un tercero que NO conoce el nonce exacto (porque la cuenta sigue operando) firma una
 * ventana de autorizaciones consecutivas. El procesamiento es secuencial, así que el ORDEN
 * decide cuántas se aplican:
 *   - descendente: solo coincide una; las demás quedan inertes.
 *   - ascendente: tras aplicar la primera, el nonce avanza y la SIGUIENTE también coincide.
 * Los informes públicos del caso Binance describen «50 autorizaciones, una válida» pero no
 * publican el orden de la lista: es un dato desconocido que este laboratorio permite acotar.
 */
export function escenarioVentanaDeNonces({ orden = "descendente", tamano = 50, nonceReal = 30 } = {}) {
  const { red, dueno, patrocinador } = crearEntorno(LoteSeguro);
  red.cuenta(dueno.direccion).nonce = BigInt(nonceReal); // estado preparado: la cuenta ya ha operado
  const centro = nonceReal + Math.floor(tamano / 2);
  const nonces = Array.from({ length: tamano }, (_, i) => BigInt(orden === "descendente" ? centro - i : centro - tamano + 1 + i));
  const ventana = nonces.filter((n) => n >= 0n).map((nonce) => autorizar(red, dueno, DELEGADO_LAB, { nonce }));
  const recibo = publicarAutorizaciones(red, patrocinador, ventana, dueno.direccion);
  return {
    orden,
    firmadas: ventana.length,
    aplicadas: recibo.autorizaciones.filter((a) => a.aplicada).length,
    inertes: recibo.autorizaciones.filter((a) => !a.aplicada).length,
    nonceAntes: nonceReal,
    nonceDespues: Number(red.nonce(dueno.direccion)),
    saltoDeNonce: Number(red.nonce(dueno.direccion)) - nonceReal,
    recibo
  };
}

// --- Escenario D · delegado hostil simulado: la forma del daño (para LE5 y LE8) -------------
export function escenarioDelegadoHostil() {
  const { red, dueno, patrocinador } = crearEntorno();
  red.desplegarDelegado(DELEGADO_LAB, crearBarredorSimulado(patrocinador.direccion));
  const delegacion = publicarAutorizaciones(red, patrocinador, [autorizar(red, dueno, DELEGADO_LAB)], dueno.direccion);
  const barrido = enviar(red, patrocinador, { destino: dueno.direccion, datos: codificarLlamada("barrer", { destino: patrocinador.direccion, tokens: [TOKEN_LAB] }) });
  red.fondear(dueno.direccion, 4n * ETH); // un depósito posterior…
  const segundoBarrido = enviar(red, patrocinador, { destino: dueno.direccion, datos: codificarLlamada("barrer", { destino: patrocinador.direccion, tokens: [TOKEN_LAB] }) });
  return { red, dueno, patrocinador, delegacion, barrido, segundoBarrido, delegacionSigueActiva: esDelegacion(red.codigo(dueno.direccion)) };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const a = escenarioDelegacionLegitima();
  console.log("LE4 · Delegación EIP-7702 en red de laboratorio\n");
  console.log("Antes:       ", a.antes.codigo, "nonce", a.antes.nonce);
  console.log("Delegada:    ", a.despuesDeDelegar.codigo, "→", a.despuesDeDelegar.delegadoA);
  console.log("Lote propio: ", a.lote.estado, "| intruso:", a.intrusion.estado, `(${a.intrusion.motivo})`);
  console.log("Revocada:    ", a.despuesDeRevocar.codigo, "\n");
  for (const orden of ["descendente", "ascendente"]) {
    const v = escenarioVentanaDeNonces({ orden, tamano: 10 });
    console.log(`Ventana ${orden}: ${v.aplicadas} aplicadas, ${v.inertes} inertes, el nonce saltó ${v.saltoDeNonce}`);
  }
  console.log("\nPatrocinio:", escenarioPatrocinio().primera.estado, "→ repetición:", escenarioPatrocinio().repeticion.estado);
  console.log("Una delegación no se consume: persiste hasta que se firma otra.");
}
