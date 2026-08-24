#!/usr/bin/env node
// Compila docs/presentacion.md en los dos documentos de la muestra del programa:
//
//   presentacion/presentacion.html → diapositivas 16:9 (proyectar / PRESENTACION.pdf)
//   presentacion/pauta.html        → pauta del expositor (guion + tiempos / PAUTA.pdf)
//
// La fuente es UNA sola: cada sección "## N · Título" de docs/presentacion.md es una
// diapositiva; su cuerpo es lo que se proyecta y la cita final (> **Pauta · N min.**)
// es lo que dice quien expone. Mantener las dos cosas en el mismo archivo evita el
// problema clásico de las presentaciones: el guion y las láminas se separan a la
// segunda edición y acaban contando cosas distintas.
//
// scripts/render-presentation-pdf.mjs convierte ambos HTML en PDF.
//
// Uso: node scripts/build-presentation.mjs   (requiere el paquete `marked`).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const SITE = "https://vladimiracunadev-create.github.io/blockchain-learning-path";
const version = JSON.parse(read("package.json")).version;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- Leer la fuente y separarla en diapositivas -------------------------------

const fuente = read("docs/presentacion.md");
const lineas = fuente.split("\n");
const slides = [];
let actual = null;

for (const linea of lineas) {
  const encabezado = /^##\s+(\d+)\s*·\s*(.+?)\s*$/.exec(linea);
  if (encabezado) {
    actual = { n: Number(encabezado[1]), titulo: encabezado[2], cuerpo: [], pauta: [] };
    slides.push(actual);
    continue;
  }
  // Cualquier otro "## " cierra la diapositiva en curso: las secciones de
  // introducción del documento (sin número) no son láminas.
  if (/^##\s/.test(linea)) {
    actual = null;
    continue;
  }
  if (!actual) continue;
  if (/^>\s?/.test(linea)) actual.pauta.push(linea.replace(/^>\s?/, ""));
  else actual.cuerpo.push(linea);
}

if (slides.length < 6) {
  throw new Error(`docs/presentacion.md solo define ${slides.length} diapositivas: se esperaban al menos 6.`);
}
slides.forEach((s, i) => {
  if (s.n !== i + 1) throw new Error(`Diapositivas mal numeradas: la ${i + 1}.ª declara "${s.n}".`);
  if (!s.pauta.length) throw new Error(`La diapositiva ${s.n} (${s.titulo}) no tiene pauta del expositor.`);
});

// Minutos declarados en cada pauta ("**Pauta · 3 min.**"): la duración total de la
// charla se calcula, no se escribe a mano, para que no envejezca al añadir láminas.
for (const s of slides) {
  const texto = s.pauta.join("\n").trim();
  const min = /\*\*Pauta\s*·\s*(\d+)\s*min\.?\*\*/.exec(texto);
  if (!min) throw new Error(`La diapositiva ${s.n} no declara los minutos: usa "> **Pauta · N min.** …".`);
  s.minutos = Number(min[1]);
  s.guion = texto.replace(/\*\*Pauta\s*·\s*\d+\s*min\.?\*\*\s*/, "");
}
const duracion = slides.reduce((total, s) => total + s.minutos, 0);

// El primer párrafo en negrita de cada lámina es su frase de entrada: se compone
// distinto (más grande, en color de acento) que el resto del cuerpo.
function cuerpoHtml(slide) {
  const html = marked.parse(slide.cuerpo.join("\n").trim());
  return html.replace(/^<p><strong>([\s\S]*?)<\/strong><\/p>/, '<p class="lead">$1</p>');
}

// Densidad de la lámina: una tabla de nueve filas o una lista de ocho puntos no
// caben con el cuerpo por defecto. En vez de dejar que el ajuste automático las
// encoja mucho (y las vuelva ilegibles al proyectar), se compone ese contenido con
// una escala tipográfica algo menor pero controlada.
function claseDensidad(html) {
  const filas = (html.match(/<tr>/g) ?? []).length;
  const puntos = (html.match(/<li>/g) ?? []).length;
  if (filas >= 8 || puntos >= 7) return " densa";
  return "";
}

// --- Diapositivas (16:9) -------------------------------------------------------

