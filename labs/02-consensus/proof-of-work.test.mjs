import test from "node:test";
import assert from "node:assert/strict";
import { minar, verificar, hashDeBloque } from "./proof-of-work.mjs";

test("el nonce encontrado cumple el objetivo de dificultad", () => {
  const resultado = minar("bloque de prueba", 3);
  assert.ok(resultado.hash.startsWith("000"), `hash ${resultado.hash} no cumple el objetivo`);
  assert.equal(hashDeBloque("bloque de prueba", resultado.nonce), resultado.hash);
});

test("verificar es barato: cualquiera comprueba el trabajo con un solo hash", () => {
  const { nonce } = minar("bloque de prueba", 3);
  assert.equal(verificar({ payload: "bloque de prueba", nonce, dificultad: 3 }).valido, true);
  assert.equal(verificar({ payload: "bloque de prueba", nonce: nonce + 1, dificultad: 3 }).valido, false);
});

test("cambiar el contenido invalida el trabajo ya hecho", () => {
  const { nonce } = minar("pago de 10", 3);
  assert.equal(verificar({ payload: "pago de 1000", nonce, dificultad: 3 }).valido, false);
});

test("más dificultad exige más intentos", () => {
  assert.ok(minar("carrera", 3).nonce > minar("carrera", 1).nonce);
});
