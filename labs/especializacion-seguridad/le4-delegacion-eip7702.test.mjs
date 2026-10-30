import test from "node:test";
import assert from "node:assert/strict";
import {
  DELEGADO_LAB, ETH, TOKEN_LAB, escenarioDelegacionLegitima, escenarioDelegadoHostil, escenarioPatrocinio,
  escenarioVentanaDeNonces
} from "./le4-delegacion-eip7702.mjs";

test("antes de delegar la cuenta es una EOA; después lleva el designador 0xef0100‖delegado", () => {
  const { antes, despuesDeDelegar } = escenarioDelegacionLegitima();
  assert.equal(antes.codigo, "0x");
  assert.equal(antes.delegada, false);
  assert.equal(despuesDeDelegar.codigo, `0xef0100${DELEGADO_LAB.slice(2).toLowerCase()}`);
  assert.equal(despuesDeDelegar.delegadoA.toLowerCase(), DELEGADO_LAB.toLowerCase());
});

test("delegar consume dos nonces del dueño: el de su transacción y el de su autorización", () => {
  const { antes, despuesDeDelegar } = escenarioDelegacionLegitima();
  assert.equal(despuesDeDelegar.nonce - antes.nonce, 2n);
});

test("la propia cuenta usa el lote; un intruso es revertido", () => {
  const { lote, intrusion } = escenarioDelegacionLegitima();
  assert.equal(lote.estado, "exito");
  assert.equal(intrusion.estado, "revertida");
  assert.match(intrusion.motivo, /propia cuenta/);
});

test("revocar (delegar a la dirección cero) devuelve el código vacío", () => {
  const { despuesDeRevocar } = escenarioDelegacionLegitima();
  assert.equal(despuesDeRevocar.delegada, false);
  assert.equal(despuesDeRevocar.codigo, "0x");
});

test("patrocinio: el gas lo paga el patrocinador y el nonce interno bloquea la repetición", () => {
  const { primera, repeticion, saldoPatrocinador } = escenarioPatrocinio();
  assert.equal(primera.estado, "exito");
  assert.equal(repeticion.estado, "revertida");
  assert.ok(saldoPatrocinador < 20n * ETH);
});

test("ventana de nonces descendente: de 50 firmas solo una se aplica y el nonce avanza 1", () => {
  const v = escenarioVentanaDeNonces({ orden: "descendente" });
  assert.equal(v.firmadas, 50);
  assert.equal(v.aplicadas, 1);
  assert.equal(v.inertes, 49);
  assert.equal(v.saltoDeNonce, 1);
});

test("ventana de nonces ascendente: se encadenan varias y el nonce de la cuenta salta sin que su dueño opere", () => {
  const v = escenarioVentanaDeNonces({ orden: "ascendente" });
  assert.ok(v.aplicadas > 1, "el orden cambia el resultado");
  assert.equal(v.saltoDeNonce, v.aplicadas);
});

test("el orden de la lista es la variable que los informes públicos no publican", () => {
  const d = escenarioVentanaDeNonces({ orden: "descendente" });
  const a = escenarioVentanaDeNonces({ orden: "ascendente" });
  assert.notEqual(d.aplicadas, a.aplicadas);
});

test("con un tamaño de ventana distinto sigue siendo exactamente una en orden descendente", () => {
  for (const tamano of [5, 20, 50]) {
    assert.equal(escenarioVentanaDeNonces({ orden: "descendente", tamano }).aplicadas, 1);
  }
});

test("delegado hostil simulado: vacía la cuenta y la delegación sigue activa para fondos futuros", () => {
  const e = escenarioDelegadoHostil();
  assert.equal(e.barrido.estado, "exito");
  assert.equal(e.segundoBarrido.estado, "exito", "sin ninguna firma nueva de la víctima");
  assert.equal(e.delegacionSigueActiva, true);
  assert.equal(e.red.saldo(e.dueno.direccion), 0n);
  assert.equal(e.red.saldoToken(TOKEN_LAB, e.dueno.direccion), 0n);
});

test("quien envía la delegación hostil es un tercero: la autoridad no firma ninguna transacción", () => {
  const e = escenarioDelegadoHostil();
  assert.equal(e.delegacion.autorizaciones[0].autoridad, e.dueno.direccion);
  assert.equal(e.red.nonce(e.dueno.direccion), 1n, "su único nonce consumido es el de la autorización");
});
