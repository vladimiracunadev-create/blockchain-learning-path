import test from "node:test";
import assert from "node:assert/strict";
import { aHex, deHex } from "./bytes.mjs";
import { direccionDeClavePrivada } from "./direcciones.mjs";
import { TOPIC_TRANSFER, RedLab, TransaccionRechazada, LoteSeguro, PatrocinioFirmado, codificarLlamada, crearBarredorSimulado, firmarInstruccionPatrocinio, DIRECCION_CERO } from "./red-lab.mjs";
import { TIPO_EIP1559, TIPO_EIP7702, decodificarTransaccion, destinoDeDelegacion, esDelegacion, firmarAutorizacion, firmarTransaccion } from "./transacciones.mjs";

// Claves de PRUEBA, públicas y triviales. No protegen nada y no deben usarse jamás en una red real.
const CLAVE_ALICE = 0xa11ce001n;
const CLAVE_BOB = 0xb0b00002n;
const CLAVE_OPERADOR = 0x0be4a704n;
const ALICE = direccionDeClavePrivada(CLAVE_ALICE);
const BOB = direccionDeClavePrivada(CLAVE_BOB);
const OPERADOR = direccionDeClavePrivada(CLAVE_OPERADOR);
const DELEGADO = "0x00000000000000000000000000000000000de1e9";
const USDT = "0x00000000000000000000000000000000005d7e57";
const EMISOR = "0x000000000000000000000000000000000000e515";
const ETH = 10n ** 18n;
const GWEI = 10n ** 9n;

function red() {
  const r = new RedLab();
  r.fondear(ALICE, 100n * ETH);
  r.fondear(BOB, 1n * ETH);
  r.fondear(OPERADOR, 10n * ETH);
  r.desplegarDelegado(DELEGADO, LoteSeguro);
  r.crearToken({ direccion: USDT, simbolo: "USDT-LAB", decimales: 6, emisor: EMISOR });
  r.emitirToken(USDT, ALICE, 5_000_000n);
  return r;
}

const tx = (r, desde, extra = {}) => ({
  tipo: TIPO_EIP1559, chainId: r.chainId, nonce: r.nonce(direccionDe(desde)), maxFee: 10n * GWEI, gasLimit: 100_000n,
  destino: BOB, valor: 0n, ...extra
});
const direccionDe = (clave) => direccionDeClavePrivada(clave);
const enviar = (r, clave, extra) => r.enviar(firmarTransaccion(tx(r, clave, extra), clave).crudo);

test("LE3 · una transferencia entre direcciones controladas mueve saldo, avanza el nonce y cobra gas", () => {
  const r = red();
  const antes = r.saldo(ALICE);
  const recibo = enviar(r, CLAVE_ALICE, { valor: 2n * ETH });
  assert.equal(recibo.estado, "exito");
  assert.equal(r.nonce(ALICE), 1n);
  assert.equal(r.saldo(BOB), 3n * ETH);
  assert.equal(antes - r.saldo(ALICE), 2n * ETH + recibo.gasUsado * 10n * GWEI);
});

test("el remitente se recupera de la firma: nadie puede 'declarar' un from", () => {
  const r = red();
  const firmada = firmarTransaccion(tx(r, CLAVE_ALICE, { valor: ETH }), CLAVE_ALICE);
  assert.equal(decodificarTransaccion(firmada.crudo).remitente, ALICE);
  // Alterar un byte del cuerpo cambia al firmante recuperado: ya no es Alice.
  const alterada = Uint8Array.from(firmada.crudo);
  alterada[alterada.length - 40] ^= 0x01;
  const otro = (() => { try { return decodificarTransaccion(alterada).remitente; } catch { return null; } })();
  assert.notEqual(otro, ALICE);
});

test("repetir una transacción ya incluida se rechaza por nonce", () => {
  const r = red();
  const firmada = firmarTransaccion(tx(r, CLAVE_ALICE, { valor: ETH }), CLAVE_ALICE);
  r.enviar(firmada.crudo);
  assert.throws(() => r.enviar(firmada.crudo), TransaccionRechazada);
});

test("una firma de otra cadena no se acepta (chain id)", () => {
  const r = red();
  const ajena = firmarTransaccion(tx(r, CLAVE_ALICE, { chainId: 1n }), CLAVE_ALICE);
  assert.throws(() => r.enviar(ajena.crudo), /chain id/);
});

test("sin saldo para gas y valor la transacción ni se incluye", () => {
  const r = red();
  assert.throws(() => enviar(r, CLAVE_BOB, { valor: 5n * ETH }), /saldo insuficiente/);
  assert.equal(r.nonce(BOB), 0n, "una transacción rechazada no consume nonce");
});

