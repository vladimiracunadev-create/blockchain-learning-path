import { ejecutadoDirectamente } from "../run-directo.mjs";

export function simulate({ initial, annualInflation, years, allocations }) {
  const totalAllocation = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  if (Math.abs(totalAllocation - 1) > 1e-9) throw new Error("Las asignaciones deben sumar 1");
  return Array.from({ length: years + 1 }, (_, year) => {
    const supply = initial * (1 + annualInflation) ** year;
    return {
      year,
      supply: Math.round(supply),
      holders: Object.fromEntries(
        Object.entries(allocations).map(([name, share]) => [name, Math.round(supply * share)])
      )
    };
  });
}

if (ejecutadoDirectamente(import.meta.url)) {
  console.table(simulate({
    initial: 1_000_000,
    annualInflation: 0.03,
    years: 5,
    allocations: { community: 0.5, team: 0.2, treasury: 0.3 }
  }));
}
