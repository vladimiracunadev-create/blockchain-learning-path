# Historial de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado [SemVer](https://semver.org/lang/es/).

## [0.7.0] · 2026-08-04

El curso sale del navegador: aplicación de escritorio para Windows y app Android,
ambas con todo el contenido offline. Autoevaluación en cada módulo y corrección de
tres fallos que rompían el curso en Windows.

### Añadido

- **App de escritorio para Windows** (Electron): instalador NSIS y versión portable
  con los 19 módulos, las 50 prácticas, los ADR y el manual PDF dentro del ejecutable.
  Funciona sin conexión. Ver [apps/desktop](apps/desktop/README.md).
- **App Android** (Capacitor): APK de ~8,5 MB con el mismo contenido offline.
  Ver [apps/android](apps/android/README.md).
- **Icono propio** para ambas apps, generado desde un único SVG
  ([apps/icono.svg](apps/icono.svg)) a ICO multi-tamaño y a los mipmaps de Android,
  incluido el icono adaptativo.
- **Autoevaluación por módulo**: 76 preguntas nuevas (4 por módulo) al cierre de cada
  uno. Cada opción incorrecta es un error frecuente documentado en ese mismo módulo,
  así que fallar indica qué releer. Se corrige en el navegador y guarda el mejor
  resultado por módulo.
- **Navegación anterior/siguiente** en la cabecera de cada módulo, además del pie, y
  como barra de tarjetas en el sitio y en las apps.
- **Verificación de contenido de los binarios**: `smoke.js` abre la app de escritorio y
  `verificar-apk.mjs` abre el APK para contar módulos, páginas y preguntas *dentro* del
  artefacto. Un build en verde no prueba que el binario tenga el curso; esto sí.
- **Vigilancia de enlaces externos** (lychee, semanal): los ~240 enlaces del material
  se revisan y abren un issue si se rompen.
- **ESLint** sobre el JavaScript del repositorio y `forge fmt --check` sobre Solidity.
- **CODE_OF_CONDUCT.md** y **CODEOWNERS**.
- Validación permanente en `pnpm check` de la autoevaluación (respuestas dentro de
  rango, sin opciones repetidas, con explicación) y de la cadena de módulos.

### Corregido

- **`pnpm test` se colgaba indefinidamente en Windows.** El servidor del panel calculaba
  su raíz con `.pathname`, que en Windows devuelve `/C:/…`; el guard anti-traversal
  rechazaba entonces *todas* las peticiones con 403, el assert fallaba y el servidor
  nunca se cerraba. La suite ahora termina en menos de un segundo.
- **Los laboratorios no imprimían nada en Windows.** Los 7 puntos de entrada usaban
  ``import.meta.url === `file://${process.argv[1]}` ``, comparación que nunca es cierta
  en Windows. `pnpm lab:hash` y compañía funcionaban en Linux y no hacían nada aquí.
- **El buscador del sitio partía las consultas por la letra «s».** El `\s` del patrón
  estaba dentro de un template literal y se generaba como `split(/s+/)`.
- La CI instalaba con `--frozen-lockfile=false`, de modo que el lockfile no garantizaba
  nada en el job que ejecuta las pruebas.
- El test del panel se llamaba «bloquea traversal» pero no probaba traversal: `fetch`
  normaliza los `..` en el cliente. Ahora se comprueba con peticiones crudas.

### Cambiado

- **El manual en PDF (10 MB) deja de versionarse** y pasa a publicarse como artefacto de
  cada release. Seguía sumando ~10 MB permanentes al historial en cada regeneración.
- Node unificado en **22** entre `engines`, CI, Pages y devcontainer, con `.nvmrc`.
- El ROADMAP volvía a marcar 0.3.0 como versión actual; ahora refleja el historial real.
- Sitio y apps comparten el mismo build: `SITE_BASE` y `SITE_OUT` permiten generarlo
  para GitHub Pages o para empaquetarlo offline.

## [0.6.0] · 2026-07-29

Laboratorios ejecutables, CI reforzada, entorno reproducible y sitio con buscador.

### Añadido

- **Suite exploit + fix de los retos de seguridad**: 12 tests Foundry que demuestran el
  ataque y verifican la corrección de cada reto (reentrancia, control de acceso, oráculo,
  replay de firma, front-running/commit-reveal, storage collision). Las prácticas 37–42
  pasan a **auto** (21/50 auto-verificadas, antes 15).
