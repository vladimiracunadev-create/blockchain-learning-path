# 🧰 El stack tecnológico del ecosistema

> **Audiencia:** Desarrolladores y CTOs · ⏱️ **Lectura:** 25 min · **Fuentes:** documentación oficial de cada herramienta
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🗂️ El stack por capas: mapa completo

El "stack web3" no es una lista de logos: es un conjunto de capas con responsabilidades claras, cada una con dos o tres opciones dominantes y una cola larga de alternativas. Esta tabla es el mapa; las secciones siguientes son el criterio:

| Capa | Para qué sirve | Opciones dominantes (2025/2026) | Nota honesta |
|---|---|---|---|
| Protocolo (L1/L2) | Dónde vive y se ejecuta el contrato | Ethereum, L2s (Arbitrum, OP Mainnet, Base), Solana, y appchains | La elección condiciona todo lo demás: lenguaje, tooling, usuarios |
| Lenguajes de contratos | Escribir la lógica on-chain | Solidity, Vyper (EVM); Rust/Anchor (Solana); Cairo (Starknet); Move (Aptos/Sui) | Solidity concentra la mayoría del empleo y de las auditorías disponibles |
| Frameworks de desarrollo | Compilar, testear, desplegar | Foundry, Hardhat | Foundry domina en testing/fuzzing; Hardhat mantiene ecosistema de plugins JS |
| Librerías cliente | Hablar con la cadena desde apps | viem, wagmi, ethers.js (JS/TS); web3.py (Python) | viem/wagmi son el estándar de facto en frontends nuevos; ethers sigue omnipresente en código existente |
| Wallets y firma | Custodia de claves y aprobación de transacciones | MetaMask, Rabby, Safe (multisig), WalletConnect, hardware wallets (Ledger, Trezor) | Toda tesorería de equipo seria vive en un Safe, no en una EOA |
| Acceso a nodos / RPC | Leer estado y enviar transacciones | Nodo propio; Alchemy, Infura, QuickNode | Comodidad del proveedor vs. dependencia y privacidad: trade-off real, ver abajo |
| Indexación y datos | Consultar datos históricos y agregados | The Graph (subgraphs), Dune, indexer propio | Leer eventos vía RPC no escala; la indexación es infraestructura obligatoria |
| Oráculos | Traer datos externos on-chain | Chainlink, Pyth | Un oráculo mal elegido es la vulnerabilidad completa del protocolo |
| Almacenamiento | Datos grandes fuera de la cadena | IPFS, Arweave, Filecoin | IPFS no garantiza persistencia sin pinning; Arweave cobra por permanencia |
| Seguridad y análisis | Encontrar bugs antes que los atacantes | Slither, Echidna, fuzzing de Foundry, librerías OpenZeppelin, auditorías externas | Las herramientas no sustituyen la auditoría; la complementan |
| Monitoreo y operación | Ver y reaccionar en producción | Tenderly, OpenZeppelin Defender, Forta | Los contratos no emiten logs a un APM: el monitoreo hay que diseñarlo |
| Testing y CI | Calidad continua | forge test en CI (GitHub Actions), cobertura, gates de análisis estático | El estándar del sector es CI en verde + fuzzing como mínimo, no opcional |

## ⛓️ Lenguajes y frameworks: dónde está el centro de gravedad

**Solidity** sigue siendo el centro de gravedad del empleo y del conocimiento acumulado (auditorías, patrones, exploits documentados). **Vyper** aporta una sintaxis minimalista tipo Python con menos superficie de sorpresas, a costa de ecosistema más pequeño — y su incidente de 2023 (bug del compilador que afectó a pools de Curve) recordó que el riesgo de compilador existe en todos los lenguajes. Fuera de la EVM: **Rust con Anchor** en Solana, **Cairo** en Starknet y **Move** en Aptos/Sui, cada uno con modelos de recursos y de cuentas distintos que no se transfieren automáticamente desde la mentalidad EVM.

En frameworks, la industria consolidó dos opciones:

- **Foundry** (forge, cast, anvil): tests en Solidity, fuzzing y pruebas de invariantes integradas, velocidad de compilación notable. Es la elección por defecto de los equipos de protocolo actuales y la de este programa.
- **Hardhat:** tests en TypeScript, ecosistema maduro de plugins, buena integración con tooling JS existente. Sigue siendo común en equipos con base frontend fuerte y en proyectos anteriores a 2023.

