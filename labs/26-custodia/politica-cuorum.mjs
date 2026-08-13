// Política de custodia M-de-N: resistencia al compromiso Y a la pérdida.
//
// Simulación determinista: sin claves reales, sin semillas, sin red. El fallo que
// menos se analiza no es que te roben las llaves: es PERDERLAS y congelar los
// fondos para siempre.
//
// Módulo 26 · Custodia, wallets institucionales e identidad.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Resistencia de una política M-de-N.
 *
 * - toleraCompromiso: cuántos firmantes puede controlar un atacante sin poder firmar.
 * - toleraPerdida:    cuántas llaves se pueden perder sin bloquear la operación.
 */
export function analizarCuorum({ m, n }) {
  if (!Number.isInteger(m) || !Number.isInteger(n)) throw new Error("M y N deben ser enteros");
  if (m <= 0 || n <= 0) throw new Error("M y N deben ser positivos");
  if (m > n) throw new Error("M no puede superar a N: la política sería imposible de cumplir");
  return {
    m,
    n,
    politica: `${m} de ${n}`,
    toleraCompromiso: m - 1,
    toleraPerdida: n - m,
    // Una política de 1 de N no reparte nada: cualquiera puede mover fondos solo.
    puntoUnicoDeFirma: m === 1,
    // Con M = N, perder una sola llave congela los fondos definitivamente.
    riesgoDeCongelacion: m === n
  };
}

/**
 * ¿Sobrevive la política a un escenario concreto de compromiso y pérdida?
 */
export function evaluarEscenario({ m, n, comprometidos = 0, perdidos = 0 }) {
  const base = analizarCuorum({ m, n });
  if (comprometidos < 0 || perdidos < 0) throw new Error("No puede haber cantidades negativas");
  if (comprometidos + perdidos > n) throw new Error("No puede haber más firmantes afectados que firmantes");
  const disponiblesHonestos = n - comprometidos - perdidos;
  return {
    ...base,
    comprometidos,
    perdidos,
    // El atacante firma si controla al menos M llaves.
    atacantePuedeFirmar: comprometidos >= m,
    // La organización opera si le quedan al menos M llaves utilizables.
    organizacionPuedeOperar: disponiblesHonestos + comprometidos >= m,
    fondosCongelados: disponiblesHonestos + comprometidos < m,
    disponiblesHonestos
  };
}

/**
 * Escalones por importe: cuanto mayor el importe, mayor el cuórum exigido y el
 * retardo temporal — el único mecanismo que da tiempo a detectar una firma indebida.
 */
export function politicaPorImporte({ escalones, importe, destino, destinosPermitidos = [] }) {
  if (!Array.isArray(escalones) || escalones.length === 0) throw new Error("Hacen falta escalones");
  if (!(importe > 0)) throw new Error("El importe debe ser positivo");
  const ordenados = [...escalones].sort((a, b) => a.hasta - b.hasta);
  const aplicable = ordenados.find((e) => importe <= e.hasta) ?? ordenados.at(-1);
  const destinoConocido = destinosPermitidos.includes(destino);
  return {
    escalon: aplicable,
    firmasRequeridas: aplicable.m,
    // Un destino en lista permitida puede relajar el retardo; uno nuevo, nunca.
    retardoSegundos: destinoConocido ? 0 : aplicable.retardoSegundos ?? 0,
    destinoConocido,
    requiereVerificacionFueraDeBanda: !destinoConocido || importe > (ordenados[0]?.hasta ?? 0)
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  console.log("=== Resistencia de distintas políticas M-de-N ===\n");
  console.table([[1, 3], [2, 3], [3, 5], [4, 5], [5, 5], [5, 7]].map(([m, n]) => {
    const a = analizarCuorum({ m, n });
    return {
      política: a.politica,
      "aguanta comprometidos": a.toleraCompromiso,
      "aguanta perdidas": a.toleraPerdida,
      "punto único": a.puntoUnicoDeFirma ? "SÍ" : "no",
      "riesgo de congelación": a.riesgoDeCongelacion ? "SÍ" : "no"
    };
  }));
  console.log("\nSubir M sin subir N (3 de 5 → 4 de 5) compra resistencia al ataque y la paga con");
  console.log("riesgo de congelación. Subir ambos (3 de 5 → 5 de 7) dobla la resistencia al ataque");
  console.log("SIN perder tolerancia a la pérdida. Ese es el diseño que la intuición no da.\n");

  console.log("=== Escenarios concretos sobre 3 de 5 ===\n");
  console.table([
    { comprometidos: 2, perdidos: 0 },
    { comprometidos: 3, perdidos: 0 },
    { comprometidos: 0, perdidos: 2 },
    { comprometidos: 0, perdidos: 3 },
    { comprometidos: 1, perdidos: 2 }
  ].map((esc) => {
    const r = evaluarEscenario({ m: 3, n: 5, ...esc });
    return {
      escenario: `${esc.comprometidos} comprometidos, ${esc.perdidos} perdidos`,
      "¿el atacante firma?": r.atacantePuedeFirmar ? "SÍ" : "no",
      "¿la organización opera?": r.organizacionPuedeOperar ? "sí" : "NO",
      "¿fondos congelados?": r.fondosCongelados ? "SÍ" : "no"
    };
  }));

  console.log("\n=== Escalones por importe y destino ===\n");
  const escalones = [
    { hasta: 10_000, m: 2, retardoSegundos: 0 },
    { hasta: 250_000, m: 3, retardoSegundos: 3_600 },
    { hasta: Infinity, m: 4, retardoSegundos: 86_400 }
  ];
  const destinosPermitidos = ["tesoreria-interna", "custodio-regulado"];
  console.table([
    { importe: 5_000, destino: "tesoreria-interna" },
    { importe: 120_000, destino: "tesoreria-interna" },
    { importe: 120_000, destino: "direccion-nueva" },
    { importe: 3_000_000, destino: "direccion-nueva" }
  ].map((op) => {
    const p = politicaPorImporte({ escalones, destinosPermitidos, ...op });
    return {
      importe: op.importe.toLocaleString("es"),
      destino: op.destino,
      firmas: p.firmasRequeridas,
      "retardo (s)": p.retardoSegundos,
      "verificación fuera de banda": p.requiereVerificacionFueraDeBanda ? "sí" : "no"
    };
  }));
  console.log("\nEl retardo no previene la firma: da tiempo a DETECTARLA. Es el único control de detección.");
}
