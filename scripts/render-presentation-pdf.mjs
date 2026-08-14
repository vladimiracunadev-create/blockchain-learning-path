#!/usr/bin/env node
// Convierte los dos HTML de la muestra en PDF con un Chrome headless:
//
//   presentacion/presentacion.html → presentacion/PRESENTACION.pdf  (16:9, una lámina por página)
//   presentacion/pauta.html        → presentacion/PAUTA.pdf         (A4, guion del expositor)
//
// Mismo mecanismo que scripts/render-manual-pdf.mjs: puppeteer-core apuntando a un
// navegador del sistema (PUPPETEER_EXECUTABLE_PATH) o a uno de los habituales.
//
// Uso: node scripts/render-presentation-pdf.mjs

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function findBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium",
  ];
  return candidates.find((p) => existsSync(p)) || null;
}

const deckHtml = join(ROOT, "presentacion", "presentacion.html");
const pautaHtml = join(ROOT, "presentacion", "pauta.html");
for (const f of [deckHtml, pautaHtml]) {
  if (!existsSync(f)) throw new Error(`Falta ${f}. Ejecuta antes: node scripts/build-presentation.mjs`);
}

const puppeteer = (await import("puppeteer-core")).default;
const executablePath = findBrowser();
if (!executablePath) throw new Error("No se encontró Chrome/Edge. Define PUPPETEER_EXECUTABLE_PATH.");

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
});

// --- Diapositivas: página de 1280×720 px, sin márgenes ni pie ------------------
const deck = await browser.newPage();
await deck.setViewport({ width: 1280, height: 720 });
await deck.goto(pathToFileURL(deckHtml).href, { waitUntil: "networkidle0", timeout: 120000 });
// El ajuste de escala de las láminas corre en el navegador: esperar a que termine
// evita imprimir una diapositiva con la última línea cortada.
await deck.waitForFunction("window.__deckReady === true", { timeout: 60000 }).catch(() => {});
const laminas = await deck.evaluate(() => document.querySelectorAll(".slide").length);
await deck.pdf({
  path: join(ROOT, "presentacion", "PRESENTACION.pdf"),
  width: "1280px",
  height: "720px",
  printBackground: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
  // Sin pageRanges a propósito: recortar el PDF a las láminas esperadas escondería
  // exactamente el fallo que check-presentation.mjs busca (una lámina que se
  // desborda a una segunda página).
});
console.log(`presentacion/PRESENTACION.pdf generado (${laminas} diapositivas).`);

// --- Pauta: A4 con numeración de páginas ---------------------------------------
const pauta = await browser.newPage();
await pauta.goto(pathToFileURL(pautaHtml).href, { waitUntil: "networkidle0", timeout: 120000 });
await pauta.pdf({
  path: join(ROOT, "presentacion", "PAUTA.pdf"),
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "16mm", left: "15mm", right: "15mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#888;padding:0 15mm;display:flex;justify-content:space-between;">' +
    '<span>Blockchain Learning Path — Pauta del expositor</span>' +
    '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
});
console.log("presentacion/PAUTA.pdf generado.");

await browser.close();