Muchos repos serios usan ambos: Foundry para tests e invariantes, Hardhat para scripting de despliegue heredado. No es una guerra religiosa; es una decisión de equipo.

## 🔌 RPC: nodo propio o proveedor, el trade-off que nadie puede evitar

Toda aplicación necesita hablar con un nodo. Las dos rutas:

- **Proveedor gestionado (Alchemy, Infura, QuickNode):** cero operación, APIs mejoradas (trazas, webhooks), SLAs. Costos: dependencia de un tercero que ve todas tus consultas (privacidad), puede aplicar rate limits o censura, y es un punto único de fallo — las caídas históricas de proveedores grandes han tumbado "medio ecosistema" de golpe porque demasiadas apps compartían el mismo endpoint.
- **Nodo propio:** soberanía y privacidad completas, sin límites de terceros; a cambio, operación 24/7, discos NVMe grandes, sincronización y upgrades en cada hard fork.

La práctica profesional en producción es **redundancia**: múltiples proveedores detrás de un router de RPC con failover, o proveedor + nodo propio de respaldo. Tratar el endpoint RPC como dependencia crítica única es un incidente esperando fecha.

## 📊 Datos, indexación y oráculos

La cadena es pésima base de datos de lectura. El patrón estándar:

1. **Eventos** bien diseñados en los contratos (indexed donde corresponde).
2. **Subgraph** en The Graph (o indexer propio con viem + base de datos) que transforma eventos en entidades consultables vía GraphQL.
3. **Dune** para analítica SQL exploratoria y dashboards públicos.

Para datos externos (precios, clima, resultados), los **oráculos** son la frontera de confianza más delicada del diseño: **Chainlink** (redes descentralizadas de nodos, feeds push) y **Pyth** (datos de primera parte de exchanges y market makers, modelo pull) dominan. La historia de DeFi está llena de protocolos técnicamente correctos drenados por manipulación de un oráculo débil (spot price de un pool ilíquido como oráculo es el clásico). La elección y configuración del oráculo es una decisión de seguridad de primer orden, no un detalle de integración.

## 🛡️ Seguridad, monitoreo y operación

El pipeline mínimo de un equipo profesional:

- **Estático:** Slither en CI en cada PR; revisar findings, no silenciarlos en bloque.
- **Dinámico:** fuzzing e invariantes con Foundry y/o Echidna — las propiedades ("la suma de balances es igual al supply") encuentran clases de bugs que los tests unitarios no ven.
- **Dependencias:** OpenZeppelin Contracts como base auditada en lugar de reimplementar ERC-20, control de acceso o upgrades a mano.
- **Auditoría externa** antes de mainnet, y **bug bounty** después (Immunefi es el estándar del sector).
- **En producción:** Tenderly para simulación y debugging de transacciones, OpenZeppelin Defender para automatizar operaciones administrativas con multisig, Forta para detección de anomalías en tiempo real.

El matiz honesto: nada de esto garantiza ausencia de exploits — protocolos auditados por firmas de primer nivel han sido drenados igualmente. El objetivo es reducir probabilidad y ganar capacidad de respuesta, no comprar certeza.

## 🖼️ Una dApp en producción, en bloque

```text
 ┌────────────────────────────┐
 │ Frontend (TS/React + wagmi) │
 └──────────────┬─────────────┘
                │ viem (lecturas/escrituras)          Wallet del usuario
                ▼                                     (MetaMask/Rabby/Safe)
 ┌────────────────────────────┐                              │ firma
 │ Router RPC redundante       │◀─────────────────────────────┘
 │ (Alchemy + QuickNode +      │
 │  nodo propio de respaldo)   │
 └──────────────┬─────────────┘
                ▼
 ┌────────────────────────────┐      precios       ┌───────────────────┐
 │ Contratos (Solidity, L2)    │◀───────────────────│ Oráculos           │
 │ + Safe multisig + timelock  │                    │ (Chainlink / Pyth) │
 └──────────────┬─────────────┘                    └───────────────────┘
                │ eventos
                ▼
 ┌────────────────────────────┐     ┌──────────────────────────────────┐
 │ Indexer (The Graph / propio)│     │ Monitoreo transversal:            │
 │ → API GraphQL del frontend  │     │ Tenderly · Defender · Forta ·     │
 └────────────────────────────┘     │ alertas on-call                   │
                                     └──────────────────────────────────┘
```