test("una ejecución revertida conserva el nonce consumido y el gas pagado, pero deshace los efectos", () => {
  const r = red();
  const saldoBob = r.saldo(BOB);
  r.enviar(firmarTransaccion(tx(r, CLAVE_ALICE, { valor: 0n }), CLAVE_ALICE).crudo);
  // Alice delega en LoteSeguro (envía otro: su nonce de autoridad es el actual, sin +1)
  // y un tercero intenta ordenar el lote: revierte.
  const auth = firmarAutorizacion({ chainId: r.chainId, direccion: DELEGADO, nonce: r.nonce(ALICE) }, CLAVE_ALICE);
  r.enviar(firmarTransaccion(tx(r, CLAVE_OPERADOR, {
    tipo: TIPO_EIP7702, destino: ALICE, autorizaciones: [auth]
  }), CLAVE_OPERADOR).crudo);
  const nonceOperador = r.nonce(OPERADOR);
  const recibo = enviar(r, CLAVE_OPERADOR, {
    destino: ALICE, datos: codificarLlamada("ejecutarLote", { pagos: [{ a: OPERADOR, monto: ETH.toString() }] })
  });
  assert.equal(recibo.estado, "revertida");
  assert.match(recibo.motivo, /propia cuenta/);
  assert.equal(r.nonce(OPERADOR), nonceOperador + 1n);
  assert.equal(r.saldo(BOB), saldoBob);
});

test("los eventos Transfer salen en el recibo con el topic estándar", () => {
  const r = red();
  r.desplegarDelegado(DELEGADO, LoteSeguro);
  const auth = firmarAutorizacion({ chainId: r.chainId, direccion: DELEGADO, nonce: 0n }, CLAVE_ALICE);
  r.enviar(firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, destino: ALICE, autorizaciones: [auth] }), CLAVE_OPERADOR).crudo);
  const recibo = enviar(r, CLAVE_ALICE, {
    destino: ALICE, datos: codificarLlamada("ejecutarLote", { pagos: [{ token: USDT, a: BOB, monto: "1250000" }] })
  });
  assert.equal(recibo.registros.length, 1);
  assert.equal(recibo.registros[0].topics[0], TOPIC_TRANSFER);
  assert.equal(BigInt(recibo.registros[0].data), 1_250_000n);
});

// --- EIP-7702 ----------------------------------------------------------------------
function delegar(r, clavePrivada, direccion, { enviadoPor = CLAVE_OPERADOR, nonceAutor, chainId } = {}) {
  const autor = direccionDe(clavePrivada);
  const auth = firmarAutorizacion({
    chainId: chainId ?? r.chainId, direccion,
    nonce: nonceAutor ?? (enviadoPor === clavePrivada ? r.nonce(autor) + 1n : r.nonce(autor))
  }, clavePrivada);
  return r.enviar(firmarTransaccion(tx(r, enviadoPor, { tipo: TIPO_EIP7702, destino: BOB, autorizaciones: [auth] }), enviadoPor).crudo);
}

test("LE4 · una autorización instala el designador 0xef0100‖dirección y consume el nonce de la autoridad", () => {
  const r = red();
  const recibo = delegar(r, CLAVE_ALICE, DELEGADO);
  assert.equal(recibo.autorizaciones[0].aplicada, true);
  assert.ok(esDelegacion(r.codigo(ALICE)));
  assert.equal(r.codigo(ALICE), `0xef0100${DELEGADO.slice(2).toLowerCase()}`);
  assert.equal(destinoDeDelegacion(r.codigo(ALICE)).toLowerCase(), DELEGADO.toLowerCase());
  assert.equal(r.nonce(ALICE), 1n);
});

test("quien paga el gas no tiene por qué ser quien delega: la autorización es una firma desconectada", () => {
  const r = red();
  const recibo = delegar(r, CLAVE_ALICE, DELEGADO, { enviadoPor: CLAVE_OPERADOR });
  assert.equal(recibo.autorizaciones[0].autoridad, ALICE);
  assert.equal(decodificarTransaccion(firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, autorizaciones: [firmarAutorizacion({ chainId: 1n, direccion: DELEGADO, nonce: 0n }, CLAVE_ALICE)] }), CLAVE_OPERADOR).crudo).remitente, OPERADOR);
});

test("si el remitente firma su propia autorización, el nonce debe ser el de la transacción + 1", () => {
  const r = red();
  const equivocada = delegar(r, CLAVE_ALICE, DELEGADO, { enviadoPor: CLAVE_ALICE, nonceAutor: 0n });
  assert.equal(equivocada.autorizaciones[0].aplicada, false);
  assert.match(equivocada.autorizaciones[0].motivo, /nonce/);
  const correcta = delegar(r, CLAVE_ALICE, DELEGADO, { enviadoPor: CLAVE_ALICE });
  assert.equal(correcta.autorizaciones[0].aplicada, true);
});

