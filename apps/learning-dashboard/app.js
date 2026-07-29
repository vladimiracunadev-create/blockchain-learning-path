const names = [
  "Orientación", "Criptografía", "Sistemas distribuidos", "Consenso",
  "Bitcoin", "Ethereum y EVM", "Solidity", "dApps", "Tokens", "Seguridad",
  "Oráculos e indexación", "DAO", "Escalabilidad", "Interoperabilidad",
  "Privacidad y ZK", "Arquitectura avanzada"
];
const questions = [
  ["¿Qué aporta directamente un hash?", ["Confidencialidad", "Integridad verificable", "Identidad legal"], 1],
  ["¿Dónde están los activos que muestra una wallet?", ["En la aplicación", "En la seed", "En el estado de la red; la wallet gestiona claves"], 2],
  ["¿Una auditoría garantiza ausencia de vulnerabilidades?", ["Sí", "No"], 1],
  ["¿Cuándo suele convenir una base tradicional?", ["Autoridad confiable, corrección y alto rendimiento", "Siempre que existan usuarios", "Nunca"], 0],
  ["¿Qué ocurre antes de una llamada externa en CEI?", ["Actualizar efectos internos", "Emitir un NFT", "Cambiar chain ID"], 0]
];
const storageKey = "blockchain-learning-progress-v3";

function loadProgress() {
  try {
    const current = JSON.parse(localStorage.getItem(storageKey));
    if (current?.version === 3) return current;
    const legacy = JSON.parse(localStorage.getItem("blockchain-learning-progress-v2") ?? "[]");
    return { version: 3, completed: Array.isArray(legacy) ? legacy : [], diagnosticScore: null };
  } catch {
    return { version: 3, completed: [], diagnosticScore: null };
  }
}

let progress = loadProgress();
const completed = new Set(progress.completed);
const modules = document.querySelector("#modules");
const done = document.querySelector("#done");
const score = document.querySelector("#score");

function save() {
  progress = { version: 3, completed: [...completed], diagnosticScore: progress.diagnosticScore };
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function render() {
  modules.replaceChildren(...names.map((name, index) => {
    const button = document.createElement("button");
    button.className = completed.has(index) ? "module complete" : "module";
    button.innerHTML = `<small>${String(index).padStart(2, "0")}</small><strong>${name}</strong><span>${completed.has(index) ? "Completado ✓" : "Pendiente"}</span>`;
    button.addEventListener("click", () => {
      completed.has(index) ? completed.delete(index) : completed.add(index);
      save();
      render();
    });
    return button;
  }));
  done.textContent = completed.size;
  score.textContent = progress.diagnosticScore == null ? "—" : `${progress.diagnosticScore}%`;
}

const quiz = document.querySelector("#quiz");
questions.forEach(([prompt, options], questionIndex) => {
  const fieldset = document.createElement("fieldset");
  fieldset.innerHTML = `<legend>${questionIndex + 1}. ${prompt}</legend>${options.map((option, optionIndex) =>
    `<label><input type="radio" name="q${questionIndex}" value="${optionIndex}"> ${option}</label>`
  ).join("")}`;
  quiz.append(fieldset);
});

document.querySelector("#grade").addEventListener("click", () => {
  let correct = 0;
  questions.forEach(([, , answer], index) => {
    const selected = new FormData(quiz).get(`q${index}`);
    if (Number(selected) === answer) correct += 1;
  });
  progress.diagnosticScore = Math.round(correct / questions.length * 100);
  save();
  render();
  document.querySelector("#quizResult").textContent =
    `${progress.diagnosticScore}% · ${progress.diagnosticScore >= 80 ? "Ruta rápida disponible." : "Comienza por el módulo 00."}`;
});

document.querySelector("#export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "blockchain-course-progress.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.querySelector("#import").addEventListener("change", async (event) => {
  const candidate = JSON.parse(await event.target.files[0].text());
  if (candidate.version !== 3 || !Array.isArray(candidate.completed)) {
    throw new Error("Archivo de progreso incompatible");
  }
  progress = candidate;
  completed.clear();
  for (const index of candidate.completed) {
    if (Number.isInteger(index) && index >= 0 && index < names.length) completed.add(index);
  }
  save();
  render();
});

document.querySelector("#reset").addEventListener("click", () => {
  if (!confirm("¿Reiniciar módulos y diagnóstico?")) return;
  completed.clear();
  progress.diagnosticScore = null;
  save();
  render();
});

const message = document.querySelector("#message");
const output = document.querySelector("#hash");
async function updateHash() {
  const bytes = new TextEncoder().encode(message.value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  output.textContent = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
message.addEventListener("input", updateHash);
window.addEventListener("unhandledrejection", (event) => alert(event.reason?.message ?? "Error"));
render();
updateHash();
