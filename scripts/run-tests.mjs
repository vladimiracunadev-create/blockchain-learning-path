import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Directorios que no son código nuestro: sin este filtro, la suite acabaría
// ejecutando las pruebas de cualquier dependencia que publique archivos
// *.test.mjs, y un fallo ajeno pondría la CI en rojo sin motivo.
const IGNORAR = new Set(["node_modules", "dist", "out", "cache", "lib", "build", "www", "android"]);

async function discover(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    if (IGNORAR.has(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return discover(path);
    return entry.name.endsWith(".test.mjs") ? [path] : [];
  }));
  return files.flat();
}

// `projects/` alberga sobre todo contratos (que prueba Foundry), pero también el
// proyecto final del módulo 28, que es JavaScript. Sin incluirlo aquí, sus
// pruebas se contarían en `pnpm check` y no se ejecutarían nunca: la peor
// combinación posible, porque la cifra prometida dejaría de estar respaldada.
const testFiles = [...await discover("labs"), ...await discover("apps"), ...await discover("projects")].sort();
if (!testFiles.length) throw new Error("No se encontraron pruebas");
console.log(`Ejecutando ${testFiles.length} archivos de prueba.`);
const result = spawnSync(process.execPath, ["--test", ...testFiles], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
