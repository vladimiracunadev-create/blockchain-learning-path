import test from "node:test";
import assert from "node:assert/strict";
import {
  comprar,
  correlacionPearson,
  metricasMercado,
  simularCicloViral,
  vender
} from "./viral-token-cycle.mjs";

test("market cap y FDV son valoraciones, no reservas retirables", () => {
  const metricas = metricasMercado({
    reservaToken: 100_000,
    reservaCotizada: 5_000,
    suministroCirculante: 1_000_000,
    suministroMaximo: 10_000_000
  });
  assert.equal(metricas.precio, 0.05);
  assert.equal(metricas.marketCap, 50_000);
  assert.equal(metricas.fdv, 500_000);
  assert.equal(metricas.liquidezMarcada, 10_000);
  assert.equal(metricas.efectivoCotizadoEnPool, 5_000);
  assert.ok(metricas.marketCap > metricas.liquidezMarcada);
});

test("comprar cambia reservas, precio y tokens de la wallet adquirente", () => {
  const compra = comprar({
    reservaToken: 100_000,
    reservaCotizada: 5_000,
    cotizadoEntrada: 1_000,
    comision: 0
  });
  assert.ok(compra.tokenSalida > 0);
  assert.equal(compra.pool.reservaCotizada, 6_000);
  assert.ok(compra.pool.reservaToken < 100_000);
  assert.ok(compra.pool.reservaCotizada / compra.pool.reservaToken > 0.05);
});

test("vender una fracción del suministro retira mucho menos que su market cap teórico", () => {
  const pool = { reservaToken: 100_000, reservaCotizada: 5_000 };
  const marketCap = metricasMercado({
    ...pool,
    suministroCirculante: 1_000_000,
    suministroMaximo: 10_000_000
  }).marketCap;
  const venta = vender({ ...pool, tokenEntrada: 100_000, comision: 0 });
  assert.equal(marketCap * 0.1, 5_000);
  assert.equal(venta.cotizadoSalida, 2_500);
});

test("el caso sintético produce subida de miles por ciento y drawdown fuerte", () => {
  const { serie, resumen } = simularCicloViral();
  assert.equal(serie.length, 7);
  assert.ok(resumen.variacionHastaMaximo > 10, `variación: ${resumen.variacionHastaMaximo}`);
  assert.ok(resumen.drawdownFinal < -0.7, `drawdown: ${resumen.drawdownFinal}`);
  assert.ok(serie.every((fila) => fila.fdv >= fila.marketCap));
  assert.ok(serie.some((fila) => fila.proporcionVolumenCircular > 0.4));
  assert.match(resumen.advertenciaCausal, /no demuestra/i);
});

test("correlación alta no cambia la advertencia causal", () => {
  assert.equal(correlacionPearson([1, 2, 3], [10, 20, 30]), 1);
  const { resumen } = simularCicloViral();
  assert.ok(resumen.correlacionAudienciaVolumen > 0.5);
  assert.match(resumen.advertenciaCausal, /varias causas/i);
});

test("rechaza configuraciones económicas imposibles", () => {
  assert.throws(() => metricasMercado({
    reservaToken: 0,
    reservaCotizada: 1,
    suministroCirculante: 1,
    suministroMaximo: 1
  }));
  assert.throws(() => metricasMercado({
    reservaToken: 1,
    reservaCotizada: 1,
    suministroCirculante: 2,
    suministroMaximo: 1
  }));
  assert.throws(() => correlacionPearson([1], [1]));
});