Nótese que la mitad de las cajas no son "blockchain": son infraestructura web clásica al servicio de dos o tres contratos. Esa proporción es representativa de los proyectos reales.

## 🧪 Criterios de selección de herramientas

Antes de adoptar cualquier pieza del stack, un CTO responsable pregunta:

| Criterio | Pregunta concreta |
|---|---|
| Madurez | ¿Años en producción, protocolos grandes que dependan de ella, historial de incidentes? |
| Auditorías | ¿El código de la herramienta/librería está auditado? ¿Las auditorías son públicas? |
| Licencia | ¿MIT/Apache, o una Business Source License que restringe forks comerciales? |
| Lock-in | ¿Qué cuesta migrar? ¿Formatos abiertos, APIs estándar, o propietario? |
| Comunidad | ¿Issues respondidos, releases regulares, más de un mantenedor activo, financiamiento sostenible? |

La última fila importa más de lo que parece: el ecosistema tiene un historial de herramientas excelentes abandonadas cuando se agotó el financiamiento del equipo. Dependencia crítica sin plan B es deuda operativa.

## 🚀 Stack mínimo recomendado para empezar

El stack de este programa es deliberadamente el camino más transitado del sector, para que cada hora invertida transfiera directamente a un empleo real:

- **Solidity + Foundry** para contratos, tests, fuzzing e invariantes.
- **viem + TypeScript** para scripts e integración cliente.
- **pnpm** como gestor de paquetes del monorepo.
- **GitHub Actions** para CI (compilación, tests, análisis estático).

Ese stack se ejercita de punta a punta en el [currículo](../curriculum/README.md) y en el [catálogo de laboratorios](../labs/CATALOG.md). La recomendación profesional es dominar un stack completo en profundidad antes de coleccionar herramientas: la amplitud llega sola con los proyectos.

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "Necesito aprender todas las herramientas" | Los equipos contratan profundidad en un stack (típicamente Solidity+Foundry+viem), no un bingo de logos. |
| "Con Infura ya tengo infraestructura descentralizada" | Un único proveedor RPC es un punto central de fallo y de vigilancia; la descentralización de la cadena no se hereda automáticamente. |
| "IPFS guarda mis archivos para siempre" | Sin pinning (propio o pagado) el contenido puede desaparecer; permanencia real es el modelo de Arweave, y también se paga. |
| "Pasó Slither, está seguro" | El análisis estático encuentra patrones conocidos; la lógica de negocio rota, los fallos económicos y de oráculo requieren fuzzing, revisión y auditoría. |
| "Uso el precio del pool como oráculo, es lo mismo" | El spot de un pool es manipulable en una transacción (flash loans); es la causa raíz de una fracción enorme de los exploits de DeFi. |
| "ethers.js está muerto" | Sigue en una cantidad enorme de código en producción; viem/wagmi son el default para código nuevo, pero leer ethers es habilidad laboral real. |
| "El monitoreo lo agregamos después del lanzamiento" | Después del lanzamiento ya custodias fondos; sin monitoreo, el primer aviso de un exploit suele llegar por redes sociales. |

## 🔗 Referencias

- Foundry Book: <https://book.getfoundry.sh/>
- viem: <https://viem.sh/>
- The Graph: <https://thegraph.com/docs/>
- Chainlink: <https://docs.chain.link/>
- OpenZeppelin: <https://docs.openzeppelin.com/>
- Solidity: <https://docs.soliditylang.org/>
- Documentación para desarrolladores de ethereum.org: <https://ethereum.org/developers/docs/>
- wagmi: <https://wagmi.sh/>
- Safe (multisig): <https://docs.safe.global/>

---

## 🧭 Navegación

⬅️ [01 · Cómo se construye una blockchain](01-como-se-construye-una-blockchain.md) · [Índice de industria](README.md) · ➡️ [03 · Equipos, roles y metodología](03-equipos-roles-y-metodologia.md)
