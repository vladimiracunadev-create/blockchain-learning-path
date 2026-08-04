#!/usr/bin/env node
// Ejecuta la comprobación de contenido de la app de escritorio.
//
// Resuelve el binario de Electron desde apps/desktop/node_modules en vez de
// delegar en `pnpm exec`: así funciona igual desde la raíz del repo, desde la
// CI y desde una máquina donde convivan varias versiones de pnpm.

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ESCRITORIO = join(ROOT, "apps", "desktop");

const require = createRequire(join(ESCRITORIO, "package.json"));
let electron;
try {
  electron = require("electron");
} catch {
  console.error("No se encontró Electron. Ejecuta: pnpm install");
  process.exit(1);
}

const resultado = spawnSync(electron, ["smoke.js", "--no-sandbox"], {
  cwd: ESCRITORIO,
  stdio: "inherit"
});
process.exit(resultado.status ?? 1);
