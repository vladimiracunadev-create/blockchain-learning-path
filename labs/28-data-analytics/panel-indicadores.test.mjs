import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas, transaccionesDe } from "./cadena-sintetica.mjs";
import {
  calcularIndicadores,
  serieDiaria,
  renderizarPanelTexto,
  renderizarPanelHtml,
  exportarCsv
} from "./panel-indicadores.mjs";

const { bloques } = cadenaCuentas({});

test("calcularIndicadores cuenta el mismo número de transacciones que el dataset", () => {
  const indicadores = calcularIndicadores(bloques);
  assert.equal(indicadores.transaccionesTotales, transaccionesDe(bloques).length);
  assert.equal(indicadores.bloquesCubiertos, bloques.length);
});

test("calcularIndicadores no produce NaN ni valores negativos en un dataset con actividad", () => {
  const indicadores = calcularIndicadores(bloques);
  for (const [clave, valor] of Object.entries(indicadores)) {
    if (typeof valor === "number") {
      assert.equal(Number.isNaN(valor), false, `${clave} es NaN`);
    }
  }
  assert.ok(indicadores.volumenTotal >= 0);
  assert.ok(indicadores.concentracionTop5 >= 0 && indicadores.concentracionTop5 <= 1);
});

test("calcularIndicadores protege divisiones cuando no hay ninguna transferencia de token", () => {
  const bloqueVacio = [{ numero: 0, marcaTiempo: bloques[0].marcaTiempo, transacciones: [], logs: [] }];
  const indicadores = calcularIndicadores(bloqueVacio);
  assert.equal(indicadores.volumenTotal, 0);
  assert.equal(indicadores.comisionMedia, 0);
  assert.equal(indicadores.gasMedio, 0);
  assert.equal(indicadores.concentracionTop5, 0);
  assert.equal(indicadores.mayorTransaccion, null);
});

test("serieDiaria suma exactamente el total de transacciones de calcularIndicadores", () => {
  const indicadores = calcularIndicadores(bloques);
  const serie = serieDiaria(bloques);
  const sumaTransacciones = serie.reduce((s, d) => s + d.transacciones, 0);
  assert.equal(sumaTransacciones, indicadores.transaccionesTotales);
});

test("serieDiaria suma (con tolerancia de redondeo) el volumen total de calcularIndicadores", () => {
  const indicadores = calcularIndicadores(bloques);
  const serie = serieDiaria(bloques);
  const sumaVolumen = serie.reduce((s, d) => s + d.volumen, 0);
  assert.ok(Math.abs(sumaVolumen - indicadores.volumenTotal) < 0.01);
});

test("serieDiaria está ordenada por fecha ascendente y sin días repetidos", () => {
  const serie = serieDiaria(bloques);
  const dias = serie.map((d) => d.dia);
  assert.deepEqual(dias, [...dias].sort());
  assert.equal(new Set(dias).size, dias.length);
});

test("renderizarPanelTexto incluye el sparkline ASCII y la advertencia obligatoria", () => {
  const indicadores = calcularIndicadores(bloques);
  const serie = serieDiaria(bloques);
  const texto = renderizarPanelTexto(indicadores, serie);
  assert.match(texto, /ADVERTENCIA/);
  assert.match(texto, /direcciones activas/i);
  assert.ok(texto.includes("#") || texto.includes("."));
});

test("renderizarPanelHtml es autocontenido: no referencia ningún recurso externo", () => {
  const indicadores = calcularIndicadores(bloques);
  const serie = serieDiaria(bloques);
  const html = renderizarPanelHtml(indicadores, serie);
  assert.doesNotMatch(html, /http:\/\//);
  assert.doesNotMatch(html, /https:\/\//);
  assert.match(html, /<style>/);
  assert.match(html, /ADVERTENCIA/);
});

test("exportarCsv produce una fila por día más la cabecera", () => {
  const serie = serieDiaria(bloques);
  const csv = exportarCsv(serie);
  const lineas = csv.trim().split("\n");
  assert.equal(lineas.length, serie.length + 1);
  assert.equal(lineas[0], "dia,transacciones,volumen,comisiones");
});

test("exportarCsv sobre una serie vacía deja solo la cabecera", () => {
  const csv = exportarCsv([]);
  assert.equal(csv.trim(), "dia,transacciones,volumen,comisiones");
});

test("los valores del CSV se corresponden con los de la serie diaria", () => {
  const serie = serieDiaria(bloques);
  const csv = exportarCsv(serie);
  const filas = csv.trim().split("\n").slice(1);
  assert.equal(filas.length, serie.length);
  const [dia, transacciones] = filas[0].split(",");
  assert.equal(dia, serie[0].dia);
  assert.equal(Number(transacciones), serie[0].transacciones);
});
