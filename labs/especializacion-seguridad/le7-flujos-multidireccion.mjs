// LE7 · Analizar flujos entre múltiples direcciones y cadenas
//
// Prerrequisitos: LE6, clases 57–58 (grafos y rastreo) y 65–66 (forensics responsable).
// Pregunta que responde: tras un robo, ¿cuánto del valor que llegó a un destino «es» robado?
//
// La respuesta depende del MÉTODO de propagación que elijas, no solo de los datos. Cuando
// fondos limpios y sucios se mezclan en una dirección, lo que sale de ella no está marcado
// en la cadena: cada método impone una convención distinta.
//
//   poison   Cualquier salida de una cuenta contaminada se considera 100 % contaminada.
//            Sobrestima: arrastra dinero ajeno. Es la postura más cautelosa para bloquear.
//   haircut  La contaminación sale en proporción a la que hay en el saldo. Intermedio.
//   fifo     Primero en entrar, primero en salir. Depende del orden y de una convención
//            contable que la blockchain no impone.
//
// Ninguno es «la verdad»: son inferencias. Un informe responsable da el rango, nombra el
// método y NO atribuye identidad. Cada afirmación se etiqueta como hecho, indicador,
// inferencia o hipótesis, con su confianza.

import { readFile } from "node:fs/promises";
import { ejecutadoDirectamente } from "../run-directo.mjs";

export const METODOS = ["poison", "haircut", "fifo"];
const EPS = 1e-9;

// --- Estado por (dirección, activo) ---------------------------------------------------------------
function nuevoLibro(datos) {
  const libro = new Map();
  const clave = (direccion, activo) => `${direccion}|${activo}`;
  const cuenta = (direccion, activo) => {
    const k = clave(direccion, activo);
    if (!libro.has(k)) libro.set(k, { direccion, activo, saldo: 0, contaminado: 0, lotes: [], marcada: false, congelado: 0, recibido: 0 });
    return libro.get(k);
  };
  for (const s of datos.saldosIniciales) acreditar(cuenta(s.direccion, s.activo), s.monto, s.contaminado ? s.monto : 0);
  return { libro, cuenta };
}

function acreditar(c, monto, contaminado) {
  c.saldo += monto;
  c.contaminado += contaminado;
  c.recibido += contaminado;
  c.lotes.push({ monto, contaminado });
  if (contaminado > EPS) c.marcada = true;
}

/** Retira `monto` de la cuenta según el método y devuelve cuánto de lo retirado es contaminado. */
function debitar(c, monto, metodo) {
  if (monto > c.saldo + EPS) throw new Error(`Saldo insuficiente en ${c.direccion} (${c.activo}): ${c.saldo} < ${monto}`);
  let movido;
  if (metodo === "haircut") {
    movido = c.saldo > EPS ? monto * (c.contaminado / c.saldo) : 0;
  } else if (metodo === "poison") {
    movido = c.marcada ? monto : 0;
  } else {
    movido = 0;
    let pendiente = monto;
    while (pendiente > EPS) {
      const lote = c.lotes[0];
      const tomado = Math.min(lote.monto, pendiente);
      const parteContaminada = lote.monto > EPS ? lote.contaminado * (tomado / lote.monto) : 0;
      movido += parteContaminada;
      lote.monto -= tomado;
      lote.contaminado -= parteContaminada;
      pendiente -= tomado;
      if (lote.monto <= EPS) c.lotes.shift();
    }
  }
  c.saldo -= monto;
  c.contaminado = Math.max(0, c.contaminado - (metodo === "poison" ? Math.min(c.contaminado, monto) : movido));
  return movido;
}

/** Aplica todas las operaciones en orden temporal con el método elegido. */
export function propagar(datos, metodo) {
  if (!METODOS.includes(metodo)) throw new Error(`Método desconocido: ${metodo}`);
  const { libro, cuenta } = nuevoLibro(datos);
  const ordenadas = [...datos.transferencias].sort((a, b) => a.t - b.t || a.id.localeCompare(b.id));
  for (const op of ordenadas) {
    if (op.tipo === "congelamiento") {
      cuenta(op.desde, op.activo).congelado += op.monto;
      continue;
    }
    const origen = cuenta(op.desde, op.activo);
    if (op.tipo === "swap") {
      const movido = debitar(origen, op.monto, metodo);
      // La conversión conserva la FRACCIÓN contaminada (supuesto declarado).
      acreditar(cuenta(op.hasta, op.activoSalida), op.montoSalida, movido * (op.montoSalida / op.monto));
      continue;
    }
    const movido = debitar(origen, op.monto, metodo);
    acreditar(cuenta(op.hasta, op.activo), op.monto, movido);
  }
  return libro;
}

