import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Los mínimos se CUENTAN del repositorio, no se escriben a mano: escritos a mano
// se quedan atrás en cuanto el currículo crece, y entonces el certificado se emite
// con el programa a medias sin que nada avise.
const MODULOS_REQUERIDOS = (await readdir(join(ROOT, "curriculum"), { withFileTypes: true }))
  .filter((entrada) => entrada.isDirectory() && /^\d{2}-/.test(entrada.name)).length;
const PRACTICAS_REQUERIDAS = ((await readFile(join(ROOT, "labs/CATALOG.md"), "utf8"))
  .match(/^\| \d+ \|/gm) ?? []).length;

const progressPath = process.argv[2];
if (!progressPath) throw new Error("Uso: pnpm course:certificate ruta/al/progress.json");
const progress = JSON.parse(await readFile(progressPath, "utf8"));
const modules = Object.values(progress.modules);
const labs = Object.values(progress.labs);
if (modules.length < MODULOS_REQUERIDOS || modules.some((module) => module.status !== "completed" || module.score < 80)) {
  throw new Error(`Se requieren ${MODULOS_REQUERIDOS} módulos completados con nota mínima de 80`);
}
if (labs.length < PRACTICAS_REQUERIDAS || labs.some((lab) => lab.status !== "completed" || !lab.evidence)) {
  throw new Error(`Se requieren ${PRACTICAS_REQUERIDAS} prácticas completadas con evidencia`);
}
if (progress.capstone.status !== "completed") throw new Error("El capstone debe estar completado");
const safeName = progress.student.normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "");
const output = `CERTIFICATE-${safeName}.md`;
const content = `# Certificado local de finalización

Se deja constancia de que **${progress.student}** registró la finalización de los ${MODULOS_REQUERIDOS} módulos y del proyecto final de Blockchain Learning Path.

- Perfil: ${progress.profile}
- Proyecto: ${progress.capstone.title}
- Evidencias: ${MODULOS_REQUERIDOS} módulos y ${PRACTICAS_REQUERIDAS} prácticas
- Fecha de emisión local: ${new Date().toISOString().slice(0, 10)}

Este documento es generado a partir de evidencias locales. Aprobación de instructor registrada: ${progress.instructorApproved ? "sí" : "no"}. No constituye un título reconocido ni reemplaza la verificación de una institución.
`;
await writeFile(output, content);
console.log(`Certificado generado: ${output}`);
