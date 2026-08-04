// Prácticas 29 y 33 — Montos de token y allowances.
//
// El error de los decimales es el más caro que comete un principiante y el más
// fácil de evitar. Los tokens NO tienen decimales: tienen enteros y un número
// (`decimals`) que dice dónde imaginar la coma.
//
// Todo va en BigInt a propósito. Un `number` de JavaScript pierde precisión por
// encima de 2^53 y un saldo de 18 decimales lo supera con menos de 0,01 ETH; que
// el redondeo decida cuánto dinero se mueve no es aceptable.
//
// Uso: node labs/07-dapps/token-amounts.mjs
import { ejecutadoDirectamente } from "../run-directo.mjs";

// Texto legible ("1,5") → unidades enteras del token.
export function aUnidades(cantidad, decimales) {
  if (!Number.isInteger(decimales) || decimales < 0) throw new RangeError("decimales inválidos");
  const texto = String(cantidad).trim().replace(",", ".");
  if (!/^-?\d*\.?\d*$/.test(texto) || texto === "" || texto === ".") {
    throw new TypeError(`Cantidad no numérica: ${cantidad}`);
  }
  const negativo = texto.startsWith("-");
  const [entera, fraccion = ""] = texto.replace("-", "").split(".");
  if (fraccion.length > decimales) {
    // Truncar en silencio es cómo se pierde dinero sin que nadie se entere.
    throw new RangeError(`${cantidad} tiene más de ${decimales} decimales: se perdería precisión`);
  }
  const unidades = BigInt((entera || "0") + fraccion.padEnd(decimales, "0"));
  return negativo ? -unidades : unidades;
}

// Unidades enteras → texto legible, sin pasar jamás por un flotante.
export function aTexto(unidades, decimales) {
  const negativo = unidades < 0n;
  const absoluto = (negativo ? -unidades : unidades).toString().padStart(decimales + 1, "0");
  const entera = absoluto.slice(0, absoluto.length - decimales);
  const fraccion = absoluto.slice(absoluto.length - decimales).replace(/0+$/, "");
  return `${negativo ? "-" : ""}${entera}${fraccion ? "." + fraccion : ""}`;
}

// Lleva un monto de un token a la escala de otro. Comparar un precio de 8
// decimales con un saldo de 18 sin normalizar da resultados absurdos.
export function reescalar(unidades, desdeDecimales, hastaDecimales) {
  if (hastaDecimales >= desdeDecimales) {
    return unidades * 10n ** BigInt(hastaDecimales - desdeDecimales);
  }
  return unidades / 10n ** BigInt(desdeDecimales - hastaDecimales);
}

export const MAXIMO_UINT256 = 2n ** 256n - 1n;

// Una allowance "infinita" expone TODO el saldo, presente y futuro, a quien la
// recibe. La función no la prohíbe: la marca, que es lo que debe hacer una
// interfaz honesta.
export function evaluarAllowance({ allowance, necesario, saldo }) {
  if (allowance < 0n || necesario < 0n || saldo < 0n) throw new RangeError("montos negativos");
  const infinita = allowance >= MAXIMO_UINT256 / 2n;
  return {
    suficiente: allowance >= necesario,
    infinita,
    expuesto: allowance >= saldo ? saldo : allowance,
    // Lo acotado es exactamente lo que hace falta: ni más ni menos.
    recomendado: necesario,
    riesgo: infinita ? "alto" : allowance > necesario ? "medio" : "bajo"
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const tokens = { USDC: 6, WETH: 18, WBTC: 8 };
  console.log("Cinco unidades de cada token, en enteros:");
  for (const [nombre, dec] of Object.entries(tokens)) {
    console.log(`  5 ${nombre.padEnd(5)} (decimals ${String(dec).padStart(2)}) = ${aUnidades("5", dec)}`);
  }

  console.log("\nEl error de asumir 18 decimales con USDC:");
  const correcto = aUnidades("5", 6);
  const equivocado = aUnidades("5", 18);
  console.log(`  pretendías enviar : ${correcto} unidades = ${aTexto(correcto, 6)} USDC`);
  console.log(`  habrías enviado   : ${equivocado} unidades = ${aTexto(equivocado, 6)} USDC`);
  console.log(`  factor de error   : ${equivocado / correcto}×`);

  console.log("\nUn precio de oráculo con 8 decimales:");
  console.log(`  312450000000 → ${aTexto(312450000000n, 8)}`);

  console.log("\nAllowances:");
  const saldo = aUnidades("1000", 6);
  for (const allowance of [aUnidades("50", 6), aUnidades("5000", 6), MAXIMO_UINT256]) {
    const r = evaluarAllowance({ allowance, necesario: aUnidades("50", 6), saldo });
    console.log(`  ${String(allowance).slice(0, 20).padEnd(20)} → riesgo ${r.riesgo}, expone ${aTexto(r.expuesto, 6)} USDC`);
  }
}
