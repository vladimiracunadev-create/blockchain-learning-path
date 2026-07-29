# 🏗️ Cómo se construye una blockchain

> **Audiencia:** Ingenieros y arquitectos · ⏱️ **Lectura:** 25 min · **Fuentes:** docs de ethereum.org, OP Stack, Cosmos SDK y Polkadot SDK
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🧬 Anatomía de un nodo: las capas que todo el mundo confunde

Una blockchain en producción no es "un programa": es una red de nodos donde cada nodo apila varias capas con responsabilidades separadas. Entenderlas por separado es el primer filtro entre una conversación de marketing y una de ingeniería:

| Capa | Responsabilidad | Tecnologías típicas |
|---|---|---|
| Red P2P | Descubrimiento de pares, gossip de bloques y transacciones | devp2p (Ethereum ejecución), libp2p (consenso Ethereum, Cosmos, Polkadot) |
| Consenso | Acordar el orden canónico de bloques y su finalidad | Gasper (PoS Ethereum), CometBFT, BABE/GRANDPA, Snow (Avalanche) |
| Ejecución | Aplicar transacciones y transicionar el estado | EVM, CosmWasm, runtimes WASM de Polkadot, SVM |
| Almacenamiento | Persistir estado, historial y pruebas (tries de Merkle-Patricia, etc.) | LevelDB, PebbleDB, MDBX (Erigon/Reth) |
| RPC / API | Exponer lectura y envío de transacciones a aplicaciones | JSON-RPC, gRPC, WebSockets |

Cada capa falla de forma distinta: un bug de P2P aísla nodos, uno de consenso parte la red en dos, y uno de ejecución corrompe el estado. Los post-mortems públicos del ecosistema casi siempre se clasifican en una de estas capas.

## 🔀 Consenso y ejecución separados: Ethereum post-Merge

Desde The Merge (septiembre de 2022), Ethereum es Proof of Stake y cada nodo completo ejecuta **dos clientes** que se comunican por la Engine API:

- **Clientes de consenso** (beacon chain, atestaciones, finalidad): Prysm, Lighthouse, Teku, Nimbus, Lodestar.
- **Clientes de ejecución** (EVM, mempool, estado): Geth, Nethermind, Besu, Erigon, Reth.

Esta separación no es cosmética. Permitió The Merge sin detener la red, y habilita que cada capa evolucione a su ritmo: Dencun (2024) introdujo blobs con EIP-4844 para abaratar la publicación de datos de rollups, y Pectra (2025) sumó, entre otros, EIP-7702 para mejorar la experiencia de cuentas.

La **diversidad de clientes** es un requisito operativo, no una preferencia estética. Los umbrales que importan:

- Con **>33 %** de la red en un cliente con bug, la red puede perder finalidad temporalmente.
- Con **>50 %**, ese cliente puede imponer una cadena incorrecta como la más larga.
- Con **>66 %**, puede **finalizar** una cadena inválida: revertirla implica slashing masivo de validadores honestos que la atestiguaron, un escenario catastrófico sin salida limpia.

El sitio de referencia para ver la distribución actual es clientdiversity.org (las cifras cambian; consúltalo en vivo antes de citarlas). Para un operador profesional, la lección es directa: elegir cliente minoritario es una contribución activa a la seguridad de la red, y toda infraestructura seria corre al menos dos implementaciones distintas.

## 🛤️ Las 4 vías reales para "construir una blockchain" en 2025/2026

Casi nadie que dice "construimos una blockchain" escribió consenso o criptografía propios. En la práctica hay cuatro caminos, con perfiles de costo y soberanía muy distintos:

| Vía | Qué es | Ejemplos de stack | Soberanía | Costo operativo | Cuándo tiene sentido |
|---|---|---|---|---|---|
| (a) Fork / cliente de una L1 | Reutilizar el código de una L1 existente con parámetros propios | Forks de Geth/Reth, forks históricos de Bitcoin | Alta | Muy alto: heredas todo el mantenimiento y los upgrades upstream | Casi nunca para productos; útil para investigación |
| (b) Rollup con un stack | L2 que publica datos/pruebas en una L1 | OP Stack, Arbitrum Orbit, ZK Stack, Polygon CDK; RaaS como Conduit o Caldera | Media (dependes de la L1 y del stack) | Medio: sequencer, batcher, infra; el RaaS lo reduce más | Producto que necesita throughput y hereda seguridad de Ethereum |
| (c) Appchain con SDK | L1 soberana construida con un framework | Cosmos SDK + CometBFT, Polkadot SDK (Substrate), subnets de Avalanche | Alta | Alto: necesitas un conjunto de validadores propio y coordinar upgrades | Lógica que no cabe en un contrato y comunidad capaz de validar |
| (d) Red permisionada | Red privada entre entidades identificadas | Hyperledger Fabric, Besu (privado), Corda | Total dentro del consorcio | Medio: infra empresarial clásica | Consorcios con requisitos regulatorios y sin token público |

