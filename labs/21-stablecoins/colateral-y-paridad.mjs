// Stablecoins: colateralización, precio de liquidación y qué sostiene la paridad.
//
// Simulación determinista: sin red, sin claves, sin fondos. El laboratorio
// demuestra la tesis del módulo — la paridad no la sostiene el respaldo, la
// sostiene la POSIBILIDAD REAL DE REDIMIR.
//
// Módulo 21 · Stablecoins.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Posición sobrecolateralizada: bloqueas colateral volátil y emites deuda estable.
 */
export function evaluarPosicion({ cantidadColateral, precioColateral, emitido, ratioMinimo = 1.5 }) {
  if (cantidadColateral <= 0 || precioColateral <= 0) throw new Error("Colateral y precio deben ser positivos");
  if (ratioMinimo <= 1) throw new Error("El ratio mínimo debe ser mayor que 1: si no, no está sobrecolateralizada");
  const valorColateral = cantidadColateral * precioColateral;
  const ratio = emitido === 0 ? Infinity : valorColateral / emitido;
  return {
    valorColateral,
    emitido,
    ratio,
    emisionMaxima: valorColateral / ratioMinimo,
    liquidable: ratio < ratioMinimo,
    precioLiquidacion: emitido === 0 ? 0 : (emitido * ratioMinimo) / cantidadColateral
  };
}

/**
 * Liquidación con penalización. La penalización paga al liquidador por vigilar y
 * por asumir el riesgo de precio mientras deshace el colateral.
 */
export function liquidarPosicion({ cantidadColateral, precioColateral, emitido, ratioMinimo = 1.5, penalizacion = 0.13 }) {
  const antes = evaluarPosicion({ cantidadColateral, precioColateral, emitido, ratioMinimo });
  if (!antes.liquidable) throw new Error("La posición no es liquidable");
  const colateralNecesario = (emitido * (1 + penalizacion)) / precioColateral;
  const bajoAgua = colateralNecesario > cantidadColateral;
  return {
    deudaCancelada: emitido,
    colateralTomado: Math.min(colateralNecesario, cantidadColateral),
    // Si el colateral no alcanza, el sistema acumula deuda incobrable: eso es lo
    // que las subastas de deuda y los colchones de capital existen para cubrir.
    deudaIncobrable: bajoAgua ? emitido - (cantidadColateral * precioColateral) / (1 + penalizacion) : 0,
    sobranteParaElDueno: bajoAgua ? 0 : cantidadColateral - colateralNecesario,
    bajoAgua
  };
}

/**
 * Arbitraje de paridad: ¿vuelve el precio a la par?
 *
 * Con redención abierta, comprar por debajo de la par y redimir a la par es
 * beneficio sin riesgo de precio, y la presión compradora cierra el descuento.
 * Con redención suspendida no hay a qué redimir: el descuento se queda.
 */
export function simularParidad({
  precioMercado,
  paridad = 1,
  redencionAbierta,
  costeRedencion = 0.001,
  velocidadCierre = 0.5,
  pasos = 6
}) {
  if (paridad <= 0) throw new Error("La paridad debe ser positiva");
  const historial = [];
  let precio = precioMercado;
  for (let paso = 0; paso <= pasos; paso += 1) {
    const descuento = (paridad - precio) / paridad;
    const beneficioArbitraje = redencionAbierta ? descuento - costeRedencion : 0;
    const hayArbitraje = beneficioArbitraje > 0;
    historial.push({ paso, precio, descuento, hayArbitraje });
    if (hayArbitraje) precio += (paridad - precio) * velocidadCierre;
  }
  const final = historial.at(-1);
  return {
    historial,
    precioFinal: final.precio,
    recuperada: Math.abs(final.precio - paridad) / paridad <= costeRedencion
  };
}

/**
 * Cobertura de la reserva teniendo en cuenta la DISPONIBILIDAD de cada tramo.
 * Un respaldo del 100 % del que solo el 60 % es accesible hoy no es un respaldo
 * del 100 % hoy — esa es la lección del episodio bancario de 2023.
 */
export function coberturaReserva({ circulante, tramos }) {
  if (circulante <= 0) throw new Error("El circulante debe ser positivo");
  const total = tramos.reduce((suma, t) => suma + t.importe, 0);
  const accesible = tramos.reduce((suma, t) => suma + t.importe * (t.disponibilidad ?? 1), 0);
  return {
    total,
    accesible,
    coberturaNominal: total / circulante,
    coberturaAccesible: accesible / circulante,
    // Si lo accesible no cubre el circulante, la redención a la par no puede
    // atenderse íntegramente hoy, aunque contablemente el respaldo esté completo.
    puedeAtenderRedencionTotal: accesible >= circulante
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const base = { cantidadColateral: 2, precioColateral: 2_000, emitido: 2_000, ratioMinimo: 1.5 };
  const p = evaluarPosicion(base);
  console.log("Posición: 2 ETH a 2 000 USD (colateral 4 000), emisión 2 000, ratio mínimo 150 %\n");
  console.table({
    "ratio actual": `${(p.ratio * 100).toFixed(0)} %`,
    "emisión máxima": p.emisionMaxima.toFixed(2),
    "precio de liquidación": p.precioLiquidacion
  });

  const maxima = evaluarPosicion({ ...base, emitido: p.emisionMaxima });
  console.log(
    `Si emitieras el máximo (${p.emisionMaxima.toFixed(2)}), el precio de liquidación sería ` +
    `${maxima.precioLiquidacion.toFixed(0)} — el precio de hoy. Nace liquidable.\n`
  );

  console.log("Arbitraje de paridad con un descuento del 2 %:\n");
  for (const abierta of [true, false]) {
    const r = simularParidad({ precioMercado: 0.98, redencionAbierta: abierta });
    console.log(`  Redención ${abierta ? "ABIERTA" : "SUSPENDIDA"}:`);
    console.table(r.historial.map((h) => ({
      paso: h.paso,
      precio: h.precio.toFixed(4),
      descuento: `${(h.descuento * 100).toFixed(2)} %`,
      "¿hay arbitraje?": h.hayArbitraje ? "sí" : "no"
    })));
    console.log(`  → ${r.recuperada ? "recupera la paridad" : "el descuento persiste"}\n`);
  }

  const cobertura = coberturaReserva({
    circulante: 1_000,
    tramos: [
      { nombre: "letras del Tesoro a corto", importe: 700, disponibilidad: 1 },
      { nombre: "depósito en banco en resolución", importe: 300, disponibilidad: 0 }
    ]
  });
  console.log("Reserva del 100 % con un tramo temporalmente inaccesible:");
  console.table({
    "cobertura nominal": `${(cobertura.coberturaNominal * 100).toFixed(0)} %`,
    "cobertura accesible hoy": `${(cobertura.coberturaAccesible * 100).toFixed(0)} %`,
    "¿puede atender la redención?": cobertura.puedeAtenderRedencionTotal ? "sí" : "no"
  });
  console.log("\nLa calidad del respaldo incluye DÓNDE está depositado, no solo cuánto suma.");
}
