import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { classFileName } from "./curriculum-lib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const source = JSON.parse(readFileSync(join(ROOT, "learning-paths", "roles.json"), "utf8"));
const LEVEL_DESCRIPTIONS = {
  Fundamental: "Comprende conceptos, vocabulario, principios y limitaciones.",
  Aplicado: "Ejecuta procedimientos guiados y explica resultados.",
  "Autónomo": "Resuelve problemas sin depender de instrucciones paso a paso.",
  Avanzado: "Diseña, compara, diagnostica y optimiza soluciones complejas.",
  "Profesional integrador": "Entrega un proyecto verificable, defiende decisiones y reconoce riesgos y límites."
};
const curriculum = JSON.parse(readFileSync(join(ROOT, "curriculum", "classes.json"), "utf8"));
const unitDirs = readdirSync(join(ROOT, "curriculum"), { withFileTypes: true })
  .filter((item) => item.isDirectory() && /^\d{2}-/.test(item.name))
  .map((item) => item.name).sort();
const classes = new Map();
for (const unit of curriculum) {
  const directory = unitDirs.find((item) => item.startsWith(`${unit.unit}-`));
  for (const item of unit.classes) {
    const id = Number(item.id);
    const path = `curriculum/${directory}/${classFileName(item)}`;
    classes.set(id, { ...item, path });
  }
}

const labText = readFileSync(join(ROOT, "labs", "CATALOG.md"), "utf8");
const labs = new Map();
for (const match of labText.matchAll(/^\|\s*(\d{2})\s*\|\s*([^|]+?)\s*\|/gm)) {
  labs.set(Number(match[1]), match[2].trim());
}

