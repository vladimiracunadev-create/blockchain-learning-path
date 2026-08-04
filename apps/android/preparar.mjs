#!/usr/bin/env node
// Copia el bundle offline del curso a www/, que es lo que Capacitor empaqueta
// dentro del APK.
//
// Falla en voz alta si el bundle no está o está incompleto. Es deliberado: un
// APK que se instala y abre una pantalla en blanco es mucho peor que un build
// que se niega a continuar.

import { cpSync, existsSync, readFileSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const BUNDLE = join(AQUI, "..", "bundle");
const WWW = join(AQUI, "www");

if (!existsSync(join(BUNDLE, "index.html"))) {
  throw new Error(
    `No existe el bundle del curso en ${BUNDLE}.\n` +
    `Ejecuta primero: pnpm build:bundle`
  );
}

const manifiesto = JSON.parse(readFileSync(join(BUNDLE, "contenido.json"), "utf8"));
if (manifiesto.modulos < 19) {
  throw new Error(`El bundle solo declara ${manifiesto.modulos} módulos.`);
}

rmSync(WWW, { recursive: true, force: true });
mkdirSync(WWW, { recursive: true });
cpSync(BUNDLE, WWW, { recursive: true });

function contarHtml(directorio) {
  let total = 0;
  for (const nombre of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, nombre.name);
    if (nombre.isDirectory()) total += contarHtml(ruta);
    else if (nombre.name.endsWith(".html")) total += 1;
  }
  return total;
}

console.log(`www/ preparado: ${contarHtml(WWW)} páginas, ${manifiesto.modulos} módulos, v${manifiesto.version}.`);
