// Ciclo sintético de un token viral sobre un AMM de producto constante.
//
// Simulación educativa y determinista: sin RPC, sin claves, sin fondos y sin
// órdenes reales. Sirve para separar hechos contables (reservas, balances,
// volumen) de interpretaciones sociales ("el video causó la subida").
import { ejecutadoDirectamente } from "../run-directo.mjs";

const EPSILON = 1e-12;

function positivo(valor, nombre) {
  if (!Number.isFinite(valor) || valor <= 0) throw new Error(`${nombre} debe ser positivo`);
}

function noNegativo(valor, nombre) {
  if (!Number.isFinite(valor) || valor < 0) throw new Error(`${nombre} no puede ser negativo`);
}

export function metricasMercado({ reservaToken, reservaCotizada, suministroCirculante, suministroMaximo }) {
  positivo(reservaToken, "La reserva de token");
  positivo(reservaCotizada, "La reserva cotizada");
  positivo(suministroCirculante, "El suministro circulante");
  positivo(suministroMaximo, "El suministro máximo");
  if (suministroCirculante > suministroMaximo) {
    throw new Error("El suministro circulante no puede superar el máximo");
  }

  const precio = reservaCotizada / reservaToken;
  // Valorar ambos lados al precio marginal del propio pool hace que el lado
  // token valga lo mismo que la reserva cotizada. No significa que exista ese
  // dinero fuera del pool ni que pueda retirarse sin mover el precio.
  const liquidezMarcada = reservaCotizada + reservaToken * precio;
  return {
    precio,
    marketCap: precio * suministroCirculante,
    fdv: precio * suministroMaximo,
    liquidezMarcada,
    efectivoCotizadoEnPool: reservaCotizada,
    ratioLiquidezMarketCap: liquidezMarcada / (precio * suministroCirculante)
  };
}

export function comprar({ reservaToken, reservaCotizada, cotizadoEntrada, comision = 0.003 }) {
  positivo(reservaToken, "La reserva de token");
  positivo(reservaCotizada, "La reserva cotizada");
  positivo(cotizadoEntrada, "La compra");
  if (comision < 0 || comision >= 1) throw new Error("La comisión debe estar entre 0 y 1");

  const k = reservaToken * reservaCotizada;
  const entradaEfectiva = cotizadoEntrada * (1 - comision);
  const tokenNuevo = k / (reservaCotizada + entradaEfectiva);
  const tokenSalida = reservaToken - tokenNuevo;
  return {
    tokenSalida,
    precioEjecucion: cotizadoEntrada / tokenSalida,
    pool: {
      reservaToken: tokenNuevo,
      reservaCotizada: reservaCotizada + cotizadoEntrada
    }
  };
}

export function vender({ reservaToken, reservaCotizada, tokenEntrada, comision = 0.003 }) {
  positivo(reservaToken, "La reserva de token");
  positivo(reservaCotizada, "La reserva cotizada");
  positivo(tokenEntrada, "La venta");
  if (comision < 0 || comision >= 1) throw new Error("La comisión debe estar entre 0 y 1");

  const k = reservaToken * reservaCotizada;
  const entradaEfectiva = tokenEntrada * (1 - comision);
  const cotizadoNuevo = k / (reservaToken + entradaEfectiva);
  const cotizadoSalida = reservaCotizada - cotizadoNuevo;
  return {
    cotizadoSalida,
    precioEjecucion: cotizadoSalida / tokenEntrada,
    pool: {
      reservaToken: reservaToken + tokenEntrada,
      reservaCotizada: cotizadoNuevo
    }
  };
}

export function correlacionPearson(xs, ys) {
  if (xs.length !== ys.length || xs.length < 2) throw new Error("Las series deben tener igual longitud y al menos dos puntos");
  const media = (serie) => serie.reduce((suma, valor) => suma + valor, 0) / serie.length;
  const mediaX = media(xs);
  const mediaY = media(ys);
  let numerador = 0;
  let sumaX = 0;
  let sumaY = 0;
  for (let i = 0; i < xs.length; i += 1) {
    const dx = xs[i] - mediaX;
    const dy = ys[i] - mediaY;
    numerador += dx * dy;
    sumaX += dx * dx;
    sumaY += dy * dy;
  }
  const denominador = Math.sqrt(sumaX * sumaY);
  return denominador <= EPSILON ? 0 : numerador / denominador;
}

