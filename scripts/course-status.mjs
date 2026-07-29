import { readFile } from "node:fs/promises";

const path = process.argv[2] ?? "student/progress.example.json";
const progress = JSON.parse(await readFile(path, "utf8"));
const modules = Object.values(progress.modules);
const labs = Object.values(progress.labs);
const completed = (items) => items.filter((item) => item.status === "completed").length;

console.log(`Estudiante: ${progress.student}`);
console.log(`Perfil: ${progress.profile}`);
console.log(`Módulos: ${completed(modules)}/${modules.length}`);
console.log(`Prácticas registradas: ${completed(labs)}/${labs.length}`);
console.log(`Capstone: ${progress.capstone.status}`);
