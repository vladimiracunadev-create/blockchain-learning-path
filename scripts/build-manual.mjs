#!/usr/bin/env node
// Compila una edición de estudio autocontenida en manual/manual.html: portada,
// índice, 66 clases y material de apoyo curado, con enlaces internos y diagramas.
// scripts/render-manual-pdf.mjs lo convierte luego en manual/MANUAL.pdf.
//
// Uso: node scripts/build-manual.mjs   (requiere el paquete `marked`).

import { readFileSync, readdirSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { classFileName } from "./curriculum-lib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const SITE = "https://vladimiracunadev-create.github.io/blockchain-learning-path";
const GH = "https://github.com/vladimiracunadev-create/blockchain-learning-path";
const version = JSON.parse(read("package.json")).version;

const curriculumSlugs = readdirSync(join(ROOT, "curriculum")).filter((d) => /^\d{2}-/.test(d)).sort();
const classCatalog = JSON.parse(read("curriculum/classes.json"));
const classCount = classCatalog.flatMap((unit) => unit.classes).length;
const industriaDocs = readdirSync(join(ROOT, "industria")).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort();
const adrDocs = readdirSync(join(ROOT, "adrs")).filter((f) => /^\d{3}-.*\.md$/.test(f)).sort();
// Las cifras de la portada se calculan de los archivos reales: escritas a mano
// envejecen al primer bloque de clases o práctica que se añada.
const practiceCount = (read("labs/CATALOG.md").match(/^\| \d+ \|/gm) ?? []).length;

// Manifiesto ordenado del manual: partes → capítulos (rutas .md del repo).
const PARTS = [
  // La guía de entrada va justo después del README y antes del currículo: quien
  // imprime el manual y lo abre por el principio tiene que encontrarla ahí, igual
  // que en el sitio y en las apps.
  ["Introducción", ["docs/empieza-aqui.md", "docs/diseno-pedagogico.md"]],
  // Cada clase es un capítulo real. Los README temáticos se conservan como mapas
  // para no romper enlaces, pero nunca sustituyen a sus dos clases independientes.
  ["Currículo · 66 clases independientes", ["curriculum/README.md", ...curriculumSlugs.flatMap((s, index) =>
    classCatalog[index].classes.map((item) => `curriculum/${s}/${classFileName(item)}`))]],
  ["Responsabilidad, delitos y prevención", ["docs/y-si-cruzas-la-linea-blockchain.md",
    "docs/operacion-incidentes.md", "docs/threat-model-project.md"]],
  ["Industria", ["industria/README.md", ...industriaDocs.map((f) => `industria/${f}`)]],
  ["Laboratorios", ["labs/CATALOG.md", "labs/guides/01-foundations.md", "labs/guides/02-consensus-bitcoin.md",
    "labs/guides/03-evm-development.md", "labs/guides/04-professional-security.md", "labs/guides/05-advanced-capstone.md",
    "labs/guides/06-finanzas-onchain.md", "labs/guides/07-data-analytics.md",
    "labs/22-cbdc-mercado-tokenizado/README.md", "projects/explorador-analitico/README.md"]],
  ["Regulación", ["regulation/README.md", "regulation/chile/README.md", "regulation/european-union/README.md",
    "regulation/united-states/README.md", "regulation/latin-america/README.md", "regulation/international/README.md",
    "regulation/comparison/README.md"]],
  ["Casos reales", ["docs/casos-reales/README.md", "docs/casos-reales/orionx-descalce-custodia.md", "docs/casos-reales/terra-ust.md",
    "docs/casos-reales/ftx-custodia.md", "docs/casos-reales/ronin-puente.md",
    "docs/casos-reales/el-salvador-bitcoin.md"]],
  ["Decisiones de arquitectura (ADR)", ["adrs/README.md", ...adrDocs.map((f) => `adrs/${f}`)]],
  ["Documentación de referencia", [
    "docs/bibliografia.md", "docs/glosario.md", "docs/explicar-blockchain-a-no-tecnicos.md",
    "docs/mejores-practicas.md", "docs/tecnologias.md", "docs/despliegue-local.md",
    "docs/recursos-oficiales.md", "docs/evaluacion.md", "docs/ruta-rapida.md", "docs/chile-regulacion-tributacion.md",
    "docs/skills-matrix.md", "docs/wallets-desde-cero.md"]],
  ["Evaluación y proyecto final", ["assessments/checkpoints.md", "assessments/module-question-bank.md",
    "assessments/audit-report-template.md", "learning-paths/README.md", "capstone/README.md"]],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slugId = (rel) => rel.replace(/[^a-z0-9]+/gi, "-").replace(/-+/g, "-").toLowerCase();
const manualPaths = new Set(PARTS.flatMap(([, files]) => files));

function normalizedTarget(srcRel, target) {
  const srcDir = posix.dirname(srcRel);
  let resolved = posix.normalize(posix.join(srcDir, target));
  if (!posix.extname(resolved)) resolved = posix.join(resolved, "README.md");
  return resolved;
}

// Enlaces locales → URL del sitio (Pages) para que funcionen desde el PDF.
function rewriteLinks(md, srcRel) {
  return md.replace(/\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (m, target, title = "") => {
    if (/^(https?:|mailto:)/i.test(target)) return `](${target}${title})`;
    if (target.startsWith("#")) return `](#${slugId(srcRel)}${title})`;
    const [pathPart, anchor = ""] = target.split("#");
    const resolved = normalizedTarget(srcRel, pathPart);
    const anchorPart = anchor ? `#${anchor}` : "";
    if (manualPaths.has(resolved)) return `](#${slugId(resolved)}${title})`;
    if (resolved.endsWith(".md")) return `](${SITE}/${resolved.replace(/\.md$/, ".html")}${anchorPart}${title})`;
    return `](${GH}/blob/main/${resolved}${anchorPart}${title})`;
  });
}

function bookMarkdown(md) {
  // La navegación web final no aporta contenido al libro y suele crear una hoja
  // semivacía. La navegación entre clases del encabezado se conserva.
  return md.replace(/\n(?:---\n\n)?##[^\n]*Navegación[\s\S]*$/m, "\n").trim() + "\n";
}

const chapterTitle = (rel) => (read(rel).split("\n").find((l) => l.startsWith("# ")) || rel).replace(/^#\s*/, "").trim();

// --- Índice ---
let toc = "";
for (const [part, files] of PARTS) {
  toc += `<li class="tp">${esc(part)}<ul>`;
  for (const rel of files) toc += `<li><a href="#${slugId(rel)}">${esc(chapterTitle(rel))}</a></li>`;
  toc += `</ul></li>`;
}

// --- Capítulos ---
let body = "";
let n = 0;
for (const [part, files] of PARTS) {
  body += `<section class="part"><h1 class="parth">${esc(part)}</h1></section>`;
  for (const rel of files) {
    n++;
    let html = marked.parse(rewriteLinks(bookMarkdown(read(rel)), rel));
    html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
      (mm, code) => `<pre class="mermaid">${code}</pre>`);
    const className = /\/clase-\d+-/.test(rel) ? " chapter-class" : "";
    body += `<section class="chapter${className}" id="${slugId(rel)}">${html}</section>`;
  }
}

const out = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Blockchain Learning Path — Manual del usuario v${version}</title>
<style>
:root{--acento:#4c2fb0}
*{box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;color:#1a1b26;line-height:1.55;font-size:11pt;margin:0}
.cover{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;
  background:radial-gradient(1200px 520px at 50% 0,#8b6bff,#3a2a8f 60%,#170f38);color:#fff;padding:2cm;page-break-after:always}
.cover .logo{font-size:5rem}
.cover h1{font-size:2.8rem;margin:.4rem 0 .2rem;letter-spacing:-.5px}
.cover .sub{font-size:1.15rem;opacity:.92;max-width:16cm}
.cover .ver{margin-top:1.2rem;font-weight:700;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:.25rem .9rem}
.cover .foot{position:absolute;bottom:1.6cm;font-size:.85rem;opacity:.85}
.toc{page-break-after:always;padding:1cm 1.4cm}
.toc h2{font-size:1.6rem;border-bottom:2px solid var(--acento);padding-bottom:.3rem}
.toc ul{list-style:none;padding-left:0}
.toc .tp{font-weight:700;margin-top:.7rem}
.toc .tp ul{padding-left:.8cm;font-weight:400}
.toc a{color:#1a1b26;text-decoration:none}
.part{break-before:page;page-break-before:always;break-after:avoid-page;page-break-after:avoid}
.parth{background:var(--acento);color:#fff;padding:.6cm 1cm;font-size:1.9rem;border-radius:10px;margin:0 0 .4cm}
.chapter{padding:0 .3cm}
.chapter-class{break-before:page;page-break-before:always}
.part+.chapter{break-before:auto;page-break-before:auto}
.chapter h1{font-size:1.7rem;color:#2a1b6b;border-bottom:2px solid #ddd;padding-bottom:.2rem;margin-top:.2cm}
.chapter h2{font-size:1.28rem;margin-top:.7cm}
.chapter h3{font-size:1.08rem}
table{border-collapse:collapse;width:100%;margin:.4cm 0;font-size:9.5pt}
thead{display:table-header-group}
tr{break-inside:avoid;page-break-inside:avoid}
th,td{border:1px solid #ccc;padding:.28rem .45rem;text-align:left;vertical-align:top}
th{background:#f0edfb}
tr:nth-child(even) td{background:#f7f6fc}
code{background:#f3f1fb;padding:.05rem .3rem;border-radius:4px;font-family:'Cascadia Code',Consolas,monospace;font-size:9pt}
pre{background:#f6f5fb;border:1px solid #e2ddf3;border-radius:8px;padding:.5cm;overflow:hidden;white-space:pre-wrap;word-break:break-word;font-size:8.5pt;page-break-inside:avoid}
pre code{background:none;padding:0}
pre.mermaid{background:#fff;text-align:center}
pre.mermaid svg{max-width:100%;max-height:220mm;height:auto}
blockquote{margin:.4cm 0;padding:.2rem .8rem;border-left:4px solid var(--acento);background:#f5f3fb;color:#444}
a{color:#4c2fb0}
img{max-width:100%}
h1,h2,h3{break-after:avoid-page;page-break-after:avoid}
p,li{orphans:3;widows:3}
</style>
<script type="module">
import mermaid from "./assets/mermaid/mermaid.esm.min.mjs";
window.__mermaidDone = false;
await mermaid.run({ querySelector: "pre.mermaid" }).catch(()=>{});
window.__mermaidDone = true;
</script>
</head><body>
<div class="cover">
  <div class="logo">⛓️</div>
  <h1>Blockchain Learning Path</h1>
  <div class="sub">Manual del usuario · Programa educativo en español para aprender blockchain de cero a producción</div>
  <div class="ver">v${version}</div>
  <div class="foot">${classCount} clases · ${practiceCount} prácticas · ${GH}</div>
</div>
<div class="toc"><h2>Índice</h2><ul>${toc}</ul></div>
${body}
</body></html>`;

mkdirSync(join(ROOT, "manual"), { recursive: true });
cpSync(join(ROOT, "node_modules", "mermaid", "dist"), join(ROOT, "manual", "assets", "mermaid"), {
  recursive: true,
});
writeFileSync(join(ROOT, "manual", "manual.html"), out, "utf8");
console.log(`manual/manual.html generado — ${n} capítulos, v${version}`);
