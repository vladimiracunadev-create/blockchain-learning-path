import test from "node:test";
import assert from "node:assert/strict";
import {
  ETH, TOKEN_LAB, crearEscenario, ejecutarEscenarioTransferencias, medirValor, probarRechazos, transferirEth,
  transferirToken, verificarConservacion
} from "./le3-transferencias-simuladas.mjs";

test("el escenario completo conserva el ETH (descontadas las comisiones) y los tokens", () => {
  const { conservacion, antes, despues } = ejecutarEscenarioTransferencias();
  assert.deepEqual(conservacion, { ethConservado: true, tokensConservados: true });
  assert.ok(despues.eth < antes.eth, "las comisiones salen del libro de cuentas");
  assert.ok(despues.comisiones > 0n);
});

test("los saldos finales coinciden con las cuatro transferencias", () => {
  const { red, billeteras } = ejecutarEscenarioTransferencias();
  const { alice, bob, carol } = billeteras;
  assert.equal(red.saldoToken(TOKEN_LAB, alice.direccion), 750_000_000n);
  assert.equal(red.saldoToken(TOKEN_LAB, carol.direccion), 200_000_000n);
  assert.equal(red.saldoToken(TOKEN_LAB, bob.direccion), 50_000_000n);
  assert.ok(red.saldo(bob.direccion) > 11n * ETH, "recibió 2 ETH y envió 0,5 ETH + comisión");
});

test("cada transferencia avanza el nonce solo del remitente", () => {
  const { red, billeteras } = ejecutarEscenarioTransferencias();
  assert.equal(red.nonce(billeteras.alice.direccion), 2n);
  assert.equal(red.nonce(billeteras.bob.direccion), 1n);
  assert.equal(red.nonce(billeteras.carol.direccion), 1n);
});

test("la tabla de movimientos reconstruye los eventos Transfer del token", () => {
  const { movimientos, billeteras } = ejecutarEscenarioTransferencias();
  const conTokens = movimientos.filter((m) => m.transferenciasToken.length > 0);
  assert.equal(conTokens.length, 2);
  assert.equal(conTokens[0].transferenciasToken[0].de.toLowerCase(), billeteras.alice.direccion.toLowerCase());
  assert.equal(conTokens[0].transferenciasToken[0].monto, 250_000_000n);
});

test("la red rechaza nonce repetido, otra cadena y saldo insuficiente", () => {
  const r = probarRechazos();
  assert.match(r["nonce repetido"], /nonce/);
  assert.match(r["otra cadena"], /chain id/);
  assert.match(r["saldo insuficiente"], /saldo insuficiente/);
  assert.equal(r["remitente declarado"], "aceptada", "decodificar recupera el remitente real");
});

test("un token transferido sin saldo se revierte pero consume nonce y gas", () => {
  const { red, bob } = crearEscenario();
  const nonceAntes = red.nonce(bob.direccion);
  const { recibo } = transferirToken(red, bob, bob.direccion, 1n);
  assert.equal(recibo.estado, "revertida");
  assert.equal(red.nonce(bob.direccion), nonceAntes + 1n);
});

test("una transferencia a uno mismo solo cuesta comisión", () => {
  const { red, alice } = crearEscenario();
  const antes = medirValor(red, [alice.direccion]);
  transferirEth(red, alice, alice.direccion, ETH);
  const despues = medirValor(red, [alice.direccion]);
  assert.deepEqual(verificarConservacion(antes, despues), { ethConservado: true, tokensConservados: true });
});