- **CI reforzada** (el módulo 09 lo enseña, ahora la CI lo corre): análisis estático con
  **Slither** sobre los contratos de producción, resumen de **cobertura** de Foundry, y
  el job de retos pasa de `forge build` a `forge test`.
- **CodeQL** para el código JavaScript/TypeScript (panel Security).
- **Entorno reproducible** con `.devcontainer/` — abre el repo en GitHub Codespaces con
  Node, pnpm, Foundry y Docker listos.
- **Buscador** y **seguimiento de progreso** en el sitio: búsqueda instantánea sobre
  todo el contenido y marca de módulos leídos (con barra de progreso) guardada en el
  navegador.
- **Autoevaluación interactiva** en el sitio: un quiz de 24 preguntas de razonamiento
  sobre todo el currículo, con puntuación y explicación de cada respuesta.

### Cambiado

- Versiones de GitHub Actions normalizadas entre workflows.

## [0.5.0] · 2026-07-29

Manual del usuario en PDF con todo el contenido del curso.

### Añadido

- **Manual del usuario en PDF** (`manual/MANUAL.pdf`, ~310 páginas): compila todo el
  contenido del programa —19 módulos, industria, laboratorios con su resolución, ADR,
  documentación de referencia y proyecto final— en un único documento con portada,
  índice y los **diagramas Mermaid renderizados**. Se genera con `pnpm build:manual`
  (`scripts/build-manual.mjs` + `scripts/render-manual-pdf.mjs`, vía Chrome headless).
- Enlace al manual desde el **README**, la **portada** y el **menú del sitio**; el PDF
  se publica también en GitHub Pages (`/manual/MANUAL.pdf`).

### Cambiado

- El workflow de Pages usa **pnpm** (no npm) e instala `marked` y `puppeteer-core` como
  devDependencies; copia el manual versionado al sitio publicado.

## [0.4.0] · 2026-07-29

Sitio navegable en GitHub Pages y navegación clara en todo el sistema.

### Añadido

- **Sitio navegable** (`scripts/build-site.mjs`): GitHub Pages pasó de ser una portada
  que rebotaba a los `.md` crudos a un sitio con **menú lateral** por secciones (Currículo
  00–18, Industria, Laboratorios, ADR, Documentación, Capstone y rutas), **diagramas
  Mermaid renderizados**, tablas y código con estilo, **tema claro/oscuro** y diseño
  responsive. Reescribe los enlaces `.md → .html` y deja los de código/directorios hacia
  GitHub. La portada ahora entra al sitio en vez de a GitHub crudo.

### Cambiado

- **`labs/CATALOG.md` navegable**: de una tabla sin enlaces a un catálogo agrupado por
  bloque donde cada práctica enlaza a su **módulo** y a su **resolución explicada**.
- Los **19 módulos** enlazan desde su laboratorio al catálogo y su resolución.

## [0.3.1] · 2026-07-29

Barrido de calidad de la documentación y **resolución explicada de los laboratorios**.

### Añadido

- **Resolución explicada de las 50 prácticas**: las 5 guías de `labs/guides/` se
  reescribieron leyendo el código real de cada laboratorio; ahora cada práctica trae
  objetivo, **cómo se resuelve** (pasos), el comando, la **salida esperada explicada** y
  el error común.
- **Guía de comunicación** `docs/explicar-blockchain-a-no-tecnicos.md` (discurso de 30 s,
  traducción de jerga, manejo de objeciones), enlazada desde README, industria y módulo 17.

### Cambiado

- README principal con la estructura de los programas educativos hermanos.
- Desarrollados ~24 documentos que seguían pobres: 7 ADRs, glosario, evaluación, ruta
  rápida, incidentes, recursos, kit de instructor, estudiante, capstone, rutas por perfil,
  diseño pedagógico, mejores prácticas, planes de clase, tecnologías, threat model,
  despliegue local, estado del repo, READMEs de apps/proyectos/labs, assessments y las
  soluciones de los retos de seguridad (patrón de arreglo, no exploits).

## [0.3.0] · 2026-07-29

La etapa de **producción** del currículo: el programa ahora termina llevando la
tecnología a la práctica real de una empresa.

### Añadido

