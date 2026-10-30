// LE5 · Detector de delegaciones sospechosas (EIP-7702)
//
// Prerrequisitos: LE4, clases 57–58 (analítica on-chain) y 65–66 (forensics).
// Pregunta que responde: viendo SOLO datos públicos, ¿qué hace sospechosa a una delegación?
//
// Una delegación no es un ataque: es una función del protocolo que usan wallets
// legítimas. Un detector que marque "toda delegación" es inservible, y uno que no marque
// ninguna llega tarde. Este detector es un sistema de PUNTAJES EXPLICABLES: cada regla
// aporta un peso y deja su evidencia, de modo que un analista pueda ver POR QUÉ una
// observación subió y discutirla. Ninguna regla atribuye identidad: describe conducta.
//
// Límite que se repite en clase: las reglas y los pesos de aquí se calibran con datos
// sintéticos. Sirven para aprender el método, no para trasladar umbrales a producción.

import { readFile } from "node:fs/promises";
import { aChecksum } from "./nucleo/direcciones.mjs";
import { destinoDeDelegacion } from "./nucleo/transacciones.mjs";
import { DIRECCION_CERO } from "./nucleo/red-lab.mjs";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const min = (d) => d.toLowerCase();
const esCero = (d) => min(d) === DIRECCION_CERO;
const VENTANA_BARRIDO_SEGUNDOS = 900;

export const NIVELES = [
  { minimo: 70, nivel: "crítica", accion: "Paginar al equipo de guardia y activar el procedimiento de contención." },
  { minimo: 40, nivel: "alta", accion: "Cola de revisión con respuesta en minutos; confirmar fuera de banda con el titular." },
  { minimo: 20, nivel: "media", accion: "Revisar en la jornada y registrar la decisión." },
  { minimo: 0, nivel: "baja", accion: "Sin acción; conservar para línea base." }
];

function autoridadesDe(obs) {
  return [...new Set(obs.autorizaciones.map((a) => min(a.autoridad)))];
}

function delegacionesNoAprobadas(obs, ctx) {
  return obs.autorizaciones.filter((a) =>
    a.aplicada && !esCero(a.delegadoA) && ctx.delegados[min(a.delegadoA)]?.aprobado !== true);
}

