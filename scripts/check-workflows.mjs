#!/usr/bin/env node
// Comprueba los scripts de shell embebidos en los workflows de GitHub Actions.
//
// Nace de un fallo que se coló dos veces: escribir `versión=…` o `tamaño=…` en un
// paso `run:`. Bash no admite tildes ni eñes en los nombres de variable, así que
// interpreta la línea entera como un comando y falla con "command not found",
// un mensaje que no se parece en nada a la causa real. En un repositorio escrito
// en español es un error natural de cometer, y actionlint no lo detecta.
//
// Uso: node scripts/check-workflows.mjs

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIRECTORIO = ".github/workflows";
// Un nombre que empieza como identificador válido pero contiene algún carácter
// fuera del ASCII imprimible: `versión`, `tamaño`, `año`…
const IDENTIFICADOR_INVALIDO = /^\s*([A-Za-z_][A-Za-z0-9_]*[^ -~][A-Za-z0-9_À-ɏ]*)=/;
const problemas = [];

for (const archivo of await readdir(DIRECTORIO)) {
  if (!/\.ya?ml$/.test(archivo)) continue;
  const lineas = (await readFile(join(DIRECTORIO, archivo), "utf8")).split("\n");

  lineas.forEach((linea, indice) => {
    const encontrado = IDENTIFICADOR_INVALIDO.exec(linea);
    if (encontrado) {
      problemas.push(
        `${DIRECTORIO}/${archivo}:${indice + 1}: "${encontrado[1]}" no es un nombre de variable válido en bash ` +
        `(lleva un carácter no ASCII). El paso fallará con "command not found".`
      );
    }
  });
}

if (problemas.length) {
  console.error(`Workflows con problemas:\n${problemas.join("\n")}`);
  process.exit(1);
}
console.log("Workflows: sin variables de shell con caracteres no ASCII.");
