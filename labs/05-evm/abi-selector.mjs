import { ejecutadoDirectamente } from "../run-directo.mjs";

const knownSelectors = new Map([
  ["transfer(address,uint256)", "a9059cbb"],
  ["balanceOf(address)", "70a08231"],
  ["approve(address,uint256)", "095ea7b3"],
  ["totalSupply()", "18160ddd"]
]);

export function selectorFor(signature) {
  const selector = knownSelectors.get(signature);
  if (!selector) throw new Error("Vector no incluido: calcula Keccak-256 y toma 4 bytes");
  return `0x${selector}`;
}

if (ejecutadoDirectamente(import.meta.url)) {
  for (const [signature] of knownSelectors) console.log(signature, selectorFor(signature));
  console.log("EVM usa Keccak-256, que no es idéntico al SHA3-256 estandarizado.");
}