const coverageValues = new Set([
  "Completa y verificada", "Parcial", "Insuficiente", "Sin evidencia", "Pendiente de revisión"
]);
const requiredArrays = [
  "aliases", "includedTitles", "responsibilities", "daily", "environments", "foundations",
  "technical", "nonTechnical", "tools", "prerequisites", "requiredClasses",
  "complementaryClasses", "essentialLabs", "advancedLabs", "evidence", "assessment",
  "mistakes", "guardrails", "differences", "specializations", "progression", "gaps", "sources"
];
const errors = [];
const seen = new Set();
for (const role of source.roles) {
  if (seen.has(role.slug)) errors.push(`slug duplicado: ${role.slug}`);
  seen.add(role.slug);
  for (const field of requiredArrays) {
    if (!Array.isArray(role[field]) || role[field].length === 0) errors.push(`${role.slug}: ${field} vacío`);
  }
  for (const id of [...role.requiredClasses, ...role.complementaryClasses]) {
    if (!classes.has(id)) errors.push(`${role.slug}: clase inexistente ${id}`);
  }
  for (const id of [...role.essentialLabs, ...role.advancedLabs]) {
    if (!labs.has(id)) errors.push(`${role.slug}: práctica inexistente ${id}`);
  }
  if (!Array.isArray(role.levelEvidence) || role.levelEvidence.length !== 5) errors.push(`${role.slug}: se requieren cinco niveles`);
  if (!coverageValues.has(role.coverage)) errors.push(`${role.slug}: cobertura inválida ${role.coverage}`);
  if (!role.project?.title || !role.project?.brief || !role.project?.criteria?.length || !role.project?.ethics) errors.push(`${role.slug}: proyecto incompleto`);
  for (const sourceItem of role.sources ?? []) {
    if (!sourceItem?.title || !/^https:\/\//.test(sourceItem?.url ?? "")) errors.push(`${role.slug}: fuente inválida`);
  }
}
if (source.roles.length !== 13) errors.push(`se esperaban 13 rutas canónicas y hay ${source.roles.length}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(source.reviewedAt)) errors.push("reviewedAt no es una fecha ISO");
if (errors.length) throw new Error(`Rutas profesionales inválidas:\n- ${errors.join("\n- ")}`);

const relFromRoles = (path) => `../../${path.replaceAll("\\", "/")}`;
const classLinks = (ids) => ids.map((id) => {
  const item = classes.get(id);
  return `[${id}. ${item.title}](${relFromRoles(item.path)})`;
}).join(" · ");
const labLinks = (ids) => ids.map((id) => `[${String(id).padStart(2, "0")}. ${labs.get(id)}](../../labs/CATALOG.md)`).join(" · ");
const bullets = (items) => items.map((item) => `- ${item}`).join("\n");
const q = (value) => value.replaceAll("|", "\\|").replaceAll("\n", " ");

function roleMarkdown(role) {
  const webPaths = role.requiredClasses.map((id) => classes.get(id).path.replace(/\.md$/, ".html")).join(",");
  return `# ${role.name}

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **${source.reviewedAt}**

<div class="route-progress" data-route-classes="${webPaths}">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** ${role.aliases.join(", ")}.

${role.description}

**Propósito organizacional.** ${role.purpose}

**Títulos y especializaciones agrupados:** ${role.includedTitles.join(", ")}.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

${bullets(role.responsibilities)}

### Actividades cotidianas

${bullets(role.daily)}

### Entornos de desempeño

${bullets(role.environments)}

## Base de entrada

### Conocimientos básicos

${bullets(role.foundations)}

### Requisitos previos

${bullets(role.prerequisites)}

## Competencias

### Técnicas

${bullets(role.technical)}

### No técnicas

${bullets(role.nonTechnical)}

### Herramientas y tecnologías

${bullets(role.tools)}

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

${classLinks(role.requiredClasses)}

### Clases complementarias

${classLinks(role.complementaryClasses)}

### Laboratorios esenciales

${labLinks(role.essentialLabs)}

### Laboratorios avanzados

${labLinks(role.advancedLabs)}

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
${source.methodology.levels.map((level, index) => `| ${level} | ${role.levelEvidence[index]} |`).join("\n")}

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### ${role.project.title}

${role.project.brief}

**Criterios de aceptación**

${bullets(role.project.criteria)}

**Consideración ética y de seguridad.** ${role.project.ethics}

## Evidencias y evaluación

### Evidencias de aprendizaje

${bullets(role.evidence)}

### Métodos de evaluación

${bullets(role.assessment)}

## Juicio profesional

### Errores frecuentes

${bullets(role.mistakes)}

### Seguridad, ética y normativa

${bullets(role.guardrails)}

### Diferencias frente a roles relacionados

${bullets(role.differences)}

### Posibles especializaciones

${bullets(role.specializations)}

### Evolución profesional posible

${bullets(role.progression)}

## Cobertura y brechas

**Cobertura actual:** ${role.coverage}.

${bullets(role.gaps)}

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

${bullets(role.sources.map((sourceItem) => `[${sourceItem.title}](${sourceItem.url})`))}
`;
}

function indexMarkdown() {
  const families = [...new Set(source.roles.map((role) => role.family))];
  return `# 🧭 Rutas de aprendizaje por rol profesional

> [⬅️ Programa](../README.md) · [Matriz de trazabilidad](TRACEABILITY.md) · [Inventario de cargos](ROLE_INVENTORY.md)

Esta capa orienta el currículo común de 66 clases y 91 prácticas hacia funciones profesionales verificables. No duplica recursos ni crea credenciales: cada ruta selecciona clases, laboratorios, evidencias y un proyecto integrador ya compatibles con la arquitectura del repositorio.

## Cómo usar las rutas

1. Completa los prerrequisitos y el tronco común indicado por la ficha.
2. Elige una familia y abre la ruta canónica que reúne cargos cercanos.
3. Recorre clases obligatorias, prácticas esenciales y recursos complementarios.
4. Conserva evidencias reproducibles y somételas a los métodos de evaluación descritos.
5. Entrega el proyecto integrador y declara explícitamente riesgos y límites.

## Familias profesionales e índice de roles

${families.map((family) => `### ${family}\n\n${source.roles.filter((role) => role.family === family).map((role) => `- [${role.name}](roles/${role.slug}.md) — ${role.aliases.slice(0, 2).join(" / ")}.`).join("\n")}`).join("\n\n")}

## Requisitos previos

Todas las rutas parten de programación y herramientas básicas acordes a su especialidad, manejo seguro de claves de prueba y comprensión del tronco común. La ficha concreta qué clases completar primero. No se requieren fondos reales, mainnet ni credenciales de producción.

## Niveles de competencia

| Nivel | Alcance |
|---|---|
${source.methodology.levels.map((level) => `| ${level} | ${LEVEL_DESCRIPTIONS[level]} |`).join("\n")}

Los niveles miden evidencia educativa; no conceden seniority, experiencia laboral ni autorización profesional.

## Clases, laboratorios y proyectos de portafolio

La [matriz profesional de trazabilidad](TRACEABILITY.md) conecta **rol → competencia → clase → laboratorio → evidencia → evaluación**. Una clase o práctica puede servir a varias rutas sin copiarse. Cada ficha culmina con un proyecto de portafolio, criterios de aceptación, evidencia reproducible, evaluación y límites éticos.

## Alcance y empleabilidad

Completar una ruta es capacitación y puede demostrar competencias mediante evidencias; no constituye certificación oficial, licencia, promesa de empleo ni experiencia laboral real. La selección profesional depende además del contexto, la evaluación independiente, la experiencia y los requisitos legales de cada organización y jurisdicción.

## Fuente canónica y mantenimiento

Las relaciones estructuradas viven en [roles.json](roles.json). Las fichas, este índice y las matrices se generan con \`pnpm build:paths\` y se verifican con \`pnpm check\`. Última revisión: **${source.reviewedAt}**.
`;
}

function inventoryMarkdown() {
  const rows = source.roles.flatMap((role) => role.includedTitles.map((title) => `| ${q(title)} | [${q(role.name)}](roles/${role.slug}.md) | Especialidad agrupada para evitar duplicar el currículo. |`));
  return `# Inventario de cargos y consolidación de rutas

> [← Rutas por rol](README.md) · Revisión: **${source.reviewedAt}**

Los títulos laborales no son taxonomías universales. Siguiendo NIST NICE, una función se describe por trabajo, competencias y evidencias; no se asume que un título sea idéntico entre organizaciones. Los cargos iniciales se consolidaron en rutas canónicas cuando comparten más currículo, herramientas y entregables de los que los separan.

| Cargo o denominación investigada | Ruta canónica | Tratamiento |
|---|---|---|
${rows.join("\n")}

## Criterios de consolidación

- Se mantuvo una ruta separada cuando cambian de forma material el activo protegido, el entregable o el método de evaluación.
- Las especializaciones se documentan dentro de una ruta cuando comparten la mayor parte del tronco y del proyecto integrador.
- La existencia de un anuncio laboral sirve para validar tareas, no para afirmar demanda, salario ni jerarquía.
- Las denominaciones emergentes se dejan como especialidad hasta disponer de trabajo, herramientas y evidencia diferenciados.

## Referencias metodológicas

- [NIST NICE Framework SP 800-181r1](https://doi.org/10.6028/NIST.SP.800-181r1)
- [Modern Cybersecurity Program — rutas profesionales](https://github.com/vladimiracunadev-create/modern-cybersecurity-program/tree/main/rutas)
`;
}

function traceabilityMarkdown() {
  const globalRows = source.roles.map((role) => `| [${q(role.name)}](roles/${role.slug}.md) | ${q(role.family)} | Profesional integrador | ${q(role.technical.join("; "))} | ${role.requiredClasses.join(", ")} | ${role.essentialLabs.map((id) => String(id).padStart(2, "0")).join(", ")} | ${q(role.project.title)} | ${role.coverage} | ${q(role.gaps.join("; "))} |`);
  const detailedRows = source.roles.flatMap((role) => role.technical.slice(0, 3).map((competency, index) => {
    const classId = role.requiredClasses[index % role.requiredClasses.length];
    const labId = role.essentialLabs[index % role.essentialLabs.length];
    return `| [${q(role.name)}](roles/${role.slug}.md) | ${q(competency)} | [${classId}. ${q(classes.get(classId).title)}](${classes.get(classId).path.replace(/^curriculum\//, "../curriculum/")}) | [${String(labId).padStart(2, "0")}. ${q(labs.get(labId))}](../labs/CATALOG.md) | ${q(role.evidence[index % role.evidence.length])} | ${q(role.assessment[index % role.assessment.length])} |`;
  }));
  return `# Matriz profesional de trazabilidad

> [← Rutas por rol](README.md) · Fuente canónica: [roles.json](roles.json) · Revisión: **${source.reviewedAt}**

## Cobertura global

| Rol | Familia | Nivel | Competencias | Clases | Laboratorios | Proyecto | Cobertura | Brechas |
|---|---|---|---|---|---|---|---|---|
${globalRows.join("\n")}

## Rol → competencia → clase → laboratorio → evidencia → evaluación

| Rol | Competencia | Clase | Laboratorio | Evidencia | Evaluación |
|---|---|---|---|---|---|
${detailedRows.join("\n")}

## Regla de interpretación

“Completa y verificada” exige contenido suficiente, una práctica pertinente y evidencia evaluable. “Parcial” identifica una base útil con una brecha explícita. Las categorías “Insuficiente”, “Sin evidencia” y “Pendiente de revisión” impiden inferir dominio a partir de una simple mención.
`;
}

const outputs = new Map([
  [join(ROOT, "learning-paths", "README.md"), indexMarkdown()],
  [join(ROOT, "learning-paths", "ROLE_INVENTORY.md"), inventoryMarkdown()],
  [join(ROOT, "learning-paths", "TRACEABILITY.md"), traceabilityMarkdown()],
  ...source.roles.map((role) => [join(ROOT, "learning-paths", "roles", `${role.slug}.md`), roleMarkdown(role)])
]);

let drift = false;
for (const [path, content] of outputs) {
  const normalized = `${content.trim()}\n`;
  if (CHECK) {
    if (!existsSync(path) || readFileSync(path, "utf8").replaceAll("\r\n", "\n") !== normalized) {
      console.error(`Desactualizado: ${relative(ROOT, path)}`);
      drift = true;
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, normalized, "utf8");
  }
}
if (drift) process.exitCode = 1;
else console.log(`${CHECK ? "Verificadas" : "Generadas"} ${outputs.size} salidas profesionales desde roles.json.`);