Los stacks de rollup redujeron radicalmente la barrera de entrada tras EIP-4844: publicar datos en blobs es órdenes de magnitud más barato que en calldata, aunque el precio de blobs es un mercado propio y fluctúa (consúltalo en vivo). El matiz honesto: la mayoría de los rollups en producción hoy siguen operando con **sequencer centralizado** y ruedas de entrenamiento (training wheels); L2BEAT documenta el estado real de cada uno.

## 📐 Decisiones de diseño que definen el proyecto

Elegir vía es solo la primera decisión. Estas cinco definen el riesgo y la economía del sistema:

1. **Disponibilidad de datos (DA):** ¿Ethereum blobs, un comité (DAC), o una capa externa como Celestia o EigenDA? Más barato suele significar menos garantías de que los datos estarán disponibles para reconstruir el estado.
2. **Secuenciador:** centralizado (rápido, censurable, punto único de fallo), compartido, o descentralizado (aún inmaduro en producción). ¿Existe una vía de escape (forced inclusion) vía L1?
3. **Gas token:** ¿ETH, el token propio, o abstracción de gas? Un token propio crea tesorería pero añade fricción y riesgo regulatorio.
4. **Gobernanza del protocolo:** ¿quién puede actualizar los contratos del bridge y del rollup? Multisig, timelock, gobernanza por token: cada opción es un vector de ataque distinto.
5. **Bridges:** históricamente la categoría con mayores pérdidas del ecosistema (Ronin y Wormhole en 2022 suman más de mil millones de USD). Minimizar bridges custom es una decisión de seguridad, no de pereza.

Ninguna de estas decisiones es reversible gratis: cambiar de capa de DA o descentralizar un sequencer ya en producción es un proyecto de ingeniería en sí mismo, con migración de usuarios incluida. Documentarlas como ADRs desde el día uno (el formato se practica en [el índice de ADRs](../adrs/README.md) del programa) evita re-litigar cada decisión con cada incorporación al equipo.

## 🗺️ Arquitectura de un rollup, en bloque

```text
 Usuarios / dApps
       │  transacciones (RPC)
       ▼
 ┌─────────────┐     lotes comprimidos      ┌──────────────────────┐
 │  Sequencer   │──────────────────────────▶│  Batcher              │
 │ (ordena, da  │                            │ (publica lotes)       │
 │ pre-confirm) │                            └──────────┬───────────┘
 └─────────────┘                                        │ blobs (EIP-4844)
                                                        ▼
                                             ┌──────────────────────┐
 ┌─────────────┐   raíces de estado          │  L1 Ethereum          │
 │  Proposer    │───────────────────────────▶│  (DA + liquidación)   │
 └─────────────┘                             └──────────┬───────────┘
                                                        │
                              verificación: pruebas de fraude (optimistic)
                              o pruebas de validez ZK, según el stack
```

El flujo completo — de la transacción del usuario a la finalidad en L1 — puede tardar minutos (rollups ZK) o mantener una ventana de disputa de días (optimistic). Las pre-confirmaciones del sequencer son una promesa, no finalidad.

## 🚫 Qué NO construir uno mismo

Regla de la industria, repetida en todo manual serio (incluido *Mastering Blockchain* de Bashir): **no implementes tu propia criptografía ni tu propio consenso desde cero**.

- Las primitivas criptográficas (curvas, hashes, firmas BLS, sistemas de pruebas ZK) requieren años de revisión académica y auditorías; un error no produce una excepción, produce fondos robados en silencio.
- Los protocolos de consenso tienen espacios de fallo enormes (particiones, equivocación, ataques de largo alcance) que solo emergen bajo adversarios reales.
- Los frameworks citados existen precisamente para que reutilices consenso y criptografía revisados y te concentres en la lógica de aplicación.

El historial de proyectos que ignoraron esta regla es un catálogo de exploits. La innovación defendible casi nunca está en la capa de consenso: está en el producto.

## 🚀 Del devnet al mainnet: cómo se lanza de verdad

Ningún equipo serio pasa del repositorio al mainnet en un paso. La secuencia estándar del sector, visible en los lanzamientos públicos de los últimos años, es:

1. **Devnet interna:** red efímera controlada por el equipo, se destruye y recrea a diario; sirve para validar la configuración de génesis y los flujos de upgrade.
2. **Testnet pública:** validadores externos, faucet, explorador; aquí aparecen los problemas de coordinación que la devnet nunca muestra (nodos desactualizados, clocks desincronizados, peers maliciosos).
3. **Auditorías y ejercicios de caos:** auditoría de los contratos del bridge y de los módulos custom; simulacros de partición de red y de pérdida de claves antes de que ocurran con fondos reales.
4. **Génesis de mainnet:** ceremonia de génesis (en appchains, coordinación explícita de validadores), límites conservadores iniciales (caps de depósito, pausas activables) y descentralización progresiva documentada.
5. **Operación continua:** el lanzamiento no termina el proyecto; lo convierte en un servicio 24/7 con SLOs, guardias y runbooks (véase [operación e incidentes](../docs/operacion-incidentes.md)).

