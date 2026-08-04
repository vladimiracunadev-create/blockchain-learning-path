#!/usr/bin/env node
// Construye el BUNDLE OFFLINE del curso: exactamente el mismo contenido que se
// publica en GitHub Pages, pero con las rutas colgando de la raíz ("/") en vez
// de "/blockchain-learning-path/", porque dentro de las apps el contenido se
// sirve desde la raíz.
//
// Ese bundle lo empaquetan las dos apps:
//   apps/desktop  (Windows, Electron)  → lo sirve un http local
//   apps/android  (Capacitor)          → lo sirve el WebView
//
// Salida: apps/bundle/
// Uso: node scripts/build-app-bundle.mjs

import { rmSync, mkdirSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "apps", "bundle");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const entorno = { ...process.env, SITE_BASE: "/", SITE_OUT: "apps/bundle" };
for (const script of ["build-landing.mjs", "build-site.mjs"]) {
  const resultado = spawnSync(process.execPath, [join("scripts", script)], {
    cwd: ROOT, env: entorno, stdio: "inherit"
  });
  if (resultado.status !== 0) throw new Error(`Falló ${script}`);
}

// --- Recuento de contenido ----------------------------------------------------
// Este número es la única defensa contra el fallo clásico: la app compila, se
// instala, arranca... y está vacía porque el contenido nunca llegó a copiarse.
// Se escribe dentro del propio bundle para poder verificarlo DENTRO del binario
// ya empaquetado, no solo aquí.
function contar(directorio) {
  let paginas = 0;
  for (const nombre of readdirSync(directorio)) {
    const ruta = join(directorio, nombre);
    if (statSync(ruta).isDirectory()) paginas += contar(ruta);
    else if (nombre.endsWith(".html")) paginas += 1;
  }
  return paginas;
}

const paginas = contar(OUT);
const modulos = readdirSync(join(ROOT, "curriculum")).filter((d) => /^\d{2}-/.test(d)).length;
const modulosEnBundle = readdirSync(join(OUT, "curriculum"), { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name) && existsSync(join(OUT, "curriculum", e.name, "README.html")))
  .length;

if (modulosEnBundle !== modulos) {
  throw new Error(`El bundle tiene ${modulosEnBundle} módulos y el curso tiene ${modulos}.`);
}
if (paginas < 50) {
  throw new Error(`El bundle solo tiene ${paginas} páginas: algo no se generó.`);
}

const version = JSON.parse(
  await import("node:fs/promises").then((fs) => fs.readFile(join(ROOT, "package.json"), "utf8"))
).version;

const manifiesto = {
  version,
  paginas,
  modulos: modulosEnBundle,
  manual: existsSync(join(OUT, "manual", "MANUAL.pdf")),
  generado: "build-app-bundle"
};
writeFileSync(join(OUT, "contenido.json"), JSON.stringify(manifiesto, null, 2), "utf8");

console.log(`\n✅ Bundle offline: ${paginas} páginas, ${modulosEnBundle}/${modulos} módulos, manual ${manifiesto.manual ? "incluido" : "AUSENTE"}.`);
