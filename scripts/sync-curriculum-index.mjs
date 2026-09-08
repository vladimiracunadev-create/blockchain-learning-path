#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { classFileName } from "./curriculum-lib.mjs";

const catalog = JSON.parse(await readFile("curriculum/classes.json", "utf8"));
const directories = (await readdir("curriculum", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const rows = [];
for (const [index, directory] of directories.entries()) {
  const text = await readFile(join("curriculum", directory, "README.md"), "utf8");
  const title = text.match(/^#\s+(.+)\s+·\s+Clases\s+\d+–\d+$/m)?.[1];
  const source = text.match(/\*\*Fuente:\*\*\s+(.+)$/m)?.[1];
  const unit = catalog[index];
  if (!title || !source || unit?.unit !== directory.slice(0, 2)) {
    throw new Error(`${directory}: no se pudo construir el índice de clases.`);
  }
  for (const item of unit.classes) {
    rows.push(`| **${item.id}** | [${item.title}](${directory}/${classFileName(item)}) | ${item.question} | [Mapa: ${title}](${directory}/README.md) · ${source} |`);
  }
}

const block = `<!-- indice-clases:inicio -->
| Clase | Documento independiente | Pregunta guía | Tema y fuente base |
|---|---|---|---|
${rows.join("\n")}
<!-- indice-clases:fin -->`;

const path = "curriculum/README.md";
const original = await readFile(path, "utf8");
const markerPattern = /<!-- indice-clases:inicio -->[\s\S]*?<!-- indice-clases:fin -->/;
const legacyPattern = /\| # \| Módulo \| Pregunta central \| Fuente principal \|[\s\S]*?\n\| 32 \|[^\n]+\n/;
let updated;
if (markerPattern.test(original)) {
  updated = original.replace(markerPattern, block);
} else if (legacyPattern.test(original)) {
  updated = original.replace(legacyPattern, `${block}\n`);
} else {
  throw new Error("No se encontró el bloque del índice ni su tabla histórica.");
}
if (updated !== original) await writeFile(path, updated, "utf8");
console.log(`Índice sincronizado: ${catalog.length * 2} documentos de clase y ${catalog.length} mapas temáticos.`);
