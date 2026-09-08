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
  "labs/22-cbdc-mercado-tokenizado/src/DvPSettlement.sol"
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
