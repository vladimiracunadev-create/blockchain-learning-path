import { pathToFileURL } from "node:url";

const MODELOS = {
  cex: { custodia: true, ejecucion: "libro interno", liquidacion: "retiro on-chain posterior" },
  dex: { custodia: false, ejecucion: "contrato o protocolo", liquidacion: "on-chain" },
  hot: { conectada: true, uso: "operación diaria", riesgo: "exposición online" },
  warm: { conectada: false, uso: "reposición controlada", riesgo: "proceso de activación" },
  cold: { conectada: false, uso: "reserva", riesgo: "ceremonia y recuperación" }
};

export function clasificarOperacion({ plataforma, retiroConfirmado = false }) {
  if (!MODELOS[plataforma]) throw new Error(`Modelo desconocido: ${plataforma}`);
  const modelo = MODELOS[plataforma];
  return {
    ...modelo,
    plataforma,
    estado: plataforma === "cex" && !retiroConfirmado ? "off-chain" : "on-chain"
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.table([clasificarOperacion({ plataforma: "cex" }), clasificarOperacion({ plataforma: "dex" })]);
}
