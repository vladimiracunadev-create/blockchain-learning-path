import test from "node:test";
import assert from "node:assert/strict";
import { cadenaCuentas } from "./cadena-sintetica.mjs";
import {
  estadisticas,
  puntuarZ,
  detectarPorZ,
  detectarPorIQR,
  detectarAnomalias,
  evaluar,
  curvaUmbral,
  explicar,
  transferenciasDesdeBloques
} from "./deteccion-anomalias.mjs";

test("estadisticas calcula media, desviación, mediana y cuartiles sobre una muestra conocida", () => {
  const s = estadisticas([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(s.media, 5.5);
  assert.equal(s.mediana, 5.5);
  assert.ok(s.q1 < s.mediana && s.mediana < s.q3);
  assert.equal(s.iqr, s.q3 - s.q1);
});

test("estadisticas con muestra vacía no produce NaN", () => {
  const s = estadisticas([]);
  assert.deepEqual(s, { media: 0, desviacion: 0, mediana: 0, q1: 0, q3: 0, iqr: 0 });
});

test("puntuarZ con valores constantes (desviación 0) devuelve ceros, no NaN", () => {
  const puntuaciones = puntuarZ([5, 5, 5, 5]);
  assert.deepEqual(puntuaciones, [0, 0, 0, 0]);
});

test("un valor extremo arrastra la media pero no la mediana: la regla IQR resiste mejor", () => {
  const conAnomalia = [10, 11, 9, 10, 12, 11, 9, 5_000];
  const sinAnomalia = [10, 11, 9, 10, 12, 11, 9];
  const media = estadisticas(conAnomalia).media;
  const mediana = estadisticas(conAnomalia).mediana;
  // La media del grupo con anomalía se dispara muy por encima del rango normal;
  // la mediana apenas se mueve respecto al grupo sin ella.
  assert.ok(media > 600);
  assert.ok(Math.abs(mediana - estadisticas(sinAnomalia).mediana) <= 1);
});

test("detectarPorIQR marca el valor por encima de q3 + factor·IQR y no marca los típicos", () => {
  const resultado = detectarPorIQR([10, 11, 9, 10, 12, 11, 9, 5_000], { factor: 1.5 });
  assert.equal(resultado.at(-1).anomalo, true);
  assert.ok(resultado.slice(0, -1).every((r) => r.anomalo === false));
});

test("detectarPorZ marca lo que se aleja más de `umbral` desviaciones típicas", () => {
  const resultado = detectarPorZ([10, 11, 9, 10, 12, 11, 9, 5_000], { umbral: 2 });
  assert.equal(resultado.at(-1).anomalo, true);
});

test("con factor 1.5 el detector encuentra las 3 anomalías plantadas en la verdad de campo", () => {
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDesdeBloques(bloques);
  const universo = transferencias.map((t) => t.hash);
  const detecciones = detectarAnomalias(transferencias, { metodo: "iqr", umbral: 1.5 });
  const detectados = detecciones.filter((d) => d.anomalo).map((d) => d.hash);
  const metricas = evaluar(detectados, verdadDeCampo.anomalas, universo);
  assert.equal(metricas.recall, 1);
  assert.equal(metricas.falsosNegativos, 0);
  assert.ok(metricas.verdaderosPositivos === verdadDeCampo.anomalas.length);
});

test("bajar el umbral (factor) sube recall y/o baja precisión frente a un umbral más estricto", () => {
  const { bloques, verdadDeCampo } = cadenaCuentas({});
  const transferencias = transferenciasDesdeBloques(bloques);
  const puntos = curvaUmbral(transferencias, verdadDeCampo.anomalas, [0.2, 5, 20, 100]);
  const [porFactor02, porFactor5, porFactor20, porFactor100] = puntos;
  // Un umbral más permisivo (factor pequeño) marca más cosas: baja la precisión.
  assert.ok(porFactor02.precision < porFactor5.precision);
  // Un umbral demasiado estricto (factor muy grande) deja anomalías reales sin marcar.
  assert.ok(porFactor100.recall < porFactor20.recall);
});

test("evaluar no devuelve NaN cuando no hay ninguna detección", () => {
  const metricas = evaluar([], ["a", "b"], ["a", "b", "c", "d"]);
  assert.equal(metricas.precision, 0);
  assert.equal(metricas.recall, 0);
  assert.equal(metricas.f1, 0);
  assert.equal(Number.isNaN(metricas.precision), false);
  assert.equal(Number.isNaN(metricas.recall), false);
  assert.equal(Number.isNaN(metricas.f1), false);
});

test("evaluar cuadra la matriz de confusión con el tamaño del universo", () => {
  const universo = ["a", "b", "c", "d", "e"];
  const metricas = evaluar(["a", "c", "x"], ["a", "b"], universo);
  // "x" no pertenece al universo declarado en `verdad`, pero sí cuenta como
  // falso positivo detectado; el resto de la aritmética debe cuadrar sobre lo
  // que sí es del universo.
  assert.equal(metricas.verdaderosPositivos, 1); // "a"
  assert.equal(metricas.falsosNegativos, 1); // "b"
});

test("explicar describe en lenguaje llano qué variable se desvió y cuánto", () => {
  const [deteccion] = detectarAnomalias(
    [{ hash: "0xabc", importe: 999_999, comision: 1 }, { hash: "0xdef", importe: 10, comision: 1 }],
    { metodo: "iqr", umbral: 1.5 }
  );
  const explicacion = explicar(deteccion);
  assert.match(explicacion, /0xabc/);
  assert.match(explicacion, /importe/);
});

test("explicar sobre una detección no anómala dice explícitamente que no hay motivo", () => {
  const deteccion = {
    hash: "0x1",
    metodo: "iqr",
    importeInfo: { anomalo: false, valor: 1, limite: 10 },
    comisionInfo: { anomalo: false, valor: 1, limite: 10 }
  };
  assert.match(explicar(deteccion), /no marcada/);
});
