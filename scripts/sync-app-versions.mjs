#!/usr/bin/env node
// Propaga la versión del package.json raíz a las apps.
//
// Existe porque una versión escrita a mano en tres sitios se desincroniza sola:
// basta un bump que olvide uno para que el instalador se llame 0.8.0 y el APK
// siga diciendo 0.7.0. La raíz es la única fuente de verdad; las apps la copian.
//
// Uso: node scripts/sync-app-versions.mjs [--check]

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const soloComprobar = process.argv.includes("--check");

const version = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
const apps = ["apps/desktop/package.json", "apps/android/package.json"];

const desincronizadas = [];
for (const relativo of apps) {
  const ruta = join(ROOT, relativo);
  const texto = readFileSync(ruta, "utf8");
  const actual = JSON.parse(texto).version;
  if (actual === version) continue;

  if (soloComprobar) {
    desincronizadas.push(`${relativo}: ${actual} (la raíz está en ${version})`);
    continue;
  }
  // Reemplazo textual para conservar el formato del archivo tal cual está.
  writeFileSync(ruta, texto.replace(/("version":\s*)"[^"]*"/, `$1"${version}"`), "utf8");
  console.log(`${relativo}: ${actual} → ${version}`);
}

if (desincronizadas.length) {
  console.error(`Versiones desincronizadas:\n  ${desincronizadas.join("\n  ")}\n\nEjecuta: pnpm sync:versions`);
  process.exit(1);
}
console.log(`Versión de las apps sincronizada en ${version}.`);