/**
 * Exposición por dirección y activo, para un método:
 *   recibido  = contaminación que LLEGÓ alguna vez (lo que importa para «¿pasó dinero robado por aquí?»)
 *   contaminado = lo que sigue en el saldo al final (lo que importa para recuperar).
 */
export function exposicion(datos, metodo) {
  const libro = propagar(datos, metodo);
  return [...libro.values()]
    .filter((c) => c.recibido > EPS || c.contaminado > EPS || c.congelado > 0)
    .map((c) => ({ direccion: c.direccion, activo: c.activo, saldo: round(c.saldo), recibido: round(c.recibido), contaminado: round(c.contaminado), congelado: c.congelado }))
    .sort((a, b) => b.recibido - a.recibido);
}

const round = (x) => Math.round(x * 100) / 100;

/** Compara los tres métodos para una dirección: el rango ES la respuesta honesta. */
export function rangoDeExposicion(datos, direccion, activo) {
  const porMetodo = Object.fromEntries(METODOS.map((m) => {
    const fila = exposicion(datos, m).find((f) => f.direccion === direccion && f.activo === activo);
    return [m, fila?.recibido ?? 0];
  }));
  const valores = Object.values(porMetodo);
  return { direccion, activo, ...porMetodo, minimo: Math.min(...valores), maximo: Math.max(...valores) };
}

// --- Patrones (indicadores, no pruebas) -------------------------------------------------------------------
/** Cadena de pelado: cada paso envía el grueso adelante y un trozo menor fuera. */
export function detectarCadenasDePelado(datos, { minimoPasos = 3, fraccionPrincipal = 0.7 } = {}) {
  const porTx = new Map();
  for (const op of datos.transferencias.filter((o) => o.txid && o.tipo === "transferencia")) {
    if (!porTx.has(op.txid)) porTx.set(op.txid, []);
    porTx.get(op.txid).push(op);
  }
  const pasos = new Map(); // dirección de entrada → { siguiente, hoja, txid }
  for (const [txid, ops] of porTx) {
    if (ops.length !== 2) continue;
    const [grande, chica] = [...ops].sort((a, b) => b.monto - a.monto);
    if (grande.monto / (grande.monto + chica.monto) >= fraccionPrincipal && grande.desde === chica.desde) {
      pasos.set(grande.desde, { siguiente: grande.hasta, hoja: chica.hasta, txid, monto: grande.monto });
    }
  }
  const cadenas = [];
  const visitados = new Set();
  for (const inicio of pasos.keys()) {
    if (visitados.has(inicio)) continue;
    const ruta = [];
    let actual = inicio;
    while (pasos.has(actual) && !visitados.has(actual)) {
      visitados.add(actual);
      ruta.push({ desde: actual, ...pasos.get(actual) });
      actual = pasos.get(actual).siguiente;
    }
    if (ruta.length >= minimoPasos) cadenas.push({ pasos: ruta.length, ruta, terminaEn: actual });
  }
  return cadenas;
}

/** Direcciones cuya PRIMERA entrada fue exactamente `cantidad` (polvo semilla). Indicador débil: es una convención de quien opera. */
export function detectarSemillasDePolvo(datos, { activo = "TRX", cantidad = 1 } = {}) {
  const primera = new Map();
  for (const op of [...datos.transferencias].sort((a, b) => a.t - b.t)) {
    if (op.hasta && !primera.has(op.hasta)) primera.set(op.hasta, op);
  }
  return [...primera.values()].filter((op) => op.activo === activo && op.monto === cantidad).map((op) => op.hasta);
}

/** Empareja salidas y entradas de puente por refId: la correspondencia es una inferencia, no un hecho de cadena. */
export function emparejarPuentes(datos) {
  const salidas = datos.transferencias.filter((o) => o.tipo === "puente-salida");
  return salidas.map((s) => {
    const entrada = datos.transferencias.find((o) => o.tipo === "puente-entrada" && o.refId === s.refId);
    return entrada
      ? { refId: s.refId, de: s.desde, a: entrada.hasta, montoSalida: s.monto, montoEntrada: entrada.monto, diferencia: s.monto - entrada.monto, segundos: entrada.t - s.t, confianza: "media" }
      : { refId: s.refId, de: s.desde, a: null, confianza: "sin pareja" };
  });
}

