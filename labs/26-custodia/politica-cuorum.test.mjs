import test from "node:test";
import assert from "node:assert/strict";
import { analizarCuorum, evaluarEscenario, politicaPorImporte } from "./politica-cuorum.mjs";

test("3 de 5 aguanta 2 compromisos y 2 pérdidas", () => {
  const a = analizarCuorum({ m: 3, n: 5 });
  assert.equal(a.toleraCompromiso, 2);
  assert.equal(a.toleraPerdida, 2);
  assert.equal(a.puntoUnicoDeFirma, false);
  assert.equal(a.riesgoDeCongelacion, false);
});

test("subir N permite subir M sin perder tolerancia a la pérdida", () => {
  const cincoSiete = analizarCuorum({ m: 5, n: 7 });
  const tresCinco = analizarCuorum({ m: 3, n: 5 });
  // 5 de 7 tolera el doble de firmantes comprometidos (4 frente a 2)...
  assert.equal(cincoSiete.toleraCompromiso, 4);
  assert.equal(tresCinco.toleraCompromiso, 2);
  // ...y exactamente las mismas pérdidas (2). Ampliar N es lo que lo permite.
  assert.equal(cincoSiete.toleraPerdida, tresCinco.toleraPerdida);
});

test("subir M sin subir N compra resistencia al ataque pagándola con congelación", () => {
  const cuatroCinco = analizarCuorum({ m: 4, n: 5 });
  const tresCinco = analizarCuorum({ m: 3, n: 5 });
  assert.ok(cuatroCinco.toleraCompromiso > tresCinco.toleraCompromiso);
  assert.ok(cuatroCinco.toleraPerdida < tresCinco.toleraPerdida);
});

test("1 de N es un punto único de firma y M = N congela con una sola pérdida", () => {
  assert.equal(analizarCuorum({ m: 1, n: 3 }).puntoUnicoDeFirma, true);
  const nn = analizarCuorum({ m: 5, n: 5 });
  assert.equal(nn.riesgoDeCongelacion, true);
  assert.equal(nn.toleraPerdida, 0);
});

test("rechaza políticas imposibles", () => {
  assert.throws(() => analizarCuorum({ m: 4, n: 3 }));
  assert.throws(() => analizarCuorum({ m: 0, n: 3 }));
  assert.throws(() => analizarCuorum({ m: 2.5, n: 3 }));
});

test("con 2 firmantes comprometidos el atacante no alcanza el cuórum de 3", () => {
  const r = evaluarEscenario({ m: 3, n: 5, comprometidos: 2 });
  assert.equal(r.atacantePuedeFirmar, false);
  assert.equal(r.organizacionPuedeOperar, true);
});

test("con 3 firmantes comprometidos el atacante firma", () => {
  const r = evaluarEscenario({ m: 3, n: 5, comprometidos: 3 });
  assert.equal(r.atacantePuedeFirmar, true);
});

test("perder 3 de 5 llaves congela los fondos para siempre", () => {
  const r = evaluarEscenario({ m: 3, n: 5, perdidos: 3 });
  assert.equal(r.fondosCongelados, true);
  assert.equal(r.organizacionPuedeOperar, false);
  assert.equal(r.atacantePuedeFirmar, false);
});

test("una política resiste compromiso Y pérdida simultáneos si le quedan M llaves", () => {
  const r = evaluarEscenario({ m: 3, n: 5, comprometidos: 1, perdidos: 1 });
  assert.equal(r.atacantePuedeFirmar, false);
  assert.equal(r.fondosCongelados, false);
  assert.equal(r.disponiblesHonestos, 3);
});

test("no admite más firmantes afectados que firmantes existentes", () => {
  assert.throws(() => evaluarEscenario({ m: 3, n: 5, comprometidos: 4, perdidos: 3 }));
  assert.throws(() => evaluarEscenario({ m: 3, n: 5, perdidos: -1 }));
});

test("el escalón por importe exige más firmas cuanto mayor es el importe", () => {
  const escalones = [
    { hasta: 10_000, m: 2, retardoSegundos: 0 },
    { hasta: 250_000, m: 3, retardoSegundos: 3_600 },
    { hasta: Infinity, m: 4, retardoSegundos: 86_400 }
  ];
  const permitidos = ["tesoreria-interna"];
  const pequena = politicaPorImporte({ escalones, importe: 5_000, destino: "tesoreria-interna", destinosPermitidos: permitidos });
  const grande = politicaPorImporte({ escalones, importe: 3_000_000, destino: "direccion-nueva", destinosPermitidos: permitidos });
  assert.equal(pequena.firmasRequeridas, 2);
  assert.equal(pequena.retardoSegundos, 0);
  assert.equal(grande.firmasRequeridas, 4);
  assert.equal(grande.retardoSegundos, 86_400);
  assert.equal(grande.requiereVerificacionFueraDeBanda, true);
});

test("un destino nuevo nunca queda exento del retardo", () => {
  const escalones = [{ hasta: Infinity, m: 3, retardoSegundos: 3_600 }];
  const nuevo = politicaPorImporte({ escalones, importe: 100, destino: "desconocido", destinosPermitidos: ["conocido"] });
  assert.equal(nuevo.destinoConocido, false);
  assert.equal(nuevo.retardoSegundos, 3_600);
  assert.throws(() => politicaPorImporte({ escalones: [], importe: 1, destino: "x" }));
});
