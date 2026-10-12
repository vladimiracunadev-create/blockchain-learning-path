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

function rutasDelEvento(lineas, evento) {
  const inicio = lineas.findIndex((linea) => linea === `  ${evento}:`);
  if (inicio === -1) return null;

  const fin = lineas.findIndex((linea, indice) => indice > inicio && /^ {2}\S/.test(linea));
  const bloque = lineas.slice(inicio + 1, fin === -1 ? undefined : fin);
  const inicioRutas = bloque.findIndex((linea) => linea === "    paths:");
  if (inicioRutas === -1) return null;

  const rutas = [];
  for (const linea of bloque.slice(inicioRutas + 1)) {
    const encontrada = /^ {6}- ["'](.+)["']$/.exec(linea);
    if (!encontrada) break;
    rutas.push(encontrada[1]);
  }
  return rutas;
}

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

  // Si un workflow usa filtros tanto en push como en pull_request, el PR debe
  // ejecutar todas las validaciones que se ejecutarían después del merge. Si no,
  // un cambio puede verse verde en revisión y romper main al aterrizar.
  const rutasPush = rutasDelEvento(lineas, "push");
  const rutasPullRequest = rutasDelEvento(lineas, "pull_request");
  if (rutasPush && rutasPullRequest) {
    const ausentes = rutasPush.filter((ruta) => !rutasPullRequest.includes(ruta));
    if (ausentes.length) {
      problemas.push(
        `${DIRECTORIO}/${archivo}: pull_request.paths no cubre estas rutas de push.paths: ` +
        ausentes.join(", ")
      );
    }
  }
}

if (problemas.length) {
  console.error(`Workflows con problemas:\n${problemas.join("\n")}`);
  process.exit(1);
}
console.log("Workflows: scripts shell válidos y filtros de PR alineados con main.");
