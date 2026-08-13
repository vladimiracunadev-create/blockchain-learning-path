// Cumplimiento: enfoque basado en riesgo y Regla de Viaje.
//
// Simulación determinista y con datos ficticios: sin red, sin claves, sin datos
// personales reales. Muestra las dos ideas centrales del módulo — los controles
// se asignan EN PROPORCIÓN AL RIESGO, y la Regla de Viaje no tiene destinatario
// cuando la contraparte es una wallet autoalojada.
//
// Módulo 27 · Regulación y cumplimiento.
import { ejecutadoDirectamente } from "../run-directo.mjs";

const PESOS = {
  jurisdiccionAltoRiesgo: 35,
  contraparteNoIdentificada: 25,
  importeElevado: 20,
  patronInusual: 15,
  clienteNuevo: 10,
  productoAnonimizante: 30
};

/**
 * Puntuación de riesgo de una operación. Deliberadamente explícita y auditable:
 * un modelo de riesgo que nadie puede explicar no se puede defender ante un
 * supervisor ni corregir cuando se equivoca.
 */
export function puntuarRiesgo({ factores = [], importe = 0, umbralImporteElevado = 10_000 }) {
  const activos = new Set(factores);
  if (importe >= umbralImporteElevado) activos.add("importeElevado");
  const desconocidos = [...activos].filter((f) => !(f in PESOS));
  if (desconocidos.length) throw new Error(`Factores no reconocidos: ${desconocidos.join(", ")}`);
  const puntuacion = [...activos].reduce((suma, f) => suma + PESOS[f], 0);
  const nivel = puntuacion >= 60 ? "alto" : puntuacion >= 30 ? "medio" : "bajo";
  return { puntuacion, nivel, factores: [...activos] };
}

/**
 * Controles proporcionados al nivel de riesgo.
 *
 * Aplicar el máximo a todo el mundo no es prudente: es caro, excluyente y
 * desplaza la atención de donde el riesgo está de verdad.
 */
export function controlesPorNivel(nivel) {
  const catalogo = {
    bajo: ["identificación estándar", "monitorización automática"],
    medio: ["identificación estándar", "monitorización automática", "origen de fondos declarado", "revisión periódica"],
    alto: [
      "diligencia reforzada",
      "origen de fondos acreditado documentalmente",
      "aprobación de un responsable de cumplimiento",
      "monitorización continua",
      "revisión de la relación"
    ]
  };
  const controles = catalogo[nivel];
  if (!controles) throw new Error(`Nivel desconocido: ${nivel}`);
  return controles;
}

/**
 * ¿Aplica la Regla de Viaje y hay a quién enviar la información?
 *
 * Entre dos proveedores identificados, la información viaja. Cuando el destino es
 * una wallet autoalojada NO HAY PROVEEDOR RECEPTOR: el tratamiento es distinto y
 * parcial, y presentarlo como resuelto es incorrecto.
 */
export function reglaDeViaje({ importe, umbral = 1_000, destino }) {
  if (!(importe > 0)) throw new Error("El importe debe ser positivo");
  const tipos = ["proveedor-registrado", "wallet-autoalojada", "proveedor-no-identificado"];
  if (!tipos.includes(destino)) throw new Error(`Tipo de destino desconocido: ${destino}`);
  const supera = importe >= umbral;

  if (!supera) {
    return { aplica: false, transmisible: false, accion: "registro interno; sin transmisión por debajo del umbral", requiereRevisionManual: false };
  }
  if (destino === "proveedor-registrado") {
    return {
      aplica: true,
      transmisible: true,
      accion: "transmitir datos de ordenante y beneficiario al proveedor receptor",
      requiereRevisionManual: false
    };
  }
  if (destino === "wallet-autoalojada") {
    return {
      aplica: true,
      transmisible: false,
      accion: "no hay proveedor receptor: prueba de titularidad de la dirección, análisis de riesgo y límites",
      requiereRevisionManual: true
    };
  }
  return {
    aplica: true,
    transmisible: false,
    accion: "contraparte no identificada: no ejecutar hasta identificar al proveedor receptor",
    requiereRevisionManual: true
  };
}

/**
 * Decisión completa sobre una operación: riesgo, controles y Regla de Viaje.
 */
export function evaluarOperacion(operacion) {
  const riesgo = puntuarRiesgo(operacion);
  const viaje = reglaDeViaje(operacion);
  return {
    ...riesgo,
    controles: controlesPorNivel(riesgo.nivel),
    reglaDeViaje: viaje,
    // Se detiene si el riesgo es alto o si la Regla de Viaje no puede cumplirse
    // por falta de contraparte identificada.
    bloqueada: riesgo.nivel === "alto" || viaje.accion.startsWith("contraparte no identificada")
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const operaciones = [
    { nombre: "traspaso interno pequeño", importe: 400, destino: "proveedor-registrado", factores: [] },
    { nombre: "envío corriente a exchange", importe: 15_000, destino: "proveedor-registrado", factores: ["clienteNuevo"] },
    { nombre: "retirada a wallet propia", importe: 25_000, destino: "wallet-autoalojada", factores: ["contraparteNoIdentificada"] },
    {
      nombre: "operación de alto riesgo",
      importe: 90_000,
      destino: "proveedor-no-identificado",
      factores: ["jurisdiccionAltoRiesgo", "productoAnonimizante", "patronInusual"]
    }
  ];

  console.log("=== Enfoque basado en riesgo: controles proporcionados ===\n");
  for (const op of operaciones) {
    const r = evaluarOperacion(op);
    console.log(`▸ ${op.nombre} — ${op.importe.toLocaleString("es")} · destino: ${op.destino}`);
    console.log(`  riesgo: ${r.puntuacion} puntos → nivel ${r.nivel.toUpperCase()}${r.bloqueada ? "  [SE DETIENE]" : ""}`);
    console.log(`  controles: ${r.controles.join(" · ")}`);
    console.log(`  regla de viaje: aplica=${r.reglaDeViaje.aplica}, transmisible=${r.reglaDeViaje.transmisible}`);
    console.log(`    → ${r.reglaDeViaje.accion}\n`);
  }

  console.log("La Regla de Viaje funciona entre dos proveedores identificados.");
  console.log("Con una wallet autoalojada no hay a quién enviar la información: el control es parcial.");
  console.log("\nDatos ficticios. Este laboratorio no procesa información personal real.");
}
