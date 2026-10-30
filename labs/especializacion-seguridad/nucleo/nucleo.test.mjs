import test from "node:test";
import assert from "node:assert/strict";
import { aHex, deHex, utf8 } from "./bytes.mjs";
import { keccak256Hex, selector } from "./keccak.mjs";
import { N, MITAD_N, clavePublica, direccionDePublica, firmarHash, recuperarPublica, verificarHash } from "./secp256k1.mjs";
import { codificarRlp, decodificarRlp } from "./rlp.mjs";
import { aChecksum, direccionDeClavePrivada, esDireccionValida } from "./direcciones.mjs";
import { keccak256 } from "./keccak.mjs";

// --- Keccak-256 -----------------------------------------------------------------
test("Keccak-256 coincide con los vectores públicos de la cadena vacía y 'abc'", () => {
  assert.equal(keccak256Hex(""), "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
  assert.equal(keccak256Hex("abc"), "0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45");
});

test("el selector de transfer y el topic de Transfer son los del estándar ERC-20", () => {
  assert.equal(selector("transfer(address,uint256)"), "0xa9059cbb");
  assert.equal(keccak256Hex("Transfer(address,address,uint256)"),
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
});

test("Keccak-256 absorbe correctamente mensajes de más de un bloque (136 bytes)", () => {
  const largo = keccak256Hex("a".repeat(200));
  assert.match(largo, /^0x[0-9a-f]{64}$/);
  assert.notEqual(largo, keccak256Hex("a".repeat(201)));
  // Un mensaje que ocupa exactamente la tasa necesita un bloque de relleno completo.
  assert.notEqual(keccak256Hex("a".repeat(136)), keccak256Hex("a".repeat(135)));
});

// --- secp256k1 y direcciones ----------------------------------------------------
test("las claves privadas 1, 2 y 3 producen las direcciones públicas conocidas", () => {
  assert.equal(direccionDeClavePrivada(1n), "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf");
  assert.equal(direccionDeClavePrivada(2n), "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF");
  assert.equal(direccionDeClavePrivada(3n), "0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69");
});

test("la clave pública de d = 1 es el generador G", () => {
  const publica = aHex(clavePublica(1n));
  assert.ok(publica.startsWith("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"));
});

test("firmar y recuperar devuelve la misma clave pública (ecrecover)", () => {
  const hash = keccak256(utf8("autorizo una operación de laboratorio"));
  const firma = firmarHash(hash, 0xabc123n);
  assert.deepEqual(recuperarPublica(hash, firma), clavePublica(0xabc123n));
  assert.ok(verificarHash(hash, firma, clavePublica(0xabc123n)));
});

test("la firma es determinista: mismo mensaje y misma clave dan los mismos (r, s, v)", () => {
  const hash = keccak256(utf8("determinismo RFC 6979"));
  assert.deepEqual(firmarHash(hash, 77n), firmarHash(hash, 77n));
});

test("alterar un solo bit del mensaje invalida la firma o cambia al firmante recuperado", () => {
  const hash = keccak256(utf8("monto=100"));
  const firma = firmarHash(hash, 99n);
  const alterado = keccak256(utf8("monto=900"));
  assert.equal(verificarHash(alterado, firma, clavePublica(99n)), false);
  assert.notDeepEqual(recuperarPublica(alterado, firma), clavePublica(99n));
});

test("la firma siempre sale en forma low-s y la forma alta se rechaza (EIP-2)", () => {
  const hash = keccak256(utf8("maleabilidad"));
  const { r, s, v } = firmarHash(hash, 5n);
  assert.ok(s <= MITAD_N);
  const maleada = { r, s: N - s, v: v ^ 1 };
  // La firma maleada valida matemáticamente al mismo firmante…
  assert.deepEqual(recuperarPublica(hash, maleada, { exigirLowS: false }), clavePublica(5n));
  // …pero Ethereum la rechaza para que cada firma tenga una única forma.
  assert.equal(recuperarPublica(hash, maleada), null);
});

test("rechaza firmas con r, s o v fuera de rango", () => {
  const hash = keccak256(utf8("rangos"));
  assert.equal(recuperarPublica(hash, { r: 0n, s: 1n, v: 0 }), null);
  assert.equal(recuperarPublica(hash, { r: 1n, s: N, v: 0 }), null);
  assert.equal(recuperarPublica(hash, { r: 1n, s: 1n, v: 2 }), null);
});

test("una clave privada fuera de [1, n−1] se rechaza", () => {
  assert.throws(() => clavePublica(0n), /rango/);
  assert.throws(() => clavePublica(N), /rango/);
});

test("la dirección es el sufijo de 20 bytes del hash de la clave pública", () => {
  const publica = clavePublica(1n);
  assert.equal(direccionDePublica(publica).length, 20);
});

// --- EIP-55 ---------------------------------------------------------------------
test("EIP-55 reproduce el ejemplo de la propia especificación", () => {
  assert.equal(aChecksum("0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed"), "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed");
});

test("una dirección con mayúsculas alteradas falla el checksum; en minúsculas no se puede comprobar", () => {
  assert.equal(esDireccionValida("0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"), true);
  assert.equal(esDireccionValida("0x5AAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"), false);
  assert.equal(esDireccionValida("0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed"), true);
  assert.equal(esDireccionValida("0x1234"), false);
});

// --- RLP ------------------------------------------------------------------------
test("RLP reproduce los ejemplos canónicos del Yellow Paper", () => {
  assert.equal(aHex(codificarRlp("dog")), "0x83646f67");
  assert.equal(aHex(codificarRlp(["cat", "dog"])), "0xc88363617483646f67");
  assert.equal(aHex(codificarRlp("")), "0x80");
  assert.equal(aHex(codificarRlp([])), "0xc0");
  assert.equal(aHex(codificarRlp(0)), "0x80", "el entero 0 es la cadena vacía");
  assert.equal(aHex(codificarRlp(15)), "0x0f");
  assert.equal(aHex(codificarRlp(1024)), "0x820400");
});

test("RLP codifica longitudes de 56 bytes o más con prefijo de longitud", () => {
  const cadena = "Lorem ipsum dolor sit amet, consectetur adipisicing elit";
  assert.equal(cadena.length, 56);
  assert.equal(aHex(codificarRlp(cadena)).slice(0, 6), "0xb838");
});

test("RLP decodifica lo que codifica, incluidas listas anidadas", () => {
  const original = [1n, "hola", [2n, [3n]], []];
  const decodificado = decodificarRlp(codificarRlp(original));
  assert.equal(decodificado.length, 4);
  assert.deepEqual(decodificado[1], utf8("hola"));
  assert.deepEqual(decodificado[3], []);
});

test("RLP rechaza bytes sobrantes y entradas truncadas", () => {
  assert.throws(() => decodificarRlp(deHex("0x8300")), /truncado/);
  assert.throws(() => decodificarRlp(deHex("0x0f0f")), /sobrantes/);
});
