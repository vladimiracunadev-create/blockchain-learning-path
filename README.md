<div align="center">

# ⛓️ Blockchain Learning Path

## **28 módulos · 70 prácticas · de cero a la infraestructura financiera**

**Programa integral y progresivo en español: de los fundamentos técnicos de blockchain a los sistemas financieros programables — criptografía, sistemas distribuidos, Bitcoin, Ethereum/EVM, contratos, activos digitales, seguridad, L2, ZK, infraestructura y empresa; y después DeFi, dinero y liquidación, stablecoins, depósitos tokenizados, CBDC/MDBC, pagos y FX on-chain, tokenización, RWA, mercados de capitales, custodia, identidad digital y regulación. Con laboratorios ejecutables y un proyecto integrador.**

[![CI](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/ci.yml)
[![Security](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/security.yml)
[![Deploy Pages](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/vladimiracunadev-create/blockchain-learning-path/actions/workflows/deploy-pages.yml)

[![Versión](https://img.shields.io/badge/versión-0.9.0-7c5cff?style=for-the-badge)](CHANGELOG.md)
[![Módulos](https://img.shields.io/badge/módulos-28-7c5cff?style=for-the-badge)](curriculum/README.md)
[![Prácticas](https://img.shields.io/badge/prácticas-70-2e8b57?style=for-the-badge)](labs/CATALOG.md)
[![Nivel](https://img.shields.io/badge/nivel-inicial%20→%20infraestructura%20financiera-e67e22?style=for-the-badge)](ROADMAP.md)
[![Idioma](https://img.shields.io/badge/idioma-español-blue?style=for-the-badge)](README.md)
[![License](https://img.shields.io/badge/code-MIT-3fb950?style=for-the-badge)](LICENSE)
[![Content](https://img.shields.io/badge/contenido-CC%20BY%204.0-3fb950?style=for-the-badge)](LICENSE-CONTENT)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)](pnpm-workspace.yaml)
[![Solidity](https://img.shields.io/badge/Solidity-contratos-363636?style=flat-square&logo=solidity&logoColor=white)](labs/06-solidity-vault)
[![Foundry](https://img.shields.io/badge/Foundry-pruebas-000000?style=flat-square)](labs/06-solidity-vault)
[![viem](https://img.shields.io/badge/viem-dApps-2e8b57?style=flat-square)](apps/community-funding-web)
[![TypeScript](https://img.shields.io/badge/TypeScript-dApp%20%26%20indexer-3178C6?style=flat-square&logo=typescript&logoColor=white)](apps)

[🌱 Empieza aquí](docs/empieza-aqui.md) · [📖 Glosario](docs/glosario.md) · [🌐 Sitio](https://vladimiracunadev-create.github.io/blockchain-learning-path/) · [📕 Manual (PDF)](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf) · [📥 Apps](#-llévate-el-curso-apps-y-manual) · [📚 Currículo](curriculum/README.md) · [🏭 Industria](industria/README.md) · [🧪 Laboratorios](labs/CATALOG.md) · [⚖️ Regulación](regulation/README.md) · [📁 Casos reales](docs/casos-reales/README.md) · [🎯 Competencias](docs/skills-matrix.md) · [🗺️ Roadmap](ROADMAP.md) · [🧭 Rutas por perfil](learning-paths/README.md) · [🤝 Contribuir](CONTRIBUTING.md) · [🔐 Seguridad](SECURITY.md)

</div>

---

<div align="center">

## 🌱 ¿Es tu primer contacto con blockchain?

### **[👉 EMPIEZA AQUÍ](docs/empieza-aqui.md)**

**No hace falta que sepas nada todavía.** Esa página te dice qué necesitas antes de arrancar, qué instalar y en qué momento, cómo se lee un módulo, qué hacer cuando te atasques — y te deja en la puerta del [módulo 00](curriculum/00-orientacion/README.md), que es por donde se empieza.

Ten a mano el **[📖 glosario](docs/glosario.md)**, enlazado desde todos los módulos, para cuando una palabra te frene.

</div>

---

> **Blockchain no es sinónimo de criptomoneda.** En este recorrido aprenderás cuándo una cadena de bloques aporta valor, cuándo una base de datos tradicional es mejor y cómo construir —y llevar a producción— sistemas descentralizados de forma responsable.

## 🎯 Qué es esto

Un currículo modular y **secuencial** que cubre el espectro completo de blockchain, paso a paso, en **28 módulos numerados (00→27)** agrupados en ocho etapas, más un proyecto final. Cada módulo es una carpeta con un `README.md` que incluye:

- 🎯 **Objetivos** medibles y **resultados de aprendizaje** verificables.
- 🗺️ **Temas** con el porqué de cada uno y **conceptos** con definiciones.
- 🧩 **Esquema visual** (diagramas Mermaid que GitHub renderiza nativamente).
- 🧠 **Modelo mental** con su analogía y los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos y casos reales verificables.
- 🧪 **Laboratorio guiado** ejecutable y un **reto verificable** con criterio de aceptación.
- ⚠️ **Errores frecuentes** (síntoma → causa) y 🛡️ **seguridad y ética**.
- 🔗 **Referencias** a los libros y fuentes primarias del área.

No enseña a especular: enseña a decidir **cuándo** usar la tecnología, a **construirla** con pruebas, a **llevarla a una empresa** con infraestructura y costos, y a entender **qué cambia y qué no** cuando el dinero, los pagos y los valores se vuelven programables.

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

> **¿Dónde se usa cada libro?** La bibliografía incluye la tabla [qué obra sustenta cada módulo](docs/bibliografia.md#-qué-obra-sustenta-cada-módulo): enlaza cada obra con su fuente oficial y con el módulo concreto que la usa, así que puedes ir del libro al módulo o del módulo al libro. Varias de las obras clave —*Mastering Bitcoin*, *Mastering Ethereum*, *Proofs, Arguments, and Zero-Knowledge*— tienen **edición legalmente gratuita**: el programa completo se puede seguir sin comprar un solo libro.
>
> La bibliografía recoge además los **hitos recientes** del ecosistema (Merge, Dencun/EIP-4844, Pectra/EIP-7702).

## 📥 Llévate el curso: apps y manual

Todo el contenido —los 28 módulos, la industria, los laboratorios, la regulación, los casos reales, los ADR y el proyecto final— viaja contigo. **Las apps funcionan sin conexión**: sirven para estudiar en el metro o en un aula sin wifi.

| Formato | Descarga | Notas |
|---|---|---|
| 🖥️ **Windows** | [Instalador o portable](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest) | Curso completo dentro del ejecutable · [cómo está hecha](apps/desktop/README.md) |
| 📱 **Android** | [APK](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest) | Curso completo dentro del APK · [cómo está hecha](apps/android/README.md) |
| 📕 **Manual PDF** | [MANUAL.pdf (~478 páginas)](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf) | También adjunto en cada release |
| 🌐 **Web** | [Sitio del programa](https://vladimiracunadev-create.github.io/blockchain-learning-path/) | Con buscador, progreso y autoevaluación |

Las tres versiones salen del **mismo build**, así que ninguna se queda atrás. Cada binario se verifica en CI abriéndolo y contando los módulos, las páginas y las preguntas que lleva dentro: un build en verde no prueba que el artefacto contenga el curso.

> Los binarios **no están firmados** con certificado de código (cuesta cientos de dólares al año), así que Windows SmartScreen y Android avisarán del origen desconocido. Compara el `SHA256` publicado en la release antes de ejecutarlos.

Para generarlo todo desde el repositorio: `pnpm build:manual`, `pnpm app:windows`, `pnpm app:android`.

## 🗂️ Los 28 módulos en ocho etapas

Cada etapa tiene su [índice de currículo](curriculum/README.md) con mapa visual. Estúdialos **en orden**: cada módulo asume el anterior.

| Etapa | Módulos | Foco | Resultado |
|---|---|---|---|
| **Orientación** | [00](curriculum/00-orientacion/README.md) | ¿Necesito blockchain? | Distinguir blockchain de una base de datos |
| **Fundamentos** | [01](curriculum/01-criptografia/README.md)–[03](curriculum/03-consenso/README.md) | Criptografía, redes P2P, consenso | Entender qué hace verificable a una cadena |
| **Desarrollo** | [04](curriculum/04-bitcoin/README.md)–[07](curriculum/07-dapps/README.md) | Bitcoin, EVM, Solidity, dApps | Crear y probar contratos y una dApp |
| **Profesional** | [08](curriculum/08-tokens/README.md)–[11](curriculum/11-dao-gobernanza/README.md) | Tokens, seguridad, oráculos, DAO | Diseñar protocolos seguros y gobernados |
| **Avanzado** | [12](curriculum/12-escalabilidad/README.md)–[15](curriculum/15-arquitectura-avanzada/README.md) | L2, interoperabilidad, ZK, arquitectura | Auditar, investigar y decidir arquitectura |
| **Producción** | [16](curriculum/16-infraestructura-nodos/README.md)–[18](curriculum/18-implementacion-empresarial/README.md) | Infraestructura, empresa, implementación | Llevar la tecnología a una empresa real |
| **Finanzas on-chain** | [19](curriculum/19-defi/README.md)–[25](curriculum/25-mercados-capitales-onchain/README.md) | DeFi, dinero y liquidación, stablecoins, MDBC, pagos y FX, tokenización, mercados | Entender qué cambia al programar el dinero y los valores |
| **Institucional** | [26](curriculum/26-custodia-identidad/README.md)–[27](curriculum/27-regulacion-cumplimiento/README.md) | Custodia, identidad digital, regulación y cumplimiento | Diseñar con custodia y cumplimiento desde el primer día |
| **Proyecto final** | [capstone](capstone/README.md) | Integración | Protocolo documentado, probado y desplegable |

## 🧪 Laboratorios y proyectos ejecutables

- **70 prácticas** guiadas con actividad, evidencia y criterio de aceptación ([catálogo](labs/CATALOG.md)).
- **Contratos con Foundry**: vault, protocolos, token, oráculo y gobernador con timelock, con pruebas, fuzzing e invariantes.
- **Retos de seguridad**: contratos vulnerables y sus correcciones ([security-challenges](security-challenges/README.md)).
- **dApp** de financiamiento comunitario (viem/TypeScript), **indexador** de eventos y **panel** de progreso.
- **Bitcoin Core en `regtest`** y un **nodo Geth real en Docker** para operar infraestructura.
- **Mercado tokenizado en Solidity**: dinero mayorista simulado, bono con transferencia restringida y **entrega contra pago atómica**, con 18 pruebas ([laboratorio](labs/22-cbdc-mercado-tokenizado/README.md)).
- **Simulaciones financieras deterministas** en Node —AMM y pérdida impermanente, factor de salud, paridad de una stablecoin, coste real de una remesa, PvP, DvP, cuórum de custodia y cribado de cumplimiento— sin red, sin claves y sin fondos.

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

Luego empieza por [curriculum/00-orientacion](curriculum/00-orientacion/README.md). Cada una de las 70 prácticas trae su **resolución explicada** —cómo se implementa, el comando, la salida esperada y su interpretación— en el [cuaderno de laboratorios](labs/guides/README.md).

## 💵 Del token al sistema financiero

La segunda mitad del programa (módulos [19](curriculum/19-defi/README.md)–[27](curriculum/27-regulacion-cumplimiento/README.md)) construye el puente que casi siempre falta:

```text
Finanzas tradicionales → infraestructura financiera digital → blockchain → finanzas on-chain
```

Cada tema se presenta en tres pasos: **cómo funciona hoy**, **qué cambia al llevarlo a una cadena** y —el que más se olvida— **qué NO cambia**. Ningún apartado presenta la versión on-chain como superior: todas las comparativas traen su columna de límites y de riesgos nuevos.

| Bloque | Qué responde |
|---|---|
| [DeFi](curriculum/19-defi/README.md) | ¿Cómo funciona un mercado cuando nadie lleva el libro de órdenes? |
| [Dinero, banca y liquidación](curriculum/20-dinero-banca-liquidacion/README.md) | Cuando pagas, ¿qué se mueve, quién debe qué y cuándo es irreversible? |
| [Stablecoins](curriculum/21-stablecoins/README.md) · [Depósitos tokenizados y MDBC](curriculum/22-deposito-tokenizado-cbdc/README.md) | ¿De quién es el pasivo y qué derecho tienes tú? |
| [Pagos, cross-border y FX](curriculum/23-pagos-fx-onchain/README.md) | ¿Por qué una remesa cuesta el 6 % y qué parte arregla la cadena? |
| [Tokenización y RWA](curriculum/24-tokenizacion-rwa/README.md) · [Mercados de capitales](curriculum/25-mercados-capitales-onchain/README.md) | ¿Qué del activo viaja al token, y qué pasa si el registro y la cadena divergen? |
| [Custodia e identidad](curriculum/26-custodia-identidad/README.md) · [Regulación](curriculum/27-regulacion-cumplimiento/README.md) | ¿Quién puede firmar, y qué actividad regulada estás realizando? |

Se apoya en dos recursos propios: la carpeta de **[regulación](regulation/README.md)** —Chile, MiCA, EE. UU., LatAm y estándares internacionales, donde cada afirmación declara su **rango** (ley, norma, guía, propuesta), su fuente oficial y su fecha— y la biblioteca de **[casos reales](docs/casos-reales/README.md)**, que analiza fracasos documentados preguntando siempre qué control faltaba.

> **No duplica un curso de finanzas.** Los conceptos financieros entran solo hasta donde hacen falta para entender su transformación mediante blockchain. Nada de este material es asesoría financiera, legal ni tributaria.

## 🏭 La industria por dentro

Además del currículo, la sección [Industria](industria/README.md) es la lectura profesional extendida: cómo se **construye** una red, el **stack** real del ecosistema, cómo trabajan y se **comunican** los equipos, **casos empresariales** (éxitos y fracasos) y **modelos de negocio**. Y para llevarlo a la práctica, los módulos 16–18 lo convierten en laboratorios: infraestructura real, caso de negocio con costos e implementación end-to-end. Incluye una guía dedicada de [**cómo explicar blockchain a clientes y personas no técnicas**](docs/explicar-blockchain-a-no-tecnicos.md): discurso de 30 segundos, traducción de jerga y manejo de objeciones.

## 👩‍🏫 Para instructores

El programa está listo para el aula: [guía del instructor](instructor/README.md), [syllabus de 26 semanas](instructor/syllabus.md), [checklist de laboratorios](instructor/lab-checklist.md) y [rúbricas de evaluación](docs/evaluacion.md). Los archivos de [`solutions/`](solutions/conceptual-guide.md) son **criterios de revisión, no respuestas para copiar**. El estudiante lleva su avance en una copia de `student/progress.example.json`.

## 🚀 Cómo usar el programa

1. **Sigue el orden.** La numeración 00→27 es secuencial por diseño: cada módulo asume el anterior.
2. **Aplica el ciclo** de cada módulo: comprender → experimentar → explicar → construir → verificar.
3. **Ejecuta los laboratorios** en local (Anvil) o testnet; registra la evidencia en tu bitácora de progreso.
4. **Haz el reto verificable** de cada módulo: ahí se fija el aprendizaje con un criterio de aceptación explícito.
5. **Comprueba tu trabajo sin depender de nadie:** 42 de las 70 prácticas traen verificación ejecutable (`pnpm test`, `forge test`), así que estudiando solo tienes señal inmediata de si tu solución funciona. El resto produce una evidencia revisable con rúbrica.
6. **Cierra con la autoevaluación** del módulo (4 preguntas al final de cada uno, también en el sitio y en las apps). Cada opción incorrecta es un error frecuente documentado en ese mismo módulo: si fallas, la explicación te dice exactamente qué releer. Al terminar el programa, el [quiz global](https://vladimiracunadev-create.github.io/blockchain-learning-path/autoevaluacion.html) repasa todo el recorrido.
7. **Usa los libros de referencia** de cada área para profundizar, y la [matriz de competencias](docs/skills-matrix.md) para saber qué nivel has alcanzado y con qué evidencia lo demuestras.

Plan completo en el [ROADMAP de 26 semanas](ROADMAP.md) · ruta intensiva en [docs/ruta-rapida.md](docs/ruta-rapida.md).

## 🧭 Rutas por perfil profesional

Recorridos ordenados para **desarrollo, arquitectura, auditoría, producto, investigación y empresa**: elige el tuyo en [learning-paths](learning-paths/README.md).

## ✅ Calidad y CI

- **CI**: lint de Markdown, JavaScript (ESLint) y Solidity (`forge fmt`), validación de estructura, enlaces, autoevaluación y cadena de módulos (`pnpm check`), pruebas de Node y de contratos con Foundry, y análisis estático con Slither.
- **Security**: escaneo de secretos con `gitleaks` en cada push y semanalmente, más CodeQL sobre el JavaScript.
- **Enlaces**: revisión semanal de todos los enlaces externos del material; si alguno muere, se abre un issue.
- **Apps**: cada binario se construye y se **abre** en CI para contar los módulos, las páginas y las preguntas que lleva dentro. Compilar no es evidencia de que el artefacto contenga el curso.
- **Deploy Pages**: el [sitio](https://vladimiracunadev-create.github.io/blockchain-learning-path/) y el manual en PDF se generan desde el repo y se publican automáticamente.
- **Dependabot** mantiene al día las dependencias y las GitHub Actions.

Consulta la [guía de contribución](CONTRIBUTING.md), el [código de conducta](CODE_OF_CONDUCT.md) y la [política de seguridad](SECURITY.md).

> 🔍 **Cómo llegó el programa hasta aquí.** La [auditoría](docs/audit/README.md) documenta el estado previo medido con comandos, las brechas encontradas con su criterio de medición, qué contenido se reutilizó en lugar de duplicarse y cómo se ejecutó la ampliación sin romper un solo enlace.

## 🎯 Qué es y qué no es este programa

### ✅ Lo que sí es

- Un currículo para **entender, construir y llevar a producción** blockchain de forma responsable.
- Material **original**, con fuentes citadas y actualizado a los hitos recientes del ecosistema.
- Laboratorios **ejecutables** en local/testnet, con criterios de aceptación verificables.

### ❌ Lo que no es

- **No es asesoría** financiera, tributaria ni legal, ni promete rentabilidad alguna.
- **No es una guía para especular** con criptomonedas ni para operar con fondos reales.
- **No sustituye** una auditoría profesional ni la operación real de una infraestructura.
- **No es asesoría regulatoria**: la normativa citada lleva fuente y fecha, pero cambia y depende de cada jurisdicción.

## 💡 Idea fuerza

La madurez técnica no se demuestra usando blockchain en todo, sino sabiendo **cuándo aporta valor, cuándo una base de datos es mejor, y cómo llevar a producción con seguridad** aquello que sí lo justifica.

## 📄 Licencia

Código bajo [MIT](LICENSE). Contenido educativo bajo [CC BY 4.0](LICENSE-CONTENT).
