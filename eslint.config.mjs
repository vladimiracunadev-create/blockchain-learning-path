// Lint del JavaScript del repositorio. El curso enseña disciplina de calidad en
// el módulo 09; este archivo es esa disciplina aplicada al propio material.
//
// El objetivo NO es imponer estilo (para eso está .editorconfig), sino atrapar
// los errores que un alumno copiaría sin darse cuenta: variables no declaradas,
// promesas sin await, comparaciones sueltas.
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "site/**",
      "**/out/**",
      "**/cache/**",
      "**/lib/**",
      "**/dist/**",
      "apps/android/android/**",
      "apps/desktop/dist/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node }
    },
    rules: {
      // `x == null` es la forma idiomática de decir "null o undefined"; el resto
      // de comparaciones flojas sí son un error.
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off"
    }
  },
  {
    // El panel y la dApp corren en el navegador, no en Node.
    files: ["apps/learning-dashboard/app.js", "apps/community-funding-web/src/**/*.js"],
    languageOptions: { globals: { ...globals.browser } }
  },
  {
    // Este script corre en Node, pero los callbacks de `page.evaluate()` se
    // serializan y ejecutan dentro del navegador de Puppeteer: ahí `document`
    // sí existe.
    files: ["scripts/render-manual-pdf.mjs", "scripts/render-presentation-pdf.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } }
  }
];
