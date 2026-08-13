// Coste real de una remesa: corresponsalía frente a corredor on-chain.
//
// Simulación determinista: sin red, sin claves, sin fondos. Aplica la lógica de
// descomposición del Banco Mundial — comisión explícita MÁS margen de cambio,
// que es la partida que casi nunca se compara.
//
// Módulo 23 · Pagos, cross-border y FX on-chain.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Descompone el coste puerta a puerta de un envío.
 *
 * Todos los componentes en la MISMA moneda de origen para poder sumarlos:
 * - comisionEnvio:     cargo explícito, el único que suele anunciarse
 * - margenCambio:      diferencia entre el tipo aplicado y el tipo medio (%)
 * - comisionesIntermedias: bancos por los que pasa la instrucción
 * - costeRetirada:     la última milla en destino
 */
export function costeRemesa({
  importe,
  comisionEnvio = 0,
  margenCambio = 0,
  comisionesIntermedias = 0,
  costeRetirada = 0
}) {
  if (importe <= 0) throw new Error("El importe debe ser positivo");
  if (margenCambio < 0 || margenCambio >= 1) throw new Error("El margen de cambio debe estar entre 0 y 1");
  const costeMargen = importe * margenCambio;
  const componentes = {
    comisionEnvio,
    margenCambio: costeMargen,
    comisionesIntermedias,
    costeRetirada
  };
  const total = Object.values(componentes).reduce((suma, valor) => suma + valor, 0);
  if (total >= importe) throw new Error("El coste no puede igualar o superar el importe enviado");
  return {
    importe,
    componentes,
    total,
    costeRelativo: total / importe,
    recibido: importe - total,
    // Qué parte del coste NO se anuncia como comisión.
    costeOculto: costeMargen + comisionesIntermedias
  };
}

/**
 * Coste anual del capital inmovilizado en cuentas nostro, repartido por operación.
 * Es el coste que ningún cliente ve nunca en su factura.
 */
export function costePrefondeo({ saldoInmovilizado, costeCapitalAnual, operacionesAnuales }) {
  if (saldoInmovilizado < 0) throw new Error("El saldo no puede ser negativo");
  if (operacionesAnuales <= 0) throw new Error("Debe haber al menos una operación");
  const costeAnual = saldoInmovilizado * costeCapitalAnual;
  return { costeAnual, costePorOperacion: costeAnual / operacionesAnuales };
}

/**
 * Compara dos corredores puerta a puerta. Devuelve cuál sale mejor y por cuánto.
 * Deliberadamente no favorece a ninguno: la última milla suele decidir.
 */
export function compararCorredores({ tradicional, onchain }) {
  const a = costeRemesa(tradicional);
  const b = costeRemesa(onchain);
  const diferencia = a.total - b.total;
  return {
    tradicional: a,
    onchain: b,
    ahorro: diferencia,
    ahorroRelativo: diferencia / a.importe,
    ganador: Math.abs(diferencia) < 1e-9 ? "empate" : diferencia > 0 ? "onchain" : "tradicional"
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const tradicional = {
    importe: 200,
    comisionEnvio: 5,
    margenCambio: 0.025,
    comisionesIntermedias: 1.5,
    costeRetirada: 0.5
  };
  const r = costeRemesa(tradicional);
  console.log("Remesa de 200 USD por la vía tradicional:\n");
  console.table({
    "comisión de envío": r.componentes.comisionEnvio.toFixed(2),
    "margen de cambio (2,5 %)": r.componentes.margenCambio.toFixed(2),
    "bancos intermedios": r.componentes.comisionesIntermedias.toFixed(2),
    "retirada en destino": r.componentes.costeRetirada.toFixed(2),
    "TOTAL": r.total.toFixed(2),
    "coste relativo": `${(r.costeRelativo * 100).toFixed(1)} %`,
    "recibe el destinatario": r.recibido.toFixed(2)
  });
  console.log(`De esos ${r.total.toFixed(2)}, ${r.costeOculto.toFixed(2)} no se anuncian como comisión.\n`);

  console.log("Mismo envío, corredor on-chain con última milla BARATA:");
  const barata = compararCorredores({
    tradicional,
    onchain: { importe: 200, comisionEnvio: 0.5, margenCambio: 0.004, comisionesIntermedias: 0, costeRetirada: 1.5 }
  });
  console.log(`  total ${barata.onchain.total.toFixed(2)} → gana ${barata.ganador}\n`);

  console.log("Mismo envío, corredor on-chain con última milla CARA (efectivo, poca competencia):");
  const cara = compararCorredores({
    tradicional,
    onchain: { importe: 200, comisionEnvio: 0.5, margenCambio: 0.004, comisionesIntermedias: 0, costeRetirada: 12 }
  });
  console.log(`  total ${cara.onchain.total.toFixed(2)} → gana ${cara.ganador}`);
  console.log("\nEl tramo que blockchain no toca —la última milla— decide el resultado.\n");

  const pref = costePrefondeo({ saldoInmovilizado: 10_000_000, costeCapitalAnual: 0.06, operacionesAnuales: 500_000 });
  console.log("Prefondeo: 10 M inmovilizados al 6 %, repartidos entre 500 000 operaciones al año:");
  console.table({
    "coste anual": pref.costeAnual.toFixed(2),
    "coste por operación": pref.costePorOperacion.toFixed(2)
  });
}
