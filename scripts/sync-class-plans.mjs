#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const plans = JSON.parse(await readFile("curriculum/classes.json", "utf8"));
const pedagogy = JSON.parse(await readFile("curriculum/pedagogy.json", "utf8"));
const directories = (await readdir("curriculum", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));

if (plans.length !== directories.length) {
  throw new Error(`El catálogo declara ${plans.length} unidades y existen ${directories.length}.`);
}

const START = "<!-- plan-clases:inicio -->";
const END = "<!-- plan-clases:fin -->";

function renderClass(item) {
  const teaching = pedagogy[item.id];
  if (!teaching) throw new Error(`${item.id}: falta diseño pedagógico específico.`);
  return `### Clase ${item.id} · ${item.title}

**Pregunta guía:** ${item.question}

**Enfoque pedagógico:** ${teaching.method}.

${teaching.explanation}

**Núcleo conceptual:**

${item.concepts.map((concept) => `- ${concept}.`).join("\n")}

**Caso de trabajo:** ${item.case}

**Actividad:** ${item.activity}

**Comprobación formativa:** ${teaching.check}

**Evidencia de aprendizaje:** ${item.evidence}`;
}

for (const [index, directory] of directories.entries()) {
  const plan = plans[index];
  const number = directory.name.slice(0, 2);
  if (plan.unit !== number || plan.classes.length !== 2) {
    const first = index * 2 + 1;
    throw new Error(`${directory.name}: se esperaban exactamente las clases ${first} y ${first + 1}.`);
  }

  const path = join("curriculum", directory.name, "README.md");
  const original = await readFile(path, "utf8");
  let updated;
  if (original.includes(START) && original.includes(END)) {
    const current = original.slice(original.indexOf(START), original.indexOf(END) + END.length);
    if (!current.includes("Esta unidad se imparte en **dos clases complementarias**")) continue;
  }

  const block = `${START}
## 🧭 Plan de clases

${plan.classes.map(renderClass).join("\n\n")}
${END}`;

  if (original.includes(START) && original.includes(END)) {
    updated = original.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
  } else {
    const separator = "\n---\n";
    const at = original.indexOf(separator);
    if (at !== -1) {
      const insertAt = at + separator.length;
      updated = `${original.slice(0, insertAt)}\n${block}\n\n---\n${original.slice(insertAt)}`;
    } else {
      const firstSection = original.indexOf("\n## ");
      if (firstSection === -1) throw new Error(`${path}: no contiene una sección donde insertar el plan.`);
      updated = `${original.slice(0, firstSection)}\n\n${block}\n\n---\n${original.slice(firstSection + 1)}`;
    }
  }
  await writeFile(path, updated, "utf8");
}

console.log(`Planes sincronizados: ${plans.length * 2} clases en ${plans.length} unidades.`);
