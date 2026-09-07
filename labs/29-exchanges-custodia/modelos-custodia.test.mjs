import test from "node:test";
import assert from "node:assert/strict";
import { clasificarOperacion } from "./modelos-custodia.mjs";

test("una compraventa en CEX puede existir solo en el ledger interno", () => {
  assert.equal(clasificarOperacion({ plataforma: "cex" }).estado, "off-chain");
});

test("un retiro confirmado conecta el ledger del CEX con la cadena", () => {
  assert.equal(clasificarOperacion({ plataforma: "cex", retiroConfirmado: true }).estado, "on-chain");
});

test("rechaza etiquetas que aparenten un modelo conocido", () => {
  assert.throws(() => clasificarOperacion({ plataforma: "broker" }), /desconocido/);
});
