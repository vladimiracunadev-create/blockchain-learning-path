<div align="center">

# ⛓️ Blockchain Learning Path

## **16 módulos · 50 prácticas · de cero a nivel avanzado**

**Programa educativo en español para aprender blockchain desde los fundamentos hasta la auditoría — criptografía, Bitcoin, Ethereum/EVM, Solidity, dApps, tokens, seguridad, L2, DAO y arquitectura, con laboratorios ejecutables, evaluaciones y un proyecto integrador.**

[![CI](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml)
[![Security](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml)
[![Deploy Pages](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml)

[![Versión](https://img.shields.io/badge/versión-0.1.0-7c5cff?style=for-the-badge)](CHANGELOG.md)
[![Módulos](https://img.shields.io/badge/módulos-16-7c5cff?style=for-the-badge)](curriculum/README.md)
[![Prácticas](https://img.shields.io/badge/prácticas-50-2e8b57?style=for-the-badge)](labs/CATALOG.md)
[![Nivel](https://img.shields.io/badge/nivel-inicial%20→%20avanzado-e67e22?style=for-the-badge)](ROADMAP.md)
[![Idioma](https://img.shields.io/badge/idioma-español-blue?style=for-the-badge)](README.md)
[![License](https://img.shields.io/badge/code-MIT-3fb950?style=for-the-badge)](LICENSE)
[![Content](https://img.shields.io/badge/contenido-CC%20BY%204.0-3fb950?style=for-the-badge)](LICENSE-CONTENT)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)](pnpm-workspace.yaml)
[![Solidity](https://img.shields.io/badge/Solidity-contratos-363636?style=flat-square&logo=solidity&logoColor=white)](labs/06-solidity-vault)
[![Foundry](https://img.shields.io/badge/Foundry-pruebas-000000?style=flat-square)](labs/06-solidity-vault)
[![viem](https://img.shields.io/badge/viem-dApps-2e8b57?style=flat-square)](apps/community-funding-web)
[![TypeScript](https://img.shields.io/badge/TypeScript-dApp%20%26%20indexer-3178C6?style=flat-square&logo=typescript&logoColor=white)](apps)

[🌐 Sitio](https://vladimiracunadev-create.github.io/blockchain-learning-path/) · [📚 Currículo](curriculum/README.md) · [🧪 Laboratorios](labs/CATALOG.md) · [🗺️ Roadmap](ROADMAP.md) · [🧭 Rutas por perfil](learning-paths/README.md) · [🤝 Contribuir](CONTRIBUTING.md) · [🔐 Seguridad](SECURITY.md)

</div>

---

> **Blockchain no es sinónimo de criptomoneda.** En este recorrido aprenderás cuándo una cadena de bloques aporta valor, cuándo una base de datos tradicional es mejor y cómo construir sistemas descentralizados de forma responsable.

## Qué aprenderás

- Fundamentos: hash, firmas digitales, Merkle trees, bloques, redes P2P y consenso.
- Bitcoin: UTXO, transacciones, minería, nodos, Lightning y modelo de seguridad.
- Ethereum/EVM: cuentas, gas, ABI, eventos, almacenamiento y llamadas.
- Solidity con buenas prácticas, pruebas, análisis estático y seguridad.
- dApps con TypeScript, `pnpm` y viem.
- Tokens, NFT, oráculos, indexación, multisig, DAO y gobernanza.
- Escalabilidad: canales, sidechains, rollups optimistas y ZK.
- Arquitectura, tokenomics, privacidad, interoperabilidad y auditoría.
- Comparación informada con Solana, Cosmos, Polkadot, Hyperledger y otras tecnologías.
- Bitcoin Core en `regtest`, desafíos de seguridad y un proyecto transversal de financiamiento comunitario.
- Rutas especializadas para desarrollo, arquitectura, auditoría, producto, investigación y empresa.
- Token, oráculo, DAO con timelock, despliegue Foundry e indexador de eventos.

## Requisitos

- Git y una terminal.
- Node.js LTS y [pnpm](https://pnpm.io/installation).
- [Foundry](https://book.getfoundry.sh/getting-started/installation) para los laboratorios Solidity.
- Docker es opcional para ejecutar nodos y servicios de apoyo.

No necesitas experiencia previa en blockchain. Para la etapa de desarrollo conviene conocer variables, funciones, pruebas y Git.

## Ruta recomendada

| Nivel | Módulos | Resultado |
|---|---:|---|
| 0. Orientación | 00 | Distinguir blockchain de una base de datos |
| 1. Fundamentos | 01–03 | Entender criptografía, bloques, consenso y Bitcoin |
| 2. Desarrollo | 04–07 | Crear y probar contratos y una dApp |
| 3. Profesional | 08–11 | Diseñar protocolos seguros, L2, oráculos y DAO |
| 4. Avanzado | 12–15 | Auditar, investigar y tomar decisiones arquitectónicas |
| Proyecto final | `capstone` | Protocolo documentado, probado y desplegable |

Consulta [ROADMAP.md](ROADMAP.md) para el plan de 24 semanas o [docs/ruta-rapida.md](docs/ruta-rapida.md) para una ruta intensiva.

También puedes elegir una [ruta por perfil profesional](learning-paths/README.md).

Cada módulo cita sus fuentes; la [bibliografía central](docs/bibliografia.md) reúne los libros de referencia por área y los hitos recientes del ecosistema.

## Estructura

```text
curriculum/       16 módulos progresivos
labs/             ejercicios ejecutables
solutions/        criterios de revisión, no respuestas para copiar
security-challenges/ contratos vulnerables y correcciones
apps/              panel visual y dApp integradora
assessments/       diagnósticos, checkpoints y rúbricas
adrs/              decisiones de arquitectura
instructor/        programa y material docente
projects/         proyectos de portafolio
capstone/         especificación del proyecto final
docs/             glosario, bibliografía, buenas prácticas, recursos y rutas
scripts/          validaciones del repositorio
.github/          CI, plantilla de issues y PR
```

## Primeros pasos

```bash
git clone <URL-DEL-REPOSITORIO>
cd blockchain-learning-path
corepack enable
pnpm install
pnpm check
pnpm test
pnpm lab:hash
pnpm serve
pnpm build:web
```

Luego estudia [curriculum/00-orientacion/README.md](curriculum/00-orientacion/README.md).
Cada práctica tiene instrucciones y aceptación en el [cuaderno de laboratorios](labs/guides/README.md).

## Método de aprendizaje

Cada módulo sigue el ciclo:

1. **Comprender:** conceptos y modelo mental.
2. **Experimentar:** laboratorio pequeño.
3. **Explicar:** registra qué ocurrió y por qué.
4. **Construir:** aplica el concepto en un proyecto.
5. **Verificar:** pruebas, amenazas y revisión.

No uses fondos reales ni claves privadas reales. Todos los laboratorios deben ejecutarse primero en local o testnet. Registra resultados en una copia de [student/progress.example.json](student/progress.example.json).

## Evaluación

- Cuestionarios y preguntas de razonamiento: 20%.
- Laboratorios y bitácora: 30%.
- Proyectos de nivel: 30%.
- Proyecto final con defensa técnica: 20%.

La rúbrica completa está en [docs/evaluacion.md](docs/evaluacion.md).

## Estado y alcance

Este repositorio enseña principios duraderos y señala explícitamente qué herramientas cambian con rapidez. No ofrece asesoría financiera, tributaria o legal ni promete rentabilidad. Las versiones se fijan en el lockfile al instalar y deben actualizarse mediante PR revisadas.

## 🤝 Contribuir y seguridad

Lee la [guía de contribución](CONTRIBUTING.md) y la [política de seguridad](SECURITY.md). El repositorio valida su estructura (`pnpm check`), ejecuta pruebas de Node y de contratos con Foundry, hace lint de Markdown y escanea secretos con `gitleaks` en cada push.

No uses fondos ni claves privadas reales: todos los laboratorios se ejecutan primero en local (Anvil) o testnet.

## Licencia

Código bajo [MIT](LICENSE). Contenido educativo bajo [CC BY 4.0](LICENSE-CONTENT).
