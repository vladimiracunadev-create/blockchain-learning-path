// Pago contra pago (PvP): riesgo Herstatt frente a liquidación atómica.
//
// Simulación determinista: sin red, sin claves, sin fondos. Demuestra con estado
// observable por qué la atomicidad elimina una CATEGORÍA ENTERA de riesgo — el de
// principal — y en qué condiciones deja de aplicarse.
//
// Módulos 20 y 23.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Liquidación secuencial: cada parte entrega cuando le toca. Es el mecanismo
 * clásico y el que produjo el caso Herstatt en 1974.
 *
 * `falloTras` permite simular que la contraparte deja de cumplir después de N
 * entregas (0 = falla antes de entregar nada; 1 = tras recibir la primera pata).
 */
export function liquidarSecuencial({ patas, falloTras = Infinity }) {
  validarPatas(patas);
  const entregadas = [];
  for (const [indice, pata] of patas.entries()) {
    if (indice >= falloTras) {
      return {
        modo: "secuencial",
        liquidado: false,
        entregadas,
        // Quien ya entregó y no recibió pierde el IMPORTE ÍNTEGRO, no el margen.
        expuesto: entregadas.map((e) => ({ parte: e.de, importe: e.importe, moneda: e.moneda })),
        perdidaDePrincipal: entregadas.reduce((suma, e) => suma + e.importe, 0)
      };
    }
    entregadas.push({ ...pata });
  }
  return { modo: "secuencial", liquidado: true, entregadas, expuesto: [], perdidaDePrincipal: 0 };
}

/**
 * Liquidación atómica: las dos patas o ninguna. Si falta cualquiera, el estado
 * vuelve íntegro al punto de partida y nadie queda expuesto.
 */
export function liquidarAtomico({ patas, depositadas, plazoSegundos = 3_600, transcurridoSegundos = 0 }) {
  validarPatas(patas);
  const faltantes = patas.filter((pata) => !depositadas.includes(pata.id));
  const vencido = transcurridoSegundos > plazoSegundos;

  if (vencido) {
    return {
      modo: "atomico",
      liquidado: false,
      motivo: "plazo vencido: devolución de lo depositado",
      devoluciones: patas.filter((p) => depositadas.includes(p.id)),
      expuesto: [],
      perdidaDePrincipal: 0
    };
  }
  if (faltantes.length > 0) {
    return {
      modo: "atomico",
      liquidado: false,
      motivo: `faltan patas: ${faltantes.map((p) => p.id).join(", ")}`,
      devoluciones: patas.filter((p) => depositadas.includes(p.id)),
      expuesto: [],
      perdidaDePrincipal: 0
    };
  }
  return {
    modo: "atomico",
    liquidado: true,
    motivo: "ambas patas presentes",
    entregadas: patas,
    expuesto: [],
    perdidaDePrincipal: 0
  };
}

/**
 * ¿Se puede aplicar PvP atómico a esta operación?
 *
 * Condición innegociable: ambas patas en el MISMO entorno de ejecución. Si una
 * está fuera, hay puente — y con el puente vuelve el riesgo que se quería quitar.
 */
export function admiteAtomicidad({ patas }) {
  validarPatas(patas);
  const entornos = new Set(patas.map((p) => p.entorno));
  const admite = entornos.size === 1;
  return {
    admite,
    entornos: [...entornos],
    motivo: admite
      ? "ambas patas se ejecutan en el mismo entorno"
      : "patas en entornos distintos: hace falta un puente y reaparece el riesgo de principal"
  };
}

function validarPatas(patas) {
  if (!Array.isArray(patas) || patas.length !== 2) throw new Error("Un PvP tiene exactamente dos patas");
  for (const pata of patas) {
    if (!pata.id || !pata.moneda || !pata.de || !pata.a) throw new Error("Cada pata necesita id, moneda, de y a");
    if (!(pata.importe > 0)) throw new Error("Cada pata necesita un importe positivo");
  }
}

if (ejecutadoDirectamente(import.meta.url)) {
  const patas = [
    { id: "EUR", moneda: "EUR", importe: 1_000_000, de: "Banco Fráncfort", a: "Banco Nueva York", entorno: "cadena-A" },
    { id: "USD", moneda: "USD", importe: 1_080_000, de: "Banco Nueva York", a: "Banco Fráncfort", entorno: "cadena-A" }
  ];

  console.log("=== Liquidación SECUENCIAL (el mecanismo de 1974) ===\n");
  const ok = liquidarSecuencial({ patas });
  console.log(`Ambas partes cumplen → liquidado: ${ok.liquidado}, pérdida de principal: ${ok.perdidaDePrincipal}\n`);

  const herstatt = liquidarSecuencial({ patas, falloTras: 1 });
  console.log("La contraparte deja de operar tras recibir la primera pata:");
  console.table(herstatt.expuesto);
  console.log(`  pérdida de principal: ${herstatt.perdidaDePrincipal.toLocaleString("es")} EUR`);
  console.log("  No se pierde el margen: se pierde el importe íntegro. Eso es riesgo Herstatt.\n");

  console.log("=== Liquidación ATÓMICA (PvP) ===\n");
  const casos = [
    { titulo: "ambas patas depositadas", depositadas: ["EUR", "USD"], transcurridoSegundos: 10 },
    { titulo: "falta la pata en USD", depositadas: ["EUR"], transcurridoSegundos: 10 },
    { titulo: "plazo vencido con una pata dentro", depositadas: ["EUR"], transcurridoSegundos: 7_200 }
  ];
  for (const caso of casos) {
    const r = liquidarAtomico({ patas, depositadas: caso.depositadas, transcurridoSegundos: caso.transcurridoSegundos });
    console.log(`  ${caso.titulo}: liquidado=${r.liquidado}, expuesto=${r.expuesto.length}, pérdida=${r.perdidaDePrincipal} — ${r.motivo}`);
  }

  console.log("\nEn ninguno de los tres finales queda una parte expuesta al principal.\n");

  const mixto = admiteAtomicidad({
    patas: [patas[0], { ...patas[1], entorno: "sistema-bancario-clasico" }]
  });
  console.log(`¿Admite atomicidad con una pata fuera de la cadena? ${mixto.admite ? "sí" : "NO"}`);
  console.log(`  ${mixto.motivo}`);
}
