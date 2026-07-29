import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

async function discover(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return discover(path);
    return entry.name.endsWith(".test.mjs") ? [path] : [];
  }));
  return files.flat();
}

const testFiles = [...await discover("labs"), ...await discover("apps")].sort();
if (!testFiles.length) throw new Error("No se encontraron pruebas");
console.log(`Ejecutando ${testFiles.length} archivos de prueba.`);
const result = spawnSync(process.execPath, ["--test", ...testFiles], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
