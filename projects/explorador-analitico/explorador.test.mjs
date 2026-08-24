import test from "node:test";
import assert from "node:assert/strict";
import {
  LIMITACIONES,
  construirInforme,
  crearExplorador,
  filtrar,
  observacionesConComision,
  perfilDireccion
} from "./explorador.mjs";
import { ROLES } from "../../labs/28-data-analytics/cadena-sintetica.mjs";

const explorador = crearExplorador();

test("importa el dataset y expone sus transferencias", () => {
  assert.ok(explorador.transferencias.length > 100);
  assert.equal(explorador.datos.cuentas.length, 60);
});

test("consulta un bloque por número y devuelve null si no existe", () => {
  const bloque = explorador.bloque(10);
  assert.equal(bloque.numero, 10);
  assert.match(bloque.hash, /^0x[0-9a-f]+$/);
  assert.match(bloque.dia, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(explorador.bloque(99_999), null);
});

test("consulta una transacción por hash", () => {
  const alguna = explorador.transferencias[0];
  const tx = explorador.transaccion(alguna.hash);
  assert.equal(tx.hash, alguna.hash);
  assert.equal(explorador.transaccion("0xnoexiste"), null);
});

test("el filtro por rango de bloques acota la selección", () => {
  const seleccion = explorador.buscar({ desde: 20, hasta: 28 });
  assert.ok(seleccion.length > 0);
  assert.ok(seleccion.every((t) => t.numeroBloque >= 20 && t.numeroBloque <= 28));
  assert.ok(seleccion.length < explorador.transferencias.length);
});

test("el filtro por activo distingue token de nativo", () => {
  const token = explorador.buscar({ activo: "token" });
  const nativo = explorador.buscar({ activo: "nativo" });
  assert.ok(token.every((t) => t.tipo === "token"));
  assert.ok(nativo.every((t) => t.tipo === "nativo"));
  assert.equal(token.length + nativo.length, explorador.transferencias.length);
});

test("el filtro por dirección incluye tanto envíos como recepciones", () => {
  const seleccion = filtrar(explorador.transferencias, { direccion: ROLES.coleccion });
  assert.ok(seleccion.length > 0);
  assert.ok(seleccion.every((t) => t.de === ROLES.coleccion || t.para === ROLES.coleccion));
});

test("los filtros se combinan (rango + activo + dirección)", () => {
  const seleccion = explorador.buscar({ desde: 20, hasta: 28, activo: "token", direccion: ROLES.coleccion });
  assert.ok(seleccion.length > 0);
  assert.ok(seleccion.every((t) => t.tipo === "token" && t.numeroBloque >= 20 && t.numeroBloque <= 28));
});

test("el perfil de la dirección colectora refleja el fan-in plantado", () => {
  const perfil = explorador.direccion(ROLES.coleccion);
  // Nueve orígenes distintos convergen en ella y no envía nada: eso es un HECHO
  // observable. Que sea "una colectora de un servicio" ya sería una inferencia.
  assert.equal(perfil.transferenciasRecibidas, 9);
  assert.equal(perfil.transferenciasEnviadas, 0);
  assert.equal(perfil.contrapartesDistintas, 9);
  assert.ok(perfil.saldoNetoObservado > 0);
});

test("el perfil de una dirección sin actividad no inventa datos", () => {
  const perfil = perfilDireccion(explorador.transferencias, "0xdireccion-sin-actividad");
  assert.equal(perfil.transferenciasEnviadas, 0);
  assert.equal(perfil.transferenciasRecibidas, 0);
  assert.equal(perfil.primerBloque, null);
  assert.equal(perfil.etiquetaDelDataset, null);
});

test("el perfil no expone identidad: solo campos observables en la cadena", () => {
  const perfil = explorador.direccion(ROLES.servicio);
  for (const prohibido of ["nombre", "titular", "pais", "persona", "identidad"]) {
    assert.equal(prohibido in perfil, false, `el perfil no debe incluir "${prohibido}"`);
  }
});

test("las métricas y la serie diaria cubren la ventana consultada", () => {
  const { indicadores, serie } = explorador.metricas({ desde: 0, hasta: 30 });
  assert.ok(serie.length > 0);
  assert.ok(indicadores != null);
});

test("el grafo de la ventana tiene nodos, aristas y componentes", () => {
  const { grafo, componentes, top } = explorador.grafo({ desde: 20, hasta: 40 });
  // El laboratorio 7 modela los nodos como Set y las aristas como Map (una por
  // par origen→destino, con `veces` e `importeTotal` agregados).
  assert.ok(grafo.nodos.size > 0);
  assert.ok(grafo.aristas.size > 0);
  assert.ok(componentes >= 1);
  assert.equal(top.length, 5);
});

test("los detectores encuentran los patrones plantados en el dataset", () => {
  const patrones = explorador.patrones();
  assert.ok(patrones.fanIn.length >= 1, "debe encontrar el fan-in plantado");
  assert.ok(patrones.fanOut.length >= 1, "debe encontrar el fan-out plantado");
  assert.ok(patrones.peelChain.length >= 1, "debe encontrar la cadena de pelado");
});

test("solo se cuentan como anomalías las observaciones marcadas", () => {
  const patrones = explorador.patrones();
  // El detector puntúa todas las transferencias; si el explorador no filtrara
  // por `anomalo`, aquí habría 210 "detecciones" y la precisión sería absurda.
  assert.ok(patrones.anomalias.length > 0);
  assert.ok(patrones.anomalias.length < explorador.transferencias.length / 4);
  assert.ok(patrones.anomalias.every((a) => a.anomalo === true));
});

test("la evaluación recupera las tres anomalías plantadas y declara sus falsos positivos", () => {
  const { evaluacionAnomalias } = explorador.patrones();
  assert.equal(evaluacionAnomalias.verdaderosPositivos, 3);
  assert.equal(evaluacionAnomalias.recall, 1);
  // Recall perfecto con precisión imperfecta: el compromiso que el módulo enseña.
  assert.ok(evaluacionAnomalias.precision > 0 && evaluacionAnomalias.precision < 1);
  assert.ok(evaluacionAnomalias.falsosPositivos > 0);
});

test("unir la comisión por hash evita el NaN silencioso", () => {
  const sinComision = [{ hash: "0xabc", importe: 10 }];
  const [observacion] = observacionesConComision(sinComision, new Map([["0xabc", 4200]]));
  assert.equal(observacion.comision, 4200);
  const [sinMapa] = observacionesConComision(sinComision);
  assert.equal(sinMapa.comision, 0);
  assert.ok(!Number.isNaN(sinMapa.comision));
});

test("el informe incluye SIEMPRE las limitaciones y la clasificación de afirmaciones", () => {
  const informe = explorador.informe({ desde: 20, hasta: 40 });
  assert.match(informe, /## 6\. Limitaciones/);
  assert.match(informe, /Hecho/);
  assert.match(informe, /Indicador/);
  assert.match(informe, /Inferencia/);
  assert.match(informe, /Hipótesis/);
  for (const limitacion of LIMITACIONES) {
    assert.ok(informe.includes(limitacion), `falta la limitación: ${limitacion.slice(0, 40)}…`);
  }
});

test("el informe no atribuye identidad a ninguna dirección", () => {
  const informe = construirInforme(explorador, {});
  assert.doesNotMatch(informe, /pertenece a|es de la persona|identificad[oa] como/i);
  assert.match(informe, /no es una persona/i);
});

test("el panel HTML es autocontenido y el CSV tiene cabecera y filas", () => {
  const { html, csv, texto, grafoCsv } = explorador.paneles({ desde: 0, hasta: 30 });
  assert.doesNotMatch(html, /https?:\/\//, "el HTML no puede depender de recursos externos");
  assert.ok(texto.length > 100);
  const filas = csv.trim().split("\n");
  assert.ok(filas.length > 1);
  assert.ok(grafoCsv.length > 0);
});

test("el explorador es determinista: dos instancias dan el mismo informe", () => {
  const otro = crearExplorador();
  assert.equal(otro.informe({ desde: 10, hasta: 20 }), explorador.informe({ desde: 10, hasta: 20 }));
});
