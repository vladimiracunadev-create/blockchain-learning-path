import test from "node:test";
import assert from "node:assert/strict";
import { simulate } from "./supply-simulator.mjs";

test("aplica emisión compuesta y valida asignaciones", () => {
  const result = simulate({ initial: 100, annualInflation: 0.1, years: 2, allocations: { a: 0.6, b: 0.4 } });
  assert.equal(result[2].supply, 121);
  assert.throws(() => simulate({ initial: 1, annualInflation: 0, years: 1, allocations: { a: 0.5 } }));
});
