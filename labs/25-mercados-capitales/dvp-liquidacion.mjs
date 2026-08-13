// Entrega contra pago (DvP) y el coste real de la liquidación atómica.
//
// Simulación determinista: sin red, sin claves, sin fondos. Además de la
// atomicidad, calcula lo que casi nunca se cuenta: la atomicidad SUPRIME EL NETEO
// y multiplica la liquidez necesaria.
//
// Módulo 25 · Mercados de capitales on-chain.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Liquidación con retraso T+n: entre el pacto y la liquidación hay exposición.
 */
export function exposicionCiclo({ volumenDiario, diasLiquidacion }) {
  if (volumenDiario <= 0) throw new Error("El volumen debe ser positivo");
  if (!Number.isInteger(diasLiquidacion) || diasLiquidacion < 0) throw new Error("T+n con n entero no negativo");
  return {
    diasLiquidacion,
    exposicionPendiente: volumenDiario * diasLiquidacion,
    // Con liquidación atómica la exposición entre pacto y liquidación es cero.
    esAtomica: diasLiquidacion === 0
  };
}

/**
 * Entrega contra pago atómica: valores y dinero, o nada.
 * Devuelve el estado de ambas patas y el saldo resultante de cada parte.
 */
export function liquidarDvP({ vendedor, comprador, titulos, precioUnitario }) {
  if (!(titulos > 0) || !(precioUnitario > 0)) throw new Error("Títulos y precio deben ser positivos");
  const importe = titulos * precioUnitario;
  const faltaValores = vendedor.titulos < titulos;
  const faltaDinero = comprador.dinero < importe;

  if (faltaValores || faltaDinero) {
    const motivos = [];
    if (faltaValores) motivos.push("el vendedor no tiene los títulos (fallo de entrega)");
    if (faltaDinero) motivos.push("el comprador no tiene el efectivo");
    return {
      liquidado: false,
      motivo: motivos.join(" y "),
      // Estado sin tocar: revierte íntegro, nadie queda a medias.
      vendedor: { ...vendedor },
      comprador: { ...comprador },
      importe
    };
  }
  return {
    liquidado: true,
    motivo: "ambas patas disponibles: entrega y pago simultáneos",
    vendedor: { titulos: vendedor.titulos - titulos, dinero: vendedor.dinero + importe },
    comprador: { titulos: comprador.titulos + titulos, dinero: comprador.dinero - importe },
    importe
  };
}

/**
 * Liquidez necesaria: bruta (atómica, modelo 1 de DvP) frente a neteada.
 *
 * Este es el intercambio central del módulo: la atomicidad elimina el riesgo de
 * contraparte y a cambio exige tener el importe íntegro en cada momento.
 */
export function liquidezNecesaria({ operaciones, eficienciaNeteo }) {
  if (!Array.isArray(operaciones) || operaciones.length === 0) throw new Error("Hacen falta operaciones");
  if (eficienciaNeteo < 0 || eficienciaNeteo >= 1) throw new Error("La eficiencia de neteo va de 0 a menos de 1");
  const bruta = operaciones.reduce((suma, op) => suma + op.importe, 0);
  const neta = bruta * (1 - eficienciaNeteo);
  return {
    bruta,
    neta,
    multiplicador: bruta / neta,
    ahorroDelNeteo: bruta - neta
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  console.log("=== Exposición del ciclo de liquidación ===\n");
  console.table([0, 1, 2].map((n) => {
    const e = exposicionCiclo({ volumenDiario: 500_000_000, diasLiquidacion: n });
    return {
      ciclo: `T+${n}`,
      "exposición pendiente": e.exposicionPendiente.toLocaleString("es"),
      "¿atómica?": e.esAtomica ? "sí" : "no"
    };
  }));

  console.log("\n=== Entrega contra pago atómica ===\n");
  const casos = [
    { titulo: "ambas patas disponibles", vendedor: { titulos: 500, dinero: 0 }, comprador: { titulos: 0, dinero: 200_000 } },
    { titulo: "el vendedor no tiene títulos", vendedor: { titulos: 50, dinero: 0 }, comprador: { titulos: 0, dinero: 200_000 } },
    { titulo: "el comprador no tiene efectivo", vendedor: { titulos: 500, dinero: 0 }, comprador: { titulos: 0, dinero: 1_000 } }
  ];
  for (const caso of casos) {
    const r = liquidarDvP({ ...caso, titulos: 100, precioUnitario: 985 });
    console.log(`  ${caso.titulo}: liquidado=${r.liquidado} — ${r.motivo}`);
  }
  console.log("\n  Cuando falla una pata, el estado vuelve intacto: no hay entrega sin pago.\n");

  console.log("=== El coste de la atomicidad: la liquidez ===\n");
  const operaciones = Array.from({ length: 1_000 }, () => ({ importe: 500_000 }));
  const l = liquidezNecesaria({ operaciones, eficienciaNeteo: 0.92 });
  console.table({
    "liquidez con liquidación atómica (bruta)": l.bruta.toLocaleString("es"),
    "liquidez con neteo del 92 %": l.neta.toLocaleString("es"),
    "multiplicador": `× ${l.multiplicador.toFixed(1)}`,
    "lo que ahorra el neteo": l.ahorroDelNeteo.toLocaleString("es")
  });
  console.log("\nLa liquidación atómica cambia riesgo de contraparte por necesidad de liquidez.");
  console.log("Si ese cambio conviene depende del mercado concreto, no es una mejora universal.");
}