const CSS_DECK = `
  :root { --tinta:#141420; --suave:#5b5b73; --acento:#7c5cff; --verde:#2e8b57; --linea:#e3e0f5; --fondo:#ffffff; }
  * { box-sizing:border-box; }
  html, body { margin:0; padding:0; background:#20202c; }
  body { font-family:"Segoe UI","Liberation Sans",system-ui,-apple-system,"Noto Sans","Helvetica Neue",Arial,sans-serif; color:var(--tinta); }
  .slide {
    width:1280px; height:720px; background:var(--fondo); position:relative; overflow:hidden;
    page-break-after:always; break-after:page; margin:0 auto 24px; padding:46px 72px 92px;
    display:flex; flex-direction:column;
  }
  .slide:last-child { page-break-after:auto; break-after:auto; margin-bottom:0; }
  .slide::before { content:""; position:absolute; inset:0 0 auto 0; height:10px; background:linear-gradient(90deg,var(--acento),var(--verde)); }
  .tope { display:flex; justify-content:space-between; align-items:center; font-size:19px; color:var(--suave); letter-spacing:.02em; }
  .tope .marca { font-weight:600; }
  .tope .pag { font-variant-numeric:tabular-nums; }
  h2 { font-size:52px; line-height:1.1; margin:26px 0 0; letter-spacing:-.015em; }
  h2::after { content:""; display:block; width:104px; height:7px; border-radius:4px; background:var(--acento); margin-top:18px; }
  /* min-height:0 es lo que hace que la zona NO crezca con su contenido: sin eso,
     un flex item se estira para caber y el ajuste de escala nunca se dispara. */
  .zona { flex:1; min-height:0; overflow:hidden; display:flex; align-items:flex-start; margin-top:24px; }
  /* flex:0 0 auto para que el ancho compensado del ajuste de escala no lo
     encoja el propio contenedor flexible. */
  .contenido { width:100%; flex:0 0 auto; transform-origin:top left; }
  .lead { font-size:33px; line-height:1.32; font-weight:700; color:var(--acento); margin:0 0 22px; }
  .contenido p { font-size:28px; line-height:1.42; margin:0 0 18px; }
  .contenido ul, .contenido ol { font-size:29px; line-height:1.42; margin:0; padding-left:1.15em; }
  .contenido li { margin-bottom:15px; }
  .contenido li::marker { color:var(--acento); }
  .contenido strong { color:var(--tinta); }
  .contenido code { font-family:"Cascadia Mono",Consolas,"SF Mono",monospace; font-size:.88em; background:#f2f0ff; color:#4a32c9; padding:.1em .32em; border-radius:5px; }
  .contenido table { border-collapse:collapse; width:100%; font-size:25px; }
  .contenido th, .contenido td { border-bottom:2px solid var(--linea); padding:11px 16px; text-align:left; }
  .contenido th { background:#f6f4ff; font-size:23px; text-transform:uppercase; letter-spacing:.04em; color:var(--suave); }
  .contenido.densa .lead { font-size:30px; margin-bottom:16px; }
  .contenido.densa ul, .contenido.densa ol { font-size:26px; }
  .contenido.densa li { margin-bottom:10px; }
  .contenido.densa table { font-size:23px; }
  .contenido.densa th, .contenido.densa td { padding:7px 14px; }
  .contenido.densa th { font-size:20px; }
  .pie { position:absolute; left:72px; right:72px; bottom:26px; display:flex; justify-content:space-between;
         font-size:16px; color:var(--suave); border-top:2px solid var(--linea); padding-top:12px; }
  /* Portada */
  .slide.portada { justify-content:center; text-align:center; background:linear-gradient(160deg,#1a1330 0%,#2b1d5c 60%,#3b2a7a 100%); color:#fff; }
  .slide.portada .tope, .slide.portada .pie { color:#c9c2f0; border-color:#5a4a9a; }
  .slide.portada h2 { font-size:76px; margin:0; }
  .slide.portada h2::after { margin:26px auto 0; background:#9d8bff; }
  .slide.portada .zona { flex:0; justify-content:center; margin-top:30px; }
  .slide.portada .contenido { max-width:960px; }
  .slide.portada .lead { color:#b9a9ff; font-size:36px; }
  .slide.portada .contenido ul { list-style:none; padding:0; }
  .slide.portada .contenido li { color:#ece9ff; }
  .slide.portada .contenido strong { color:#fff; }
  .slide.portada .contenido code { background:#3a2d6e; color:#dcd4ff; }
  @page { size:1280px 720px; margin:0; }
  @media print { body { background:#fff; } .slide { margin:0; } }
`;

