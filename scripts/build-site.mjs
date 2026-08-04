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
// En GitHub Pages el sitio cuelga de /blockchain-learning-path/. Dentro de las
// apps de escritorio y Android el contenido se sirve desde la raíz, así que la
// base se puede cambiar por entorno:
//   SITE_BASE=/ node scripts/build-site.mjs   → bundle para las apps
const BASE = process.env.SITE_BASE ?? `/${REPO}/`;
// Y el destino también, para no pisar el sitio de Pages al generar el bundle.
const OUT = process.env.SITE_OUT ?? "site";
const GH = `https://github.com/${OWNER}/${REPO}`;

// --- Descubrir todos los .md a renderizar (espejo del árbol del repo) ----------
const SKIP_DIRS = new Set(["node_modules", "site", ".git", "dist", "out", "cache", "lib", "broadcast"]);
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
const curriculumHrefs = curriculumSlugs.map((s) => `curriculum/${s}/README.html`);
const industriaDocs = readdirSync(join(ROOT, "industria")).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort();

const hasManual = existsSync(join(ROOT, "manual", "MANUAL.pdf"));

const NAV = [
  { t: "🏠 Inicio", href: "index.html" },
  // Primera parada real del sitio: quien llega sin base necesita esta página
  // antes que el índice del currículo.
  { t: "🌱 Empieza aquí", href: "docs/empieza-aqui.html" },
  { t: "📖 Glosario", href: "docs/glosario.html" },
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
  { t: "🧠 Autoevaluación", href: "autoevaluacion.html" },
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
    const ghPath = resolved;
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
/* Buscador */
.search{position:relative}
.search input{width:210px;max-width:42vw;padding:.4rem .7rem;border-radius:999px;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.15);color:#fff;font-size:.9rem}
.search input::placeholder{color:rgba(255,255,255,.75)}
.results{position:absolute;top:2.4rem;right:0;width:min(420px,80vw);max-height:60vh;overflow-y:auto;background:var(--card);border:1px solid var(--borde);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:none;z-index:30}
.results.open{display:block}
.results a{display:block;padding:.55rem .8rem;border-bottom:1px solid var(--borde);color:var(--txt)}
.results a:hover{background:var(--bg2);text-decoration:none}
.results .rt{font-weight:600;font-size:.92rem}
.results .rx{font-size:.8rem;color:var(--muted);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.results .empty{padding:.7rem .8rem;color:var(--muted);font-size:.88rem}
/* Progreso */
.prog{margin:.2rem .4rem .8rem;padding:.5rem .6rem;background:var(--card);border:1px solid var(--borde);border-radius:10px;font-size:.82rem;color:var(--muted)}
.prog .bar{height:7px;background:var(--bg);border-radius:99px;overflow:hidden;margin-top:.35rem;border:1px solid var(--borde)}
.prog .bar > i{display:block;height:100%;background:linear-gradient(90deg,var(--acento),#2e8b57);width:0}
nav.side a .done{color:#2e8b57;font-weight:700}
.readbtn{display:inline-flex;align-items:center;gap:.4rem;margin:.2rem 0 1rem;padding:.4rem .9rem;border-radius:999px;border:1px solid var(--borde);background:var(--bg2);color:var(--txt);font-size:.9rem;cursor:pointer}
.readbtn.on{background:#2e8b57;color:#fff;border-color:#2e8b57}
.qm{border:1px solid var(--borde);border-radius:12px;padding:.9rem 1rem;margin:0 0 .9rem;background:var(--card)}
.qm legend{font-weight:600;padding:0 .4rem;line-height:1.4}
.qm-op{display:block;padding:.45rem .6rem;margin:.25rem 0;border:1px solid var(--borde);border-radius:8px;cursor:pointer;background:var(--bg)}
.qm-op:hover{border-color:var(--acento)}
.qm-op.qm-ok{background:rgba(46,139,87,.16);border-color:#2e8b57}
.qm-op.qm-mal{background:rgba(220,70,70,.16);border-color:#dc4646}
.qm-exp{margin:.6rem 0 0;padding:.55rem .7rem;border-left:3px solid var(--acento);background:var(--bg2);border-radius:0 8px 8px 0;color:var(--muted);font-size:.92rem}
.qm-btn{padding:.5rem 1.1rem;border-radius:999px;border:1px solid var(--acento);background:var(--acento);color:#fff;font-size:.95rem;cursor:pointer}
.qm-btn.qm-reset{background:transparent;color:var(--txt);border-color:var(--borde)}
.qm-out{font-weight:600;margin:.4rem 0}
.qm-out.qm-aprob{color:#2e8b57}
.qm-out.qm-susp{color:#dc4646}
.qm-previo{font-size:.88rem;color:var(--muted);margin:.2rem 0 .8rem}
.modnav{display:flex;gap:.6rem;justify-content:space-between;align-items:stretch;margin:2rem 0 .5rem;flex-wrap:wrap}
.modnav a{flex:1 1 240px;display:flex;flex-direction:column;gap:.15rem;padding:.7rem .9rem;border:1px solid var(--borde);border-radius:12px;background:var(--card);color:var(--txt)}
.modnav a:hover{border-color:var(--acento)}
.modnav a.next{text-align:right;align-items:flex-end}
.modnav .dir{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.modnav .ttl{font-weight:600;line-height:1.3}
@media (max-width:860px){
  .search input{width:130px}
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
  <div class="search">
    <input id="q" type="search" placeholder="🔎 Buscar…" autocomplete="off" aria-label="Buscar en el sitio">
    <div class="results" id="results"></div>
  </div>
  <a href="${GH}" title="Ver en GitHub">GitHub</a>
  <button class="toggle" title="Tema" onclick="var r=document.documentElement,d=(r.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));r.setAttribute('data-theme',d==='dark'?'light':'dark');location.reload()">🌓</button>
</header>
<div class="layout">
<nav class="side"><div class="prog" id="prog" hidden>📈 Progreso del currículo: <b id="progn">0/${curriculumHrefs.length}</b><div class="bar"><i id="progbar"></i></div></div>${navHtml(currentHref)}</nav>
<main><button class="readbtn" id="readbtn" hidden>Marcar como leído</button>${bodyHtml}</main>
</div>
<script>
(function(){
  var BASE=${JSON.stringify(BASE)}, CURR=${JSON.stringify(curriculumHrefs)}, HERE=${JSON.stringify(currentHref)};
  var KEY="blp-progress";
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } }
  function save(a){ localStorage.setItem(KEY, JSON.stringify(a)); }
  var done=load();
  // Marca en el menú lo ya leído y actualiza la barra de progreso.
  function refresh(){
    document.querySelectorAll('nav.side a').forEach(function(a){
      var h=a.getAttribute('href')||""; h=h.replace(BASE,"");
      var old=a.querySelector('.done'); if(old) old.remove();
      if(done.indexOf(h)>=0 && h!=="index.html"){ var s=document.createElement('span'); s.className='done'; s.textContent=' ✓'; a.appendChild(s); }
    });
    var n=CURR.filter(function(h){return done.indexOf(h)>=0;}).length;
    var p=document.getElementById('prog'); if(p){ p.hidden=false; document.getElementById('progn').textContent=n+"/"+CURR.length; document.getElementById('progbar').style.width=(100*n/CURR.length)+"%"; }
  }
  // Botón "leído" en páginas de contenido (no en la portada).
  var btn=document.getElementById('readbtn');
  if(btn && HERE!=="index.html"){
    btn.hidden=false;
    function paint(){ var on=done.indexOf(HERE)>=0; btn.classList.toggle('on',on); btn.textContent=on?"✓ Leído":"Marcar como leído"; }
    paint();
    btn.addEventListener('click',function(){ var i=done.indexOf(HERE); if(i>=0) done.splice(i,1); else done.push(HERE); save(done); paint(); refresh(); });
  }
  refresh();
  // Buscador sobre busqueda.json.
  var q=document.getElementById('q'), box=document.getElementById('results'), idx=null;
  function esc(s){ return s.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function run(){
    var t=q.value.trim().toLowerCase();
    if(t.length<2){ box.classList.remove('open'); box.innerHTML=""; return; }
    if(!idx){ box.classList.add('open'); box.innerHTML='<div class="empty">Cargando índice…</div>'; return; }
    var hits=idx.map(function(d){
      var hay=(d.t+" "+d.x).toLowerCase(); var s=0; t.split(/\\s+/).forEach(function(w){ if(d.t.toLowerCase().indexOf(w)>=0)s+=3; else if(hay.indexOf(w)>=0)s+=1; });
      return {d:d,s:s};
    }).filter(function(h){return h.s>0;}).sort(function(a,b){return b.s-a.s;}).slice(0,12);
    if(!hits.length){ box.classList.add('open'); box.innerHTML='<div class="empty">Sin resultados para "'+esc(t)+'"</div>'; return; }
    box.innerHTML=hits.map(function(h){ return '<a href="'+BASE+h.d.u+'"><span class="rt">'+esc(h.d.t)+'</span><span class="rx">'+esc(h.d.x.slice(0,110))+'…</span></a>'; }).join("");
    box.classList.add('open');
  }
  if(q){
    q.addEventListener('focus',function(){ if(!idx){ fetch(BASE+'busqueda.json').then(function(r){return r.json();}).then(function(j){ idx=j; run(); }).catch(function(){}); } });
    q.addEventListener('input',run);
    document.addEventListener('click',function(e){ if(!e.target.closest('.search')) box.classList.remove('open'); });
  }
})();
</script>
</body>
</html>`;
}

// --- Autoevaluación al cierre de cada módulo ----------------------------------
// Cada página de módulo termina con sus propias preguntas. La corrección ocurre
// en el navegador y el resultado se guarda en localStorage por módulo, así que
// el sitio sigue siendo estático y funciona igual dentro de las apps offline.
const QUIZZES = existsSync(join(ROOT, "assessments", "module-quizzes.json"))
  ? JSON.parse(readFileSync(join(ROOT, "assessments", "module-quizzes.json"), "utf8"))
  : { modules: {}, aprobado: 75 };

// Barra "anterior / siguiente" al pie de cada módulo. Se genera a partir del
// orden real de las carpetas, así que añadir un módulo reenlaza la cadena sola:
// no hay que acordarse de editar los vecinos.
function navDeModulo(rel) {
  const match = /^curriculum\/(\d{2}-[a-z0-9-]+)\/README\.md$/.exec(rel);
  if (!match) return "";
  const i = curriculumSlugs.indexOf(match[1]);
  if (i === -1) return "";

  const anterior = i > 0
    ? { href: `${BASE}curriculum/${curriculumSlugs[i - 1]}/README.html`, t: modTitle(curriculumSlugs[i - 1]) }
    : { href: `${BASE}index.html`, t: "Inicio del programa" };
  const siguiente = i < curriculumSlugs.length - 1
    ? { href: `${BASE}curriculum/${curriculumSlugs[i + 1]}/README.html`, t: modTitle(curriculumSlugs[i + 1]) }
    : { href: `${BASE}capstone/README.html`, t: "Proyecto final" };

  return `
<nav class="modnav" aria-label="Navegación entre módulos">
  <a class="prev" href="${anterior.href}" rel="prev"><span class="dir">⬅️ Anterior</span><span class="ttl">${esc(anterior.t)}</span></a>
  <a class="next" href="${siguiente.href}" rel="next"><span class="dir">Siguiente ➡️</span><span class="ttl">${esc(siguiente.t)}</span></a>
</nav>`;
}

function quizDelModulo(rel) {
  const match = /^curriculum\/(\d{2}-[a-z0-9-]+)\/README\.md$/.exec(rel);
  const quiz = match && QUIZZES.modules[match[1]];
  if (!quiz) return "";
  // Escapamos "<" dentro del JSON para que ningún texto pueda cerrar el <script>.
  const datos = JSON.stringify(quiz.preguntas).replace(/</g, "\\u003c");
  return `
<hr>
<h2 id="autoevaluacion">🧠 Autoevaluación del módulo</h2>
<p>Responde sin volver atrás. Cada opción incorrecta corresponde a un error frecuente
documentado en este mismo módulo: si fallas, la explicación te dice qué releer.</p>
<div class="quiz-mod" id="quiz-mod"></div>
<script>
(function(){
  var PREGUNTAS = ${datos};
  var CLAVE = "blp-quiz-${match[1]}";
  var APROBADO = ${Number(QUIZZES.aprobado) || 75};
  var caja = document.getElementById("quiz-mod");
  if (!caja) return;

  var html = "";
  for (var i = 0; i < PREGUNTAS.length; i++) {
    var p = PREGUNTAS[i];
    html += '<fieldset class="qm"><legend>' + (i + 1) + ". " + escapar(p.prompt) + "</legend>";
    for (var o = 0; o < p.options.length; o++) {
      var id = "qm" + i + "o" + o;
      html += '<label class="qm-op" id="lbl-' + id + '"><input type="radio" name="qm' + i + '" value="' + o + '"> ' + escapar(p.options[o]) + "</label>";
    }
    html += '<p class="qm-exp" id="qm-exp' + i + '" hidden></p></fieldset>';
  }
  html += '<p><button type="button" class="qm-btn" id="qm-check">Comprobar respuestas</button> <button type="button" class="qm-btn qm-reset" id="qm-reset" hidden>Intentar de nuevo</button></p><p class="qm-out" id="qm-out" role="status"></p>';
  caja.innerHTML = html;

  function escapar(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  document.getElementById("qm-check").addEventListener("click", function(){
    var aciertos = 0, sinResponder = 0;
    for (var i = 0; i < PREGUNTAS.length; i++) {
      var p = PREGUNTAS[i];
      var sel = caja.querySelector('input[name="qm' + i + '"]:checked');
      var exp = document.getElementById("qm-exp" + i);
      for (var o = 0; o < p.options.length; o++) {
        var lbl = document.getElementById("lbl-qm" + i + "o" + o);
        lbl.classList.remove("qm-ok", "qm-mal");
        if (o === p.answer) lbl.classList.add("qm-ok");
      }
      if (!sel) { sinResponder++; }
      else {
        var elegida = parseInt(sel.value, 10);
        if (elegida === p.answer) aciertos++;
        else document.getElementById("lbl-qm" + i + "o" + elegida).classList.add("qm-mal");
      }
      exp.textContent = p.explanation;
      exp.hidden = false;
    }
    var pct = Math.round(100 * aciertos / PREGUNTAS.length);
    var salida = document.getElementById("qm-out");
    salida.textContent = aciertos + "/" + PREGUNTAS.length + " (" + pct + "%) — " +
      (pct >= APROBADO ? "módulo superado." : "repasa lo marcado antes de seguir.") +
      (sinResponder ? " Dejaste " + sinResponder + " sin responder." : "");
    salida.className = "qm-out " + (pct >= APROBADO ? "qm-aprob" : "qm-susp");
    document.getElementById("qm-reset").hidden = false;
    try {
      var previo = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (!previo || pct > previo.pct) localStorage.setItem(CLAVE, JSON.stringify({ pct: pct, de: PREGUNTAS.length }));
    } catch (e) {}
  });

  document.getElementById("qm-reset").addEventListener("click", function(){
    caja.querySelectorAll('input[type="radio"]').forEach(function(r){ r.checked = false; });
    caja.querySelectorAll(".qm-op").forEach(function(l){ l.classList.remove("qm-ok","qm-mal"); });
    caja.querySelectorAll(".qm-exp").forEach(function(e){ e.hidden = true; });
    document.getElementById("qm-out").textContent = "";
    document.getElementById("qm-reset").hidden = true;
  });

  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE) || "null");
    if (guardado) {
      var aviso = document.createElement("p");
      aviso.className = "qm-previo";
      aviso.textContent = "Tu mejor resultado en este módulo: " + guardado.pct + "%.";
      caja.parentNode.insertBefore(aviso, caja);
    }
  } catch (e) {}
})();
</script>`;
}

// --- Render -------------------------------------------------------------------
marked.setOptions({ gfm: true, breaks: false });
const searchIndex = [];
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
  const outPath = join(ROOT, OUT, outHref);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page(title, html + quizDelModulo(rel) + navDeModulo(rel), outHref), "utf8");
  // Índice de búsqueda: título + texto plano (sin HTML, recortado). Se calcula
  // ANTES de añadir la autoevaluación: si no, buscar un término del temario
  // devolvería la pregunta —y su respuesta— en vez del contenido.
  const plain = html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
  searchIndex.push({ t: title, u: outHref, x: plain.slice(0, 600) });
  count++;
}
writeFileSync(join(ROOT, OUT, "busqueda.json"), JSON.stringify(searchIndex), "utf8");

// Página de autoevaluación interactiva a partir del banco de preguntas.
if (existsSync(join(ROOT, "assessments", "quiz.json"))) {
  const quiz = JSON.parse(readFileSync(join(ROOT, "assessments", "quiz.json"), "utf8"));
  const quizBody = `<h1>🧠 ${esc(quiz.title)}</h1>
<p>${esc(quiz.description)}</p>
<div id="quiz-app"></div>
<script>
var QUIZ = ${JSON.stringify(quiz.questions)};
(function(){
  var app = document.getElementById("quiz-app");
  var form = document.createElement("form");
  QUIZ.forEach(function(q, i){
    var fs = document.createElement("fieldset");
    fs.style.cssText = "border:1px solid var(--borde);border-radius:12px;padding:1rem;margin:0 0 1rem";
    var lg = document.createElement("legend");
    lg.style.cssText = "font-weight:600;padding:0 .4rem";
    lg.textContent = (i+1) + ". [" + q.etapa + "] " + q.prompt;
    fs.appendChild(lg);
    q.options.forEach(function(opt, j){
      var id = "q" + i + "o" + j;
      var lab = document.createElement("label");
      lab.id = "lab-" + id;
      lab.style.cssText = "display:block;padding:.35rem .5rem;border-radius:8px;cursor:pointer";
      var inp = document.createElement("input");
      inp.type = "radio"; inp.name = "q" + i; inp.value = j; inp.id = id;
      inp.style.marginRight = ".5rem";
      lab.appendChild(inp);
      lab.appendChild(document.createTextNode(opt));
      fs.appendChild(lab);
    });
    var exp = document.createElement("div");
    exp.id = "exp-" + i;
    exp.style.cssText = "display:none;margin-top:.5rem;font-size:.9rem;color:var(--muted);border-left:3px solid var(--acento);padding-left:.6rem";
    fs.appendChild(exp);
    form.appendChild(fs);
  });
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "readbtn"; btn.textContent = "Corregir";
  var out = document.createElement("div");
  out.style.cssText = "font-size:1.1rem;font-weight:700;margin:1rem 0";
  form.appendChild(btn); form.appendChild(out);
  app.appendChild(form);

  btn.addEventListener("click", function(){
    var score = 0, answered = 0;
    QUIZ.forEach(function(q, i){
      var sel = form.querySelector('input[name="q'+i+'"]:checked');
      var exp = document.getElementById("exp-" + i);
      q.options.forEach(function(_, j){
        var lab = document.getElementById("lab-q"+i+"o"+j);
        lab.style.background = ""; lab.style.color = "";
        if (j === q.answer){ lab.style.background = "rgba(46,139,87,.18)"; }
      });
      if (sel){
        answered++;
        var pick = parseInt(sel.value, 10);
        if (pick === q.answer){ score++; }
        else { var bad = document.getElementById("lab-q"+i+"o"+pick); bad.style.background = "rgba(220,70,70,.18)"; }
      }
      exp.style.display = "block";
      exp.textContent = "✔ " + q.explanation;
    });
    var pct = Math.round(100 * score / QUIZ.length);
    out.textContent = "Puntuación: " + score + "/" + QUIZ.length + " (" + pct + "%)" + (pct >= 80 ? " — ¡aprobado!" : " — repasa lo marcado.");
    out.style.color = pct >= 80 ? "#2e8b57" : "var(--acento)";
    try {
      var best = parseInt(localStorage.getItem("blp-quiz-best") || "0", 10);
      if (score > best){ localStorage.setItem("blp-quiz-best", String(score)); }
    } catch(e){}
    out.scrollIntoView({ block: "center" });
  });
})();
</script>`;
  writeFileSync(join(ROOT, OUT, "autoevaluacion.html"), page(quiz.title, quizBody, "autoevaluacion.html"), "utf8");
}
// Copiar el manual PDF al sitio si existe (para servirlo en GitHub Pages).
if (hasManual) {
  mkdirSync(join(ROOT, OUT, "manual"), { recursive: true });
  copyFileSync(join(ROOT, "manual", "MANUAL.pdf"), join(ROOT, OUT, "manual", "MANUAL.pdf"));
  console.log(`${OUT}/manual/MANUAL.pdf copiado.`);
}
console.log(`${OUT}: ${count} páginas de contenido generadas (menú + Mermaid + tema).`);
