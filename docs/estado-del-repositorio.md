# Estado de completitud

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🗺️ Roadmap](../ROADMAP.md)

Estado honesto de lo que el repositorio entrega hoy y de lo que requiere infraestructura
externa. El programa cubre **29 módulos (00–28)** organizados en **9 etapas**:
Orientación, Fundamentos, Desarrollo, Profesional, Avanzado, Producción,
Finanzas on-chain, Institucional y regulación, y Analítica de datos on-chain.

Leyenda: ✅ disponible · 🚧 parcial o requiere operación externa.

## Contenido incluido

| Área | Qué incluye | Estado |
|---|---|:---:|
| Currículo | 29 módulos (00–28) con esquemas Mermaid, casos reales, fuentes y navegación, más la unidad transversal [Wallets desde cero](wallets-desde-cero.md) | ✅ |
| Rutas por perfil | Itinerarios según objetivo del estudiante | ✅ |
| Industria | Construcción de una red, stack, equipos, empresas, negocio y ciclo de vida | ✅ |
| Prácticas | Ochenta y tres prácticas con criterios de aceptación (55 auto-verificables) | ✅ |
| Laboratorios | Automáticos sin dependencias y laboratorios Foundry | ✅ |
| Bitcoin regtest | Entorno de práctica UTXO | ✅ |
| Contratos de ejemplo | Token, oráculo, gobernanza, Vault y financiamiento | ✅ |
| dApp y datos | Interfaz, indexador y panel educativo | ✅ |
| Seguridad | Ofensiva autorizada y auditoría | ✅ |
| Evaluación | Evaluaciones, progreso, certificado y kit docente | ✅ |
| Autoevaluación | Quiz global + 117 preguntas repartidas en los 29 módulos | ✅ |
| Apps offline | App de escritorio para Windows y APK de Android con todo el curso dentro | ✅ |
| Manual en PDF | ~400 páginas con todo el contenido; se genera en cada publicación | ✅ |
| Presentación y pauta | 6 diapositivas del programa y pauta del expositor con guion y tiempos; se generan en cada publicación | ✅ |
| Regulación | Chile, MiCA, EE. UU., LatAm y estándares internacionales, con rango normativo y fuente | ✅ |
| Casos reales | Terra/UST, FTX, puente Ronin y El Salvador, con estructura fija de análisis | ✅ |
| Bibliografía | Libros de referencia por área e hitos del ecosistema | ✅ |
| CI y publicación | Lint (Markdown, JS y Solidity), pruebas Node y Foundry, escaneo de secretos, CodeQL, vigilancia de enlaces externos, sitio en GitHub Pages y binarios verificados por contenido | ✅ |

## Etapas del programa

| # | Etapa | Módulos | Estado |
|---:|---|---|:---:|
| 1 | Orientación | 00 | ✅ |
| 2 | Fundamentos | 01–03 | ✅ |
| 3 | Desarrollo | 04–07 | ✅ |
| 4 | Profesional | 08–11 | ✅ |
| 5 | Avanzado | 12–15 | ✅ |
| 6 | Producción | 16–18 | ✅ |
| 7 | Finanzas on-chain | 19–25 | ✅ |
| 8 | Institucional y regulación | 26–27 | ✅ |
| 9 | Analítica de datos on-chain | 28 | ✅ |

## Componentes del repositorio

| Área | Qué incluye | Estado | Cómo verificar |
|---|---|:---:|---|
| `curriculum/` | Módulos 00–28 y plantilla | ✅ | Abrir `curriculum/README.md` |
| `labs/` | Laboratorios con guía y catálogo | ✅ | Revisar `labs/CATALOG.md` |
| `projects/` | Contratos Foundry de ejemplo | ✅ | `forge test` en el proyecto |
| `apps/` | dApp web, indexador, panel y las dos apps offline | ✅ | Ver [despliegue local](despliegue-local.md) |
| `apps/desktop/` | App de Windows (Electron) | ✅ | `pnpm app:windows:verify` |
| `apps/android/` | App Android (Capacitor) | ✅ | `pnpm app:android:verify` |
| `capstone/` | Proyecto integrador | ✅ | Abrir `capstone/README.md` |
| `assessments/` | Evaluaciones y progreso | ✅ | Revisar rúbricas y criterios |
| `instructor/` | Kit docente y syllabus | ✅ | Abrir `instructor/README.md` |
| `industria/` | Análisis de la industria | ✅ | Abrir `industria/README.md` |
| `docs/presentacion.md` | Guion de la muestra: diapositivas y pauta | ✅ | `pnpm build:presentacion` |
| CI / workflows | Lint, pruebas, secretos, CodeQL, enlaces y binarios | ✅ | Revisar estado de Actions en verde |

## Requiere infraestructura externa

Estas capacidades no se simulan como "terminadas" porque necesitan decisiones y operación
reales. El repositorio entrega interfaces, criterios y laboratorios para evolucionar hacia
ellas, sin afirmar que una instalación local equivale a producción.

| Capacidad | Qué falta | Estado |
|---|---|:---:|
| LMS multiusuario | Autenticación y protección de datos | 🚧 |
| Sandbox por estudiante | Entorno remoto aislado | 🚧 |
| Testnets operadas | RPC financiado y monitoreo | 🚧 |
| Certificados institucionales | Emisión reconocida | 🚧 |
| Auditoría externa | Revisión independiente | 🚧 |
| Firma de los binarios | Certificado de firma de código y cuenta de Play Store; sin ellos Windows y Android avisan del origen desconocido | 🚧 |
| Asesoría legal/tributaria | Producto real conforme a normativa | 🚧 |
| Publicación institucional | Organización y dominio propios | 🚧 |

## Recursos relacionados

- [Roadmap](../ROADMAP.md) · [Currículo](../curriculum/README.md)
- [Despliegue local](despliegue-local.md) · [Operación e incidentes](operacion-incidentes.md)
