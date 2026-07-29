#!/usr/bin/env node
// Genera un SITIO NAVEGABLE (site/) a partir de todos los .md del repositorio:
// cada documento se renderiza a HTML con un menú lateral, tema claro/oscuro,
// tablas y bloques de código con estilo, y diagramas Mermaid renderizados.
// La portada (site/index.html) la produce scripts/build-landing.mjs; este
// generador crea todas las páginas de contenido y reescribe los enlaces .md → .html.
//
// Uso: node scripts/build-site.mjs   (requiere el paquete `marked`).

import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname, relative, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "vladimiracunadev-create";
const REPO = "blockchain-learning-path";
const BASE = `/${REPO}/`;
const GH = `https://github.com/${OWNER}/${REPO}`;

// --- Descubrir todos los .md a renderizar (espejo del árbol del repo) ----------
const SKIP_DIRS = new Set(["node_modules", "site", ".git", "dist", "out", "cache"]);
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".md")) out.push(posix.normalize(relative(ROOT, full).split("\\").join("/")));
  }
  return out;
}
const mdFiles = walk(ROOT).filter((p) => p !== "curriculum/MODULE_TEMPLATE.md");
const rendered = new Set(mdFiles); // rutas .md que existirán como .html

// --- Menú lateral (estructura curada) ------------------------------------------
const modTitle = (slug) => {
  const h1 = readFileSync(join(ROOT, "curriculum", slug, "README.md"), "utf8").split("\n").find((l) => l.startsWith("# ")) || slug;
  return h1.replace(/^#\s*/, "").trim();
};
const curriculumSlugs = readdirSync(join(ROOT, "curriculum")).filter((d) => /^\d{2}-/.test(d)).sort();
const industriaDocs = readdirSync(join(ROOT, "industria")).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort();

const hasManual = existsSync(join(ROOT, "manual", "MANUAL.pdf"));

const NAV = [
  { t: "🏠 Inicio", href: "index.html" },
  ...(hasManual ? [{ t: "📕 Manual (PDF)", href: "manual/MANUAL.pdf" }] : []),
  {
    t: "📚 Currículo", href: "curriculum/README.html",
    children: curriculumSlugs.map((s) => ({ t: modTitle(s), href: `curriculum/${s}/README.html` })),
  },
  {
    t: "🏭 Industria", href: "industria/README.html",
    children: industriaDocs.map((f) => ({ t: fileTitle(`industria/${f}`), href: `industria/${f.replace(/\.md$/, ".html")}` })),
  },
  {
    t: "🧪 Laboratorios", href: "labs/CATALOG.html",
    children: [
      { t: "Cuaderno de guías", href: "labs/guides/README.html" },
      { t: "01 · Fundamentos", href: "labs/guides/01-foundations.html" },
      { t: "02 · Consenso y Bitcoin", href: "labs/guides/02-consensus-bitcoin.html" },
      { t: "03 · Desarrollo EVM", href: "labs/guides/03-evm-development.html" },
      { t: "04 · Profesional y seguridad", href: "labs/guides/04-professional-security.html" },
      { t: "05 · Avanzado y capstone", href: "labs/guides/05-advanced-capstone.html" },
    ],
  },
  {
    t: "🏛️ Decisiones (ADR)", href: "adrs/README.html",
    children: readdirSync(join(ROOT, "adrs")).filter((f) => /^\d{3}-.*\.md$/.test(f)).sort()
      .map((f) => ({ t: fileTitle(`adrs/${f}`), href: `adrs/${f.replace(/\.md$/, ".html")}` })),
  },
  {
    t: "📖 Documentación", href: "docs/bibliografia.html",
    children: [
      ["Bibliografía", "docs/bibliografia.html"],
      ["Glosario", "docs/glosario.html"],
      ["Explicar a no técnicos", "docs/explicar-blockchain-a-no-tecnicos.html"],
      ["Mejores prácticas", "docs/mejores-practicas.html"],
      ["Mapa de tecnologías", "docs/tecnologias.html"],
      ["Despliegue local", "docs/despliegue-local.html"],
      ["Operación e incidentes", "docs/operacion-incidentes.html"],
      ["Recursos oficiales", "docs/recursos-oficiales.html"],
      ["Evaluación", "docs/evaluacion.html"],
      ["Ruta rápida", "docs/ruta-rapida.html"],
    ].map(([t, href]) => ({ t, href })),
  },
  {
    t: "🎓 Más", href: "capstone/README.html",
    children: [
      ["Capstone", "capstone/README.html"],
      ["Rutas por perfil", "learning-paths/README.html"],
      ["Guía del estudiante", "student/README.html"],
      ["Para instructores", "instructor/README.html"],
      ["Roadmap", "ROADMAP.html"],
    ].map(([t, href]) => ({ t, href })),
  },
];

function fileTitle(rel) {
  try {
    const h1 = readFileSync(join(ROOT, rel), "utf8").split("\n").find((l) => l.startsWith("# ")) || rel;
    return h1.replace(/^#\s*/, "").replace(/^[\p{Emoji}\s]+/u, "").trim() || rel;
  } catch { return rel; }
}

// --- Reescritura de enlaces .md → .html (o a GitHub si no se renderiza) ---------
function rewriteLinks(md, srcRel) {
  const srcDir = posix.dirname(srcRel);
  return md.replace(/\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (m, target, title = "") => {
    if (/^(https?:|mailto:|#|\/)/i.test(target)) return `](${target}${title})`;
    const [pathPart, anchor = ""] = target.split("#");
    const resolved = posix.normalize(posix.join(srcDir, pathPart));
    const anchorPart = anchor ? `#${anchor}` : "";
    if (rendered.has(resolved)) {
      return `](${target.replace(/\.md(#|$)/, ".html$1")}${title})`;
    }
    // No se renderiza (código, dir, yml…): apuntar a GitHub.
    let ghPath = resolved;
    const isDir = !posix.basename(resolved).includes(".");
    const url = `${GH}/${isDir ? "tree" : "blob"}/main/${ghPath}${anchorPart}`;
    return `](${url}${title})`;
  });
}

// --- Plantilla HTML ------------------------------------------------------------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function navHtml(currentHref) {
  const item = (n, depth) => {
    const active = n.href === currentHref ? ' class="active"' : "";
    const kids = n.children ? `<div class="sub">${n.children.map((c) => item(c, depth + 1)).join("")}</div>` : "";
    return `<a href="${BASE}${n.href}"${active}>${esc(n.t)}</a>${kids}`;
  };
  return NAV.map((n) => `<div class="grp">${item(n, 0)}</div>`).join("");
}

function page(title, bodyHtml, currentHref) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Blockchain Learning Path</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9B%93%EF%B8%8F%3C/text%3E%3C/svg%3E">
<style>
:root{--acento:#7c5cff;--acento2:#4c2fb0;--bg:#ffffff;--bg2:#f5f4fb;--txt:#1a1b26;--muted:#5b5f70;--card:#ffffff;--borde:#e6e4f0;--code:#f3f1fb}
@media (prefers-color-scheme:dark){:root{--bg:#0d1117;--bg2:#12131c;--txt:#e8e6f3;--muted:#9a9ab2;--card:#171826;--borde:#272a3d;--acento:#9b83ff;--code:#12131c}}
:root[data-theme="light"]{--bg:#ffffff;--bg2:#f5f4fb;--txt:#1a1b26;--muted:#5b5f70;--card:#ffffff;--borde:#e6e4f0;--acento:#7c5cff;--code:#f3f1fb}
:root[data-theme="dark"]{--bg:#0d1117;--bg2:#12131c;--txt:#e8e6f3;--muted:#9a9ab2;--card:#171826;--borde:#272a3d;--acento:#9b83ff;--code:#12131c}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--txt);line-height:1.65}
a{color:var(--acento);text-decoration:none}
a:hover{text-decoration:underline}
header.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:.6rem;padding:.7rem 1rem;background:linear-gradient(90deg,#3a2a8f,#7c5cff);color:#fff;box-shadow:0 2px 12px rgba(0,0,0,.15)}
header.top a{color:#fff;font-weight:700}
header.top .burger{font-size:1.3rem;cursor:pointer;background:none;border:0;color:#fff;display:none}
header.top .sp{flex:1}
.layout{display:flex;max-width:1280px;margin:0 auto}
nav.side{width:290px;flex:0 0 290px;border-right:1px solid var(--borde);padding:1rem .6rem 3rem;height:calc(100vh - 52px);position:sticky;top:52px;overflow-y:auto;background:var(--bg2)}
nav.side .grp{margin-bottom:.5rem}
nav.side a{display:block;color:var(--txt);padding:.32rem .6rem;border-radius:8px;font-size:.92rem}
nav.side a:hover{background:var(--card);text-decoration:none}
nav.side a.active{background:var(--acento);color:#fff;font-weight:600}
nav.side .sub{margin:.1rem 0 .4rem .5rem;border-left:2px solid var(--borde);padding-left:.4rem}
nav.side .sub a{font-size:.86rem;color:var(--muted)}
nav.side .sub a:hover{color:var(--txt)}
nav.side .sub a.active{color:#fff}
main{flex:1;min-width:0;padding:1.6rem 2rem 4rem;max-width:900px}
main h1{font-size:1.9rem;letter-spacing:-.4px;margin:.2rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid var(--borde)}
main h2{font-size:1.35rem;margin:2rem 0 .8rem}
main h3{font-size:1.1rem;margin:1.5rem 0 .6rem}
main table{border-collapse:collapse;width:100%;margin:1rem 0;font-size:.92rem;display:block;overflow-x:auto}
main th,main td{border:1px solid var(--borde);padding:.5rem .7rem;text-align:left;vertical-align:top}
main th{background:var(--bg2);font-weight:700}
main tr:nth-child(even) td{background:var(--bg2)}
main code{background:var(--code);padding:.12rem .4rem;border-radius:5px;font-size:.88em;font-family:ui-monospace,'Cascadia Code',Consolas,monospace}
main pre{background:var(--code);border:1px solid var(--borde);border-radius:10px;padding:1rem;overflow-x:auto}
main pre code{background:none;padding:0}
main pre.mermaid{background:var(--card);text-align:center;line-height:1.2}
main blockquote{margin:1rem 0;padding:.4rem 1rem;border-left:4px solid var(--acento);background:var(--bg2);border-radius:0 8px 8px 0;color:var(--muted)}
main img{max-width:100%}
main a{word-break:break-word}
.toggle{margin-left:.4rem;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.4);color:#fff;border-radius:999px;width:34px;height:34px;font-size:1rem;cursor:pointer}
@media (max-width:860px){
  nav.side{position:fixed;left:0;top:52px;transform:translateX(-100%);transition:transform .2s;z-index:15}
  nav.side.open{transform:translateX(0)}
  header.top .burger{display:block}
  main{padding:1.2rem 1rem 3rem}
}
</style>
<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
const dark = (document.documentElement.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))==="dark";
mermaid.initialize({startOnLoad:true,theme:dark?"dark":"default",securityLevel:"loose"});
</script>
</head>
<body>
<header class="top">
  <button class="burger" onclick="document.querySelector('nav.side').classList.toggle('open')">☰</button>
  <a href="${BASE}index.html">⛓️ Blockchain Learning Path</a>
  <span class="sp"></span>
  <a href="${GH}" title="Ver en GitHub">GitHub</a>
  <button class="toggle" title="Tema" onclick="var r=document.documentElement,d=(r.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));r.setAttribute('data-theme',d==='dark'?'light':'dark');location.reload()">🌓</button>
</header>
<div class="layout">
<nav class="side">${navHtml(currentHref)}</nav>
<main>${bodyHtml}</main>
</div>
</body>
</html>`;
}

// --- Render -------------------------------------------------------------------
marked.setOptions({ gfm: true, breaks: false });
let count = 0;
for (const rel of mdFiles) {
  const raw = readFileSync(join(ROOT, rel), "utf8");
  const md = rewriteLinks(raw, rel);
  let html = marked.parse(md);
  // Mermaid: <pre><code class="language-mermaid"> → <pre class="mermaid">
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (m, code) => `<pre class="mermaid">${code}</pre>`);
  const title = (raw.split("\n").find((l) => l.startsWith("# ")) || rel).replace(/^#\s*/, "").trim();
  const outHref = rel.replace(/\.md$/, ".html");
  const outPath = join(ROOT, "site", outHref);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page(title, html, outHref), "utf8");
  count++;
}
// Copiar el manual PDF al sitio si existe (para servirlo en GitHub Pages).
if (hasManual) {
  mkdirSync(join(ROOT, "site", "manual"), { recursive: true });
  copyFileSync(join(ROOT, "manual", "MANUAL.pdf"), join(ROOT, "site", "manual", "MANUAL.pdf"));
  console.log("site/manual/MANUAL.pdf copiado.");
}
console.log(`site: ${count} páginas de contenido generadas (menú + Mermaid + tema).`);
