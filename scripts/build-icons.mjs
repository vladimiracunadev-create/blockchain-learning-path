#!/usr/bin/env node
// Genera los iconos de las apps a partir de una única fuente vectorial
// (apps/icono.svg), para que Windows y Android nunca muestren dibujos distintos.
//
// Produce:
//   apps/desktop/build/icon.ico        → instalador y ventana de Windows (multi-tamaño)
//   apps/desktop/build/icon.png        → 512 px, fuente para Linux/macOS si se añaden
//   apps/android/recursos/ic_launcher-*.png → mipmaps de Android por densidad
//   apps/android/recursos/ic_launcher_foreground.png → capa del icono adaptativo
//
// Rasteriza con el Chrome del sistema (el mismo que usa el manual en PDF), así
// que no añade ninguna dependencia nativa al repositorio.
//
// Uso: node scripts/build-icons.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG = join(ROOT, "apps", "icono.svg");

function findBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium",
  ];
  return candidates.find((p) => existsSync(p)) || null;
}

const svg = readFileSync(SVG, "utf8");
const puppeteer = (await import("puppeteer-core")).default;
const executablePath = findBrowser();
if (!executablePath) throw new Error("No se encontró Chrome/Edge. Define PUPPETEER_EXECUTABLE_PATH.");

const browser = await puppeteer.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

// Rasteriza el SVG al tamaño pedido. `omitBackground` conserva la transparencia
// de las esquinas redondeadas: sin ella, Windows dibuja un cuadrado negro.
async function rasterizar(tamano, contenido = svg) {
  const page = await browser.newPage();
  await page.setViewport({ width: tamano, height: tamano, deviceScaleFactor: 1 });
  // El SVG declara width/height de 512: sin forzarlo a llenar el contenedor,
  // Chrome lo dibuja a tamaño natural y RECORTA en vez de escalar, así que
  // cualquier icono menor de 512 saldría siendo la esquina superior izquierda.
  await page.setContent(
    `<html><head><style>
       html,body{margin:0;background:transparent}
       .caja{width:${tamano}px;height:${tamano}px;overflow:hidden}
       .caja>svg{width:100%;height:100%;display:block}
     </style></head>
     <body><div class="caja">${contenido}</div></body></html>`,
    { waitUntil: "load" }
  );
  const png = await page.screenshot({ type: "png", omitBackground: true });
  await page.close();
  return Buffer.from(png);
}

// --- ICO ----------------------------------------------------------------------
// El formato es un directorio de 6 bytes, una entrada de 16 por imagen y luego
// los datos. Desde Windows Vista cada entrada puede ser un PNG tal cual, que es
// lo que hacemos: evita reimplementar el bitmap DIB.
function construirIco(imagenes) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);                 // reservado
  cabecera.writeUInt16LE(1, 2);                 // tipo 1 = icono
  cabecera.writeUInt16LE(imagenes.length, 4);

  let desplazamiento = 6 + imagenes.length * 16;
  const entradas = [];
  for (const { tamano, datos } of imagenes) {
    const entrada = Buffer.alloc(16);
    entrada.writeUInt8(tamano >= 256 ? 0 : tamano, 0); // 0 significa 256
    entrada.writeUInt8(tamano >= 256 ? 0 : tamano, 1);
    entrada.writeUInt8(0, 2);                   // colores de la paleta
    entrada.writeUInt8(0, 3);                   // reservado
    entrada.writeUInt16LE(1, 4);                // planos
    entrada.writeUInt16LE(32, 6);               // bits por píxel
    entrada.writeUInt32LE(datos.length, 8);
    entrada.writeUInt32LE(desplazamiento, 12);
    desplazamiento += datos.length;
    entradas.push(entrada);
  }
  return Buffer.concat([cabecera, ...entradas, ...imagenes.map((i) => i.datos)]);
}

const escritorio = join(ROOT, "apps", "desktop", "build");
const android = join(ROOT, "apps", "android", "recursos");
mkdirSync(escritorio, { recursive: true });
mkdirSync(android, { recursive: true });

const tamanosIco = [16, 24, 32, 48, 64, 128, 256];
const imagenes = [];
for (const tamano of tamanosIco) {
  imagenes.push({ tamano, datos: await rasterizar(tamano) });
}
writeFileSync(join(escritorio, "icon.ico"), construirIco(imagenes));
writeFileSync(join(escritorio, "icon.png"), await rasterizar(512));
console.log(`icon.ico generado con ${tamanosIco.length} tamaños (${tamanosIco.join(", ")} px).`);

// --- Android ------------------------------------------------------------------
// Mipmaps clásicos por densidad, más la capa de primer plano del icono
// adaptativo. El adaptativo se recorta a un círculo o a un "squircle" según el
// lanzador, y solo garantiza visible el 66 % central: por eso el primer plano
// lleva el dibujo reducido y con margen, no el SVG a sangre.
const densidades = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [densidad, tamano] of Object.entries(densidades)) {
  writeFileSync(join(android, `ic_launcher-${densidad}.png`), await rasterizar(tamano));
  writeFileSync(join(android, `ic_launcher_round-${densidad}.png`), await rasterizar(tamano));
}

const svgSinFondo = svg.replace(/<rect width="512" height="512" rx="112" fill="url\(#fondo\)"\/>/, "");
const primerPlano = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-96 -96 704 704" width="512" height="512">
  <g>${svgSinFondo.replace(/<\/?svg[^>]*>/g, "")}</g>
</svg>`;
for (const [densidad, tamano] of Object.entries({ mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 })) {
  writeFileSync(join(android, `ic_launcher_foreground-${densidad}.png`), await rasterizar(tamano, primerPlano));
}
writeFileSync(join(android, "ic_launcher-512.png"), await rasterizar(512));
console.log(`Android: mipmaps en ${Object.keys(densidades).length} densidades + capa adaptativa.`);

await browser.close();
