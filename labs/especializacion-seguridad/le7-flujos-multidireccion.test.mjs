import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  METODOS, analizarRecuperabilidad, detectarCadenasDePelado, detectarSemillasDePolvo, emparejarPuentes, exposicion,
  informe, propagar, rangoDeExposicion
} from "./le7-flujos-multidireccion.mjs";

const datos = JSON.parse(await readFile(new URL("./fixtures/flujos-multicadena.json", import.meta.url), "utf8"));

test("el mismo conjunto de transferencias da tres exposiciones distintas según el método", () => {
  const r = rangoDeExposicion(datos, "eth:hop-2", "ETH");
  assert.equal(r.poison, 150);
  assert.equal(r.haircut, 111.04);
  assert.equal(r.fifo, 50);
  assert.equal(r.minimo, 50);
  assert.equal(r.maximo, 150);
});

test("en el depósito de exchange, haircut es menor que poison y fifo", () => {
  const r = rangoDeExposicion(datos, "eth:deposito-exchange-A", "ETH");
  assert.equal(r.haircut, 148.05);
  assert.equal(r.poison, 200);
  assert.equal(r.fifo, 200);
});

test("poison nunca subestima: su exposición es mayor o igual que la de haircut y fifo en cada dirección", () => {
  const porClave = (m) => new Map(exposicion(datos, m).map((f) => [`${f.direccion}|${f.activo}`, f.recibido]));
  const poison = porClave("poison");
  for (const m of ["haircut", "fifo"]) {
    for (const [k, v] of porClave(m)) assert.ok((poison.get(k) ?? 0) >= v - 0.01, `${m} ${k}`);
  }
});

test("haircut y fifo conservan la contaminación total (solo se pierde lo que sale del swap por el tipo de cambio)", () => {
  for (const m of ["haircut", "fifo"]) {
    const total = [...propagar(datos, m).values()].reduce((s, c) => s + c.contaminado, 0);
    assert.ok(Math.abs(total - 3060) < 0.01, `${m}: ${total}`);
  }
});

test("poison puede crear contaminación que no existía: arrastra dinero limpio", () => {
  const recibido = (m) => exposicion(datos, m).reduce((s, f) => s + f.recibido, 0);
  assert.ok(recibido("poison") > recibido("haircut"));
});

test("los métodos desconocidos y los conjuntos inconsistentes fallan de forma explícita", () => {
  assert.throws(() => propagar(datos, "azar"), /desconocido/);
  const roto = { ...datos, transferencias: [{ id: "x", t: 1, cadena: "eth", desde: "eth:nadie", hasta: "eth:otro", activo: "ETH", monto: 5, tipo: "transferencia" }] };
  assert.throws(() => propagar(roto, "fifo"), /Saldo insuficiente/);
});

test("detecta la cadena de pelado de Bitcoin de 4 pasos y reporta su fin", () => {
  const cadenas = detectarCadenasDePelado(datos);
  assert.equal(cadenas.length, 1);
  assert.equal(cadenas[0].pasos, 4);
  assert.equal(cadenas[0].terminaEn, "btc:p4");
  assert.deepEqual(cadenas[0].ruta.map((p) => p.hoja), ["btc:hoja-1", "btc:hoja-2", "btc:hoja-3", "btc:hoja-4"]);
});

test("una división equilibrada (50/50) no es pelado", () => {
  const equilibrado = { transferencias: [
    { id: "a", t: 1, cadena: "btc", desde: "btc:x", hasta: "btc:y", activo: "BTC", monto: 50, tipo: "transferencia", txid: "t1" },
    { id: "b", t: 1, cadena: "btc", desde: "btc:x", hasta: "btc:z", activo: "BTC", monto: 50, tipo: "transferencia", txid: "t1" }
  ] };
  assert.deepEqual(detectarCadenasDePelado(equilibrado, { minimoPasos: 1 }), []);
});

test("detecta las tres direcciones sembradas con exactamente 1 TRX", () => {
  assert.deepEqual(detectarSemillasDePolvo(datos).sort(), ["tron:hop-a", "tron:hop-b", "tron:hop-c"]);
});

test("empareja el puente por refId y deja la pareja como inferencia de confianza media", () => {
  const [p] = emparejarPuentes(datos);
  assert.equal(p.refId, "b1");
  assert.equal(p.a, "l2a:hop-3");
  assert.equal(p.diferencia, 1);
  assert.equal(p.confianza, "media");
});

test("un puente sin entrada correspondiente queda 'sin pareja'", () => {
  const huerfano = { transferencias: [{ id: "p", t: 1, cadena: "eth", desde: "eth:a", hasta: "puente:z", activo: "ETH", monto: 5, tipo: "puente-salida", refId: "z" }] };
  assert.equal(emparejarPuentes(huerfano)[0].confianza, "sin pareja");
});

test("recuperabilidad: lo congelable es el stablecoin; ETH, BTC y TRX no tienen botón", () => {
  const r = analizarRecuperabilidad(datos);
  assert.equal(r.yaCongelado, 700);
  assert.equal(r.congelablePendiente, 575);
  assert.equal(r.noCongelable, 1785);
  assert.equal(r.yaCongelado + r.congelablePendiente + r.noCongelable, r.totalContaminado, "los tres grupos suman el total");
  assert.ok(r.filas.filter((f) => ["ETH", "BTC", "TRX"].includes(f.activo)).every((f) => f.estado.startsWith("no congelable")));
});

test("un saldo parcialmente congelado deja un resto pendiente, no se da por resuelto", () => {
  const fila = analizarRecuperabilidad(datos).filas.find((f) => f.direccion === "eth:parada-1");
  assert.equal(fila.congelado, 100);
  assert.equal(fila.resto, 75);
  assert.match(fila.estado, /^congelable/);
});

test("lo congelado es lo que el emisor puede alcanzar antes de que el valor se mueva", () => {
  const congelado = analizarRecuperabilidad(datos).filas.filter((f) => f.estado === "congelado").map((f) => f.direccion).sort();
  assert.deepEqual(congelado, ["eth:coleccion", "tron:parada-t"]);
});

test("el informe nunca atribuye identidad y separa hecho, indicador, inferencia e hipótesis", () => {
  const r = informe(datos);
  assert.equal(r.atribucion, null);
  assert.match(r.aviso, /no equivale a una persona/);
  assert.deepEqual([...new Set(r.afirmaciones.map((a) => a.nivel))].sort(), ["hecho", "hipótesis", "indicador", "inferencia"]);
  assert.ok(r.afirmaciones.filter((a) => a.nivel === "hipótesis").every((a) => a.confianza === "baja"));
});

test("el informe declara el rango entre métodos, no un único número", () => {
  const frase = informe(datos).afirmaciones.find((a) => /exchange/.test(a.texto)).texto;
  assert.match(frase, /148\.05 a 200/);
});

test("los métodos disponibles son exactamente tres", () => {
  assert.deepEqual(METODOS, ["poison", "haircut", "fifo"]);
});
