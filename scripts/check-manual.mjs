#!/usr/bin/env node
// Comprueba que el manual generado tiene el tamaño que la documentación afirma.
//
// El PDF ya no se versiona: se genera en cada publicación. Eso es bueno para el
// historial del repositorio y malo para la coherencia, porque el número de
// páginas que anuncia el README deja de tener nada que lo sujete. Cuando el
// currículo crece, la cifra envejece en silencio y el material acaba prometiendo
// un documento que no existe.
//
// Se ejecuta después de `pnpm build:manual`, en los workflows que generan el PDF.
//
// Uso: node scripts/check-manual.mjs

import { readFile, stat } from "node:fs/promises";

const PDF = "manual/MANUAL.pdf";
const TOLERANCIA = 0.12; // ±12 %: el paginado varía algo entre versiones de Chrome

let datos;
try {
  datos = await readFile(PDF);
} catch {
  console.error(`No existe ${PDF}. Ejecuta antes: pnpm build:manual`);
  process.exit(1);
}

// Contar objetos /Type /Page (excluyendo /Pages, que es el nodo del árbol).
const paginas = (datos.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
if (paginas === 0) {
  console.error("El PDF no declara ninguna página: la generación falló.");
  process.exit(1);
}

const readme = await readFile("README.md", "utf8");
const declarado = /MANUAL\.pdf \(~(\d+) páginas\)/.exec(readme);
if (!declarado) {
  console.error("El README ya no declara el número de páginas del manual.");
  process.exit(1);
}

const esperado = Number(declarado[1]);
const desviacion = Math.abs(paginas - esperado) / esperado;
const megas = ((await stat(PDF)).size / 1048576).toFixed(1);

if (desviacion > TOLERANCIA) {
  console.error(
    `El manual tiene ${paginas} páginas y el README anuncia ~${esperado} ` +
    `(${(desviacion * 100).toFixed(0)} % de desviación).\n` +
    `Actualiza la cifra en README.md y en docs/estado-del-repositorio.md.`
  );
  process.exit(1);
}

console.log(`Manual: ${paginas} páginas, ${megas} MB — coincide con el ~${esperado} anunciado.`);
