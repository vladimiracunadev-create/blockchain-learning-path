# Auditoría · Estado inicial encontrado

> [⬅️ Índice de la auditoría](README.md) · [🏠 Programa](../../README.md) · [📚 Currículo](../../curriculum/README.md)

Fotografía del repositorio **antes** de la evolución a `0.9.0`, tomada el
**2026-08-12** sobre el commit `69d2d6e` (v0.8.1). Las cifras se midieron
ejecutando conteos sobre los archivos reales, no se copiaron de la
documentación existente — precisamente porque comprobar esa coincidencia era
parte de la auditoría.

## Métricas medidas

| Magnitud | Valor medido | Cómo se midió |
|---|---:|---|
| Archivos versionados | 230 | `git ls-files` |
| Documentos Markdown | 98 | `find . -name '*.md'` excluyendo `node_modules` |
| Palabras de contenido | 127 972 | `cat` de todos los `.md` + `wc -w` |
| Módulos del currículo | 19 (00–18) | directorios `curriculum/NN-*` |
| Palabras en el currículo | 52 207 | 21 `.md` bajo `curriculum/` |
| Prácticas catalogadas | 50 | filas `\| NN \|` en `labs/CATALOG.md` |
| Prácticas auto-verificables | 31 | filas del catálogo marcadas `**auto**` |
| Pruebas automatizadas | 80 | 60 Node (`^test(`) + 20 Foundry (`function test`) |
| Preguntas de autoevaluación | 76 | `assessments/module-quizzes.json` (4 × 19) |
| Workflows de CI | 7 | `.github/workflows/*.yml` |
| ADR | 6 | `adrs/NNN-*.md` |

## Qué había, área por área

### Currículo (`curriculum/`)

19 módulos numerados `00`–`18`, agrupados en seis etapas (Orientación,
Fundamentos, Desarrollo, Profesional, Avanzado, Producción). Todos siguen la
misma plantilla y **la CI verifica que la sigan**: cabecera con fuente y
navegación, objetivos, resultados de aprendizaje, temas, modelo mental, esquema
Mermaid, conceptos, profundización (mínimo 400 palabras, comprobado), laboratorio,
reto verificable, errores frecuentes, seguridad y ética, referencias (mínimo 3
enlaces, comprobado) y navegación al pie.

La calidad media es alta y **homogénea**: la profundización usa el patrón de
cuatro capas descrito en [`docs/diseno-pedagogico.md`](../diseno-pedagogico.md),
con ejemplos numéricos trabajados y bloques `<details>` para el lector avanzado.
No se encontró ningún módulo "de relleno".

### Laboratorios (`labs/`, `security-challenges/`, `projects/`)

- 10 laboratorios Node ejecutables con sus `.test.mjs` (criptografía, consenso,
  mini-chain, UTXO, ABI, ciclo de transacción, montos de token, tokenomics).
- 2 proyectos Foundry (`06-solidity-vault`, `08-protocols`) y un proyecto
  integrador (`projects/community-funding`).
- 6 retos de seguridad con contrato vulnerable + prueba de explotación + corrección.
- Bitcoin Core en `regtest` vía Docker Compose.
- Cuaderno de resoluciones con las 50 prácticas explicadas paso a paso.

### Aplicaciones (`apps/`)

dApp con viem, indexador de eventos con checkpoint, panel de progreso, app de
escritorio (Electron) y app Android (Capacitor). Ambos binarios se **abren** en
CI para contar módulos, páginas y preguntas: compilar no se acepta como prueba
de que el artefacto contiene el curso.

### Calidad y automatización (`scripts/`, `.github/`)

`scripts/check-repository.mjs` es el activo más valioso del repositorio y
condiciona cualquier evolución. Verifica, en este orden:

1. Presencia de 19 documentos esenciales.
2. Recuento de prácticas del catálogo (fijado en 50).
3. Validez del diagnóstico.
4. **Todos los enlaces Markdown locales** (rutas relativas resueltas en disco).
5. Recuento de guías de resolución (fijado en 50).
6. Autoevaluación: un quiz por módulo, respuesta correcta en rango, sin opciones
   repetidas, con explicación obligatoria.
7. **Cadena anterior/siguiente** entre módulos, más glosario y guía de novatos
   enlazados desde cada uno.
8. Trazabilidad de fuentes: `**Fuente:**` en cabecera, ≥3 enlaces en Referencias,
   fila en la bibliografía y ≥400 palabras de profundización.
9. Recuento de pruebas contrastado contra el número escrito en la bibliografía.
10. Prácticas auto-verificables contrastadas contra el número escrito en el README.
11. Coherencia de versión entre `package.json`, apps, README, CHANGELOG y ROADMAP.

`scripts/build-site.mjs` y `scripts/build-manual.mjs` **descubren los módulos por
directorio** (`/^\d{2}-/`), de modo que un módulo nuevo entra solo en el sitio, en
el manual y en las apps. Esto determinó la estrategia de migración: extender la
numeración es barato, renumerar es caro.

## Fortalezas que se decidió preservar intactas

1. **La numeración `00`–`18` está referenciada por todas partes** — README,
   bibliografía, catálogo de prácticas, quizzes, rutas por perfil, syllabus,
   guías de laboratorio y los verificadores de las apps. Renumerar habría roto
   cientos de enlaces a cambio de nada pedagógico.
2. **El validador es el contrato del repositorio.** Todo contenido nuevo se
   escribió para pasarlo, no se relajó ninguna comprobación. Donde había una
   cifra fija (50 prácticas, 50 guías) se actualizó la cifra, no se eliminó la
   comprobación.
3. **El tono es explicativo y honesto**, sin promesas de rentabilidad y con
   comparación sistemática frente a la alternativa tradicional. La ampliación
   financiera es exactamente el terreno donde ese tono más se pone a prueba.

## Documento de estado previo

El repositorio ya mantenía [`docs/estado-del-repositorio.md`](../estado-del-repositorio.md),
que describe el estado funcional. Esta auditoría **no lo reemplaza**: aquel
responde "¿qué hay y funciona?", este responde "¿qué falta y por qué?".

---

## 🧭 Navegación

[⬅️ Índice de la auditoría](README.md) · ➡️ [Análisis de brechas](GAP_ANALYSIS.md) · [🏠 Programa](../../README.md)