/** Cada regla devuelve null (no aplica) o { evidencia }. El peso es parte de la regla, no del motor. */
export const REGLAS = [
  {
    id: "DEL-01", nombre: "Delegado no aprobado", peso: 30,
    falsoPositivo: "Una aplicación legítima nueva todavía no está en la lista de aprobados.",
    evaluar(obs, ctx) {
      const hits = delegacionesNoAprobadas(obs, ctx);
      return hits.length ? { evidencia: `delega en ${[...new Set(hits.map((h) => h.delegadoA))].join(", ")}` } : null;
    }
  },
  {
    id: "DEL-02", nombre: "Delegado reciente o sin código verificado", peso: 15,
    falsoPositivo: "Los contratos legítimos también nacen: la edad sola no los condena.",
    evaluar(obs, ctx) {
      for (const a of delegacionesNoAprobadas(obs, ctx)) {
        const info = ctx.delegados[min(a.delegadoA)] ?? { edadHoras: 0, verificado: false };
        if (info.edadHoras < 72 || !info.verificado) {
          return { evidencia: `${a.delegadoA}: ${info.edadHoras} h de edad, verificado=${info.verificado}` };
        }
      }
      return null;
    }
  },
  {
    id: "DEL-04", nombre: "La envía un tercero no reconocido", peso: 10,
    falsoPositivo: "Los patrocinadores (relayers) legítimos envían autorizaciones ajenas a diario.",
    evaluar(obs, ctx) {
      const remitente = min(obs.remitente);
      const esAutor = autoridadesDe(obs).includes(remitente);
      const conocido = ctx.relayersConocidos.map(min).includes(remitente);
      return !esAutor && !conocido ? { evidencia: `remitente ${obs.remitente} no es la autoridad ni un relayer conocido` } : null;
    }
  },
  {
    id: "DEL-05", nombre: "Ventana de autorizaciones de una misma cuenta", peso: 30,
    falsoPositivo: "Casi ninguno: una cuenta legítima no necesita firmar decenas de nonces a la vez.",
    evaluar(obs) {
      const conteo = new Map();
      for (const a of obs.autorizaciones) conteo.set(min(a.autoridad), (conteo.get(min(a.autoridad)) ?? 0) + 1);
      const [autoridad, n] = [...conteo].sort((x, y) => y[1] - x[1])[0] ?? [null, 0];
      return n >= 3 ? { evidencia: `${n} autorizaciones de ${autoridad} en una sola transacción (solo se aplican las que coinciden con el nonce)` } : null;
    }
  },
  {
    id: "DEL-06", nombre: "Chain id 0 hacia un delegado no aprobado", peso: 10,
    falsoPositivo: "Un usuario puede querer la misma delegación en todas las redes, pero hacia un delegado de confianza.",
    evaluar(obs, ctx) {
      const hits = delegacionesNoAprobadas(obs, ctx).filter((a) => String(a.chainId) === "0");
      return hits.length ? { evidencia: "firma válida en cualquier red: reutilizable en todas a la vez" } : null;
    }
  },
  {
    id: "DEL-07", nombre: "Financiación opaca o recién creada del remitente", peso: 15,
    falsoPositivo: "Un usuario nuevo en una red también tiene una cuenta joven.",
    evaluar(obs) {
      const esAutor = autoridadesDe(obs).includes(min(obs.remitente));
      if (esAutor) return null;
      const f = obs.fondeoRemitente ?? { origen: "desconocido", edadHoras: 0 };
      return (["mezclador", "desconocido"].includes(f.origen) || f.edadHoras < 24)
        ? { evidencia: `origen de fondos ${f.origen}, cuenta de ${f.edadHoras} h` } : null;
    }
  },
  {
    id: "DEL-08", nombre: "Barrido posterior a la delegación", peso: 35,
    falsoPositivo: "Un usuario puede retirar legítimamente su saldo justo después de cambiar de wallet.",
    evaluar(obs, ctx) {
      const autores = autoridadesDe(obs);
      const fin = obs.timestamp + VENTANA_BARRIDO_SEGUNDOS;
      for (const autor of autores) {
        const saldo = ctx.saldoUsdAntes[autor] ?? ctx.saldoUsdAntes[aChecksum(autor)] ?? 0;
        if (saldo <= 0) continue;
        const salido = (obs.salidasPosteriores ?? [])
          .filter((s) => min(s.desde) === autor && s.timestamp >= obs.timestamp && s.timestamp <= fin)
          .reduce((suma, s) => suma + s.valorUsd, 0);
        if (salido / saldo >= 0.5) {
          return { evidencia: `${Math.round((salido / saldo) * 100)} % del saldo de ${autor} salió en ${VENTANA_BARRIDO_SEGUNDOS} s` };
        }
      }
      return null;
    }
  },
  {
    id: "DEL-09", nombre: "Delegación no aprobada que persiste", peso: 10,
    falsoPositivo: "Una delegación legítima también persiste; por eso solo suma junto a DEL-01.",
    evaluar(obs, ctx) {
      return delegacionesNoAprobadas(obs, ctx).length && (obs.horasActiva ?? 0) >= 24
        ? { evidencia: `sigue activa tras ${obs.horasActiva} h sin revocarse` } : null;
    }
  }
];

/** ¿Alguna autoridad es una cuenta de custodia? En custodia la tolerancia a delegaciones no aprobadas es CERO. */
function esCustodia(obs, ctx) {
  return autoridadesDe(obs).some((a) => ctx.etiquetas[a]?.tipo?.startsWith("custodio"));
}

export function analizarObservacion(obs, ctx) {
  const hallazgos = [];
  for (const regla of REGLAS) {
    const resultado = regla.evaluar(obs, ctx);
    if (resultado) hallazgos.push({ regla: regla.id, nombre: regla.nombre, peso: regla.peso, evidencia: resultado.evidencia, falsoPositivoPosible: regla.falsoPositivo });
  }
  let puntaje = Math.min(100, hallazgos.reduce((suma, h) => suma + h.peso, 0));
  const pisoDeCustodia = esCustodia(obs, ctx) && hallazgos.some((h) => h.regla === "DEL-01");
  if (pisoDeCustodia) puntaje = Math.max(puntaje, 70);
  const nivel = NIVELES.find((n) => puntaje >= n.minimo);
  return { id: obs.id, cadena: obs.cadena, txHash: obs.txHash, puntaje, nivel: nivel.nivel, accion: nivel.accion, pisoDeCustodia, hallazgos };
}

export function analizarTodo(observaciones, ctx) {
  return observaciones.map((obs) => analizarObservacion(obs, ctx)).sort((a, b) => b.puntaje - a.puntaje);
}

