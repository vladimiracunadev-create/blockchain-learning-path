import test from "node:test";
import assert from "node:assert/strict";
import { ESTADOS, transicionesPosibles, puedeTransicionar, esFinal, seguirFlujo } from "./tx-lifecycle.mjs";

test("todo estado declara qué debe mostrar la interfaz", () => {
  // Un estado sin instrucción de interfaz es exactamente el que acaba mostrando
  // un spinner infinito en producción.
  for (const [nombre, info] of Object.entries(ESTADOS)) {
    assert.ok(info.descripcion?.length > 10, `${nombre} sin descripción`);
    assert.ok(info.interfaz?.length > 10, `${nombre} sin instrucción de interfaz`);
  }
});

test("el flujo feliz llega a confirmada", () => {
  const resultado = seguirFlujo(["simulando", "esperandoFirma", "pendiente", "confirmada"]);
  assert.equal(resultado.estadoFinal, "confirmada");
  assert.equal(resultado.terminado, true);
});

test("no se puede difundir sin firma", () => {
  assert.throws(
    () => seguirFlujo(["simulando", "pendiente"]),
    /Transición imposible/
  );
});

test("no se puede pedir firma si la simulación falló", () => {
  assert.equal(puedeTransicionar("simulacionFallida", "esperandoFirma"), false);
});

test("desde pendiente hay cuatro finales posibles, no uno", () => {
  // El bug clásico es contemplar solo 'confirmada'.
  assert.deepEqual(
    transicionesPosibles("pendiente").sort(),
    ["confirmada", "descartada", "reemplazada", "revertida"]
  );
});

test("los estados finales no tienen salida", () => {
  for (const [nombre, info] of Object.entries(ESTADOS)) {
    if (info.final) {
      assert.deepEqual(transicionesPosibles(nombre), [], `${nombre} es final pero tiene transiciones`);
    }
  }
});

test("todo estado no final tiene al menos una salida: nada se queda colgado", () => {
  for (const nombre of Object.keys(ESTADOS)) {
    if (!esFinal(nombre)) {
      assert.ok(transicionesPosibles(nombre).length > 0, `${nombre} no es final y no lleva a ninguna parte`);
    }
  }
});

test("toda transición apunta a un estado que existe", () => {
  for (const nombre of Object.keys(ESTADOS)) {
    for (const destino of transicionesPosibles(nombre)) {
      assert.ok(destino in ESTADOS, `${nombre} → ${destino}, que no existe`);
    }
  }
});

test("todo flujo arranca simulando", () => {
  assert.throws(() => seguirFlujo(["esperandoFirma", "pendiente"]), /empieza simulando/);
});

test("un estado desconocido falla en voz alta", () => {
  assert.throws(() => esFinal("inventado"), /Estado desconocido/);
});
