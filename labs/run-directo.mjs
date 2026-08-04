// ¿Se está ejecutando este archivo directamente (`node archivo.mjs`) o lo está
// importando otro módulo (una prueba, por ejemplo)?
//
// El guard ingenuo `import.meta.url === \`file://${process.argv[1]}\`` funciona
// en Linux y macOS pero FALLA SIEMPRE en Windows: allí `process.argv[1]` es una
// ruta como `C:\dev\repo\labs\x.mjs`, mientras que `import.meta.url` es
// `file:///C:/dev/repo/labs/x.mjs` — barras invertidas contra barras normales, y
// dos barras contra tres. La comparación nunca es cierta, así que el laboratorio
// se ejecuta sin imprimir nada y el alumno cree que está roto.
//
// `pathToFileURL` hace esa conversión con las reglas del sistema operativo, que
// es justamente el trabajo que no debemos escribir a mano.
import { pathToFileURL } from "node:url";

export function ejecutadoDirectamente(metaUrl) {
  const entrada = process.argv[1];
  if (!entrada) return false;
  return metaUrl === pathToFileURL(entrada).href;
}