test("una autorización de otra cadena se salta, pero chain id 0 vale en todas", () => {
  const r = red();
  assert.equal(delegar(r, CLAVE_ALICE, DELEGADO, { chainId: 1n }).autorizaciones[0].motivo, "chain id ajeno");
  assert.equal(delegar(r, CLAVE_ALICE, DELEGADO, { chainId: 0n }).autorizaciones[0].aplicada, true);
});

test("un autor distinto del dueño no puede hacer pasar una firma ajena como propia", () => {
  const r = red();
  const auth = firmarAutorizacion({ chainId: r.chainId, direccion: DELEGADO, nonce: 0n }, CLAVE_ALICE);
  const recibo = r.enviar(firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, autorizaciones: [auth] }), CLAVE_OPERADOR).crudo);
  assert.equal(recibo.autorizaciones[0].autoridad, ALICE);
  assert.equal(r.codigo(BOB), "0x", "la delegación afecta solo a la cuenta que firmó");
});

test("la lista de autorizaciones no puede estar vacía", () => {
  const r = red();
  assert.throws(() => firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, autorizaciones: [] }), CLAVE_OPERADOR), /al menos una/);
});

test("VENTANA DE NONCES · en orden descendente solo una de 50 autorizaciones coincide", () => {
  const r = red();
  // El atacante no conoce el nonce exacto porque la víctima sigue operando: firma una ventana.
  r.cuenta(ALICE).nonce = 30n; // estado preparado: el nonce real de Alice es 30
  const ventana = Array.from({ length: 50 }, (_, i) =>
    firmarAutorizacion({ chainId: r.chainId, direccion: DELEGADO, nonce: BigInt(55 - i) }, CLAVE_ALICE)); // 55 … 6
  const recibo = r.enviar(firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, autorizaciones: ventana, gasLimit: 2_000_000n }), CLAVE_OPERADOR).crudo);
  assert.equal(recibo.autorizaciones.filter((a) => a.aplicada).length, 1);
  assert.equal(recibo.autorizaciones.filter((a) => !a.aplicada).length, 49);
  assert.equal(r.nonce(ALICE), 31n, "la autoridad solo avanzó una vez");
});

test("VENTANA DE NONCES · en orden ascendente se encadenan: la tupla siguiente coincide con el nonce ya avanzado", () => {
  const r = red();
  for (let i = 0; i < 7; i += 1) enviar(r, CLAVE_ALICE, { valor: 1n });
  const ascendente = Array.from({ length: 10 }, (_, i) =>
    firmarAutorizacion({ chainId: r.chainId, direccion: DELEGADO, nonce: BigInt(5 + i) }, CLAVE_ALICE)); // 5…14; nonce real = 7
  const recibo = r.enviar(firmarTransaccion(tx(r, CLAVE_OPERADOR, { tipo: TIPO_EIP7702, autorizaciones: ascendente, gasLimit: 2_000_000n }), CLAVE_OPERADOR).crudo);
  const aplicadas = recibo.autorizaciones.filter((a) => a.aplicada).length;
  assert.equal(aplicadas, 8, "nonces 7…14 coinciden uno tras otro");
  assert.equal(r.nonce(ALICE), 15n, "el nonce de la víctima saltó sin que ella enviara nada: es una señal de detección");
});

test("revocar: delegar a la dirección cero restituye la cuenta a EOA", () => {
  const r = red();
  delegar(r, CLAVE_ALICE, DELEGADO);
  assert.ok(esDelegacion(r.codigo(ALICE)));
  delegar(r, CLAVE_ALICE, DIRECCION_CERO);
  assert.equal(r.codigo(ALICE), "0x");
});

test("una cuenta delegada puede seguir originando transacciones (EIP-3607 relajado)", () => {
  const r = red();
  delegar(r, CLAVE_ALICE, DELEGADO);
  assert.equal(enviar(r, CLAVE_ALICE, { valor: ETH }).estado, "exito");
});

test("lote seguro: solo la propia cuenta puede ordenar pagos", () => {
  const r = red();
  delegar(r, CLAVE_ALICE, DELEGADO);
  const propio = enviar(r, CLAVE_ALICE, { destino: ALICE, datos: codificarLlamada("ejecutarLote", { pagos: [{ a: BOB, monto: ETH.toString() }, { token: USDT, a: BOB, monto: "100" }] }) });
  assert.equal(propio.estado, "exito");
  const ajeno = enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos: codificarLlamada("ejecutarLote", { pagos: [{ a: OPERADOR, monto: ETH.toString() }] }) });
  assert.equal(ajeno.estado, "revertida");
});

