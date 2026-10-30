import test from "node:test";
import assert from "node:assert/strict";
import {
  crearBilleteraAleatoria, crearBilleteraDePrueba, crearFamilia, describirParaBitacora,
  medirDeteccionDeErrores, verificarEsDePrueba
} from "./le1-billeteras-de-prueba.mjs";
import { esDireccionValida } from "./nucleo/direcciones.mjs";

test("la misma etiqueta produce siempre la misma billetera (resultado reproducible)", () => {
  assert.equal(crearBilleteraDePrueba("alice").direccion, crearBilleteraDePrueba("alice").direccion);
  assert.notEqual(crearBilleteraDePrueba("alice").direccion, crearBilleteraDePrueba("bob").direccion);
});

test("la dirección generada es válida con checksum EIP-55", () => {
  const { direccion } = crearBilleteraDePrueba("alice");
  assert.match(direccion, /^0x[0-9a-fA-F]{40}$/);
  assert.ok(esDireccionValida(direccion));
});

test("una billetera de prueba se puede recomputar desde su etiqueta; una aleatoria no", () => {
  assert.equal(verificarEsDePrueba(crearBilleteraDePrueba("alice")), true);
  const aleatoria = crearBilleteraAleatoria();
  assert.equal(aleatoria.esDePrueba, false);
  assert.equal(verificarEsDePrueba({ ...aleatoria, etiqueta: "alice" }), false);
});

test("una billetera cuya clave no corresponde a su etiqueta no se acepta como de prueba", () => {
  const falsa = { ...crearBilleteraDePrueba("alice"), clavePrivada: 12345n };
  assert.equal(verificarEsDePrueba(falsa), false);
});

test("una etiqueta vacía se rechaza", () => {
  assert.throws(() => crearBilleteraDePrueba("   "), /vacía/);
});

test("la familia crea direcciones distintas y valida su tamaño", () => {
  const familia = crearFamilia("custodio", 4);
  assert.equal(new Set(familia.map((b) => b.direccion)).size, 4);
  assert.throws(() => crearFamilia("x", 0), /entre 1 y 50/);
  assert.throws(() => crearFamilia("x", 51), /entre 1 y 50/);
});

test("la descripción para bitácora nunca incluye la clave privada", () => {
  const texto = JSON.stringify(describirParaBitacora(crearBilleteraDePrueba("alice")), (_, v) => (typeof v === "bigint" ? v.toString() : v));
  assert.ok(!texto.includes(crearBilleteraDePrueba("alice").clavePrivada.toString()));
  assert.ok(texto.includes("••••"));
});

test("el checksum detecta prácticamente todas las alteraciones de una letra", () => {
  const { direccion } = crearBilleteraDePrueba("alice");
  const { mutaciones, detectadas } = medirDeteccionDeErrores(direccion);
  assert.ok(mutaciones > 0);
  assert.equal(detectadas, mutaciones, "cambiar la capitalización de una letra rompe el checksum");
});
