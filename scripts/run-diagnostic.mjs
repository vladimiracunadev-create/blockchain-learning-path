import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const assessment = JSON.parse(await readFile("assessments/diagnostic.json", "utf8"));
const terminal = createInterface({ input: stdin, output: stdout });
let correct = 0;

console.log(`\n${assessment.title}\n`);
for (const [index, question] of assessment.questions.entries()) {
  console.log(`${index + 1}. ${question.prompt}`);
  question.options.forEach((option, optionIndex) => console.log(`   ${optionIndex + 1}) ${option}`));
  const value = Number(await terminal.question("Respuesta: ")) - 1;
  if (value === question.answer) {
    correct += 1;
    console.log("Correcta.\n");
  } else {
    console.log(`Revisar: ${question.explanation}\n`);
  }
}
terminal.close();
const score = Math.round(correct / assessment.questions.length * 100);
console.log(`Resultado: ${score}% · ${score >= assessment.passingScore ? "puedes considerar la ruta rápida" : "comienza por el módulo 00"}.`);
