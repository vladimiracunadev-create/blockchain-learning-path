// Ciclo de vida de un bono tokenizado: emisión, cupones, amortización y vencimiento.
//
// Simulación determinista: sin red, sin claves, sin fondos. Incluye las dos
// restricciones reales que los diagramas conceptuales omiten — la retención
// fiscal ocurre FUERA de la cadena y el reparto masivo puede no caber en un bloque.
//
// Módulos 24 y 25.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Calendario completo de flujos de un bono a la par.
 *
 * `cuponAnual` en tanto por uno; `frecuencia` pagos al año; `plazoAnios` entero.
 */
export function calendarioBono({ nominal, cuponAnual, frecuencia = 2, plazoAnios, titulos = 1 }) {
  if (!(nominal > 0) || !(titulos > 0)) throw new Error("Nominal y títulos deben ser positivos");
  if (cuponAnual < 0) throw new Error("El cupón no puede ser negativo");
  if (!Number.isInteger(frecuencia) || frecuencia <= 0) throw new Error("La frecuencia debe ser un entero positivo");
  if (!Number.isInteger(plazoAnios) || plazoAnios <= 0) throw new Error("El plazo debe ser un entero positivo de años");

  const pagos = plazoAnios * frecuencia;
  const cuponPorTitulo = (nominal * cuponAnual) / frecuencia;
  const flujos = Array.from({ length: pagos }, (_, indice) => {
    const numero = indice + 1;
    const esUltimo = numero === pagos;
    return {
      numero,
      periodo: `año ${Math.ceil(numero / frecuencia)}, pago ${((numero - 1) % frecuencia) + 1}`,
      cuponPorTitulo,
      amortizacionPorTitulo: esUltimo ? nominal : 0,
      totalPorTitulo: cuponPorTitulo + (esUltimo ? nominal : 0),
      total: (cuponPorTitulo + (esUltimo ? nominal : 0)) * titulos
    };
  });
  return {
    pagos,
    cuponPorTitulo,
    flujos,
    totalCupones: cuponPorTitulo * pagos * titulos,
    totalDevuelto: flujos.reduce((suma, f) => suma + f.total, 0)
  };
}

/**
 * Reparto de un cupón entre los titulares al bloque de la fecha de registro.
 *
 * La retención se calcula por titular porque depende de su residencia, que NO
 * está en la cadena: el contrato reparte el bruto y la retención se liquida fuera.
 */
export function repartirCupon({ cuponPorTitulo, titulares }) {
  if (!(cuponPorTitulo > 0)) throw new Error("El cupón debe ser positivo");
  if (!Array.isArray(titulares) || titulares.length === 0) throw new Error("Hacen falta titulares");
  const detalle = titulares.map((t) => {
    if (!(t.titulos > 0)) throw new Error(`Titular ${t.id} sin títulos`);
    const bruto = cuponPorTitulo * t.titulos;
    const retencion = bruto * (t.retencion ?? 0);
    return { id: t.id, titulos: t.titulos, bruto, retencion, neto: bruto - retencion };
  });
  return {
    detalle,
    brutoTotal: detalle.reduce((s, d) => s + d.bruto, 0),
    retencionTotal: detalle.reduce((s, d) => s + d.retencion, 0),
    netoTotal: detalle.reduce((s, d) => s + d.neto, 0)
  };
}

/**
 * ¿Reparto activo (el contrato itera) o patrón de reclamación (cada titular retira)?
 *
 * Con muchos titulares, iterar no cabe en un bloque: no es una preferencia de
 * estilo, es una restricción de ingeniería con solución conocida.
 */
export function estrategiaReparto({ titulares, gasPorTransferencia = 30_000, limiteGasBloque = 30_000_000 }) {
  if (!(titulares > 0)) throw new Error("Debe haber al menos un titular");
  const gasTotal = titulares * gasPorTransferencia;
  const cabeEnUnBloque = gasTotal <= limiteGasBloque;
  return {
    gasTotal,
    cabeEnUnBloque,
    bloquesNecesarios: Math.ceil(gasTotal / limiteGasBloque),
    estrategia: cabeEnUnBloque ? "reparto activo" : "patrón de reclamación (el contrato reserva y cada titular retira)"
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const bono = { nominal: 1_000, cuponAnual: 0.04, frecuencia: 2, plazoAnios: 3, titulos: 100_000 };
  const c = calendarioBono(bono);
  console.log("Bono tokenizado: nominal 1 000, cupón 4 % anual, semestral, 3 años, 100 000 títulos\n");
  console.log(`Cupón por título y periodo: ${c.cuponPorTitulo} — total de pagos: ${c.pagos}\n`);
  console.table(c.flujos.map((f) => ({
    "#": f.numero,
    periodo: f.periodo,
    "cupón/título": f.cuponPorTitulo,
    "amortización/título": f.amortizacionPorTitulo,
    "total del pago": f.total.toLocaleString("es")
  })));
  console.log(`\nCupones totales: ${c.totalCupones.toLocaleString("es")} · devuelto total: ${c.totalDevuelto.toLocaleString("es")}\n`);

  const reparto = repartirCupon({
    cuponPorTitulo: c.cuponPorTitulo,
    titulares: [
      { id: "residente-A", titulos: 40_000, retencion: 0.04 },
      { id: "residente-B", titulos: 35_000, retencion: 0.04 },
      { id: "no-residente-C", titulos: 25_000, retencion: 0.35 }
    ]
  });
  console.log("Reparto del primer cupón, con retención distinta por residencia:");
  console.table(reparto.detalle.map((d) => ({
    titular: d.id,
    títulos: d.titulos.toLocaleString("es"),
    bruto: d.bruto.toLocaleString("es"),
    retención: d.retencion.toLocaleString("es"),
    neto: d.neto.toLocaleString("es")
  })));
  console.log("La retención depende de la residencia, que no está en la cadena: se liquida fuera.\n");

  console.log("¿Reparto activo o reclamación? Depende del número de titulares:");
  console.table([100, 1_000, 8_000].map((n) => {
    const e = estrategiaReparto({ titulares: n });
    return { titulares: n, "gas total": e.gasTotal.toLocaleString("es"), "¿un bloque?": e.cabeEnUnBloque ? "sí" : "no", estrategia: e.estrategia };
  }));
}