export const ESCENARIO_SINTETICO = [
  { fase: "creación", audiencia: 120, busquedas: 8, nuevasWallets: 2, compras: 0, ventas: 0, volumenCircular: 0 },
  { fase: "liquidez inicial", audiencia: 180, busquedas: 12, nuevasWallets: 6, compras: 1_000, ventas: 0, volumenCircular: 0 },
  { fase: "contenido publicado", audiencia: 4_000, busquedas: 220, nuevasWallets: 25, compras: 4_000, ventas: 0, volumenCircular: 500 },
  { fase: "difusión viral", audiencia: 90_000, busquedas: 8_500, nuevasWallets: 210, compras: 15_000, ventas: 0, volumenCircular: 8_000 },
  { fase: "máximo", audiencia: 240_000, busquedas: 19_000, nuevasWallets: 430, compras: 30_000, ventas: 0, volumenCircular: 35_000 },
  { fase: "ventas", audiencia: 110_000, busquedas: 11_000, nuevasWallets: 70, compras: 2_000, ventas: 55_000, volumenCircular: 12_000 },
  { fase: "drawdown", audiencia: 18_000, busquedas: 2_100, nuevasWallets: 15, compras: 500, ventas: 120_000, volumenCircular: 2_000 }
];

export function simularCicloViral({
  escenario = ESCENARIO_SINTETICO,
  suministroCirculante = 1_000_000,
  suministroMaximo = 10_000_000,
  reservaTokenInicial = 100_000,
  reservaCotizadaInicial = 5_000,
  holdersIniciales = 2,
  comision = 0.003
} = {}) {
  if (!Array.isArray(escenario) || escenario.length === 0) throw new Error("El escenario no puede estar vacío");
  let pool = { reservaToken: reservaTokenInicial, reservaCotizada: reservaCotizadaInicial };
  let holders = holdersIniciales;
  let precioMaximo = metricasMercado({ ...pool, suministroCirculante, suministroMaximo }).precio;

  const serie = escenario.map((periodo, indice) => {
    for (const campo of ["audiencia", "busquedas", "nuevasWallets", "compras", "ventas", "volumenCircular"]) {
      noNegativo(periodo[campo], campo);
    }

    let volumenEconomico = 0;
    let tokensAdquiridos = 0;
    let cotizadoRetirado = 0;
    if (periodo.compras > 0) {
      const compra = comprar({ ...pool, cotizadoEntrada: periodo.compras, comision });
      pool = compra.pool;
      tokensAdquiridos = compra.tokenSalida;
      volumenEconomico += periodo.compras;
    }
    if (periodo.ventas > 0) {
      const venta = vender({ ...pool, tokenEntrada: periodo.ventas, comision });
      pool = venta.pool;
      cotizadoRetirado = venta.cotizadoSalida;
      volumenEconomico += cotizadoRetirado;
    }

    holders += periodo.nuevasWallets;
    const mercado = metricasMercado({ ...pool, suministroCirculante, suministroMaximo });
    precioMaximo = Math.max(precioMaximo, mercado.precio);
    return {
      periodo: indice,
      fase: periodo.fase,
      audiencia: periodo.audiencia,
      busquedas: periodo.busquedas,
      nuevasWallets: periodo.nuevasWallets,
      holders,
      tokensAdquiridos,
      cotizadoRetirado,
      volumenEconomico,
      volumenBruto: volumenEconomico + periodo.volumenCircular,
      proporcionVolumenCircular: (volumenEconomico + periodo.volumenCircular) === 0
        ? 0
        : periodo.volumenCircular / (volumenEconomico + periodo.volumenCircular),
      ...mercado,
      drawdownDesdeMaximo: mercado.precio / precioMaximo - 1
    };
  });

  const precioInicial = serie[0].precio;
  const maximo = serie.reduce((mejor, fila) => fila.precio > mejor.precio ? fila : mejor, serie[0]);
  const ultimo = serie.at(-1);
  return {
    serie,
    resumen: {
      variacionHastaMaximo: maximo.precio / precioInicial - 1,
      drawdownFinal: ultimo.precio / maximo.precio - 1,
      correlacionAudienciaVolumen: correlacionPearson(
        serie.map((fila) => fila.audiencia),
        serie.map((fila) => fila.volumenBruto)
      ),
      advertenciaCausal: "La correlación temporal es compatible con varias causas y no demuestra que el contenido haya causado las compras."
    }
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const resultado = simularCicloViral();
  console.table(resultado.serie.map((fila) => ({
    fase: fila.fase,
    audiencia: fila.audiencia,
    wallets: fila.nuevasWallets,
    holders: fila.holders,
    precio: fila.precio.toFixed(4),
    "market cap": fila.marketCap.toFixed(0),
    liquidez: fila.liquidezMarcada.toFixed(0),
    volumen: fila.volumenBruto.toFixed(0),
    drawdown: `${(fila.drawdownDesdeMaximo * 100).toFixed(1)} %`
  })));
  console.log(`\nVariación sintética hasta el máximo: ${(resultado.resumen.variacionHastaMaximo * 100).toFixed(1)} %`);
  console.log(`Drawdown final: ${(resultado.resumen.drawdownFinal * 100).toFixed(1)} %`);
  console.log(`Correlación audiencia/volumen: ${resultado.resumen.correlacionAudienciaVolumen.toFixed(3)}`);
  console.log(resultado.resumen.advertenciaCausal);
  console.log("MARKET CAP ≠ LIQUIDEZ ≠ DINERO DISPONIBLE PARA RETIRAR.");
}
