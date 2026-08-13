// Préstamo sobrecolateralizado: factor de salud, precio de liquidación y qué
// recibe el liquidador.
//
// Simulación determinista: sin red, sin claves, sin fondos. La cifra que hay que
// mirar a diario no se recibe por notificación — se calcula.
//
// Módulo 19 · DeFi: mercados, préstamo y riesgo on-chain.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Estado de una posición colateralizada.
 *
 * factorSalud = (colateral × umbralLiquidacion) / deuda
 * Por debajo de 1, la posición puede liquidarse.
 */
export function evaluarPosicion({ cantidadColateral, precioColateral, deuda, ltvMaximo = 0.75, umbralLiquidacion = 0.8 }) {
  if (cantidadColateral <= 0 || precioColateral <= 0) throw new Error("Colateral y precio deben ser positivos");
  if (deuda < 0) throw new Error("La deuda no puede ser negativa");
  if (umbralLiquidacion <= ltvMaximo) throw new Error("El umbral de liquidación debe superar al LTV máximo");
  const valorColateral = cantidadColateral * precioColateral;
  const ltv = deuda === 0 ? 0 : deuda / valorColateral;
  const factorSalud = deuda === 0 ? Infinity : (valorColateral * umbralLiquidacion) / deuda;
  return {
    valorColateral,
    deuda,
    ltv,
    factorSalud,
    deudaMaxima: valorColateral * ltvMaximo,
    capacidadRestante: Math.max(0, valorColateral * ltvMaximo - deuda),
    liquidable: factorSalud < 1,
    precioLiquidacion: deuda === 0 ? 0 : (deuda / umbralLiquidacion) / cantidadColateral
  };
}

/**
 * Caída de precio que la posición aguanta antes de ser liquidable, en porcentaje.
 */
export function margenDeCaida({ cantidadColateral, precioColateral, deuda, umbralLiquidacion = 0.8 }) {
  const { precioLiquidacion } = evaluarPosicion({ cantidadColateral, precioColateral, deuda, umbralLiquidacion });
  if (precioLiquidacion === 0) return 1;
  return Math.max(0, 1 - precioLiquidacion / precioColateral);
}

/**
 * Liquidación parcial: el liquidador paga parte de la deuda y se lleva colateral
 * con una bonificación. Esa bonificación no es un abuso: paga la vigilancia y el
 * riesgo de precio de deshacer la posición.
 */
export function liquidar({ cantidadColateral, precioColateral, deuda, umbralLiquidacion = 0.8, bonificacion = 0.05, factorCierre = 0.5 }) {
  const antes = evaluarPosicion({ cantidadColateral, precioColateral, deuda, umbralLiquidacion });
  if (!antes.liquidable) throw new Error("La posición no es liquidable: factor de salud >= 1");
  const deudaPagada = deuda * factorCierre;
  const colateralEntregado = (deudaPagada * (1 + bonificacion)) / precioColateral;
  if (colateralEntregado > cantidadColateral) throw new Error("Colateral insuficiente: la posición está bajo agua");
  const despues = evaluarPosicion({
    cantidadColateral: cantidadColateral - colateralEntregado,
    precioColateral,
    deuda: deuda - deudaPagada,
    umbralLiquidacion
  });
  return {
    deudaPagada,
    colateralEntregado,
    beneficioLiquidador: colateralEntregado * precioColateral - deudaPagada,
    factorSaludAntes: antes.factorSalud,
    factorSaludDespues: despues.factorSalud,
    posicionRestante: despues
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const base = { cantidadColateral: 1, precioColateral: 2_000, deuda: 1_200, umbralLiquidacion: 0.8 };
  const p = evaluarPosicion(base);
  console.log("Posición: 1 ETH de colateral a 2 000 USD, deuda de 1 200 USDC, umbral 80 %\n");
  console.table({
    "valor del colateral": p.valorColateral,
    "LTV": `${(p.ltv * 100).toFixed(1)} %`,
    "factor de salud": p.factorSalud.toFixed(3),
    "puede pedir aún": p.capacidadRestante.toFixed(2),
    "precio de liquidación": p.precioLiquidacion,
    "aguanta una caída del": `${(margenDeCaida(base) * 100).toFixed(1)} %`
  });

  console.log("\nEl mismo préstamo según cae el precio del colateral:");
  console.table([2_000, 1_750, 1_550, 1_500, 1_400].map((precio) => {
    const e = evaluarPosicion({ ...base, precioColateral: precio });
    return {
      "precio ETH": precio,
      "factor de salud": e.factorSalud.toFixed(3),
      "estado": e.liquidable ? "LIQUIDABLE" : "sana"
    };
  }));

  const l = liquidar({ ...base, precioColateral: 1_400 });
  console.log("\nLiquidación al 50 % con ETH a 1 400 y bonificación del 5 %:");
  console.table({
    "deuda pagada por el liquidador": l.deudaPagada.toFixed(2),
    "colateral que se lleva (ETH)": l.colateralEntregado.toFixed(4),
    "beneficio del liquidador": l.beneficioLiquidador.toFixed(2),
    "factor de salud antes": l.factorSaludAntes.toFixed(3),
    "factor de salud después": l.factorSaludDespues.toFixed(3)
  });

  const maxima = evaluarPosicion({ ...base, deuda: 1_500 });
  console.log(
    `\nSi pidieras el máximo (LTV 75 % = 1 500), el precio de liquidación sería ` +
    `${maxima.precioLiquidacion} — a un 6,25 % del precio actual. Pedir el máximo no es agresivo: es inviable.`
  );
}
