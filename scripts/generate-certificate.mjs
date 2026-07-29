import { readFile, writeFile } from "node:fs/promises";

const progressPath = process.argv[2];
if (!progressPath) throw new Error("Uso: pnpm course:certificate ruta/al/progress.json");
const progress = JSON.parse(await readFile(progressPath, "utf8"));
const modules = Object.values(progress.modules);
const labs = Object.values(progress.labs);
if (modules.length < 16 || modules.some((module) => module.status !== "completed" || module.score < 80)) {
  throw new Error("Se requieren 16 módulos completados con nota mínima de 80");
}
if (labs.length < 50 || labs.some((lab) => lab.status !== "completed" || !lab.evidence)) {
  throw new Error("Se requieren 50 prácticas completadas con evidencia");
}
if (progress.capstone.status !== "completed") throw new Error("El capstone debe estar completado");
const safeName = progress.student.normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "");
const output = `CERTIFICATE-${safeName}.md`;
const content = `# Certificado local de finalización

Se deja constancia de que **${progress.student}** registró la finalización de los 16 módulos y del proyecto final de Blockchain Learning Path.

- Perfil: ${progress.profile}
- Proyecto: ${progress.capstone.title}
- Evidencias: 16 módulos y 50 prácticas
- Fecha de emisión local: ${new Date().toISOString().slice(0, 10)}

Este documento es generado a partir de evidencias locales. Aprobación de instructor registrada: ${progress.instructorApproved ? "sí" : "no"}. No constituye un título reconocido ni reemplaza la verificación de una institución.
`;
await writeFile(output, content);
console.log(`Certificado generado: ${output}`);
