// LE8 · Diseñar un monitor de riesgos para custodios
//
// Prerrequisitos: LE4–LE7, clases 59–60 (exchanges y custodia) y 53–54 (claves institucionales).
// Pregunta que responde: ¿qué debe vigilar un custodio y qué puede hacer realmente al detectarlo?
//
// El monitor evalúa EVENTOS (salidas, delegaciones, firmas, saltos de nonce) contra una
// POLÍTICA (límites, destinos permitidos, delegados aprobados). Cada regla es explicable
// y cada alerta dice qué regla la disparó y con qué evidencia.
//
// La lección central no es el código sino un límite de diseño que el laboratorio mide:
//
//   El freno de emergencia detiene lo que pasa POR TUS SISTEMAS. Si el atacante firma con
//   material robado fuera de tu servicio, el freno no detiene nada. Lo único que acota la
//   pérdida en ese caso es cuánto valor había expuesto en la billetera caliente: el TOPE.
//
// Por eso se simulan dos hipótesis sobre la misma secuencia de hechos (infraestructura de
// firma comprometida vs. clave exfiltrada) y dos días (un ataque y un día normal): una
// política que solo se evalúa contra el ataque parece perfecta y paraliza la operación real.

import { readFile } from "node:fs/promises";
import { ejecutadoDirectamente } from "../run-directo.mjs";

const min = (d) => (d ?? "").toLowerCase();

export const SEVERIDADES = { crítica: 3, alta: 2, media: 1 };

export class MonitorCustodio {
  constructor(politica, variante) {
    this.politica = politica;
    this.variante = variante;
    this.salidas = []; // historial reciente: { t, billetera, valorUsd }
    this.anomalias = []; // salidas anómalas por cadena, para la correlación
    this.pausadoDesde = null;
    this.alertas = [];
    this.pausas = [];
  }

  /** ¿Seguiría el servicio de firma aceptando órdenes en el instante t? */
  servicioActivo(t) {
    return this.pausadoDesde === null || t < this.pausadoDesde;
  }

  #alertar(evento, regla, severidad, evidencia) {
    const t = evento.t + this.politica.latenciaDeteccionSegundos;
    const alerta = { eventoId: evento.id, t, regla, severidad, billetera: evento.billetera, evidencia };
    this.alertas.push(alerta);
    if (this.variante.frenoDeEmergencia && this.variante.pausaCon.includes(regla) && this.pausadoDesde === null) {
      this.pausadoDesde = t;
      this.pausas.push({ t, motivo: regla, eventoId: evento.id });
    }
    return alerta;
  }

  procesar(evento) {
    const billetera = this.politica.billeteras[evento.billetera];
    const generadas = [];
    const mas = (regla, severidad, evidencia) => generadas.push(this.#alertar(evento, regla, severidad, evidencia));

    if (evento.tipo === "delegacion") {
      const aprobada = this.politica.delegacionesAprobadas.map(min).includes(min(evento.delegadoA));
      if (!aprobada) mas("R-DEL", "crítica", `la billetera ${evento.billetera} adoptó el código no aprobado ${evento.delegadoA}`);
    }

    if (evento.tipo === "firma" && !evento.ticket) {
      mas("R-FIRMA", "crítica", "firma producida sin solicitud registrada en el flujo de aprobación");
    }

    if (evento.tipo === "nonce" && evento.nonceOnchain !== evento.nonceInterno) {
      mas("R-NONCE", "crítica", `nonce on-chain ${evento.nonceOnchain} ≠ interno ${evento.nonceInterno}: se consumieron firmas fuera del sistema`);
    }

    if (evento.tipo === "salida" && billetera) {
      this.salidas.push({ t: evento.t, billetera: evento.billetera, valorUsd: evento.valorUsd });
      const permitido = billetera.destinosPermitidos.map(min).includes(min(evento.destino));
      let anomala = false;
      if (!permitido && !evento.ticket) {
        mas("R-DEST", "alta", `salida de ${evento.valorUsd} USD a un destino fuera de la lista y sin ticket`);
        anomala = true;
      }
      const desde = evento.t - this.politica.ventanaVelocidadSegundos;
      const enVentana = this.salidas.filter((s) => s.billetera === evento.billetera && s.t > desde && s.t <= evento.t)
        .reduce((suma, s) => suma + s.valorUsd, 0);
      if (enVentana > billetera.limiteHoraUsd && !evento.ticket) {
        mas("R-VEL", "alta", `${enVentana} USD en la última hora superan el límite de ${billetera.limiteHoraUsd}`);
        anomala = true;
      }
      if (anomala) {
        this.anomalias.push({ t: evento.t, cadena: billetera.cadena, billetera: evento.billetera });
        const recientes = this.anomalias.filter((a) => a.t > evento.t - this.politica.ventanaCorrelacionSegundos);
        const cadenas = new Set(recientes.map((a) => a.cadena));
        if (cadenas.size >= this.politica.minimoCadenasCorrelacionadas && !this.alertas.some((a) => a.regla === "R-CORR")) {
          mas("R-CORR", "crítica", `salidas anómalas en ${cadenas.size} cadenas (${[...cadenas].join(", ")}) dentro de ${this.politica.ventanaCorrelacionSegundos} s: apunta a un compromiso común de la infraestructura de firma, no a un fallo aislado`);
        }
      }
    }
    return generadas;
  }
}

