import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas } from "./cadena-sintetica.mjs";
import {
  normalizarTransaccion,
  validarRegistro,
  crearAlmacen,
  cargarCadena
} from "./normalizar-almacenar.mjs";

const TX_BASE = {
  hash: "0x" + "a".repeat(40),
  numeroBloque: 5,
  indiceEnBloque: 0,
  marcaTiempo: 1_767_571_200,
  de: "0x" + "1".repeat(40),
  para: "0x" + "2".repeat(40),
  valor: 1_000_000,
  nonce: 3,
  gasUsado: 21_000,
  precioGas: 10_000_000_000,
  comision: 210_000_000_000_000,
  estado: 1,
  tipo: "nativo"
};

test("normaliza una transacción a un registro plano con importes como string", () => {
  const reg = normalizarTransaccion(TX_BASE);
  assert.equal(reg.hash, TX_BASE.hash);
  assert.equal(typeof reg.valor, "string");
  assert.equal(typeof reg.comision, "string");
  assert.equal(reg.valor, "1000000");
  assert.equal(reg.dia, "2026-01-05");
  assert.equal(reg.marcaTiempoISO, "2026-01-05T00:00:00.000Z");
});

test("un registro válido no reporta problemas", () => {
  const reg = normalizarTransaccion(TX_BASE);
  assert.deepEqual(validarRegistro(reg), []);
});

test("detecta campos faltantes, importes negativos y estado desconocido", () => {
  const reg = normalizarTransaccion(TX_BASE);
  assert.ok(validarRegistro({ ...reg, hash: "" }).length > 0);
  assert.ok(validarRegistro({ ...reg, valor: "-5" }).some((p) => p.includes("valor")));
  assert.ok(validarRegistro({ ...reg, estado: 7 }).some((p) => p.includes("estado")));
});

test("detecta direcciones con formato inválido", () => {
  const reg = normalizarTransaccion(TX_BASE);
  assert.ok(validarRegistro({ ...reg, de: "no-es-una-direccion" }).some((p) => p.includes("dirección")));
});

test("insertar el mismo hash dos veces NO duplica el registro (idempotencia)", () => {
  const almacen = crearAlmacen();
  const reg = normalizarTransaccion(TX_BASE);
  assert.equal(almacen.insertar(reg), true);
  assert.equal(almacen.insertar(reg), false);
  assert.equal(almacen.contar(), 1);
  assert.equal(almacen.consultarPorDireccion(TX_BASE.de).length, 1);
});

test("consultarPorDireccion encuentra tanto como remitente como destinatario", () => {
  const almacen = crearAlmacen();
  almacen.insertar(normalizarTransaccion(TX_BASE));
  const otra = { ...TX_BASE, hash: "0x" + "b".repeat(40), de: "0x" + "9".repeat(40), para: TX_BASE.de };
  almacen.insertar(normalizarTransaccion(otra));
  assert.equal(almacen.consultarPorDireccion(TX_BASE.de).length, 2);
});

test("consultarPorRangoBloques filtra por bloque y ordena por posición", () => {
  const almacen = crearAlmacen();
  const tx1 = { ...TX_BASE, hash: "0x" + "c".repeat(40), numeroBloque: 10 };
  const tx2 = { ...TX_BASE, hash: "0x" + "d".repeat(40), numeroBloque: 20 };
  const tx3 = { ...TX_BASE, hash: "0x" + "e".repeat(40), numeroBloque: 30 };
  for (const tx of [tx3, tx1, tx2]) almacen.insertar(normalizarTransaccion(tx));
  const resultado = almacen.consultarPorRangoBloques(10, 20);
  assert.deepEqual(resultado.map((r) => r.numeroBloque), [10, 20]);
});

test("cargarCadena sobre la cadena sintética no pierde transacciones y contar() cuadra", () => {
  const { bloques } = cadenaCuentas({});
  const resumen = cargarCadena(bloques);
  assert.equal(resumen.invalidos, 0);
  assert.equal(resumen.insertados, resumen.almacen.contar());
  assert.equal(resumen.duplicadosDescartados, 0);
});

test("recargar el mismo lote (simula un reintento) no crece el almacén", () => {
  const { bloques } = cadenaCuentas({});
  const primera = cargarCadena(bloques);
  const totalPrevio = primera.almacen.contar();
  const segunda = cargarCadena(bloques, primera.almacen);
  assert.equal(segunda.insertados, 0);
  assert.equal(segunda.duplicadosDescartados, totalPrevio);
  assert.equal(segunda.almacen.contar(), totalPrevio);
});
