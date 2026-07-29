# Historial de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado [SemVer](https://semver.org/lang/es/).

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

[0.4.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.4.0
[0.3.1]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.3.1
[0.3.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.3.0
[0.2.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.2.0
[0.1.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.1.0
