import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MonitorCustodio, compararVariantes, simular, verificarExposicion } from "./le8-monitor-riesgos-custodio.mjs";

const politica = JSON.parse(await readFile(new URL("./fixtures/politica-custodio.json", import.meta.url), "utf8"));
const lineas = JSON.parse(await readFile(new URL("./fixtures/linea-de-tiempo-custodio.json", import.meta.url), "utf8"));
const TOTAL_ATAQUE = 296000 + 96000 + 1470000 + 628000 + 2500000 + 200000;

test("una delegación a un delegado no aprobado es una alerta crítica; a uno aprobado, no", () => {
  const monitor = new MonitorCustodio(politica, politica.variantes.base);
  const hostil = lineas.ataque.find((e) => e.tipo === "delegacion");
  const legitima = lineas.normal.find((e) => e.tipo === "delegacion");
  assert.equal(monitor.procesar(hostil)[0].regla, "R-DEL");
  assert.equal(monitor.procesar(legitima).length, 0);
});

test("una firma sin solicitud registrada es crítica; con ticket no genera alerta", () => {
  const monitor = new MonitorCustodio(politica, politica.variantes.base);
  assert.equal(monitor.procesar({ id: "x", t: 1, tipo: "firma", billetera: "hot-eth" })[0].regla, "R-FIRMA");
  assert.equal(monitor.procesar({ id: "y", t: 2, tipo: "firma", billetera: "hot-eth", ticket: "OPS-1" }).length, 0);
});

test("un nonce on-chain por delante del interno delata firmas consumidas fuera del sistema", () => {
  const monitor = new MonitorCustodio(politica, politica.variantes.base);
  const [alerta] = monitor.procesar({ id: "z", t: 1, tipo: "nonce", billetera: "hot-eth", nonceOnchain: 90, nonceInterno: 41 });
  assert.equal(alerta.regla, "R-NONCE");
  assert.match(alerta.evidencia, /90 ≠ interno 41/);
});

test("una salida a un destino fuera de la lista y sin ticket es alta; con ticket o en la lista no", () => {
  const m = new MonitorCustodio(politica, politica.variantes.base);
  const permitido = politica.billeteras["hot-eth"].destinosPermitidos[0];
  const ajeno = "0xdead00000000000000000000000000000000dead";
  assert.equal(m.procesar({ id: "a", t: 1, tipo: "salida", billetera: "hot-eth", valorUsd: 1000, destino: ajeno })[0].regla, "R-DEST");
  assert.equal(m.procesar({ id: "b", t: 2, tipo: "salida", billetera: "hot-eth", valorUsd: 1000, destino: ajeno, ticket: "OPS-9" }).length, 0);
  assert.equal(m.procesar({ id: "c", t: 3, tipo: "salida", billetera: "hot-eth", valorUsd: 1000, destino: permitido }).length, 0);
});

test("la velocidad acumulada en la ventana supera el límite aunque cada salida sea pequeña", () => {
  const m = new MonitorCustodio(politica, politica.variantes.base);
  const destino = politica.billeteras["hot-xrp"].destinosPermitidos[0];
  let ultimas = [];
  for (let i = 0; i < 5; i += 1) ultimas = m.procesar({ id: `v${i}`, t: i * 60, tipo: "salida", billetera: "hot-xrp", valorUsd: 8000, destino });
  assert.deepEqual(ultimas.map((a) => a.regla), ["R-VEL"], "5 × 8 000 = 40 000 > 30 000 por hora");
});

test("salidas anómalas en tres cadenas distintas disparan la correlación una sola vez", () => {
  const { monitor } = simular(politica, lineas.ataque, "base", "infraestructura");
  const correlaciones = monitor.alertas.filter((a) => a.regla === "R-CORR");
  assert.equal(correlaciones.length, 1);
  assert.match(correlaciones[0].evidencia, /3 cadenas/);
  assert.match(correlaciones[0].evidencia, /infraestructura de firma/);
});

test("dos cadenas anómalas no bastan: no se alcanza el mínimo de correlación", () => {
  const solo2 = lineas.ataque.filter((e) => ["hot-xrp", "hot-sol"].includes(e.billetera));
  const { monitor } = simular(politica, solo2, "base", "infraestructura");
  assert.equal(monitor.alertas.filter((a) => a.regla === "R-CORR").length, 0);
});