const deckSlides = slides.map((s) => {
  const cuerpo = cuerpoHtml(s);
  return `
<section class="slide${s.n === 1 ? " portada" : ""}">
  <div class="tope"><span class="marca">${s.n === 1 ? "🎤 Muestra del programa" : "⛓️ Blockchain Learning Path"}</span><span class="pag">${s.n} / ${slides.length}</span></div>
  <h2>${esc(s.titulo)}</h2>
  <div class="zona"><div class="contenido${claseDensidad(cuerpo)}">${cuerpo}</div></div>
  <div class="pie"><span>v${version} · 28 módulos · 71 prácticas</span><span>${SITE.replace("https://", "")}</span></div>
</section>`;
}).join("\n");

// Ajuste de escala: una lámina que se pasa de alto se encoge en bloque en vez de
// desbordar (y de perder la última línea al imprimir). Se hace en el navegador,
// que es el único que sabe cuánto ocupa el texto de verdad.
const AJUSTE = `
<script>
(function () {
  document.querySelectorAll(".slide").forEach(function (slide) {
    // La portada se compone centrada, sin zona de alto fijo: no se escala.
    if (slide.classList.contains("portada")) return;
    var zona = slide.querySelector(".zona");
    var caja = slide.querySelector(".contenido");
    if (!zona || !caja) return;
    var disponible = zona.clientHeight - 2;
    if (disponible <= 0) return;
    var base = caja.scrollHeight;
    if (base <= disponible) return; // cabe tal cual: no se toca

    function aplicar(e) {
      caja.style.transform = e < 1 ? "scale(" + e + ")" : "";
      caja.style.width = (100 / e) + "%";
    }
    // Primera escala, calculada al ancho original: siempre cabe, porque al
    // compensar el ancho el texto envuelve MENOS y el bloque solo puede encoger.
    var segura = Math.max(0.62, disponible / base);
    aplicar(segura);
    // Y como al ensanchar suele sobrar sitio, se busca por bisección la letra más
    // grande que sigue cabiendo: cada intento se mide de verdad, no se estima.
    var alta = 1;
    for (var i = 0; i < 5 && alta - segura > 0.015; i++) {
      var media = (segura + alta) / 2;
      aplicar(media);
      if (caja.scrollHeight * media <= disponible) segura = media;
      else alta = media;
    }
    aplicar(segura);
  });
  window.__deckReady = true;
})();
</script>`;

