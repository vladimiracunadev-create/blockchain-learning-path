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
  "docs/despliegue-local.md"
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
    .filter((entry) => ![".git", "node_modules", "dist"].includes(entry.name))
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
