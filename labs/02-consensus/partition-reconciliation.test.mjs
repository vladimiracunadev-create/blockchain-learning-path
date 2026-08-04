import test from "node:test";
import assert from "node:assert/strict";
import { crearCadena, minar, altura, trabajoAcumulado, reconciliar } from "./partition-reconciliation.mjs";

// Prepara dos lados que compartían historia hasta el bloque `b1` y luego se
// separaron: es el escenario de una partición de red real.
function ladosSeparados() {
  const izquierda = crearCadena("izq");
  minar(izquierda, { id: "b1", transacciones: ["comun"] });
  const derecha = structuredClone(izquierda);
  derecha.nombre = "der";
  return { izquierda, derecha };
}

test("el trabajo acumulado no es la altura", () => {
  const cadena = crearCadena("x");
  minar(cadena, { id: "a", trabajo: 1 });
  minar(cadena, { id: "b", trabajo: 5 });
  assert.equal(altura(cadena), 2);
  assert.equal(trabajoAcumulado(cadena), 6);
});

test("gana la cadena con más trabajo, aunque sea más corta", () => {
  const { izquierda, derecha } = ladosSeparados();
  minar(izquierda, { id: "i2", trabajo: 1 });
  minar(izquierda, { id: "i3", trabajo: 1 }); // más larga: altura 3
  minar(derecha, { id: "d2", trabajo: 10 }); // más trabajo: altura 2

  const resultado = reconciliar(izquierda, derecha);
  assert.equal(resultado.ganadora, "der");
  assert.ok(altura(izquierda) > altura(derecha), "la perdedora era la más larga");
});

test("encuentra el punto de divergencia, no el genesis", () => {
  const { izquierda, derecha } = ladosSeparados();
  minar(izquierda, { id: "i2", trabajo: 1 });
  minar(derecha, { id: "d2", trabajo: 5 });
  // Compartían genesis (0) y b1 (1): el ancestro común está en la altura 1.
  assert.equal(reconciliar(izquierda, derecha).alturaComun, 1);
});

test("las transacciones del lado perdedor quedan huérfanas", () => {
  const { izquierda, derecha } = ladosSeparados();
  minar(izquierda, { id: "i2", transacciones: ["solo-en-izq"], trabajo: 1 });
  minar(derecha, { id: "d2", transacciones: ["solo-en-der"], trabajo: 9 });

  const resultado = reconciliar(izquierda, derecha);
  assert.deepEqual(resultado.transaccionesHuerfanas, ["solo-en-izq"]);
  assert.deepEqual(resultado.bloquesDescartados, ["i2"]);
});

test("una transacción incluida en AMBOS lados no queda huérfana", () => {
  const { izquierda, derecha } = ladosSeparados();
  minar(izquierda, { id: "i2", transacciones: ["en-los-dos"], trabajo: 1 });
  minar(derecha, { id: "d2", transacciones: ["en-los-dos"], trabajo: 9 });

  // Es el caso normal: la transacción estaba en el mempool de ambos lados y los
  // dos la incluyeron. El usuario no nota nada.
  assert.deepEqual(reconciliar(izquierda, derecha).transaccionesHuerfanas, []);
});

test("la historia anterior a la partición nunca se descarta", () => {
  const { izquierda, derecha } = ladosSeparados();
  minar(izquierda, { id: "i2", trabajo: 1 });
  minar(derecha, { id: "d2", trabajo: 9 });

  const resultado = reconciliar(izquierda, derecha);
  assert.ok(!resultado.bloquesDescartados.includes("b1"));
  assert.ok(!resultado.transaccionesHuerfanas.includes("comun"));
});

test("sin partición real no hay nada que descartar", () => {
  const { izquierda, derecha } = ladosSeparados();
  const resultado = reconciliar(izquierda, derecha);
  assert.deepEqual(resultado.bloquesDescartados, []);
  assert.deepEqual(resultado.transaccionesHuerfanas, []);
});