const deck = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280">
<title>Blockchain Learning Path · Presentación del programa</title>
<style>${CSS_DECK}</style>
</head>
<body>
${deckSlides}
${AJUSTE}
</body>
</html>`;

// --- Pauta del expositor (A4) ---------------------------------------------------

const CSS_PAUTA = `
  :root { --tinta:#1b1b26; --suave:#5b5b73; --acento:#7c5cff; --linea:#ddd9f2; }
  * { box-sizing:border-box; }
  body { font-family:"Segoe UI","Liberation Sans",system-ui,-apple-system,"Noto Sans","Helvetica Neue",Arial,sans-serif;
         color:var(--tinta); margin:0; font-size:13.5pt; line-height:1.5; }
  .portada { text-align:center; padding:70px 0 40px; border-bottom:4px solid var(--acento); margin-bottom:26px; }
  .portada .escudo { font-size:64pt; line-height:1; }
  .portada h1 { font-size:30pt; margin:14px 0 6px; letter-spacing:-.02em; }
  .portada p { font-size:14pt; color:var(--suave); margin:6px 0; }
  .portada .meta { display:inline-flex; gap:14px; margin-top:18px; font-size:12pt; color:var(--suave); }
  .portada .meta span { border:2px solid var(--linea); border-radius:999px; padding:6px 16px; }
  h2 { font-size:18pt; margin:26px 0 10px; }
  h3 { font-size:15pt; margin:0 0 8px; }
  table { border-collapse:collapse; width:100%; font-size:12pt; margin:12px 0 20px; }
  th, td { border:1.5px solid var(--linea); padding:8px 11px; text-align:left; vertical-align:top; }
  th { background:#f6f4ff; color:var(--suave); text-transform:uppercase; font-size:10.5pt; letter-spacing:.04em; }
  .aviso { background:#f6f4ff; border-left:6px solid var(--acento); padding:14px 18px; border-radius:0 8px 8px 0; font-size:12.5pt; }
  .lamina { border:2px solid var(--linea); border-radius:12px; padding:18px 22px; margin:0 0 18px;
            page-break-inside:avoid; break-inside:avoid; }
  .lamina .cab { display:flex; justify-content:space-between; align-items:baseline; gap:14px;
                 border-bottom:2px solid var(--linea); padding-bottom:10px; margin-bottom:12px; }
  .lamina .num { font-size:12pt; color:#fff; background:var(--acento); border-radius:8px; padding:3px 12px; font-weight:700; }
  .lamina .tiempo { font-size:11.5pt; color:var(--suave); white-space:nowrap; }
  .rot { font-size:10.5pt; text-transform:uppercase; letter-spacing:.07em; color:var(--acento); font-weight:700; margin:0 0 6px; }
  .pantalla { font-size:12pt; color:#33334a; background:#faf9ff; border-radius:8px; padding:10px 16px; }
  .pantalla ul, .pantalla ol { margin:0; padding-left:1.1em; }
  .pantalla li { margin-bottom:4px; }
  .pantalla p { margin:0 0 6px; }
  .pantalla table { font-size:10.5pt; margin:6px 0 0; }
  .pantalla th, .pantalla td { padding:5px 8px; }
  .guion { margin-top:12px; font-size:13pt; }
  .guion p { margin:0 0 8px; }
  code { font-family:"Cascadia Mono",Consolas,monospace; font-size:.9em; background:#f2f0ff; color:#4a32c9; padding:.08em .3em; border-radius:4px; }
  @page { size:A4; margin:16mm 15mm; }
`;

const filasResumen = slides.map((s) =>
  `<tr><td style="text-align:right">${s.n}</td><td>${esc(s.titulo)}</td><td style="text-align:right">${s.minutos} min</td></tr>`).join("\n");

const laminas = slides.map((s) => `
<div class="lamina">
  <div class="cab">
    <h3><span class="num">${s.n}</span> ${esc(s.titulo)}</h3>
    <span class="tiempo">⏱ ${s.minutos} min</span>
  </div>
  <p class="rot">En pantalla</p>
  <div class="pantalla">${cuerpoHtml(s)}</div>
  <p class="rot" style="margin-top:14px">Qué decir</p>
  <div class="guion">${marked.parse(s.guion)}</div>
</div>`).join("\n");

const pauta = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Blockchain Learning Path · Pauta del expositor</title>
<style>${CSS_PAUTA}</style>
</head>
<body>
<div class="portada">
  <div class="escudo">⛓️</div>
  <h1>Pauta del expositor</h1>
  <p><strong>Blockchain Learning Path</strong> · muestra del programa</p>
  <p>28 módulos · 71 prácticas · de cero a la infraestructura financiera</p>
  <div class="meta"><span>v${version}</span><span>${slides.length} diapositivas</span><span>≈ ${duracion} min</span></div>
</div>

<div class="aviso">
  <strong>Cómo se usa.</strong> Proyecta <code>PRESENTACION.pdf</code> a pantalla completa y
  ten esta pauta impresa o en un segundo monitor. Para cada diapositiva encontrarás
  <strong>lo que el público ve</strong> y <strong>lo que conviene decir</strong>, con el tiempo
  previsto. Los tiempos suman ${duracion} minutos sobre ${slides.length} láminas, así que la
  muestra completa cabe en media hora dejando margen para preguntas. Si vas corto, recorta
  en el mapa de etapas —dos frases y adelante— antes que en cualquier otra lámina.
</div>

<h2>Guion en un vistazo</h2>
<table>
  <thead><tr><th style="width:8%">#</th><th>Diapositiva</th><th style="width:16%">Tiempo</th></tr></thead>
  <tbody>
${filasResumen}
    <tr><th colspan="2" style="text-align:right">Total</th><th style="text-align:right">${duracion} min</th></tr>
  </tbody>
</table>

<h2>Diapositiva a diapositiva</h2>
${laminas}

<p style="margin-top:26px;font-size:11pt;color:#5b5b73;border-top:2px solid #ddd9f2;padding-top:12px">
Generado desde <code>docs/presentacion.md</code> · v${version} ·
${SITE.replace("https://", "")} · Código MIT · Contenido CC BY 4.0
</p>
</body>
</html>`;

// --- Escribir ------------------------------------------------------------------

mkdirSync(join(ROOT, "presentacion"), { recursive: true });
writeFileSync(join(ROOT, "presentacion", "presentacion.html"), deck, "utf8");
writeFileSync(join(ROOT, "presentacion", "pauta.html"), pauta, "utf8");
console.log(`presentacion/presentacion.html: ${slides.length} diapositivas.`);
console.log(`presentacion/pauta.html: pauta del expositor, ≈${duracion} min.`);
