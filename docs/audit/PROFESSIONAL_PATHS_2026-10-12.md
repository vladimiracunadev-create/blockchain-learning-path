# Auditoría curricular, técnica y profesional · 2026-10-12

> [Auditorías](README.md) · [Rutas profesionales](../../learning-paths/README.md) · [Trazabilidad](../../learning-paths/TRACEABILITY.md) · Corte: **2026-10-12**

## Alcance y método

Se inspeccionaron README, ROADMAP, currículo, 66 clases, catálogo de 91 prácticas, guías, proyectos, capstone, matriz de competencias, `learning-paths/`, `industria/`, regulación, bibliografía, casos, generadores, aplicaciones y workflows. Antes de editar se ejecutaron los validadores estructurales, lint y pruebas. La mejora conserva numeración, enlaces y arquitectura; las rutas son una capa generada sobre recursos existentes.

Las afirmaciones externas se contrastaron con documentación oficial, fuentes primarias y ofertas de empleadores usadas sólo para identificar tareas. No se infirieron demanda, salario, seniority ni empleabilidad.

## Fase A — inventario verificable

| Elemento | Estado observado | Fuente de verdad |
|---|---:|---|
| Clases independientes | 66 | `curriculum/classes.json` y archivos `clase-NN-*` |
| Mapas temáticos | 33 | directorios `curriculum/00-*` a `32-*` |
| Prácticas | 91, identificadores 01–91 | `labs/CATALOG.md` |
| Prácticas auto-verificables | 62 | `scripts/check-repository.mjs` |
| Preguntas por unidad | 136 | `assessments/module-quizzes.json` |
| Pruebas declaradas por el validador | 363: 316 Node + 47 Foundry | `scripts/check-repository.mjs` |
| Rutas previas | 10 resúmenes | versión anterior de `learning-paths/README.md` |
| Aplicaciones | web, escritorio Windows y Android offline | `scripts/build-site.mjs`, `scripts/build-app-bundle.mjs`, `apps/` |
| Workflows | 7 | `.github/workflows/` |
| Versión actual | 0.14.0 | `package.json` y manifests de apps |
| Runtime fijado | Node >=22.12; pnpm 10.13.1 | `package.json` |

### Dependencias y generadores

| Componente | Dependencias relevantes | Función |
|---|---|---|
| Raíz | marked, Mermaid, Puppeteer Core, ESLint, markdownlint | contenido, sitio, PDF y calidad |
| Web de financiamiento | TypeScript, Vite, viem | dApp educativa |
| Indexador | TypeScript, viem | eventos y checkpoint |
| Windows | Electron, electron-builder | paquete offline |
| Android | Capacitor Core/Android/CLI | paquete offline |
| Foundry | dependencias Solidity fijadas por el repo | contratos, fuzzing e invariantes |

Los generadores relevantes son `build-professional-paths.mjs`, `build-site.mjs`, `build-landing.mjs`, `build-manual.mjs`, `build-app-bundle.mjs`, `sync-class-plans.mjs` y los validadores en `scripts/`. No se agregó una carpeta principal ni una dependencia.

## Fase B — contraste externo

### Chile DAO Nodo DNO