test("sin freno de emergencia se pierde todo el ataque en cualquier hipótesis", () => {
  for (const h of ["infraestructura", "clave"]) assert.equal(simular(politica, lineas.ataque, "solo-alertas", h).perdidaUsd, TOTAL_ATAQUE);
});

test("si el compromiso es de la infraestructura de firma, el freno acota la pérdida; cuanto antes pausa, menos se pierde", () => {
  const base = simular(politica, lineas.ataque, "base", "infraestructura");
  const estricta = simular(politica, lineas.ataque, "estricta", "infraestructura");
  assert.equal(base.perdidaUsd, 296000 + 96000 + 1470000, "pausa tras la correlación: ya pasaron 3 cadenas");
  assert.equal(base.pausaSegundos, 930);
  assert.equal(estricta.perdidaUsd, 296000, "pausa en la primera anomalía");
  assert.equal(estricta.pausaSegundos, 30);
  assert.ok(estricta.perdidaUsd < base.perdidaUsd);
});

test("si la clave fue exfiltrada, el freno NO detiene nada: ninguna variante sin topes baja la pérdida", () => {
  for (const v of ["solo-alertas", "base", "estricta"]) {
    assert.equal(simular(politica, lineas.ataque, v, "clave").perdidaUsd, TOTAL_ATAQUE, v);
  }
});

test("lo único que acota la pérdida con clave exfiltrada es el tope de la billetera caliente", () => {
  const conTopes = simular(politica, lineas.ataque, "base-con-topes", "clave");
  assert.equal(conTopes.perdidaUsd, 40000 + 15000 + 150000 + 80000 + 250000);
  assert.ok(conTopes.perdidaUsd < TOTAL_ATAQUE / 9);
});

test("el ataque se detecta aunque no se pueda frenar: la alerta llega 30 s después del primer hecho", () => {
  const r = simular(politica, lineas.ataque, "solo-alertas", "clave");
  assert.equal(r.primeraAlertaSegundos, 30);
  assert.equal(r.pausaSegundos, null);
});

test("un día normal tiene falsos positivos: la velocidad y el retiro sin ticket disparan alertas", () => {
  const r = simular(politica, lineas.normal, "base");
  assert.equal(r.alertas, 2);
  assert.deepEqual(r.alertasPorRegla, { "R-VEL": 1, "R-DEST": 1 });
});

test("la política estricta frena un día normal y bloquea operaciones legítimas; la base no", () => {
  const base = simular(politica, lineas.normal, "base");
  const estricta = simular(politica, lineas.normal, "estricta");
  assert.equal(base.pausas, 0);
  assert.equal(base.operacionesLegitimasBloqueadas, 0);
  assert.equal(estricta.pausas, 1);
  assert.equal(estricta.pausaInnecesaria, true);
  assert.ok(estricta.operacionesLegitimasBloqueadas >= 3, "el coste de ser estricto es operativo y se mide");
});

test("la comparación expone el dilema completo en una sola tabla", () => {
  const tabla = Object.fromEntries(compararVariantes(politica, lineas).map((f) => [f.variante, f]));
  assert.ok(tabla.estricta.perdidaSiInfraestructura < tabla.base.perdidaSiInfraestructura);
  assert.ok(tabla.estricta.pausasEnDiaNormal > tabla.base.pausasEnDiaNormal);
  assert.equal(tabla.estricta.perdidaSiClaveExfiltrada, tabla.base.perdidaSiClaveExfiltrada);
  assert.ok(tabla["base-con-topes"].perdidaSiClaveExfiltrada < tabla.base.perdidaSiClaveExfiltrada);
});

test("toda billetera caliente del ejemplo excede su tope: la exposición real es el saldo, no el tope", () => {
  const filas = verificarExposicion(politica);
  assert.ok(filas.every((f) => f.excedeTope));
  assert.ok(filas.every((f) => f.exposicionConTopeUsd === f.topeUsd));
});

test("una variante desconocida falla de forma explícita", () => {
  assert.throws(() => simular(politica, lineas.ataque, "inexistente"), /desconocida/);
});