- **Módulo 16 · Infraestructura y operación de nodos**: hardware real por tipo de nodo
  (CPU, RAM, NVMe, IOPS), casa vs. colocation vs. nube vs. gestionado, instancias y
  costos de nube, laboratorio con un nodo Geth real en Docker + `cast`, topología
  redundante y dónde viven físicamente las claves (HSM, MPC, multisig).
- **Módulo 17 · Blockchain en la empresa**: qué ganan las empresas
  (beneficio→mecanismo→evidencia), usos por sector, casos de estudio de éxito (Kinexys,
  BEI/Siemens, BUIDL) y fracaso (TradeLens, Libra/Diem, ASX) con su lección, mapa de
  servicios del mercado, presupuesto completo por partidas y **cómo explicarlo a
  clientes y personas no técnicas** (discurso de 30 segundos, traducción de jerga,
  manejo de objeciones).
- **Módulo 18 · Implementación empresarial end-to-end**: arquitectura de siete capas
  (del usuario al bloque), build vs. buy por componente, ambientes y ceremonias, plan de
  seis meses con entregables, y laboratorio que ensambla la maqueta completa con las
  piezas del repo (Anvil + Foundry + indexador + web).

### Cambiado

- El currículo pasa de 16 a **19 módulos (00–18)** con la nueva etapa "Producción";
  mapa, índice, rutas, roadmap de 26 semanas, certificado y progreso actualizados.

## [0.2.0] · 2026-07-29

Dimensión profesional del programa: industria, profundización y esquemas visuales.

### Añadido

- **Sección Industria** ([`industria/`](industria/README.md)) con seis documentos de
  nivel profesional: cómo se construye una blockchain, el stack tecnológico del
  ecosistema, equipos/roles/metodología, blockchain para empresas (casos reales,
  incluidos fracasos instructivos), modelos de negocio y ciclo de vida de un proyecto.
- **Esquemas visuales**: diagramas Mermaid en los 16 módulos del currículo (flujos,
  secuencias y estados que GitHub renderiza nativamente), mapa visual del programa y
  de la sección de industria.
- **Profundización** en los 16 módulos: subsecciones avanzadas con ejemplos numéricos
  y mini-casos reales verificables (The DAO, Ronin, Wormhole, Beanstalk, Mango,
  TradeLens, entre otros).

### Cambiado

- Índice del currículo con mapa Mermaid y enlace a la sección de industria.
- README con la nueva estructura y navegación.

## [0.1.0] · 2026-07-29

Primera versión pública del programa.

### Añadido

- **Currículo** de 16 módulos progresivos (00–15), de criptografía y consenso a
  arquitectura avanzada, cada uno con teoría, laboratorio y verificación, con el
  formato de clase completo (objetivos, temas, conceptos, reto verificable y errores
  frecuentes), **navegación entre módulos** y **referencias a libros y fuentes primarias**.
- **Bibliografía central** ([`docs/bibliografia.md`](docs/bibliografia.md)) con las obras
  de referencia por área y los hitos recientes del ecosistema (Merge, Dencun/EIP-4844,
  Pectra/EIP-7702).
- **50 prácticas** ejecutables con actividad, evidencia y criterio de aceptación,
  catalogadas en `labs/CATALOG.md`.
- **Contratos con Foundry**: vault, protocolos, token, oráculo y gobernador con
  timelock, con pruebas, fuzzing e invariantes.
- **Retos de seguridad**: contratos vulnerables y sus correcciones con criterios
  de revisión.
- **dApp** de financiamiento comunitario (viem/TypeScript) e **indexador** de
  eventos con checkpoint.
- **Evaluaciones**: diagnóstico, checkpoints, banco de preguntas y plantilla de
  informe de auditoría.
- **6 ADR** de decisiones de arquitectura y material docente (syllabus, checklist).
- **Rutas por perfil** (desarrollo, arquitectura, auditoría, producto,
  investigación, empresa) y **proyecto integrador** (capstone).
- **Landing page** publicada en GitHub Pages, generada desde los datos del repo.
- Tooling del repositorio: CI (Node, Foundry, markdownlint), workflow de
  seguridad (gitleaks), Dependabot, `.gitleaks.toml` y `.markdownlint-cli2.jsonc`.

[0.7.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.7.0
[0.6.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.6.0
[0.5.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.5.0
[0.4.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.4.0
[0.3.1]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.3.1
[0.3.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.3.0
[0.2.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.2.0
[0.1.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.1.0