test("patrocinio: el gas lo paga un tercero y el nonce interno impide repetir la instrucción", () => {
  const r = red();
  r.desplegarDelegado(DELEGADO, PatrocinioFirmado);
  delegar(r, CLAVE_ALICE, DELEGADO);
  const pagos = [{ a: BOB, monto: ETH.toString() }];
  const firma = firmarInstruccionPatrocinio({ chainId: r.chainId, cuenta: ALICE, nonceInterno: 0, pagos }, CLAVE_ALICE);
  const datos = codificarLlamada("ejecutarFirmado", { pagos, nonceInterno: 0, firma });
  assert.equal(enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos }).estado, "exito");
  assert.equal(enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos }).estado, "revertida", "repetir la misma instrucción falla");
});

test("patrocinio: una instrucción firmada por otra clave se revierte", () => {
  const r = red();
  r.desplegarDelegado(DELEGADO, PatrocinioFirmado);
  delegar(r, CLAVE_ALICE, DELEGADO);
  const pagos = [{ a: OPERADOR, monto: ETH.toString() }];
  const firma = firmarInstruccionPatrocinio({ chainId: r.chainId, cuenta: ALICE, nonceInterno: 0, pagos }, CLAVE_OPERADOR);
  const recibo = enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos: codificarLlamada("ejecutarFirmado", { pagos, nonceInterno: 0, firma }) });
  assert.match(recibo.motivo, /no está firmada por el dueño/);
});

test("LE5/LE8 · un delegado hostil simulado vacía la cuenta y la delegación sigue activa para fondos futuros", () => {
  const r = red();
  r.desplegarDelegado(DELEGADO, crearBarredorSimulado(OPERADOR));
  delegar(r, CLAVE_ALICE, DELEGADO);
  const primero = enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos: codificarLlamada("barrer", { destino: OPERADOR, tokens: [USDT] }) });
  assert.equal(primero.estado, "exito");
  assert.equal(r.saldo(ALICE), 0n);
  assert.equal(r.saldoToken(USDT, ALICE), 0n);
  // Nuevos depósitos: el operador los barre otra vez SIN ninguna firma nueva de la víctima.
  r.fondear(ALICE, 3n * ETH);
  r.emitirToken(USDT, ALICE, 7_000_000n);
  enviar(r, CLAVE_OPERADOR, { destino: ALICE, datos: codificarLlamada("barrer", { destino: OPERADOR, tokens: [USDT] }) });
  assert.equal(r.saldo(ALICE), 0n);
  assert.equal(r.saldoToken(USDT, OPERADOR), 12_000_000n);
});

test("el delegado hostil no obedece a nadie que no sea su operador", () => {
  const r = red();
  r.desplegarDelegado(DELEGADO, crearBarredorSimulado(OPERADOR));
  delegar(r, CLAVE_ALICE, DELEGADO);
  const recibo = enviar(r, CLAVE_BOB, { destino: ALICE, datos: codificarLlamada("barrer", { destino: BOB, tokens: [] }) });
  assert.equal(recibo.estado, "revertida");
});

// --- Congelamiento -----------------------------------------------------------------
test("LE7 · el emisor congela un token con lista de bloqueo, pero ETH no tiene botón de congelamiento", () => {
  const r = red();
  r.congelar(USDT, ALICE, EMISOR);
  assert.throws(() => r.transferirToken(USDT, ALICE, BOB, 1n), /congelada/);
  assert.equal(enviar(r, CLAVE_ALICE, { valor: ETH }).estado, "exito", "el ETH de la misma dirección sigue moviéndose");
  assert.throws(() => r.congelar(USDT, BOB, BOB), /solo el emisor/);
});

test("un token sin función de congelamiento no puede congelarse", () => {
  const r = red();
  r.crearToken({ direccion: "0x000000000000000000000000000000000000dEaD", simbolo: "LIBRE", emisor: EMISOR, congelable: false });
  assert.throws(() => r.congelar("0x000000000000000000000000000000000000dEaD", ALICE, EMISOR), /no tiene función de congelamiento/);
});

test("los hashes de transacción son estables y los bytes crudos viajan en hexadecimal", () => {
  const r = red();
  const firmada = firmarTransaccion(tx(r, CLAVE_ALICE, { valor: 1n }), CLAVE_ALICE);
  assert.match(aHex(firmada.crudo), /^0x02/);
  assert.deepEqual(deHex(aHex(firmada.crudo)), firmada.crudo);
});
