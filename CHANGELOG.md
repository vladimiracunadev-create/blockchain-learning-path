# Historial de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado [SemVer](https://semver.org/lang/es/).

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

[0.2.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.2.0
[0.1.0]: https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/tag/v0.1.0