/** Reglas estáticas sobre saldos: la exposición máxima es el saldo de la billetera caliente. */
export function verificarExposicion(politica) {
  return Object.entries(politica.billeteras).map(([nombre, b]) => ({
    billetera: nombre, saldoUsd: b.saldoUsd, topeUsd: b.topeUsd,
    excedeTope: b.saldoUsd > b.topeUsd, exposicionMaximaUsd: b.saldoUsd, exposicionConTopeUsd: Math.min(b.saldoUsd, b.topeUsd)
  }));
}

/**
 * Reproduce una línea de tiempo con una política y una hipótesis de compromiso.
 *   hipotesis = "infraestructura": los hechos del ataque pasan por el servicio de firma → el freno los detiene.
 *   hipotesis = "clave": el atacante firma fuera del servicio → el freno no detiene nada.
 */
export function simular(politica, linea, nombreVariante, hipotesis = "infraestructura") {
  const variante = politica.variantes[nombreVariante];
  if (!variante) throw new Error(`Variante desconocida: ${nombreVariante}`);
  const monitor = new MonitorCustodio(politica, variante);
  const eventos = [...linea].sort((a, b) => a.t - b.t).map((e) => (e.esAtaque ? { ...e, via: hipotesis === "clave" ? "externo" : "sistema" } : e));

  const ejecutados = [];
  for (const evento of eventos) {
    monitor.procesar(evento);
    // Un evento que pasa por el servicio de firma se bloquea si el freno ya estaba activo cuando llegó.
    const bloqueado = evento.via === "sistema" && !monitor.servicioActivo(evento.t);
    ejecutados.push({ ...evento, bloqueado });
  }

  const ataques = ejecutados.filter((e) => e.esAtaque && e.tipo === "salida");
  const perdidaPorBilletera = new Map();
  for (const e of ataques.filter((a) => !a.bloqueado)) {
    perdidaPorBilletera.set(e.billetera, (perdidaPorBilletera.get(e.billetera) ?? 0) + e.valorUsd);
  }
  let perdida = 0;
  for (const [nombre, valor] of perdidaPorBilletera) {
    const tope = politica.billeteras[nombre].topeUsd;
    // Con topes, la billetera caliente nunca tuvo más que su tope: no hay más que robar.
    perdida += variante.aplicarTopes ? Math.min(valor, tope) : valor;
  }
  const totalAtaque = ataques.reduce((s, e) => s + (variante.aplicarTopes ? Math.min(e.valorUsd, politica.billeteras[e.billetera].topeUsd) : e.valorUsd), 0);
  const alertasAtaque = monitor.alertas.filter((a) => ejecutados.find((e) => e.id === a.eventoId)?.esAtaque);
  const primeraDeAtaque = alertasAtaque.length ? Math.min(...alertasAtaque.map((a) => a.t)) : null;
  const inicioAtaque = Math.min(...ejecutados.filter((e) => e.esAtaque).map((e) => e.t), Infinity);

  return {
    variante: nombreVariante, hipotesis,
    perdidaUsd: perdida,
    perdidaEvitadaUsd: totalAtaque - perdida,
    primeraAlertaSegundos: primeraDeAtaque === null || !Number.isFinite(inicioAtaque) ? null : primeraDeAtaque - inicioAtaque,
    pausaSegundos: monitor.pausadoDesde === null || !Number.isFinite(inicioAtaque) ? null : monitor.pausadoDesde - inicioAtaque,
    alertas: monitor.alertas.length,
    alertasPorRegla: Object.fromEntries([...new Set(monitor.alertas.map((a) => a.regla))].map((r) => [r, monitor.alertas.filter((a) => a.regla === r).length])),
    pausas: monitor.pausas.length,
    pausaInnecesaria: !ejecutados.some((e) => e.esAtaque) && monitor.pausas.length > 0,
    // Coste operativo del freno: lo legítimo que se bloqueó mientras el servicio estaba pausado.
    operacionesLegitimasBloqueadas: ejecutados.filter((e) => !e.esAtaque && e.bloqueado && ["salida", "firma", "delegacion"].includes(e.tipo)).length,
    monitor
  };
}

/** La comparación que importa: cada variante contra el ataque (dos hipótesis) y contra un día normal. */
export function compararVariantes(politica, lineas) {
  return Object.keys(politica.variantes).map((nombre) => {
    const infra = simular(politica, lineas.ataque, nombre, "infraestructura");
    const clave = simular(politica, lineas.ataque, nombre, "clave");
    const normal = simular(politica, lineas.normal, nombre);
    return {
      variante: nombre,
      perdidaSiInfraestructura: infra.perdidaUsd,
      perdidaSiClaveExfiltrada: clave.perdidaUsd,
      pausaTrasInicioSegundos: infra.pausaSegundos,
      alertasEnDiaNormal: normal.alertas,
      pausasEnDiaNormal: normal.pausas,
      operacionesLegitimasBloqueadas: normal.operacionesLegitimasBloqueadas
    };
  });
}

if (ejecutadoDirectamente(import.meta.url)) {
  const politica = JSON.parse(await readFile(new URL("./fixtures/politica-custodio.json", import.meta.url), "utf8"));
  const lineas = JSON.parse(await readFile(new URL("./fixtures/linea-de-tiempo-custodio.json", import.meta.url), "utf8"));
  console.log("LE8 · Monitor de riesgos para custodios (datos sintéticos)\n");
  console.log("Exposición máxima por billetera caliente:");
  console.table(verificarExposicion(politica));
  console.log("Variantes de política contra el ataque (dos hipótesis) y contra un día normal:");
  console.table(compararVariantes(politica, lineas));
  console.log("El freno detiene lo que pasa por tus sistemas; el tope acota lo que se puede perder.");
}
