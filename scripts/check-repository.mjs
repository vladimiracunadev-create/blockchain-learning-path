import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";

const required = [
  "README.md",
  "ROADMAP.md",
  "SECURITY.md",
  "docs/mejores-practicas.md",
  "curriculum/README.md",
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
  "industria/README.md"
];

for (const file of required) await access(join(process.cwd(), file));

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
if (!packageJson.packageManager?.startsWith("pnpm@")) {
  throw new Error("Debe fijarse pnpm como gestor del repositorio");
}

console.log(`Repositorio válido: ${required.length} documentos esenciales presentes.`);

const catalog = await readFile("labs/CATALOG.md", "utf8");
const practices = catalog.match(/^\| \d{2} \|/gm) ?? [];
if (practices.length !== 50) throw new Error(`Se esperaban 50 prácticas y existen ${practices.length}`);

const diagnostic = JSON.parse(await readFile("assessments/diagnostic.json", "utf8"));
if (!Array.isArray(diagnostic.questions) || diagnostic.questions.length < 5) {
  throw new Error("Diagnóstico incompleto");
}

console.log("Catálogo: 50 prácticas. Diagnóstico: válido.");

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
  ["01-foundations.md", "02-consensus-bitcoin.md", "03-evm-development.md", "04-professional-security.md", "05-advanced-capstone.md"]
    .map((name) => readFile(join("labs/guides", name), "utf8"))
);
const guidedPractices = guideText.join("\n").match(/^## \d{2} ·/gm) ?? [];
if (guidedPractices.length !== 50) {
  throw new Error(`Se esperaban 50 guías prácticas y existen ${guidedPractices.length}`);
}
console.log("Guías prácticas: 50/50.");

// --- Autoevaluación por módulo -----------------------------------------------
// Un quiz con una respuesta correcta fuera de rango o con opciones repetidas no
// falla al construir el sitio: falla en la cara del alumno, que no entiende por
// qué acertando le dice que no. Aquí se comprueba antes de publicar.
const quizzes = JSON.parse(await readFile("assessments/module-quizzes.json", "utf8"));
const moduleSlugs = (await readdir("curriculum", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

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
  if (!moduleSlugs.includes(slug)) quizErrors.push(`${slug}: hay quiz pero no existe el módulo`);
}
if (quizErrors.length) throw new Error(`Autoevaluación por módulo:\n${quizErrors.join("\n")}`);
console.log(`Autoevaluación: ${moduleSlugs.length}/${moduleSlugs.length} módulos, ${preguntas} preguntas.`);

// --- Cadena anterior/siguiente entre módulos ---------------------------------
// El curso es secuencial: si un módulo apunta al vecino equivocado (o a ninguno),
// el alumno se salta contenido sin enterarse. Insertar un módulo nuevo en medio
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

  const pie = texto.split(/\n## [^\n]*Navegación[^\n]*\n/)[1];
  if (!pie) {
    cadenaErrores.push(`${slug}: falta la sección de navegación al pie`);
  } else {
    if (!pie.includes(anterior)) cadenaErrores.push(`${slug}: el pie no enlaza al anterior (${anterior})`);
    if (!pie.includes(siguiente)) cadenaErrores.push(`${slug}: el pie no enlaza al siguiente (${siguiente})`);
  }
}
if (cadenaErrores.length) throw new Error(`Cadena de módulos rota:\n${cadenaErrores.join("\n")}`);
console.log(`Cadena anterior/siguiente: ${moduleSlugs.length} módulos encadenados.`);

// --- Trazabilidad de las fuentes ----------------------------------------------
// El contenido de los módulos es original, pero se apoya en obras concretas. Esa
// afirmación solo vale algo si el lector PUEDE IR A COMPROBARLA: cada módulo debe
// declarar su fuente y ofrecer enlaces a fuente primaria, y la bibliografía debe
// decir dónde se usa cada obra.
//
// Sin esto, un módulo podría afirmar cualquier cosa "según Antonopoulos" y nadie
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
if (fuentesErrores.length) throw new Error(`Fuentes no trazables:\n${fuentesErrores.join("\n")}`);
console.log(`Fuentes: ${moduleSlugs.length} módulos con fuente declarada y referencias enlazadas.`);

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

if (versionErrores.length) throw new Error(`Versión incoherente:\n${versionErrores.join("\n")}`);
console.log(`Versión: ${version} coherente en raíz, apps, README y CHANGELOG.`);