La comparación se hizo contra el sitio público [Chile DAO Nodo DNO](https://chiledao-nodo-dno.vercel.app/) observado el 2026-10-12. Es un contraste de propuesta educativa, no una evaluación de calidad ni una equivalencia de credenciales.

| Dimensión | Chile DAO observado | Este repositorio | Decisión |
|---|---|---|---|
| Formato | talleres, bootcamps, eventos y aprendizaje comunitario | currículo autónomo, laboratorios, apps y manual offline | conservar profundidad autónoma y reforzar talleres como modalidad, no copiar estructura |
| Tecnologías | actividades asociadas a comunidades y protocolos, entre ellas Avalanche y Polkadot | tronco EVM con comparación multiecosistema | añadir guía comparativa y declarar brechas no EVM |
| Gobernanza | participación y comunidad aparecen como experiencia | clases DAO y simulaciones existentes | orientar evidencia a propuesta, voto, tesorería y concentración |
| IA | presentación conjunta de Blockchain + IA | analítica on-chain y detección de anomalías | integrar IA sólo como asistencia validada por humanos |
| Disponibilidad | actividades sujetas a programación y contacto | contenido versionado y reproducible | mantener operación local y offline |
| Acreditación | no se usó para inferir certificación | capacitación con evidencia | advertencia explícita sobre empleo, experiencia y certificación |

### Modern Cybersecurity Program

Se revisó la carpeta pública de [rutas profesionales](https://github.com/vladimiracunadev-create/modern-cybersecurity-program/tree/main/rutas) como patrón metodológico: problema que resuelve el rol, trabajo diario, competencias, herramientas, ruta, laboratorios, proyecto, evaluación, portafolio y errores. Se adaptó la granularidad, no se copiaron capítulos.

Competencias compartidas —criptografía, threat modeling, auditoría, DevSecOps, forensics, incident response, cumplimiento y seguridad de IA— se enseñan aquí sólo en su aplicación blockchain. La seguridad general sigue enlazándose como referencia externa para evitar duplicar otro programa y se respetan las licencias declaradas por cada repositorio.

### Referencias primarias de control

- [NIST NICE SP 800-181r1](https://doi.org/10.6028/NIST.SP.800-181r1): una función de trabajo no es sinónimo universal de cargo; se describen tareas, conocimientos y habilidades.
- [Ethereum Developers](https://ethereum.org/developers/), [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) y [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702): EVM y abstracción de cuentas.
- [Solidity SMTChecker](https://docs.soliditylang.org/en/latest/smtchecker.html): alcance y límites de verificación formal.
- [Avalanche Builder Hub](https://build.avax.network/), [Polkadot Docs](https://docs.polkadot.com/), [Cosmos Docs](https://docs.cosmos.network/), [Solana Docs](https://solana.com/docs), [Soroban Docs](https://developers.stellar.org/docs/build/smart-contracts/overview) y [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/): modelos no EVM.
- [CMF — Ley Fintec 21.521](https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43333.html), [EUR-Lex — MiCA 2023/1114](https://eur-lex.europa.eu/eli/reg/2023/1114/oj) y [FATF — activos virtuales](https://www.fatf-gafi.org/en/topics/virtual-assets.html): regulación y enfoque basado en riesgo.
- [BIS — The tokenisation continuum](https://www.bis.org/publications/bulletin-72-tokenisation-continuum) y [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework): infraestructura financiera e IA con gestión de riesgo.

## Fase C — brechas y decisiones

| Área | Diagnóstico | Acción en este cambio | Estado residual |
|---|---|---|---|
| Rutas profesionales | 10 recorridos resumidos; sin ficha de 26 campos ni trazabilidad global | 13 rutas canónicas generadas desde `roles.json` | cubierta para orientación; exige revisión periódica |
| Títulos laborales | lista extensa con solapamientos | consolidación explícita de cargos y especializaciones | no se afirma taxonomía universal |
| Evidencia por rol | enlaces generales | clases y prácticas reales, proyecto, criterios, rúbrica y cinco niveles | algunas especialidades siguen parciales |
| Ecosistemas | EVM profundo; cobertura desigual fuera de EVM; Soroban ausente | guía comparativa oficial con cobertura declarada | faltan laboratorios Solana/Move/Soroban |
| Seguridad formal | fuzzing e invariantes profundos; verificación formal no explicada | sección SMT/formal con límites | falta ejercicio ejecutable dedicado |
| IA aplicada | ML y anomalías presentes, validación generativa implícita | protocolo humano para consultas, hipótesis y trazabilidad | falta evaluación comparada de un asistente |
| Roles de equipos | mezclaba mercado, aprendizaje y proyecto; contenía afirmaciones no sustentadas | separación de tres categorías y entregables verificables | revisar fuentes de prácticas de equipo periódicamente |
| Apps y manual | índice resumido; sin navegación de fichas ni progreso de ruta | navegación generada, fichas incluidas y progreso local reutilizado | no se crea perfil multiusuario por privacidad/offline |
| Ruta de custodia previa | bloque regulatorio desplazado dentro de otro perfil | reemplazo por generación canónica | corregida |

No se crearon clases ni laboratorios para rellenar tablas. Las brechas sin evidencia se mantienen visibles en lugar de declarar cobertura por mención.

## Fases D–G — implementación e integración

- `learning-paths/roles.json` es la fuente canónica de 13 rutas y conserva familias, aliases, niveles, clases 1–66 y prácticas 01–91.
- `build-professional-paths.mjs` valida identificadores y genera índice, inventario, 13 fichas y dos matrices; `pnpm check` falla si hay drift.
- Cada ficha cubre los 26 campos solicitados, proyecto profesional, aceptación, ética, brechas y fecha.
- La matriz global y el detalle conectan rol, competencia, clase, laboratorio, evidencia y evaluación.
- README, matriz de competencias, industria, landing, sitio, Windows, Android y manual enlazan la nueva capa.
- El progreso de ruta reutiliza `blp-progress` en `localStorage`; no agrega cuenta, telemetría, red ni dato personal, y funciona offline dentro del bundle.
- La guía de ecosistemas profundiza decisiones sin cambiar el tronco práctico EVM ni prometer dominio donde no hay laboratorio.

## Compatibilidad

| Contrato preservado | Evidencia |
|---|---|
| 66 clases y sus rutas | catálogo y comprobación estructural |
| 91 prácticas e identificadores | catálogo y validador |
| Enlaces históricos | no se renombraron unidades, clases, laboratorios ni apps |
| Web/Windows/Android | todos consumen el mismo sitio generado; las fichas son Markdown normal |
| Offline y privacidad | roles y progreso viajan en el bundle; almacenamiento sólo local |
| pnpm y herramientas existentes | cero dependencias nuevas; script añadido al lifecycle actual |
| Licencias | contenido nuevo bajo el régimen existente; fuentes enlazadas, no copiadas |

## Fase H — validación ejecutada

| Comprobación | Resultado |
|---|---|
| `pnpm check` | aprobado: 16 salidas profesionales, 36 documentos esenciales, 66 clases, 91 prácticas, 136 preguntas y 363 pruebas inventariadas |
| ESLint y markdownlint | aprobados; 228 Markdown, 0 incidencias |
| Pruebas Node | 316/316 aprobadas en 45 archivos, incluidos servidores loopback |
| Pruebas Foundry | el binario no estaba disponible en el host local; los 47 tests declarados quedan como gate bloqueante de GitHub Actions, no como éxito local inferido |
| dApp web | build Vite aprobado, 427 módulos transformados |
| Sitio y bundle offline | 227 documentos indexados; bundle con 230 HTML, 66/66 clases y 33/33 mapas |
| Manual | 501 páginas, 94/94 diagramas Mermaid y 1.753 enlaces internos comprobados |
| Aplicación Windows | bundle abierto con Electron; portada, clase, profundidad, gráfico, navegación, quiz, 66 clases e índice verificados |
| Flujo de ruta profesional | Chrome headless cargó 13 rutas y actualizó progreso de 0/22 a 1/22 desde almacenamiento local |
| Coherencia | versión 0.14.0, siete workflows, enlaces, conteos y `git diff --check` aprobados |

La tabla registra sólo comandos ejecutados. La publicación se considera cerrada únicamente si los jobs remotos —incluido Foundry— terminan en verde sobre el commit de `main`.

## Riesgos y próximas ampliaciones

1. Priorizar un laboratorio no EVM sólo después de asegurar toolchain fijado, CI y ejecución offline.
2. Crear una práctica diferenciada de verificación formal con una propiedad no trivial y contraejemplo reproducible.
3. Probar usabilidad de selección de ruta con estudiantes y accesibilidad con tecnología asistiva; esta auditoría no sustituye ese estudio.
4. Revisar regulación por fecha y jurisdicción antes de usarla en una decisión real.
5. Mantener cargos como agrupaciones de trabajo: no convertir aliases de anuncios coyunturales en nuevas rutas sin evidencia diferenciada.
6. Añadir progreso por evidencias sólo si puede conservar privacidad, portabilidad y operación offline sin crear un LMS paralelo.

## Criterio de cierre

La evolución se considera cerrada cuando los generados coinciden con la fuente canónica, todos los gates locales pasan, el commit publicado en `main` obtiene CI verde y no quedan ramas remotas pendientes que ya estén integradas. El cierre no transforma capacitación en experiencia profesional.
