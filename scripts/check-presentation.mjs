#!/usr/bin/env node
// Comprueba que la muestra del programa se generó completa y que el README no
// promete un documento distinto del que se publica.
//
// Los PDF no se versionan (se generan en cada publicación), así que nada sujeta
// la cifra que anuncia el README salvo esta comprobación: si alguien añade una
// diapositiva o un anexo a docs/presentacion.md y no toca el texto, aquí se nota.
//
// Se ejecuta después de `pnpm build:presentacion`.
//
// Uso: node scripts/check-presentation.mjs

import { readFile, stat } from "node:fs/promises";

const DECK = "presentacion/PRESENTACION.pdf";
const PAUTA = "presentacion/PAUTA.pdf";

async function paginas(ruta) {
  let datos;
  try {
    datos = await readFile(ruta);
  } catch {
    console.error(`No existe ${ruta}. Ejecuta antes: pnpm build:presentacion`);
    process.exit(1);
  }
  // Contar objetos /Type /Page (excluyendo /Pages, el nodo del árbol).
  const total = (datos.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  if (total === 0) {
    console.error(`${ruta} no declara ninguna página: la generación falló.`);
    process.exit(1);
  }
  return { total, kb: Math.round((await stat(ruta)).size / 1024) };
}

// Diapositivas declaradas en la fuente: secciones "## N · Título".
const fuente = await readFile("docs/presentacion.md", "utf8");
const declaradasEnFuente = (fuente.match(/^##\s+\d+\s*·\s+/gm) ?? []).length;
if (declaradasEnFuente < 6) {
  console.error(`docs/presentacion.md define ${declaradasEnFuente} diapositivas: se esperaban al menos 6.`);
  process.exit(1);
}

const deck = await paginas(DECK);
if (deck.total !== declaradasEnFuente) {
  console.error(
    `El PDF de diapositivas tiene ${deck.total} páginas y docs/presentacion.md define ` +
    `${declaradasEnFuente} diapositivas: alguna lámina se desbordó a dos páginas.`
  );
  process.exit(1);
}

const pauta = await paginas(PAUTA);
if (pauta.total < 3) {
  console.error(`La pauta solo tiene ${pauta.total} páginas: el guion no se generó completo.`);
  process.exit(1);
}

// Los anexos ("## Anexo · Título") son la mitad del valor de la pauta y la que más
// fácil se pierde en silencio: no se proyectan, así que nadie nota que faltan hasta
// que alguien tiene que exponer. Se comprueban contra el HTML realmente generado.
const anexosEnFuente = (fuente.match(/^##\s+Anexo\s*·\s+/gm) ?? []).length;
if (anexosEnFuente < 1) {
  console.error('docs/presentacion.md no define ningún anexo del expositor ("## Anexo · Título").');
  process.exit(1);
}
const pautaHtml = await readFile("presentacion/pauta.html", "utf8");
const anexosRenderizados = (pautaHtml.match(/class="anexo"/g) ?? []).length;
if (anexosRenderizados !== anexosEnFuente) {
  console.error(
    `docs/presentacion.md define ${anexosEnFuente} anexos y la pauta generada tiene ` +
    `${anexosRenderizados}: alguno no llegó al documento.`
  );
  process.exit(1);
}

const readme = await readFile("README.md", "utf8");
const anunciado = /PRESENTACION\.pdf \((\d+) diapositivas\)/.exec(readme);
if (!anunciado) {
  console.error("El README ya no declara el número de diapositivas de la presentación.");
  process.exit(1);
}
if (Number(anunciado[1]) !== declaradasEnFuente) {
  console.error(
    `El README anuncia ${anunciado[1]} diapositivas y la presentación tiene ${declaradasEnFuente}.\n` +
    "Actualiza la cifra en README.md."
  );
  process.exit(1);
}

// La duración también se anuncia, y también se calcula: es la suma de los minutos
// que declara cada pauta, así que añadir una lámina cambia el total.
const minutos = [...fuente.matchAll(/\*\*Pauta\s*·\s*(\d+)\s*min\.?\*\*/g)].reduce((t, m) => t + Number(m[1]), 0);
const duracionReadme = /≈\*\*(\d+) minutos\*\*|\*\*≈(\d+) minutos\*\*/.exec(readme);
if (!duracionReadme) {
  console.error("El README ya no declara la duración de la presentación (≈**N minutos**).");
  process.exit(1);
}
const declaradaReadme = Number(duracionReadme[1] ?? duracionReadme[2]);
if (declaradaReadme !== minutos) {
  console.error(
    `El README anuncia ≈${declaradaReadme} minutos de charla y las pautas suman ${minutos}.\n` +
    "Actualiza la cifra en README.md."
  );
  process.exit(1);
}

const anexosReadme = /\*\*(\d+) anexos\*\*/.exec(readme);
if (!anexosReadme) {
  console.error("El README ya no declara cuántos anexos trae la pauta del expositor (**N anexos**).");
  process.exit(1);
}
if (Number(anexosReadme[1]) !== anexosEnFuente) {
  console.error(
    `El README anuncia ${anexosReadme[1]} anexos y la pauta trae ${anexosEnFuente}.\n` +
    "Actualiza la cifra en README.md."
  );
  process.exit(1);
}

console.log(
  `Presentación: ${deck.total} diapositivas (${deck.kb} KB), ≈${minutos} min, y pauta de ` +
  `${pauta.total} páginas con ${anexosEnFuente} anexos (${pauta.kb} KB) — coincide con lo ` +
  "anunciado en el README."
);
