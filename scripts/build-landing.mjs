#!/usr/bin/env node
// Genera la landing page del programa (site/index.html) a partir de los datos
// reales del repositorio: los módulos del currículo y su título, y los conteos
// de prácticas, ADRs y documentos. Sin dependencias externas: se ejecuta con
// `node scripts/build-landing.mjs` tanto en local como en CI.
//
// La identidad visual replica la de los programas hermanos (hero con gradiente,
// stats, grid de features y de módulos, tema claro/oscuro) en clave blockchain.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// --- Datos reales del repositorio ---------------------------------------------

// Módulos: cada carpeta curriculum/NN-* con el H1 de su README como título.
const MODULE_EMOJI = ["🧭","🔐","🌐","🤝","₿","⟠","📜","🖥️","🪙","🛡️","🔮","🏛️","⚡","🔗","🕶️","🏗️","⚙️","🏦","🏢"];
const modules = readdirSync(join(ROOT, "curriculum"))
  .filter((d) => /^\d{2}-/.test(d))
  .sort()
  .map((d, i) => {
    const h1 = read(`curriculum/${d}/README.md`).split("\n").find((l) => l.startsWith("# ")) || "";
    const title = h1.replace(/^#\s*/, "").replace(/^\d+\s*·\s*/, "").trim();
    const num = d.slice(0, 2);
    return { num, title, emoji: MODULE_EMOJI[i] || "📦", href: `curriculum/${d}/README.md` };
  });

const catalog = read("labs/CATALOG.md");
const practiceCount = (catalog.match(/^\| \d+/gm) || []).length;
const adrCount = readdirSync(join(ROOT, "adrs")).filter((f) => /^\d{3}-.*\.md$/.test(f)).length;
const docCount = readdirSync(join(ROOT, "docs")).filter((f) => f.endsWith(".md")).length;
const industryCount = readdirSync(join(ROOT, "industria")).filter((f) => /^\d{2}-.*\.md$/.test(f)).length;
const pkg = JSON.parse(read("package.json"));
const version = pkg.version;

// --- Componentes ---------------------------------------------------------------

const REPO = "https://github.com/vladimiracunadev-create/blockchain-learning-path";

const stats = [
  [modules.length, "módulos"],
  [practiceCount, "prácticas"],
  [industryCount, "docs de industria"],
  [adrCount, "decisiones (ADR)"],
  [docCount, "documentos"],
];

const features = [
  ["📚", "Currículo completo", `${modules.length} módulos progresivos, de criptografía a la implementación empresarial, cada uno con teoría, laboratorio y verificación.`, "curriculum/README.md"],
  ["🧪", "Laboratorios ejecutables", `${practiceCount} prácticas guiadas con actividad, evidencia y criterio de aceptación. Corren en local o testnet.`, "labs/CATALOG.md"],
  ["🧭", "Rutas por perfil", "Recorridos ordenados para desarrollo, arquitectura, auditoría, producto, investigación y empresa.", "learning-paths/README.md"],
  ["📜", "Solidity + Foundry", "Contratos con pruebas, fuzzing e invariantes. Vault, protocolos, token, oráculo y gobernador con timelock.", "labs/06-solidity-vault"],
  ["🛡️", "Retos de seguridad", "Contratos vulnerables y sus correcciones: reentrancy, control de acceso, overflow y más, con criterios de revisión.", "security-challenges/README.md"],
  ["🧩", "dApp e indexador", "Aplicación de financiamiento comunitario con viem/TypeScript e indexador de eventos con checkpoint.", "apps/community-funding-web"],
  ["📝", "Evaluaciones", "Diagnóstico, checkpoints, banco de preguntas y plantilla de informe de auditoría para medir tu avance.", "assessments/checkpoints.md"],
  ["🏭", "Industria y negocio", "Cómo se construye una red, el stack real, los equipos, casos empresariales con éxitos y fracasos, y modelos de negocio.", "industria/README.md"],
  ["🏛️", "Decisiones de arquitectura", `${adrCount} ADR que comparan blockchain vs. base de datos, pública vs. permisionada, on/off-chain, L1/L2 y más.`, "adrs/README.md"],
  ["🎓", "Proyecto integrador", "Un capstone documentado, probado y desplegable con Foundry: del diseño a la defensa técnica.", "capstone/README.md"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Enlace interno al sitio navegable (.html) generado por build-site.mjs.
// Un directorio (sin extensión) apunta a su README.html.
const local = (href) => href.endsWith(".md") ? href.replace(/\.md$/, ".html") : `${href}/README.html`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blockchain Learning Path — programa educativo en español</title>
<meta name="description" content="Programa educativo en español para aprender blockchain de cero a producción: ${modules.length} módulos, ${practiceCount} prácticas, laboratorios ejecutables, evaluaciones y proyecto integrador.">
<meta property="og:title" content="Blockchain Learning Path">
<meta property="og:description" content="${modules.length} módulos · ${practiceCount} prácticas · de cero a producción. Criptografía, Bitcoin, Ethereum/EVM, Solidity, dApps, seguridad, L2, DAO, infraestructura y empresa.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9B%93%EF%B8%8F%3C/text%3E%3C/svg%3E">
<style>
:root{
  --acento:#7c5cff; --acento2:#4c2fb0; --verde:#2e8b57;
  --bg:#ffffff; --bg2:#f5f4fb; --txt:#12131a; --muted:#5b5f70; --card:#ffffff; --borde:#e6e4f0;
}
@media (prefers-color-scheme:dark){
  :root{ --bg:#0d1117; --bg2:#12131c; --txt:#e8e6f3; --muted:#9a9ab2; --card:#171826; --borde:#272a3d; --acento:#9b83ff; }
}
:root[data-theme="light"]{ --bg:#ffffff; --bg2:#f5f4fb; --txt:#12131a; --muted:#5b5f70; --card:#ffffff; --borde:#e6e4f0; --acento:#7c5cff; }
:root[data-theme="dark"]{ --bg:#0d1117; --bg2:#12131c; --txt:#e8e6f3; --muted:#9a9ab2; --card:#171826; --borde:#272a3d; --acento:#9b83ff; }
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  background:var(--bg);color:var(--txt);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:1040px;margin:0 auto;padding:0 1.1rem}
/* Hero */
.hero{position:relative;overflow:hidden;color:#fff;text-align:center;padding:4.6rem 1.1rem 3.4rem;
  background:radial-gradient(1200px 520px at 50% -10%,#8b6bff 0%,#3a2a8f 55%,#170f38 100%)}
.hero::after{content:"";position:absolute;inset:0;opacity:.12;
  background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);
  background-size:34px 34px;mask-image:radial-gradient(circle at 50% 0,#000,transparent 75%)}
.hero>*{position:relative;z-index:1}
.hero .escudo{font-size:3.3rem;line-height:1}
.hero h1{font-size:clamp(1.9rem,4.6vw,3.1rem);margin:.4rem 0 .3rem;font-weight:800;letter-spacing:-.5px}
.hero .ver{display:inline-block;margin:.2rem 0 .5rem;font-size:.8rem;font-weight:700;letter-spacing:.5px;
  background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:.15rem .7rem}
.hero .sub{font-size:clamp(1rem,2.2vw,1.25rem);opacity:.93;max-width:660px;margin:0 auto 1.4rem}
.chips{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:1.6rem}
.chip{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:999px;
  padding:.28rem .8rem;font-size:.85rem;font-weight:600;backdrop-filter:blur(4px)}
.cta{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center}
.btn{display:inline-block;padding:.7rem 1.3rem;border-radius:10px;font-weight:700;font-size:1rem;transition:transform .08s ease,box-shadow .2s}
.btn:hover{transform:translateY(-2px)}
.btn-1{background:#fff;color:#3a2a8f;box-shadow:0 6px 20px rgba(0,0,0,.28)}
.btn-2{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.5)}
/* Aviso */
.aviso{background:var(--bg2);border-bottom:1px solid var(--borde);font-size:.9rem;color:var(--muted)}
.aviso .wrap{padding:.7rem 1.1rem;text-align:center}
/* Stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin:2.6rem 0}
.stat{background:var(--card);border:1px solid var(--borde);border-radius:14px;padding:1.1rem;text-align:center}
.stat b{display:block;font-size:1.9rem;color:var(--acento);font-weight:800;line-height:1}
.stat span{font-size:.85rem;color:var(--muted)}
/* Secciones */
h2.sec{font-size:1.5rem;margin:2.8rem 0 1.1rem;font-weight:800}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem}
.feat{background:var(--card);border:1px solid var(--borde);border-radius:14px;padding:1.2rem;transition:border-color .2s,transform .08s}
.feat:hover{border-color:var(--acento);transform:translateY(-2px)}
.feat .ic{font-size:1.7rem}
.feat h3{margin:.5rem 0 .3rem;font-size:1.08rem}
.feat p{margin:0;color:var(--muted);font-size:.92rem}
/* Módulos */
.parts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.8rem}
.part{display:flex;gap:.75rem;align-items:center;background:var(--card);border:1px solid var(--borde);
  border-radius:12px;padding:.8rem .9rem;transition:border-color .2s,transform .08s}
.part:hover{border-color:var(--acento);transform:translateY(-2px)}
.part .num{flex:0 0 auto;width:40px;height:40px;border-radius:10px;display:grid;place-items:center;
  font-size:1.15rem;color:#fff;background:linear-gradient(135deg,var(--acento),var(--acento2))}
.part .t{font-size:.92rem;font-weight:600;line-height:1.25}
.part .c{font-size:.78rem;color:var(--muted)}
/* Ruta */
.path{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.8rem;margin-top:1rem}
.step{background:var(--card);border:1px solid var(--borde);border-left:4px solid var(--acento);border-radius:12px;padding:1rem}
.step b{display:block;font-size:.8rem;color:var(--acento);text-transform:uppercase;letter-spacing:.5px}
.step p{margin:.3rem 0 0;font-size:.92rem;color:var(--muted)}
/* Footer */
footer{margin-top:3rem;border-top:1px solid var(--borde);background:var(--bg2)}
footer .wrap{padding:2.2rem 1.1rem;text-align:center;color:var(--muted);font-size:.9rem}
footer a{color:var(--acento);font-weight:600}
.toggle{position:fixed;top:1rem;right:1rem;z-index:5;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.4);
  color:#fff;border-radius:999px;width:38px;height:38px;font-size:1.1rem;cursor:pointer}
</style>
</head>
<body>
<button class="toggle" id="tema" title="Cambiar tema" aria-label="Cambiar tema">🌓</button>
<header class="hero">
  <div class="escudo">⛓️</div>
  <div class="ver">v${version}</div>
  <h1>Blockchain Learning Path</h1>
  <p class="sub">Programa educativo en español para aprender blockchain <strong>de cero a producción</strong>: criptografía, Bitcoin, Ethereum/EVM, Solidity, dApps, tokens, seguridad, L2, DAO y arquitectura.</p>
  <div class="chips">
    <span class="chip">🔐 Fundamentos</span>
    <span class="chip">₿ Bitcoin</span>
    <span class="chip">⟠ Ethereum/EVM</span>
    <span class="chip">📜 Solidity + Foundry</span>
    <span class="chip">🛡️ Seguridad</span>
    <span class="chip">🏛️ DAO &amp; arquitectura</span>
  </div>
  <div class="cta">
    <a class="btn btn-1" href="curriculum/README.html">🚀 Empezar</a>
    <a class="btn btn-2" href="manual/MANUAL.pdf">📕 Manual (PDF)</a>
    <a class="btn btn-2" href="${REPO}">⭐ Ver en GitHub</a>
  </div>
</header>

<div class="aviso"><div class="wrap">⚠️ Material educativo. No uses fondos ni claves privadas reales: todos los laboratorios se ejecutan en local (Anvil) o testnet. No es asesoría financiera, tributaria ni legal.</div></div>

<main class="wrap">
  <div class="stats">
    ${stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("\n    ")}
  </div>

  <h2 class="sec">Qué incluye</h2>
  <div class="grid">
    ${features.map(([ic, t, d, href]) => `<a class="feat" href="${local(href)}"><div class="ic">${ic}</div><h3>${t}</h3><p>${esc(d)}</p></a>`).join("\n    ")}
  </div>

  <h2 class="sec">Los ${modules.length} módulos</h2>
  <div class="parts">
    ${modules.map((m) => `<a class="part" href="${local(m.href)}"><div class="num">${m.emoji}</div><div><div class="t">${esc(m.title)}</div><div class="c">Módulo ${m.num}</div></div></a>`).join("\n    ")}
  </div>

  <h2 class="sec">Cómo se aprende</h2>
  <div class="path">
    <div class="step"><b>1 · Comprender</b><p>Conceptos y modelo mental de cada tema.</p></div>
    <div class="step"><b>2 · Experimentar</b><p>Un laboratorio pequeño y ejecutable.</p></div>
    <div class="step"><b>3 · Explicar</b><p>Registras qué ocurrió y por qué.</p></div>
    <div class="step"><b>4 · Construir</b><p>Aplicas el concepto en un proyecto.</p></div>
    <div class="step"><b>5 · Verificar</b><p>Pruebas, amenazas y revisión.</p></div>
  </div>
</main>

<footer>
  <div class="wrap">
    <p><strong>Blockchain Learning Path</strong> · v${version} · Código <a href="${REPO}/blob/main/LICENSE">MIT</a> · Contenido <a href="${REPO}/blob/main/LICENSE-CONTENT">CC BY 4.0</a></p>
    <p>Hecho por <a href="https://github.com/vladimiracunadev-create">Vladimir Acuña</a> · <a href="${REPO}">Repositorio</a> · <a href="manual/MANUAL.pdf">Manual (PDF)</a> · <a href="ROADMAP.html">Roadmap</a> · <a href="industria/README.html">Industria</a> · <a href="labs/CATALOG.html">Laboratorios</a></p>
  </div>
</footer>

<script>
  (function(){
    var b=document.getElementById('tema');
    b.addEventListener('click',function(){
      var cur=document.documentElement.getAttribute('data-theme');
      var dark=cur?cur==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;
      document.documentElement.setAttribute('data-theme',dark?'light':'dark');
    });
  })();
</script>
</body>
</html>
`;

mkdirSync(join(ROOT, "site"), { recursive: true });
writeFileSync(join(ROOT, "site", "index.html"), html, "utf8");
console.log(`site/index.html generado — ${modules.length} módulos, ${practiceCount} prácticas, v${version}`);
