#!/usr/bin/env node
// Convierte manual/manual.html en manual/MANUAL.pdf con un Chrome headless.
// Usa puppeteer-core apuntando a un navegador del sistema (variable PUPPETEER_EXECUTABLE_PATH)
// o, si no, al Chromium que trae puppeteer. Espera a que Mermaid termine de dibujar.
//
// Uso: node scripts/render-manual-pdf.mjs

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(ROOT, "manual", "manual.html");
const pdfPath = join(ROOT, "manual", "MANUAL.pdf");

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

const puppeteer = (await import("puppeteer-core")).default;
const executablePath = findBrowser();
if (!executablePath) throw new Error("No se encontró Chrome/Edge. Define PUPPETEER_EXECUTABLE_PATH.");

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
});
const pageObj = await browser.newPage();
await pageObj.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0", timeout: 120000 });
// Esperar a que Mermaid termine: bandera global y, por seguridad, que el número
// de SVG dibujados iguale al de bloques mermaid.
await pageObj.waitForFunction("window.__mermaidDone === true", { timeout: 120000 }).catch(() => {});
await pageObj.waitForFunction(
  "document.querySelectorAll('pre.mermaid svg').length >= document.querySelectorAll('pre.mermaid').length",
  { timeout: 120000, polling: 500 },
).catch(() => {});
const diag = await pageObj.evaluate(
  () => `${document.querySelectorAll("pre.mermaid svg").length}/${document.querySelectorAll("pre.mermaid").length}`);
console.log(`Diagramas Mermaid dibujados: ${diag}`);
await new Promise((r) => setTimeout(r, 2000));

await pageObj.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#888;padding:0 14mm;display:flex;justify-content:space-between;">' +
    '<span>Blockchain Learning Path — Manual del usuario</span>' +
    '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
});
await browser.close();
console.log(`manual/MANUAL.pdf generado.`);
