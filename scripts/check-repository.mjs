import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { classFileName } from "./curriculum-lib.mjs";

const required = [
  "README.md",
  "ROADMAP.md",
  "SECURITY.md",
  "docs/mejores-practicas.md",
  "curriculum/README.md",
  "curriculum/classes.json",
  "curriculum/pedagogy.json",
  "capstone/README.md",
  "labs/CATALOG.md",
  "learning-paths/README.md",
  "learning-paths/roles.json",
  "learning-paths/ROLE_INVENTORY.md",
  "learning-paths/TRACEABILITY.md",
  "security-challenges/README.md",
  "apps/learning-dashboard/index.html",
  "projects/community-funding/src/CommunityFunding.sol",
  "docs/chile-regulacion-tributacion.md",
  "labs/08-protocols/src/CourseToken.sol",
  "labs/guides/README.md",
  "apps/event-indexer/src/index.mjs",
  "instructor/syllabus.md",
  "docs/despliegue-local.md",
  "docs/bibliografia.md",
  "industria/README.md",
  "regulation/README.md",
  "regulation/chile/README.md",
  "docs/casos-reales/README.md",
  "docs/audit/README.md",
  "docs/skills-matrix.md",
  "docs/ecosistemas-y-lenguajes.md",
  "docs/audit/PROFESSIONAL_PATHS_2026-10-12.md",
  "labs/22-cbdc-mercado-tokenizado/src/DvPSettlement.sol",
  "docs/andes-quest-activos-tokenizados.md",
  "labs/23-andes-quest-assets/src/GameAsset.sol",
  "docs/economia-token-viral.md",
  "labs/15-tokenomics/viral-token-cycle.mjs",
  "especializacion-seguridad-custodia/README.md",
  "especializacion-seguridad-custodia/MATRIZ-INTEGRACION.md",
  "especializacion-seguridad-custodia/glosario.md",
  "especializacion-seguridad-custodia/GUIA-DEL-INSTRUCTOR.md",
  "especializacion-seguridad-custodia/bloques/09-caso-binance-2026-10-29.md",
  "especializacion-seguridad-custodia/laboratorios/README.md",
  "especializacion-seguridad-custodia/evaluacion/README.md",
  "especializacion-seguridad-custodia/evaluacion/rubricas.md",
  "especializacion-seguridad-custodia/evaluacion/banco-de-preguntas.md",
  "especializacion-seguridad-custodia/evaluacion/quiz.json",
  "labs/especializacion-seguridad/nucleo/red-lab.mjs"
];

for (const file of required) await access(join(process.cwd(), file));

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
if (!packageJson.packageManager?.startsWith("pnpm@")) {
  throw new Error("Debe fijarse pnpm como gestor del repositorio");
}

console.log(`Repositorio válido: ${required.length} documentos esenciales presentes.`);

const catalog = await readFile("labs/CATALOG.md", "utf8");
const practices = catalog.match(/^\| \d{2} \|/gm) ?? [];
if (practices.length !== 91) throw new Error(`Se esperaban 91 prácticas y existen ${practices.length}`);

const diagnostic = JSON.parse(await readFile("assessments/diagnostic.json", "utf8"));
if (!Array.isArray(diagnostic.questions) || diagnostic.questions.length < 5) {
  throw new Error("Diagnóstico incompleto");
}

console.log("Catálogo: 91 prácticas. Diagnóstico: válido.");

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries
    .filter((entry) => ![".git", "node_modules", "dist", "lib", "site"].includes(entry.name))
    .map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? markdownFiles(path) : extname(path) === ".md" ? [path] : [];
    }));
  return nested.flat();
}

const broken = [];
for (const file of await markdownFiles(process.cwd())) {
  // La plantilla curricular se excluye a propósito: sus rutas están escritas
  // para el sitio donde acabará copiada (curriculum/NN-slug/), no para su
  // ubicación actual, y sus destinos son marcadores de posición.
  if (file.endsWith("MODULE_TEMPLATE.md")) continue;
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:/i.test(target) || target.startsWith("<")) continue;
    try {
      await access(resolve(dirname(file), target));
    } catch {
      broken.push(`${file}: ${target}`);
    }
  }
}
if (broken.length) throw new Error(`Enlaces locales rotos:\n${broken.join("\n")}`);
console.log("Enlaces Markdown locales: válidos.");

