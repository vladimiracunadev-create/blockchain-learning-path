import test from "node:test";
import assert from "node:assert/strict";
import { aUnidades, aTexto, reescalar, evaluarAllowance, MAXIMO_UINT256 } from "./token-amounts.mjs";

test("convierte según los decimales del token, no según una suposición", () => {
  assert.equal(aUnidades("5", 6), 5_000_000n);          // USDC
  assert.equal(aUnidades("5", 18), 5_000_000_000_000_000_000n); // WETH
  assert.equal(aUnidades("5", 8), 500_000_000n);        // WBTC
});

test("el error de asumir 18 decimales en USDC es de 10^12", () => {
  assert.equal(aUnidades("5", 18) / aUnidades("5", 6), 1_000_000_000_000n);
});

test("ida y vuelta sin perder nada", () => {
  for (const [cantidad, decimales] of [["1.5", 18], ["0.000001", 6], ["12345.6789", 8], ["0", 18]]) {
    assert.equal(aTexto(aUnidades(cantidad, decimales), decimales), String(Number(cantidad)));
  }
});

test("acepta la coma decimal, que es como se escribe en español", () => {
  assert.equal(aUnidades("1,5", 6), aUnidades("1.5", 6));
});

test("se niega a truncar en silencio", () => {
  // USDC tiene 6 decimales: 0,0000005 no es representable. Redondear sin avisar
  // es exactamente cómo desaparece dinero sin que nadie lo note.
  assert.throws(() => aUnidades("0.0000005", 6), /precisión/);
});

test("rechaza lo que no es un número", () => {
  for (const malo of ["", "abc", "1.2.3", "."]) {
    assert.throws(() => aUnidades(malo, 6), /no numérica/, `debería rechazar "${malo}"`);
  }
});

test("mantiene la precisión donde un flotante ya la habría perdido", () => {
  // Number.MAX_SAFE_INTEGER es ~9e15; un saldo de 18 decimales lo supera enseguida.
  const enorme = aUnidades("123456789.123456789123456789", 18);
  assert.equal(aTexto(enorme, 18), "123456789.123456789123456789");
  assert.ok(enorme > BigInt(Number.MAX_SAFE_INTEGER));
});

test("reescala entre tokens de distinta precisión", () => {
  const precio = 312_450_000_000n; // 3124,50 con 8 decimales
  assert.equal(aTexto(precio, 8), "3124.5");
  assert.equal(aTexto(reescalar(precio, 8, 18), 18), "3124.5");
  assert.equal(aTexto(reescalar(precio, 8, 6), 6), "3124.5");
});

test("una allowance acotada solo expone lo autorizado", () => {
  const r = evaluarAllowance({ allowance: 50n, necesario: 50n, saldo: 1000n });
  assert.equal(r.suficiente, true);
  assert.equal(r.infinita, false);
  assert.equal(r.expuesto, 50n);
  assert.equal(r.riesgo, "bajo");
});

test("una allowance infinita expone el saldo entero", () => {
  const r = evaluarAllowance({ allowance: MAXIMO_UINT256, necesario: 50n, saldo: 1000n });
  assert.equal(r.infinita, true);
  assert.equal(r.expuesto, 1000n);
  assert.equal(r.riesgo, "alto");
  assert.equal(r.recomendado, 50n, "lo recomendable es autorizar exactamente lo necesario");
});

test("una allowance insuficiente se detecta antes de enviar la transacción", () => {
  const r = evaluarAllowance({ allowance: 10n, necesario: 50n, saldo: 1000n });
  assert.equal(r.suficiente, false);
});