// --- Qué se puede congelar y qué no --------------------------------------------------------------------------
export function analizarRecuperabilidad(datos, metodo = "fifo") {
  const libro = propagar(datos, metodo);
  const filas = [];
  for (const c of libro.values()) {
    if (c.contaminado <= EPS) continue;
    const activo = datos.activos[c.activo];
    const congelado = Math.min(c.congelado, c.contaminado);
    const resto = c.contaminado - congelado;
    filas.push({
      direccion: c.direccion, activo: c.activo, contaminado: round(c.contaminado), congelado: round(congelado), resto: round(resto),
      estado: resto <= EPS ? "congelado" : activo?.congelable ? "congelable: solicitar al emisor" : "no congelable: depende de quien controle la salida (exchange, OTC)",
      mecanismo: activo?.mecanismo ?? "desconocido"
    });
  }
  const suma = (f, campo) => round(filas.filter(f).reduce((s, x) => s + x[campo], 0));
  return {
    metodo, filas: filas.sort((a, b) => b.contaminado - a.contaminado),
    totalContaminado: suma(() => true, "contaminado"),
    yaCongelado: suma(() => true, "congelado"),
    congelablePendiente: suma((f) => f.estado.startsWith("congelable"), "resto"),
    noCongelable: suma((f) => f.estado.startsWith("no congelable"), "resto")
  };
}

// --- Informe con etiquetas de certeza -----------------------------------------------------------------------------
export function informe(datos) {
  const afirmaciones = [];
  const hecho = (texto, fuente) => afirmaciones.push({ nivel: "hecho", texto, fuente, confianza: "alta" });
  const indicador = (texto, confianza) => afirmaciones.push({ nivel: "indicador", texto, confianza });
  const inferencia = (texto, confianza) => afirmaciones.push({ nivel: "inferencia", texto, confianza });
  const hipotesis = (texto) => afirmaciones.push({ nivel: "hipótesis", texto, confianza: "baja" });

  hecho(`El conjunto contiene ${datos.transferencias.length} operaciones en ${new Set(datos.transferencias.map((o) => o.cadena)).size} cadenas.`, "dataset");
  const cadenasPelado = detectarCadenasDePelado(datos);
  for (const c of cadenasPelado) indicador(`Patrón de cadena de pelado de ${c.pasos} pasos que termina en ${c.terminaEn}.`, "media");
  const semillas = detectarSemillasDePolvo(datos);
  if (semillas.length) indicador(`${semillas.length} direcciones recibieron exactamente 1 TRX como primera entrada: convención de preparación, no prueba de autoría.`, "baja");
  for (const p of emparejarPuentes(datos)) inferencia(`El puente ${p.refId} conecta ${p.de} con ${p.a ?? "?"} (diferencia ${p.diferencia}).`, p.confianza);
  const rango = rangoDeExposicion(datos, "eth:deposito-exchange-A", "ETH");
  inferencia(`La exposición contaminada del depósito en un exchange va de ${rango.minimo} a ${rango.maximo} según el método (poison ${rango.poison}, haircut ${rango.haircut}, fifo ${rango.fifo}).`, "media");
  hipotesis("Las direcciones intermedias (hop-*) podrían estar controladas por la misma entidad; el dataset no lo demuestra.");
  return { atribucion: null, aviso: "Una dirección no equivale a una persona; ninguna etiqueta de este informe identifica a nadie.", afirmaciones };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const datos = JSON.parse(await readFile(new URL("./fixtures/flujos-multicadena.json", import.meta.url), "utf8"));
  console.log("LE7 · Flujos entre múltiples direcciones y cadenas (datos sintéticos)\n");
  console.log("Exposición del depósito en el exchange según el método:");
  console.table([rangoDeExposicion(datos, "eth:deposito-exchange-A", "ETH"), rangoDeExposicion(datos, "eth:hop-2", "ETH")]);
  console.log("Cadenas de pelado:", detectarCadenasDePelado(datos).map((c) => `${c.pasos} pasos → ${c.terminaEn}`));
  console.log("Puentes:", emparejarPuentes(datos));
  const r = analizarRecuperabilidad(datos);
  console.log(`\nRecuperabilidad (fifo): contaminado ${r.totalContaminado} | congelado ${r.yaCongelado} | congelable pendiente ${r.congelablePendiente} | no congelable ${r.noCongelable}`);
  console.log("\nInforme:");
  console.table(informe(datos).afirmaciones.map((a) => ({ nivel: a.nivel, confianza: a.confianza, texto: a.texto.slice(0, 90) })));
}
