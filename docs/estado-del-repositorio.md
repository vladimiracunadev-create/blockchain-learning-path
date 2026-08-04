# Estado de completitud

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🗺️ Roadmap](../ROADMAP.md)

Estado honesto de lo que el repositorio entrega hoy y de lo que requiere infraestructura
externa. El programa cubre **19 módulos (00–18)** organizados en **6 etapas**:
Orientación, Fundamentos, Desarrollo, Profesional, Avanzado y Producción.

Leyenda: ✅ disponible · 🚧 parcial o requiere operación externa.

## Contenido incluido

| Área | Qué incluye | Estado |
|---|---|:---:|
| Currículo | 19 módulos (00–18) con esquemas Mermaid, casos reales, fuentes y navegación | ✅ |
| Rutas por perfil | Itinerarios según objetivo del estudiante | ✅ |
| Industria | Construcción de una red, stack, equipos, empresas, negocio y ciclo de vida | ✅ |
| Prácticas | Cincuenta prácticas con criterios de aceptación | ✅ |
| Laboratorios | Automáticos sin dependencias y laboratorios Foundry | ✅ |
| Bitcoin regtest | Entorno de práctica UTXO | ✅ |
| Contratos de ejemplo | Token, oráculo, gobernanza, Vault y financiamiento | ✅ |
| dApp y datos | Interfaz, indexador y panel educativo | ✅ |
| Seguridad | Ofensiva autorizada y auditoría | ✅ |
| Evaluación | Evaluaciones, progreso, certificado y kit docente | ✅ |
| Autoevaluación | Quiz global de 24 preguntas + 76 preguntas repartidas en los 19 módulos | ✅ |
| Apps offline | App de escritorio para Windows y APK de Android con todo el curso dentro | ✅ |
| Manual en PDF | ~340 páginas con todo el contenido; se genera en cada publicación | ✅ |
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

## Componentes del repositorio

| Área | Qué incluye | Estado | Cómo verificar |
|---|---|:---:|---|
| `curriculum/` | Módulos 00–18 y plantilla | ✅ | Abrir `curriculum/README.md` |
| `labs/` | Laboratorios con guía y catálogo | ✅ | Revisar `labs/CATALOG.md` |
| `projects/` | Contratos Foundry de ejemplo | ✅ | `forge test` en el proyecto |
| `apps/` | dApp web, indexador, panel y las dos apps offline | ✅ | Ver [despliegue local](despliegue-local.md) |
| `apps/desktop/` | App de Windows (Electron) | ✅ | `pnpm app:windows:verify` |
| `apps/android/` | App Android (Capacitor) | ✅ | `pnpm app:android:verify` |
| `capstone/` | Proyecto integrador | ✅ | Abrir `capstone/README.md` |
| `assessments/` | Evaluaciones y progreso | ✅ | Revisar rúbricas y criterios |
| `instructor/` | Kit docente y syllabus | ✅ | Abrir `instructor/README.md` |
| `industria/` | Análisis de la industria | ✅ | Abrir `industria/README.md` |
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