Ethereum mismo ensaya cada hard fork en varias testnets (y en shadow forks del mainnet) antes de activarlo; es el estándar de referencia de cómo se coordina un upgrade en una red que no puede detenerse.

## 💸 Costos operativos reales de mantener una red

El costo de lanzar es bajo; el de operar, no. Presupuesta desde el diseño:

- **Validadores / sequencers:** hardware, hosting redundante, monitoreo 24/7, gestión de claves (HSM o servicios de firma remota). En una appchain, además, incentivos suficientes para que terceros validen.
- **Upgrades coordinados:** cada hard fork exige coordinar a todos los operadores de nodos; en redes pequeñas eso es una llamada, en redes públicas es un proceso de meses (Ethereum lo ejecuta con all-core-devs calls y varias testnets).
- **Infraestructura de soporte:** exploradores de bloques, endpoints RPC públicos, indexadores, faucets de testnet, documentación. Nada de esto viene gratis con el stack.
- **Seguridad continua:** auditorías por cada upgrade, bug bounty permanente, respuesta a incidentes (véase [operación e incidentes](../docs/operacion-incidentes.md)).
- **El fracaso silencioso más común:** appchains técnicamente correctas que mueren por no poder pagar validadores ni retener un equipo core; el cementerio de cadenas Cosmos y de rollups sin tracción es amplio y bien documentado.

Un orden de magnitud honesto: operar un rollup propio "a mano" exige un equipo de plataforma dedicado; un RaaS lo reduce a una factura mensual más el costo variable de publicar datos en L1 (que depende del mercado de blobs — consúltalo en vivo). Una appchain con validadores externos añade el costo permanente de mantener alineados los incentivos de terceros. Compara siempre contra la línea base: desplegar contratos en una L2 existente, cuyo costo operativo marginal es cercano a cero.

Para practicar estas piezas con las manos, el [catálogo de laboratorios](../labs/CATALOG.md) del programa incluye ejercicios de nodos y despliegue, y el [currículo](../curriculum/README.md) ordena los prerrequisitos.

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "Necesitamos nuestra propia blockchain" | En la mayoría de los casos un contrato en una L2 existente resuelve el problema con una fracción del costo y del riesgo. |
| "Un fork de Geth y listo" | Heredas cada CVE y cada hard fork upstream para siempre; sin equipo de protocolo dedicado, el fork se pudre. |
| "Los rollups son tan seguros como Ethereum" | Heredan DA y liquidación, pero añaden riesgos propios: sequencer centralizado, multisigs de upgrade, bridges. L2BEAT clasifica estos supuestos por proyecto. |
| "PoS significa que ya no hay mineros, todo lo demás es igual" | El cambio a PoS reestructuró la arquitectura completa del nodo (dos clientes, Engine API, finalidad económica) y las suposiciones de seguridad. |
| "Más TPS = mejor blockchain" | El TPS aislado ignora DA, descentralización de validadores y costo de verificación; es la métrica favorita del marketing precisamente porque es fácil de inflar. |
| "La red permisionada nos da blockchain sin sus problemas" | Si todos los participantes confían en un operador, una base de datos replicada suele ser más simple, barata y rápida. |
| "Lanzar la cadena es el hito final" | Es el inicio de una operación 24/7: upgrades, guardias, incidentes y costos recurrentes que superan con creces el costo de desarrollo. |
| "Nuestro consenso propio nos diferencia" | Salvo equipos de investigación con años de revisión por pares, el consenso casero es un pasivo de seguridad, no una ventaja competitiva. |

## 🔗 Referencias

- Nodos y clientes de Ethereum: <https://ethereum.org/developers/docs/nodes-and-clients/>
- Arquitectura del OP Stack: <https://docs.optimism.io/>
- Documentación del Cosmos SDK: <https://docs.cosmos.network/>
- Polkadot SDK (Substrate): <https://docs.polkadot.com/>
- Diversidad de clientes de Ethereum: <https://clientdiversity.org/>
- Estado real de los L2 (riesgos y training wheels): <https://l2beat.com/>
- Imran Bashir, *Mastering Blockchain* (Packt) — capítulos de consenso y arquitectura de nodos.

---

## 🧭 Navegación

⬅️ [Índice de industria](README.md) · ➡️ [02 · Stack tecnológico](02-stack-tecnologico.md)