const guideText = await Promise.all(
  ["01-foundations.md", "02-consensus-bitcoin.md", "03-evm-development.md", "04-professional-security.md",
   "05-advanced-capstone.md", "06-finanzas-onchain.md", "07-data-analytics.md", "08-custodia-auditoria.md"]
    .map((name) => readFile(join("labs/guides", name), "utf8"))
);
const guidedPractices = guideText.join("\n").match(/^## \d{2} ·/gm) ?? [];
if (guidedPractices.length !== 91) {
  throw new Error(`Se esperaban 91 guías prácticas y existen ${guidedPractices.length}`);
}
console.log("Guías prácticas: 91/91.");

// --- Catálogo y diseño pedagógico de las clases ------------------------------
const classCatalog = JSON.parse(await readFile("curriculum/classes.json", "utf8"));
const pedagogy = JSON.parse(await readFile("curriculum/pedagogy.json", "utf8"));

// Las carpetas numeradas son mapas temáticos estables. Las 66 clases deben existir
// como documentos independientes; el mapa nunca puede sustituirlas ni agruparlas.
const moduleSlugs = (await readdir("curriculum", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort();
const classIds = classCatalog.flatMap((unit) => unit.classes.map((item) => item.id));
const classItems = classCatalog.flatMap((unit) => unit.classes);
const classErrors = [];

if (classCatalog.length !== moduleSlugs.length) {
  classErrors.push(`hay ${classCatalog.length} unidades en classes.json y ${moduleSlugs.length} directorios`);
}
if (classIds.length !== 66 || new Set(classIds).size !== 66) {
  classErrors.push(`se esperaban 66 identificadores únicos y existen ${new Set(classIds).size}/${classIds.length}`);
}
const expectedClassIds = Array.from({ length: 66 }, (_, index) => String(index + 1));
if (classIds.some((id, index) => id !== expectedClassIds[index])) {
  classErrors.push("los identificadores deben formar la secuencia simple y ordenada 1–66");
}
for (const field of ["title", "question", "case", "activity", "evidence"]) {
  const values = classItems.map((item) => item[field]?.trim()).filter(Boolean);
  if (values.length !== classItems.length || new Set(values).size !== classItems.length) {
    classErrors.push(`el campo ${field} debe ser propio y no repetirse entre las 66 clases`);
  }
}
const expectedPedagogy = new Set(classIds);
const actualPedagogy = new Set(Object.keys(pedagogy));
if (actualPedagogy.size !== expectedPedagogy.size || [...actualPedagogy].some((id) => !expectedPedagogy.has(id))) {
  classErrors.push("pedagogy.json debe contener exactamente las 66 clases");
}

for (const [index, unit] of classCatalog.entries()) {
  const number = moduleSlugs[index]?.slice(0, 2);
  if (unit.unit !== number || unit.classes.length !== 2) {
    classErrors.push(`${unit.unit}: no corresponde a ${number} o no contiene exactamente dos clases`);
    continue;
  }
  const text = await readFile(join("curriculum", moduleSlugs[index], "README.md"), "utf8");
  const [firstId, secondId] = unit.classes.map((item) => item.id);
  if (!new RegExp(`^# .+ · Clases ${firstId}–${secondId}$`, "m").test(text)) {
    classErrors.push(`${moduleSlugs[index]}: el título no muestra el rango ${firstId}–${secondId}`);
  }
  if ((text.match(/<!-- clases-independientes:inicio -->/g) ?? []).length !== 1 ||
      (text.match(/<!-- clases-independientes:fin -->/g) ?? []).length !== 1) {
    classErrors.push(`${moduleSlugs[index]}: debe contener un único índice de clases independientes`);
  }
  for (const [pairIndex, item] of unit.classes.entries()) {
    const design = pedagogy[item.id];
    if (!design) classErrors.push(`${item.id}: falta diseño pedagógico`);
    if (design && design.explanation.trim().split(/\s+/).length < 18) {
      classErrors.push(`${item.id}: explicación pedagógica demasiado breve`);
    }
    const file = join("curriculum", moduleSlugs[index], classFileName(item));
    let classText;
    try { classText = await readFile(file, "utf8"); }
    catch { classErrors.push(`${item.id}: falta su documento independiente ${file}`); continue; }
    if (!classText.startsWith(`# Clase ${item.id} · ${item.title}\n`)) {
      classErrors.push(`${item.id}: título o archivo de clase desincronizado`);
    }
    if (classText.trim().split(/\s+/).length < 800) {
      classErrors.push(`${item.id}: su clase independiente tiene menos de 800 palabras`);
    }
    if ((classText.match(/```mermaid/g) ?? []).length < 1) {
      classErrors.push(`${item.id}: falta un gráfico Mermaid pedagógico`);
    }
    if ((classText.match(/https?:\/\//g) ?? []).length < 3) {
      classErrors.push(`${item.id}: faltan al menos tres fuentes enlazadas`);
    }
    for (const value of [item.question, item.case, item.activity, item.evidence, design.method, design.check]) {
      if (!classText.includes(value)) classErrors.push(`${item.id}: su documento no contiene su diseño específico`);
    }
    const globalIndex = index * 2 + pairIndex;
    const previous = classItems[globalIndex - 1];
    const next = classItems[globalIndex + 1];
    if (previous && !classText.includes(classFileName(previous))) classErrors.push(`${item.id}: no enlaza directamente a la clase ${previous.id}`);
    if (next && !classText.includes(classFileName(next))) classErrors.push(`${item.id}: no enlaza directamente a la clase ${next.id}`);
    if (!previous && !classText.includes("../../README.md")) classErrors.push("1: no enlaza al inicio del programa");
    if (!next && !classText.includes("../../capstone/README.md")) classErrors.push("66: no enlaza al caso final");
    if (!text.includes(`](${classFileName(item)})`)) classErrors.push(`${item.id}: el mapa temático no enlaza su clase`);
  }
  const methods = unit.classes.map((item) => pedagogy[item.id]?.method).filter(Boolean);
  if (methods.length === 2 && methods[0] === methods[1]) {
    classErrors.push(`${unit.unit}: sus dos clases usan el mismo método`);
  }
}
if (new Set(Object.values(pedagogy).map((item) => item.method)).size < 25) {
  classErrors.push("hay menos de 25 estrategias pedagógicas distintas");
}
if (classErrors.length) throw new Error(`Catálogo de clases inválido:\n${classErrors.join("\n")}`);
console.log(`Clases: ${classIds.length} documentos independientes en ${classCatalog.length} mapas temáticos, con profundidad, gráficos, fuentes y diseño propio verificados.`);

// La numeración de carpeta es una decisión técnica de compatibilidad, no una
// subdivisión pedagógica. Ningún documento vigente debe volver a enseñar 00.1–32.2
// ni llamar “módulos” a las clases. Se preservan solo archivos históricos y el uso
// técnico de “módulos Diamond” en el ADR correspondiente.
const terminologyErrors = [];
for (const file of await markdownFiles(process.cwd())) {
  const normalized = file.replaceAll("\\", "/");
  if (normalized.includes("/docs/audit/") ||
      normalized.endsWith("/CHANGELOG.md") ||
      normalized.endsWith("/ROADMAP.md") ||
      normalized.endsWith("/adrs/004-inmutabilidad-upgrades.md")) continue;
  const content = await readFile(file, "utf8");
  if (/\bclases?\s+\d{2}\.[12]\b/i.test(content)) {
    terminologyErrors.push(`${file}: conserva numeración de clase con subdivisión`);
  }
  if (/\bmódulos?\b/i.test(content)) {
    terminologyErrors.push(`${file}: conserva la terminología módulo`);
  }
  for (const match of content.matchAll(/\[(\d{2})\]\([^)]*curriculum\/(\d{2})-[^)]*\)/g)) {
    if (match[1] === match[2]) {
      terminologyErrors.push(`${file}: muestra el identificador interno ${match[1]} como si fuera una clase`);
    }
  }
}
if (terminologyErrors.length) {
  throw new Error(`Terminología pedagógica incoherente:\n${terminologyErrors.join("\n")}`);
}
console.log("Numeración y terminología: secuencia visible 1–66, sin subdivisiones vigentes.");

// --- Autoevaluación por unidad ------------------------------------------------
// Un quiz con una respuesta correcta fuera de rango o con opciones repetidas no
// falla al construir el sitio: falla en la cara del alumno, que no entiende por
// qué acertando le dice que no. Aquí se comprueba antes de publicar.
const quizzes = JSON.parse(await readFile("assessments/module-quizzes.json", "utf8"));

const quizErrors = [];
let preguntas = 0;
for (const slug of moduleSlugs) {
  const quiz = quizzes.modules[slug];
  if (!quiz) {
    quizErrors.push(`${slug}: no tiene autoevaluación`);
    continue;
  }
  if (quiz.preguntas.length < 3) {
    quizErrors.push(`${slug}: solo ${quiz.preguntas.length} preguntas (mínimo 3)`);
  }
  quiz.preguntas.forEach((pregunta, indice) => {
    preguntas += 1;
    const donde = `${slug} · pregunta ${indice + 1}`;
    if (!Number.isInteger(pregunta.answer) || pregunta.answer < 0 || pregunta.answer >= pregunta.options.length) {
      quizErrors.push(`${donde}: la respuesta correcta apunta fuera de las opciones`);
    }
    if (new Set(pregunta.options).size !== pregunta.options.length) {
      quizErrors.push(`${donde}: opciones repetidas`);
    }
    if (!pregunta.explanation) {
      quizErrors.push(`${donde}: sin explicación (fallar sin saber por qué no enseña nada)`);
    }
  });
}
for (const slug of Object.keys(quizzes.modules)) {
  if (!moduleSlugs.includes(slug)) quizErrors.push(`${slug}: hay evaluación pero no existe la unidad`);
}
if (quizErrors.length) throw new Error(`Autoevaluación por unidad:\n${quizErrors.join("\n")}`);
console.log(`Autoevaluación: ${moduleSlugs.length}/${moduleSlugs.length} mapas temáticos, ${preguntas} preguntas, más 66 comprobaciones formativas de clase.`);

// --- Cadena anterior/siguiente entre unidades ---------------------------------
// El curso es secuencial: si una unidad apunta a la vecina equivocada (o a ninguna),
// el alumno se salta contenido sin enterarse. Insertar una unidad nueva en medio
// rompe esta cadena en silencio, así que se comprueba en cada `pnpm check`.
const cadenaErrores = [];
for (const [indice, slug] of moduleSlugs.entries()) {
  const texto = await readFile(join("curriculum", slug, "README.md"), "utf8");
  const anterior = indice > 0 ? `../${moduleSlugs[indice - 1]}/README.md` : "../../README.md";
  const siguiente = indice < moduleSlugs.length - 1
    ? `../${moduleSlugs[indice + 1]}/README.md`
    : "../../capstone/README.md";

  const cabecera = texto.split("\n").find((linea) => linea.startsWith("> 🧭 "));
  if (!cabecera) {
    cadenaErrores.push(`${slug}: falta la línea de navegación (> 🧭 …) en la cabecera`);
  } else {
    if (!cabecera.includes(anterior)) cadenaErrores.push(`${slug}: la cabecera no enlaza al anterior (${anterior})`);
    if (!cabecera.includes(siguiente)) cadenaErrores.push(`${slug}: la cabecera no enlaza al siguiente (${siguiente})`);
  }

  // Glosario y guía de novatos accesibles desde CUALQUIER unidad: quien se atasca
  // en las clases 25–26 no debería tener que volver al README para encontrarlos.
  if (!texto.includes("../../docs/glosario.md")) {
    cadenaErrores.push(`${slug}: no enlaza el glosario`);
  }
  if (!texto.includes("../../docs/empieza-aqui.md")) {
    cadenaErrores.push(`${slug}: no enlaza la guía para novatos`);
  }

  const pie = texto.split(/\n## [^\n]*Navegación[^\n]*\n/)[1];
  if (!pie) {
    cadenaErrores.push(`${slug}: falta la sección de navegación al pie`);
  } else {
    if (!pie.includes(anterior)) cadenaErrores.push(`${slug}: el pie no enlaza al anterior (${anterior})`);
    if (!pie.includes(siguiente)) cadenaErrores.push(`${slug}: el pie no enlaza al siguiente (${siguiente})`);
  }
}
if (cadenaErrores.length) throw new Error(`Cadena de unidades rota:\n${cadenaErrores.join("\n")}`);
console.log(`Navegación: 66 clases encadenadas directamente y ${moduleSlugs.length} mapas temáticos compatibles.`);

// --- Trazabilidad de las fuentes ----------------------------------------------
// El contenido de las clases es original, pero se apoya en obras concretas. Esa
// afirmación solo vale algo si el lector PUEDE IR A COMPROBARLA: cada unidad debe
// declarar su fuente y ofrecer enlaces a fuente primaria, y la bibliografía debe
// decir dónde se usa cada obra.
//
// Sin esto, una clase podría afirmar cualquier cosa "según Antonopoulos" y nadie
// tendría forma de contrastarlo. El workflow de enlaces comprueba además, cada
// semana, que esas URL siguen vivas.
const MINIMO_REFERENCIAS = 3;
const bibliografia = await readFile("docs/bibliografia.md", "utf8");
const fuentesErrores = [];

for (const slug of moduleSlugs) {
  const texto = await readFile(join("curriculum", slug, "README.md"), "utf8");

  if (!/\*\*Fuente:\*\*/.test(texto)) {
    fuentesErrores.push(`${slug}: la cabecera no declara **Fuente:**`);
  }

  const referencias = texto.split(/\n## [^\n]*Referencias[^\n]*\n/)[1]?.split("\n## ")[0] ?? "";
  const enlaces = referencias.match(/https?:\/\//g) ?? [];
  if (enlaces.length < MINIMO_REFERENCIAS) {
    fuentesErrores.push(
      `${slug}: solo ${enlaces.length} enlaces en Referencias (mínimo ${MINIMO_REFERENCIAS}); ` +
      `una fuente que no se puede consultar no es una fuente`
    );
  }

  if (!bibliografia.includes(`../curriculum/${slug}/README.md`)) {
    fuentesErrores.push(`${slug}: no aparece en la tabla de obras de docs/bibliografia.md`);
  }
}
// Suelo de profundidad. No mide calidad —eso no se automatiza— pero sí impide la
// regresión silenciosa: una unidad cuya profundización se queda en cuatro líneas
// deja de enseñar el "por qué" y vuelve a ser una lista de definiciones.
const MINIMO_PROFUNDIZACION = 400;
for (const slug of moduleSlugs) {
  const texto = await readFile(join("curriculum", slug, "README.md"), "utf8");
  const seccion = texto.split(/\n## [^\n]*Profundización[^\n]*\n/)[1]?.split("\n## ")[0] ?? "";
  const palabras = seccion.trim().split(/\s+/).filter(Boolean).length;
  if (palabras < MINIMO_PROFUNDIZACION) {
    fuentesErrores.push(`${slug}: la profundización tiene ${palabras} palabras (mínimo ${MINIMO_PROFUNDIZACION})`);
  }
}

if (fuentesErrores.length) throw new Error(`Fuentes no trazables:\n${fuentesErrores.join("\n")}`);
console.log(`Fuentes: ${moduleSlugs.length} mapas / ${classIds.length} clases con fuente declarada y al menos tres referencias enlazadas por clase.`);

// --- Recuento de pruebas declarado en la documentación ------------------------
// La bibliografía afirma que buena parte del contenido "se comprueba ejecutándolo"
// y da una cifra. Una cifra escrita a mano envejece al primer test que se añada, y
// entonces el argumento de validez pasa a ser falso. Se cuenta y se contrasta.
const IGNORAR_AL_CONTAR = new Set(["node_modules", "dist", "out", "cache", "lib", "build", "www", "android", "site", ".git", "bundle"]);

async function contarPruebas(directorio) {
  let node = 0;
  let foundry = 0;
  for (const entrada of await readdir(directorio, { withFileTypes: true })) {
    if (IGNORAR_AL_CONTAR.has(entrada.name)) continue;
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      const anidado = await contarPruebas(ruta);
      node += anidado.node;
      foundry += anidado.foundry;
    } else if (entrada.name.endsWith(".test.mjs")) {
      node += ((await readFile(ruta, "utf8")).match(/^test\(/gm) ?? []).length;
    } else if (entrada.name.endsWith(".t.sol")) {
      foundry += ((await readFile(ruta, "utf8")).match(/function test/g) ?? []).length;
    }
  }
  return { node, foundry };
}

const pruebas = await contarPruebas(".");
const total = pruebas.node + pruebas.foundry;
const declarado = /\*\*(\d+) pruebas automatizadas\*\* \((\d+) de Node y (\d+) de Foundry\)/.exec(bibliografia);
if (!declarado) {
  throw new Error("docs/bibliografia.md ya no declara el recuento de pruebas: actualiza el texto o esta comprobación.");
}
if (Number(declarado[1]) !== total || Number(declarado[2]) !== pruebas.node || Number(declarado[3]) !== pruebas.foundry) {
  throw new Error(
    `El recuento de pruebas de docs/bibliografia.md está obsoleto.\n` +
    `  declara: ${declarado[1]} (${declarado[2]} Node + ${declarado[3]} Foundry)\n` +
    `  reales:  ${total} (${pruebas.node} Node + ${pruebas.foundry} Foundry)`
  );
}
console.log(`Pruebas: ${total} (${pruebas.node} Node + ${pruebas.foundry} Foundry) — coincide con lo documentado.`);

// --- Prácticas con verificación ejecutable ------------------------------------
// El catálogo marca **auto** las prácticas que traen comprobación automática. Es
// la promesa que más importa a quien estudia sin instructor, así que el número no
// puede vivir suelto en el README: se cuenta del catálogo y se contrasta.
// Se cuentan FILAS de práctica, no apariciones del texto: la leyenda y el párrafo
// introductorio también dicen "**auto**" y antes inflaban el total.
const catalogo = await readFile("labs/CATALOG.md", "utf8");
const filasPractica = catalogo.match(/^\| \d+ \|.*$/gm) ?? [];
const practicasAuto = filasPractica.filter((fila) => fila.includes("**auto**")).length;
if (filasPractica.length !== 91) {
  throw new Error(`El catálogo tiene ${filasPractica.length} prácticas y deberían ser 91.`);
}
const readmeAuto = /(\d+) de las 91 prácticas traen verificación ejecutable/
  .exec(await readFile("README.md", "utf8"));
if (!readmeAuto) {
  throw new Error("El README ya no declara cuántas prácticas son auto-verificables.");
}
if (Number(readmeAuto[1]) !== practicasAuto) {
  throw new Error(
    `El README declara ${readmeAuto[1]} prácticas auto-verificadas y el catálogo marca ${practicasAuto}.`
  );
}
console.log(`Prácticas auto-verificadas: ${practicasAuto}/91, coincide con el README.`);

// --- Especialización avanzada de seguridad y custodia -------------------------
// La especialización vive FUERA de las 33 unidades y de las 91 prácticas para no
// alterar su numeración. Justamente por eso necesita su propio guardián: nada de lo
// anterior la vigila. Cada cifra que declara se contrasta con los archivos, y la
// matriz de integración se cruza con los README de las unidades que dice ampliar.
const ESP = "especializacion-seguridad-custodia";
const LABS_ESP = "labs/especializacion-seguridad";
const espErrores = [];
const leer = (ruta) => readFile(ruta, "utf8");
const palabras = (texto) => texto.trim().split(/\s+/).filter(Boolean).length;

// 1. Nueve bloques de contenido, cada uno con profundidad, gráfico, fuentes y cierre.
const archivosBloques = (await readdir(join(ESP, "bloques"))).filter((n) => /^\d{2}-.*\.md$/.test(n)).sort();
if (archivosBloques.length !== 9 || archivosBloques.some((n, i) => Number(n.slice(0, 2)) !== i + 1)) {
  espErrores.push(`se esperaban 9 bloques numerados 01–09 y hay ${archivosBloques.join(", ")}`);
}
for (const nombre of archivosBloques) {
  const texto = await leer(join(ESP, "bloques", nombre));
  if (palabras(texto) < 1200) espErrores.push(`${nombre}: solo ${palabras(texto)} palabras (mínimo 1200)`);
  if (!/```mermaid/.test(texto)) espErrores.push(`${nombre}: falta un gráfico Mermaid`);
  if ((texto.match(/https?:\/\//g) ?? []).length < 3) espErrores.push(`${nombre}: faltan al menos tres fuentes enlazadas`);
  if (!texto.includes("## ✅ Criterio de dominio")) espErrores.push(`${nombre}: falta el criterio de dominio`);
  if (!/## 🧭 Navegación/.test(texto)) espErrores.push(`${nombre}: falta la navegación`);
}

// 2. El caso estudia con honestidad: tres categorías, fecha de corte, desconocidos y procedimiento de actualización.
const casoTexto = await leer(join(ESP, "bloques", "09-caso-binance-2026-10-29.md"));
for (const frase of ["## Lo que se sabe: hechos confirmados", "## Lo que se sospecha: hipótesis", "## Lo que no se sabe: desconocidos",
  "30 de octubre de 2026", "## Cómo actualizar este estudio", "## Discrepancias entre fuentes"]) {
  if (!casoTexto.includes(frase)) espErrores.push(`el caso Binance perdió «${frase}»`);
}
const hipotesis = casoTexto.match(/^\| H\d+ \|/gm) ?? [];
const desconocidos = casoTexto.match(/^\| U\d+ \|/gm) ?? [];
if (hipotesis.length < 4) espErrores.push(`el caso declara ${hipotesis.length} hipótesis (mínimo 4)`);
if (desconocidos.length < 8) espErrores.push(`el caso declara ${desconocidos.length} desconocidos (mínimo 8)`);
if (!/no atribuye conducta a ninguna persona/i.test(casoTexto)) espErrores.push("el caso debe declarar que no atribuye conducta a ninguna persona");

// 3. Ocho laboratorios: guía completa, código, pruebas, y cifras que coinciden con el código.
const SECCIONES_LAB = ["Prerrequisitos", "Teoría", "Instrucciones", "Código comentado", "Pruebas", "Resultados esperados", "Ejercicios adicionales", "Soluciones"];
const archivosLabs = (await readdir(join(ESP, "laboratorios"))).filter((n) => /^LE\d-.*\.md$/.test(n)).sort();
if (archivosLabs.length !== 8) espErrores.push(`se esperaban 8 guías LE1–LE8 y hay ${archivosLabs.length}`);
const codigosLabs = (await readdir(LABS_ESP)).filter((n) => /^le\d-.*\.mjs$/.test(n) && !n.endsWith(".test.mjs")).sort();
const labsReadme = await leer(join(ESP, "laboratorios", "README.md"));
const scriptsPackage = JSON.parse(await leer("package.json")).scripts;
let pruebasLabs = 0;
for (const guia of archivosLabs) {
  const n = guia.slice(2, 3);
  const texto = await leer(join(ESP, "laboratorios", guia));
  let cursor = -1;
  for (const seccion of SECCIONES_LAB) {
    const posicion = texto.indexOf(`\n## ${seccion}\n`);
    if (posicion === -1) espErrores.push(`${guia}: falta la sección «${seccion}»`);
    else if (posicion < cursor) espErrores.push(`${guia}: «${seccion}» está fuera de orden`);
    else cursor = posicion;
  }
  const codigo = codigosLabs.find((c) => c.startsWith(`le${n}-`));
  if (!codigo) { espErrores.push(`${guia}: no existe su código le${n}-*.mjs`); continue; }
  const pruebas = ((await leer(join(LABS_ESP, codigo.replace(/\.mjs$/, ".test.mjs")))).match(/^test\(/gm) ?? []).length;
  pruebasLabs += pruebas;
  const declaradas = /\*\*Pruebas:\*\* (\d+)/.exec(texto);
  if (!declaradas || Number(declaradas[1]) !== pruebas) {
    espErrores.push(`${guia}: declara ${declaradas?.[1] ?? "ninguna"} pruebas y el código tiene ${pruebas}`);
  }
  if (pruebas < 5) espErrores.push(`${guia}: solo ${pruebas} pruebas (mínimo 5)`);
  const comando = scriptsPackage[`lab:le${n}`];
  if (!comando || !comando.includes(codigo)) espErrores.push(`${guia}: package.json no define «lab:le${n}» hacia ${codigo}`);
  if (!labsReadme.includes(`pnpm lab:le${n}`)) espErrores.push(`el índice de laboratorios no menciona pnpm lab:le${n}`);
}
const nucleoPruebas = (await Promise.all(["nucleo.test.mjs", "red-lab.test.mjs"].map((f) => leer(join(LABS_ESP, "nucleo", f)))))
  .reduce((suma, t) => suma + (t.match(/^test\(/gm) ?? []).length, 0);
const nucleoDeclarado = /núcleo criptográfico compartido[^\n]*tiene (\d+) pruebas/.exec(labsReadme);
if (!nucleoDeclarado || Number(nucleoDeclarado[1]) !== nucleoPruebas) {
  espErrores.push(`laboratorios/README.md declara ${nucleoDeclarado?.[1] ?? "ninguna"} pruebas del núcleo y existen ${nucleoPruebas}`);
}

// 4. Autonomía: los laboratorios solo importan módulos de Node y archivos propios del repositorio.
async function archivosJs(directorio) {
  const salida = [];
  for (const e of await readdir(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, e.name);
    if (e.isDirectory()) salida.push(...await archivosJs(ruta));
    else if (e.name.endsWith(".mjs")) salida.push(ruta);
  }
  return salida;
}
for (const archivo of await archivosJs(LABS_ESP)) {
  const codigo = await leer(archivo);
  for (const m of codigo.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/g)) {
    if (!m[1].startsWith(".") && !m[1].startsWith("node:")) {
      espErrores.push(`${archivo}: importa «${m[1]}», pero la especialización no tiene dependencias externas`);
    }
  }
  if (/\b(?:fetch|XMLHttpRequest|WebSocket)\b/.test(codigo) && !archivo.includes("le6-explorador-transacciones")) {
    espErrores.push(`${archivo}: usa red, y solo LE6 (modo en vivo opcional) puede hacerlo`);
  }
}
for (const fixture of ["delegaciones-observadas.json", "flujos-multicadena.json", "politica-custodio.json", "linea-de-tiempo-custodio.json"]) {
  const datos = JSON.parse(await leer(join(LABS_ESP, "fixtures", fixture)));
  const nota = datos.nota ?? datos.contexto?.nota ?? "";
  if (!/sint[ée]tic/i.test(nota)) espErrores.push(`fixtures/${fixture}: debe declararse sintético`);
}

// 5. Matriz de integración: 33 unidades, tres niveles, recuento coherente y unidades que de verdad enlazan.
const matriz = await leer(join(ESP, "MATRIZ-INTEGRACION.md"));
const filasMatriz = matriz.split("\n").filter((l) => l.startsWith("| [") && l.includes("curriculum/"));
const nivelesMatriz = { "Ampliación directa": 0, Complemento: 0, Contexto: 0 };
const vistas = new Set();
for (const fila of filasMatriz) {
  const slug = /curriculum\/(\d{2}-[a-z0-9-]+)\/README\.md/.exec(fila)?.[1];
  const nivel = Object.keys(nivelesMatriz).find((n) => fila.split("|")[2]?.trim() === n);
  if (!slug || !nivel) { espErrores.push(`matriz: fila ilegible → ${fila.slice(0, 60)}`); continue; }
  if (vistas.has(slug)) espErrores.push(`matriz: la unidad ${slug} aparece dos veces`);
  vistas.add(slug);
  nivelesMatriz[nivel] += 1;
  const readmeUnidad = await leer(join("curriculum", slug, "README.md"));
  const enlaza = readmeUnidad.includes(ESP);
  if (nivel === "Ampliación directa" && !enlaza) espErrores.push(`matriz: ${slug} es «Ampliación directa» pero su README no enlaza la especialización`);
  if (nivel !== "Ampliación directa" && enlaza) espErrores.push(`matriz: ${slug} enlaza la especialización pero la matriz lo marca «${nivel}»`);
}
for (const slug of moduleSlugs) if (!vistas.has(slug)) espErrores.push(`matriz: falta la unidad ${slug}`);
const recuento = /\*\*Recuento:\*\* (\d+) unidades con ampliación directa, (\d+) de complemento y (\d+) de contexto/.exec(matriz);
if (!recuento || Number(recuento[1]) !== nivelesMatriz["Ampliación directa"] || Number(recuento[2]) !== nivelesMatriz.Complemento || Number(recuento[3]) !== nivelesMatriz.Contexto) {
  espErrores.push(`matriz: el recuento declarado (${recuento?.slice(1).join("/") ?? "ninguno"}) no coincide con la tabla (${Object.values(nivelesMatriz).join("/")})`);
}

// 6. Evaluación: los identificadores que usa la matriz existen, y el cuestionario es válido.
const rubricas = await leer(join(ESP, "evaluacion", "rubricas.md"));
const quiz = JSON.parse(await leer(join(ESP, "evaluacion", "quiz.json")));
const idsUsados = new Set(matriz.match(/`(?:Q\d|R-LE\d|R-CASO|R-PROY)`/g)?.map((s) => s.slice(1, -1)));
for (const id of idsUsados) {
  const definido = id.startsWith("Q") ? Boolean(quiz.bloques[id]) : new RegExp(`${id.replace("-", "\\-")}\\b`).test(rubricas);
  if (!definido) espErrores.push(`la matriz usa «${id}», que no está definido en la evaluación`);
}
let preguntasEsp = 0;
for (let b = 1; b <= 9; b += 1) {
  const bloque = quiz.bloques[`Q${b}`];
  if (!bloque) { espErrores.push(`quiz: falta Q${b}`); continue; }
  if (bloque.preguntas.length < 4) espErrores.push(`quiz Q${b}: solo ${bloque.preguntas.length} preguntas (mínimo 4)`);
  bloque.preguntas.forEach((p, i) => {
    preguntasEsp += 1;
    if (!Number.isInteger(p.respuesta) || p.respuesta < 0 || p.respuesta >= p.opciones.length) espErrores.push(`quiz Q${b}.${i + 1}: la respuesta apunta fuera de las opciones`);
    if (new Set(p.opciones).size !== p.opciones.length) espErrores.push(`quiz Q${b}.${i + 1}: opciones repetidas`);
    if (!p.explicacion) espErrores.push(`quiz Q${b}.${i + 1}: sin explicación`);
  });
}
const evalReadme = await leer(join(ESP, "evaluacion", "README.md"));
const preguntasDeclaradas = /(\d+) preguntas autocorregibles/.exec(evalReadme);
if (!preguntasDeclaradas || Number(preguntasDeclaradas[1]) !== preguntasEsp) {
  espErrores.push(`evaluacion/README.md declara ${preguntasDeclaradas?.[1] ?? "ninguna"} preguntas y quiz.json tiene ${preguntasEsp}`);
}
for (const id of ["R-LE1", "R-LE2", "R-LE3", "R-LE4", "R-LE5", "R-LE6", "R-LE7", "R-LE8", "R-CASO", "R-PROY"]) {
  if (!new RegExp(`${id}\\b`).test(rubricas)) espErrores.push(`rubricas.md no define ${id}`);
}

// 7. Glosario y higiene: términos clave presentes y ningún valor con forma de clave privada en los documentos.
const glosarioEsp = await leer(join(ESP, "glosario.md"));
if ((glosarioEsp.match(/^- \*\*/gm) ?? []).length < 60) espErrores.push("el glosario de la especialización tiene menos de 60 términos");
for (const termino of ["EIP-7702", "ERC-4337", "Nonce de cuenta", "Prueba de reservas", "Congelamiento", "Heurística de entradas comunes", "Política de firma"]) {
  if (!glosarioEsp.includes(`**${termino}`) && !glosarioEsp.toLowerCase().includes(`**${termino.toLowerCase()}`)) espErrores.push(`el glosario no define «${termino}»`);
}
const TOPIC_TRANSFER_DOC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
async function mdDe(directorio) {
  const salida = [];
  for (const e of await readdir(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, e.name);
    if (e.isDirectory()) salida.push(...await mdDe(ruta));
    else if (e.name.endsWith(".md")) salida.push(ruta);
  }
  return salida;
}
for (const archivo of await mdDe(ESP)) {
  const texto = await leer(archivo);
  for (const valor of texto.match(/0x[0-9a-fA-F]{64}\b/g) ?? []) {
    if (valor.toLowerCase() !== TOPIC_TRANSFER_DOC) espErrores.push(`${archivo}: contiene ${valor.slice(0, 12)}…, un valor con forma de clave privada o hash sin justificar`);
  }
}

if (espErrores.length) throw new Error(`Especialización de seguridad y custodia:\n${espErrores.join("\n")}`);
console.log(`Especialización: ${archivosBloques.length} bloques, ${archivosLabs.length} laboratorios con ${pruebasLabs} pruebas (más ${nucleoPruebas} del núcleo), matriz de ${vistas.size} unidades (${Object.values(nivelesMatriz).join("/")}), ${preguntasEsp} preguntas y caso con ${hipotesis.length} hipótesis y ${desconocidos.length} desconocidos.`);

// --- Coherencia de versión ----------------------------------------------------
// La versión vive en el package.json raíz. Cualquier otro sitio que la declare
// es una copia que se desincroniza sola: un bump que olvide uno publica un
// instalador y un APK que dicen versiones distintas del mismo curso.
const version = JSON.parse(await readFile("package.json", "utf8")).version;
const versionErrores = [];

for (const app of ["apps/desktop/package.json", "apps/android/package.json"]) {
  const suya = JSON.parse(await readFile(app, "utf8")).version;
  if (suya !== version) versionErrores.push(`${app} declara ${suya} y la raíz ${version} — ejecuta: pnpm sync:versions`);
}

const readme = await readFile("README.md", "utf8");
if (!readme.includes(`versión-${version}-`)) {
  versionErrores.push(`el badge del README no está en ${version}`);
}

const changelog = await readFile("CHANGELOG.md", "utf8");
if (!changelog.includes(`## [${version}]`)) {
  versionErrores.push(`CHANGELOG.md no tiene una entrada para ${version}`);
}

// La tabla de evolución del ROADMAP marca una versión como "actual". Ya se quedó
// una vez tres versiones por detrás sin que nada lo detectara.
const roadmap = await readFile("ROADMAP.md", "utf8");
const actual = /^\| ([0-9.]+) \|.*\| actual \|/m.exec(roadmap);
if (!actual) {
  versionErrores.push("ROADMAP.md no marca ninguna versión como actual");
} else if (actual[1] !== version) {
  versionErrores.push(`ROADMAP.md marca ${actual[1]} como actual y la versión es ${version}`);
}

if (versionErrores.length) throw new Error(`Versión incoherente:\n${versionErrores.join("\n")}`);
console.log(`Versión: ${version} coherente en raíz, apps, README y CHANGELOG.`);
