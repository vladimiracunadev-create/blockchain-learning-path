export function selectUtxos(utxos, target, fee) {
  if (target <= 0 || fee < 0) throw new RangeError("Montos inválidos");
  const selected = [];
  let total = 0;
  for (const utxo of [...utxos].sort((a, b) => a.value - b.value)) {
    selected.push(utxo);
    total += utxo.value;
    if (total >= target + fee) {
      return { selected, total, target, fee, change: total - target - fee };
    }
  }
  throw new Error("Fondos insuficientes");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(selectUtxos(
    [{ id: "a:0", value: 8_000 }, { id: "b:1", value: 12_000 }, { id: "c:0", value: 30_000 }],
    17_000,
    1_000
  ));
}
