import test from "node:test";
import assert from "node:assert/strict";
import {
  analizarMaleabilidad, construirMensajeConDominio, crearVerificadorConDominio, firmarConNonceFijo,
  firmarMensaje, hashMensajePersonal, recuperarClaveDeNonceRepetido, recuperarFirmante, verificarFirma
} from "./le2-firmas-digitales.mjs";
import { clavePublica } from "./nucleo/secp256k1.mjs";
import { aHex } from "./nucleo/bytes.mjs";

const CLAVE = 0xa11ce001n;
const OTRA = 0xb0b00002n;

test("firmar y verificar contra la dirección del firmante", () => {
  const firmada = firmarMensaje("Autorizo la práctica", CLAVE);
  assert.equal(firmada.firma.length, 2 + 130, "r‖s‖v = 65 bytes");
  assert.equal(verificarFirma(firmada.mensaje, firmada.firma, firmada.firmante).valida, true);
});

test("el hash personal usa el prefijo EIP-191 con la longitud en bytes UTF-8", () => {
  // La longitud cuenta BYTES, no caracteres: 'ñ' ocupa dos.
  assert.notEqual(aHex(hashMensajePersonal("año")), aHex(hashMensajePersonal("ano")));
  assert.equal(aHex(hashMensajePersonal("hola")).length, 66);
});

test("un mensaje alterado no verifica contra el firmante original", () => {
  const firmada = firmarMensaje("pagar 10", CLAVE);
  assert.equal(verificarFirma("pagar 90", firmada.firma, firmada.firmante).valida, false);
});

test("recuperar da una dirección aunque el mensaje sea otro: hay que comparar con la esperada", () => {
  const firmada = firmarMensaje("pagar 10", CLAVE);
  const recuperada = recuperarFirmante("pagar 90", firmada.firma);
  assert.ok(recuperada, "ecrecover siempre devuelve ALGUNA dirección");
  assert.notEqual(recuperada, firmada.firmante);
});

test("una firma de otra clave no verifica", () => {
  const firmada = firmarMensaje("pagar 10", OTRA);
  assert.equal(verificarFirma("pagar 10", firmada.firma, firmarMensaje("x", CLAVE).firmante).valida, false);
});

test("una firma con longitud incorrecta no recupera nada", () => {
  assert.equal(recuperarFirmante("x", "0x1234"), null);
});

test("la gemela maleable valida matemáticamente pero Ethereum la rechaza", () => {
  const firmada = firmarMensaje("maleable", CLAVE);
  const analisis = analizarMaleabilidad(firmada.mensaje, firmada.firma, firmada.firmante);
  assert.equal(analisis.originalEsLowS, true);
  assert.equal(analisis.gemelaValidaMatematicamente, true);
  assert.equal(analisis.gemelaAceptadaPorEthereum, false);
});

test("sin dominio, la misma firma sirve en otro contexto; con dominio, no", () => {
  const ahora = () => 1000;
  const verificador = crearVerificadorConDominio({ chainId: 31337, contrato: "0xABCDEF0000000000000000000000000000000001", ahora });
  const firmante = firmarMensaje("x", CLAVE).firmante;

  const valido = construirMensajeConDominio({ chainId: 31337, contrato: "0xABCDEF0000000000000000000000000000000001", nonce: 1, accion: "pagar 10", expira: 2000 });
  const firmaValida = firmarMensaje(valido, CLAVE).firma;
  assert.equal(verificador.aceptar(valido, firmaValida, firmante).aceptada, true);

  assert.match(verificador.aceptar(valido, firmaValida, firmante).motivo, /repetición/);

  const otraCadena = construirMensajeConDominio({ chainId: 1, contrato: "0xABCDEF0000000000000000000000000000000001", nonce: 2, accion: "pagar 10", expira: 2000 });
  assert.equal(verificador.aceptar(otraCadena, firmarMensaje(otraCadena, CLAVE).firma, firmante).motivo, "otra cadena");

  const otroContrato = construirMensajeConDominio({ chainId: 31337, contrato: "0xAAAAAA0000000000000000000000000000000002", nonce: 3, accion: "pagar 10", expira: 2000 });
  assert.equal(verificador.aceptar(otroContrato, firmarMensaje(otroContrato, CLAVE).firma, firmante).motivo, "otro contrato");

  const caducada = construirMensajeConDominio({ chainId: 31337, contrato: "0xABCDEF0000000000000000000000000000000001", nonce: 4, accion: "pagar 10", expira: 500 });
  assert.equal(verificador.aceptar(caducada, firmarMensaje(caducada, CLAVE).firma, firmante).motivo, "caducada");
});

test("dos firmas con el mismo nonce k revelan la clave privada", () => {
  const a = firmarConNonceFijo("transferir 1", CLAVE, 1234567n);
  const b = firmarConNonceFijo("transferir 2", CLAVE, 1234567n);
  assert.equal(a.r, b.r, "mismo k ⇒ mismo r: la huella visible del fallo");
  assert.equal(recuperarClaveDeNonceRepetido(a, b, clavePublica(CLAVE)), CLAVE);
});

test("con nonces distintos no hay fuga", () => {
  const a = firmarConNonceFijo("transferir 1", CLAVE, 1234567n);
  const b = firmarConNonceFijo("transferir 2", CLAVE, 7654321n);
  assert.notEqual(a.r, b.r);
  assert.equal(recuperarClaveDeNonceRepetido(a, b, clavePublica(CLAVE)), null);
});

test("el nonce determinista (RFC 6979) evita el fallo: mensajes distintos dan r distintos", () => {
  const a = firmarMensaje("transferir 1", CLAVE).firma.slice(0, 66);
  const b = firmarMensaje("transferir 2", CLAVE).firma.slice(0, 66);
  assert.notEqual(a, b);
});