/** Matriz de confusión contra la verdad de campo sintética. */
export function evaluar(observaciones, ctx, umbral = 40) {
  let vp = 0; let fp = 0; let fn = 0; let vn = 0;
  const falsosPositivos = [];
  const falsosNegativos = [];
  for (const obs of observaciones) {
    const marcada = analizarObservacion(obs, ctx).puntaje >= umbral;
    const maliciosa = obs.verdad === "maliciosa";
    if (marcada && maliciosa) vp += 1;
    else if (marcada) { fp += 1; falsosPositivos.push(obs.id); }
    else if (maliciosa) { fn += 1; falsosNegativos.push(obs.id); }
    else vn += 1;
  }
  return {
    umbral, vp, fp, fn, vn, falsosPositivos, falsosNegativos,
    precision: vp + fp === 0 ? null : vp / (vp + fp),
    exhaustividad: vp + fn === 0 ? null : vp / (vp + fn)
  };
}

/** Qué pasa al mover el umbral: no hay punto gratis entre molestar al analista y llegar tarde. */
export function barridoDeUmbrales(observaciones, ctx, umbrales = [20, 40, 45, 60, 70]) {
  return umbrales.map((u) => evaluar(observaciones, ctx, u));
}

/**
 * Puente con LE4: convierte lo que ocurrió en la red de laboratorio en observaciones del
 * detector. Es el mismo trabajo que haría un indexador sobre un nodo real.
 */
export function observacionesDesdeRed(red, { fondeo = {}, precioEthUsd = 2500, decimalesToken = 6, precioTokenUsd = 1 } = {}) {
  const observaciones = [];
  for (const { tx, recibo, bloque } of red.transacciones.values()) {
    if (tx.autorizaciones.length === 0) continue;
    const timestamp = red.bloques[bloque - 1].timestamp;
    const autorizaciones = tx.autorizaciones.map((a, i) => ({
      autoridad: recibo.autorizaciones[i].autoridad ?? "0x" + "0".repeat(40), delegadoA: a.direccion,
      nonce: Number(a.nonce), chainId: a.chainId.toString(), aplicada: recibo.autorizaciones[i].aplicada
    }));
    const autores = new Set(autorizaciones.map((a) => min(a.autoridad)));
    const salidasEth = red.trazaEth
      .filter((p) => p.monto > 0n && p.timestamp > timestamp && autores.has(min(p.de)))
      .map((p) => ({ desde: p.de, timestamp: p.timestamp, valorUsd: (Number(p.monto) / 1e18) * precioEthUsd }));
    const salidasToken = [...red.transacciones.values()]
      .filter((o) => o.bloque > bloque)
      .flatMap((o) => o.recibo.registros.map((r) => ({ r, ts: red.bloques[o.bloque - 1].timestamp })))
      .filter(({ r }) => autores.has(min(`0x${r.topics[1].slice(26)}`)) && r.topics[1] !== r.topics[2])
      .map(({ r, ts }) => ({ desde: `0x${r.topics[1].slice(26)}`, timestamp: ts, valorUsd: (Number(BigInt(r.data)) / 10 ** decimalesToken) * precioTokenUsd }));
    observaciones.push({
      id: tx.hash.slice(0, 10), txHash: tx.hash, cadena: "red-lab", timestamp, remitente: tx.remitente,
      fondeoRemitente: fondeo[min(tx.remitente)] ?? { origen: "desconocido", edadHoras: 1 },
      autorizaciones, salidasPosteriores: [...salidasEth, ...salidasToken], horasActiva: 0
    });
  }
  return observaciones;
}

/** Lee el código de una cuenta (como lo devuelve eth_getCode) y dice si está delegada y adónde. */
export function inspeccionarCodigo(codigo) {
  const destino = destinoDeDelegacion(codigo);
  return destino ? { delegada: true, delegadoA: destino } : { delegada: false, delegadoA: null };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const { contexto, observaciones } = JSON.parse(await readFile(new URL("./fixtures/delegaciones-observadas.json", import.meta.url), "utf8"));
  console.log("LE5 · Detector de delegaciones sospechosas (datos sintéticos)\n");
  console.table(analizarTodo(observaciones, contexto).map((r) => ({
    id: r.id, puntaje: r.puntaje, nivel: r.nivel, reglas: r.hallazgos.map((h) => h.regla).join(" ")
  })));
  console.log("Barrido de umbrales:");
  console.table(barridoDeUmbrales(observaciones, contexto).map((e) => ({
    umbral: e.umbral, vp: e.vp, fp: e.fp, fn: e.fn, precision: e.precision?.toFixed(2), exhaustividad: e.exhaustividad?.toFixed(2)
  })));
  console.log("Una conducta sospechosa no es una identidad: el detector describe, no acusa.");
}
