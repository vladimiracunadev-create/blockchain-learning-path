<div align="center">

# ⛓️ Blockchain Learning Path

## **19 módulos · 50 prácticas · de cero a producción**

**Programa educativo en español para aprender blockchain desde los fundamentos hasta llevarla a producción en una empresa — criptografía, Bitcoin, Ethereum/EVM, Solidity, dApps, seguridad, L2, DAO, infraestructura, casos de negocio e implementación, con laboratorios ejecutables y un proyecto integrador.**

[![CI](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml)
[![Security](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml)
[![Deploy Pages](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml)

[![Versión](https://img.shields.io/badge/versión-0.7.0-7c5cff?style=for-the-badge)](CHANGELOG.md)
[![Módulos](https://img.shields.io/badge/módulos-19-7c5cff?style=for-the-badge)](curriculum/README.md)
[![Prácticas](https://img.shields.io/badge/prácticas-50-2e8b57?style=for-the-badge)](labs/CATALOG.md)
[![Nivel](https://img.shields.io/badge/nivel-inicial%20→%20producción-e67e22?style=for-the-badge)](ROADMAP.md)
[![Idioma](https://img.shields.io/badge/idioma-español-blue?style=for-the-badge)](README.md)
[![License](https://img.shields.io/badge/code-MIT-3fb950?style=for-the-badge)](LICENSE)
[![Content](https://img.shields.io/badge/contenido-CC%20BY%204.0-3fb950?style=for-the-badge)](LICENSE-CONTENT)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)](pnpm-workspace.yaml)
[![Solidity](https://img.shields.io/badge/Solidity-contratos-363636?style=flat-square&logo=solidity&logoColor=white)](labs/06-solidity-vault)
[![Foundry](https://img.shields.io/badge/Foundry-pruebas-000000?style=flat-square)](labs/06-solidity-vault)
[![viem](https://img.shields.io/badge/viem-dApps-2e8b57?style=flat-square)](apps/community-funding-web)
[![TypeScript](https://img.shields.io/badge/TypeScript-dApp%20%26%20indexer-3178C6?style=flat-square&logo=typescript&logoColor=white)](apps)

[🌐 Sitio](https://vladimiracunadev-create.github.io/blockchain-learning-path/) · [📕 Manual (PDF)](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf) · [📥 Apps](#-llévate-el-curso-apps-y-manual) · [📚 Currículo](curriculum/README.md) · [🏭 Industria](industria/README.md) · [🧪 Laboratorios](labs/CATALOG.md) · [🗺️ Roadmap](ROADMAP.md) · [🧭 Rutas por perfil](learning-paths/README.md) · [🤝 Contribuir](CONTRIBUTING.md) · [🔐 Seguridad](SECURITY.md)

</div>

---

> **Blockchain no es sinónimo de criptomoneda.** En este recorrido aprenderás cuándo una cadena de bloques aporta valor, cuándo una base de datos tradicional es mejor y cómo construir —y llevar a producción— sistemas descentralizados de forma responsable.

## 🎯 Qué es esto

Un currículo modular y **secuencial** que cubre el espectro completo de blockchain, paso a paso, en **19 módulos numerados (00→18)** agrupados en seis etapas, más un proyecto final. Cada módulo es una carpeta con un `README.md` que incluye:

- 🎯 **Objetivos** medibles y **resultados de aprendizaje** verificables.
- 🗺️ **Temas** con el porqué de cada uno y **conceptos** con definiciones.
- 🧩 **Esquema visual** (diagramas Mermaid que GitHub renderiza nativamente).
- 🧠 **Modelo mental** con su analogía y los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos y casos reales verificables.
- 🧪 **Laboratorio guiado** ejecutable y un **reto verificable** con criterio de aceptación.
- ⚠️ **Errores frecuentes** (síntoma → causa) y 🛡️ **seguridad y ética**.
- 🔗 **Referencias** a los libros y fuentes primarias del área.

No enseña a especular: enseña a decidir **cuándo** usar la tecnología, a **construirla** con pruebas y a **llevarla a una empresa** con infraestructura, costos y casos reales.

## 📚 Pauta derivada de los mejores libros

Cada etapa se apoya explícitamente en la literatura de referencia del sector; el contenido es **original en su redacción** y **no reproduce** las obras.

| Área | Libros y fuentes de referencia |
|---|---|
| **Fundamentos y panorama** | Bashir — *Mastering Blockchain* · Narayanan et al. — *Bitcoin and Cryptocurrency Technologies* · Werbach — *The Blockchain and the New Architecture of Trust* |
| **Criptografía** | Aumasson — *Serious Cryptography* · Katz, Lindell — *Introduction to Modern Cryptography* · Ferguson/Schneier/Kohno — *Cryptography Engineering* |
| **Sistemas distribuidos y consenso** | Cachin, Guerraoui, Rodrigues — *Reliable and Secure Distributed Programming* · Nakamoto (whitepaper) · Castro, Liskov — *PBFT* |
| **Bitcoin y Ethereum** | Antonopoulos — *Mastering Bitcoin* · Antonopoulos, Wood — *Mastering Ethereum* · Wood — *Yellow Paper* |
| **Contratos y seguridad** | Docs de Solidity · The Foundry Book · Trail of Bits — *Building Secure Contracts* · ConsenSys — *Smart Contract Best Practices* |
| **Escalabilidad, ZK y arquitectura** | Buterin — *An Incomplete Guide to Rollups* · Thaler — *Proofs, Arguments, and Zero-Knowledge* · ERC-4337 · Flashbots |
| **Empresa e infraestructura** | BIS · World Economic Forum · documentación de clientes de nodo y de nube |

> Referencias completas en la [bibliografía central](docs/bibliografia.md), que también recoge los **hitos recientes** del ecosistema (Merge, Dencun/EIP-4844, Pectra/EIP-7702).

## 📥 Llévate el curso: apps y manual

Todo el contenido —los 19 módulos, la industria, los laboratorios, los ADR y el proyecto final— viaja contigo. **Las apps funcionan sin conexión**: sirven para estudiar en el metro o en un aula sin wifi.

| Formato | Descarga | Notas |
|---|---|---|
| 🖥️ **Windows** | [Instalador o portable](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest) | Curso completo dentro del ejecutable · [cómo está hecha](apps/desktop/README.md) |
| 📱 **Android** | [APK (~8,5 MB)](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest) | Curso completo dentro del APK · [cómo está hecha](apps/android/README.md) |
| 📕 **Manual PDF** | [MANUAL.pdf (~310 páginas)](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf) | También adjunto en cada release |
| 🌐 **Web** | [Sitio del programa](https://vladimiracunadev-create.github.io/blockchain-learning-path/) | Con buscador, progreso y autoevaluación |

Las tres versiones salen del **mismo build**, así que ninguna se queda atrás. Cada binario se verifica en CI abriéndolo y contando los módulos, las páginas y las preguntas que lleva dentro: un build en verde no prueba que el artefacto contenga el curso.

> Los binarios **no están firmados** con certificado de código (cuesta cientos de dólares al año), así que Windows SmartScreen y Android avisarán del origen desconocido. Compara el `SHA256` publicado en la release antes de ejecutarlos.

Para generarlo todo desde el repositorio: `pnpm build:manual`, `pnpm app:windows`, `pnpm app:android`.

## 🗂️ Los 19 módulos en seis etapas

Cada etapa tiene su [índice de currículo](curriculum/README.md) con mapa visual. Estúdialos **en orden**: cada módulo asume el anterior.

| Etapa | Módulos | Foco | Resultado |
|---|---|---|---|
| **Orientación** | [00](curriculum/00-orientacion/README.md) | ¿Necesito blockchain? | Distinguir blockchain de una base de datos |
| **Fundamentos** | [01](curriculum/01-criptografia/README.md)–[03](curriculum/03-consenso/README.md) | Criptografía, redes P2P, consenso | Entender qué hace verificable a una cadena |
| **Desarrollo** | [04](curriculum/04-bitcoin/README.md)–[07](curriculum/07-dapps/README.md) | Bitcoin, EVM, Solidity, dApps | Crear y probar contratos y una dApp |
| **Profesional** | [08](curriculum/08-tokens/README.md)–[11](curriculum/11-dao-gobernanza/README.md) | Tokens, seguridad, oráculos, DAO | Diseñar protocolos seguros y gobernados |
| **Avanzado** | [12](curriculum/12-escalabilidad/README.md)–[15](curriculum/15-arquitectura-avanzada/README.md) | L2, interoperabilidad, ZK, arquitectura | Auditar, investigar y decidir arquitectura |
| **Producción** | [16](curriculum/16-infraestructura-nodos/README.md)–[18](curriculum/18-implementacion-empresarial/README.md) | Infraestructura, empresa, implementación | Llevar la tecnología a una empresa real |
| **Proyecto final** | [capstone](capstone/README.md) | Integración | Protocolo documentado, probado y desplegable |

## 🧪 Laboratorios y proyectos ejecutables

- **50 prácticas** guiadas con actividad, evidencia y criterio de aceptación ([catálogo](labs/CATALOG.md)).
- **Contratos con Foundry**: vault, protocolos, token, oráculo y gobernador con timelock, con pruebas, fuzzing e invariantes.
- **Retos de seguridad**: contratos vulnerables y sus correcciones ([security-challenges](security-challenges/README.md)).
- **dApp** de financiamiento comunitario (viem/TypeScript), **indexador** de eventos y **panel** de progreso.
- **Bitcoin Core en `regtest`** y un **nodo Geth real en Docker** para operar infraestructura.

```bash
git clone https://github.com/vladimiracunadev-create/blockchain-learning-path.git
cd blockchain-learning-path
corepack enable && pnpm install
pnpm check      # valida estructura, enlaces y conteos
pnpm test       # pruebas de Node y de scripts
pnpm lab:hash   # tu primer laboratorio
pnpm serve      # panel de seguimiento
```

> 💻 **Sin instalar nada:** abre el repo en [GitHub Codespaces](https://codespaces.new/vladimiracunadev-create/blockchain-learning-path) — el [devcontainer](.devcontainer/devcontainer.json) deja listos Node, pnpm, Foundry y Docker.

Luego empieza por [curriculum/00-orientacion](curriculum/00-orientacion/README.md). Cada una de las 50 prácticas trae su **resolución explicada** —cómo se implementa, el comando, la salida esperada y su interpretación— en el [cuaderno de laboratorios](labs/guides/README.md).

## 🏭 La industria por dentro

Además del currículo, la sección [Industria](industria/README.md) es la lectura profesional extendida: cómo se **construye** una red, el **stack** real del ecosistema, cómo trabajan y se **comunican** los equipos, **casos empresariales** (éxitos y fracasos) y **modelos de negocio**. Y para llevarlo a la práctica, los módulos 16–18 lo convierten en laboratorios: infraestructura real, caso de negocio con costos e implementación end-to-end. Incluye una guía dedicada de [**cómo explicar blockchain a clientes y personas no técnicas**](docs/explicar-blockchain-a-no-tecnicos.md): discurso de 30 segundos, traducción de jerga y manejo de objeciones.

## 👩‍🏫 Para instructores

El programa está listo para el aula: [guía del instructor](instructor/README.md), [syllabus de 26 semanas](instructor/syllabus.md), [checklist de laboratorios](instructor/lab-checklist.md) y [rúbricas de evaluación](docs/evaluacion.md). Los archivos de [`solutions/`](solutions/conceptual-guide.md) son **criterios de revisión, no respuestas para copiar**. El estudiante lleva su avance en una copia de `student/progress.example.json`.

## 🚀 Cómo usar el programa

1. **Sigue el orden.** La numeración 00→18 es secuencial por diseño: cada módulo asume el anterior.
2. **Aplica el ciclo** de cada módulo: comprender → experimentar → explicar → construir → verificar.
3. **Ejecuta los laboratorios** en local (Anvil) o testnet; registra la evidencia en tu bitácora de progreso.
4. **Haz el reto verificable** de cada módulo: ahí se fija el aprendizaje con un criterio de aceptación explícito.
5. **Usa los libros de referencia** de cada área para profundizar.

Plan completo en el [ROADMAP de 26 semanas](ROADMAP.md) · ruta intensiva en [docs/ruta-rapida.md](docs/ruta-rapida.md).

## 🧭 Rutas por perfil profesional

Recorridos ordenados para **desarrollo, arquitectura, auditoría, producto, investigación y empresa**: elige el tuyo en [learning-paths](learning-paths/README.md).

## ✅ Calidad y CI

- **CI**: lint de Markdown, validación de estructura y enlaces (`pnpm check`), pruebas de Node y de contratos con Foundry.
- **Security**: escaneo de secretos con `gitleaks` en cada push y semanalmente.
- **Deploy Pages**: la [landing](https://vladimiracunadev-create.github.io/blockchain-learning-path/) se genera desde los datos del repo y se publica automáticamente.
- **Dependabot** mantiene al día las dependencias y las GitHub Actions.

Consulta la [guía de contribución](CONTRIBUTING.md) y la [política de seguridad](SECURITY.md).

## 🎯 Qué es y qué no es este programa

### ✅ Lo que sí es

- Un currículo para **entender, construir y llevar a producción** blockchain de forma responsable.
- Material **original**, con fuentes citadas y actualizado a los hitos recientes del ecosistema.
- Laboratorios **ejecutables** en local/testnet, con criterios de aceptación verificables.

### ❌ Lo que no es

- **No es asesoría** financiera, tributaria ni legal, ni promete rentabilidad alguna.
- **No es una guía para especular** con criptomonedas ni para operar con fondos reales.
- **No sustituye** una auditoría profesional ni la operación real de una infraestructura.

## 💡 Idea fuerza

La madurez técnica no se demuestra usando blockchain en todo, sino sabiendo **cuándo aporta valor, cuándo una base de datos es mejor, y cómo llevar a producción con seguridad** aquello que sí lo justifica.

## 📄 Licencia

Código bajo [MIT](LICENSE). Contenido educativo bajo [CC BY 4.0](LICENSE-CONTENT).
