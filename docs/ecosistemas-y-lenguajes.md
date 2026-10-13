# Ecosistemas y lenguajes: guía de contraste

> [🏠 Programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🛠️ Tecnologías](tecnologias.md) · Revisión: **2026-10-12**

Esta guía amplía el mapa existente sin convertir cada red en una clase ni sugerir que todas deben usarse. El tronco EVM sigue siendo el entorno práctico principal porque ya tiene contratos, pruebas, dApp e indexador reproducibles. Las demás tecnologías se estudian para comparar modelos de ejecución, seguridad, interoperabilidad y operación antes de transferir una competencia.

## Comparación orientada a decisiones

| Ecosistema | Modelo que conviene estudiar | Cuándo aporta contraste | Evidencia razonable en este programa | Cobertura actual |
|---|---|---|---|---|
| Bitcoin | UTXO, Script, PoW, Lightning | Dinero verificable y política de aceptación | Transacción regtest y política de confirmaciones | Profunda |
| Ethereum | Estado global, EVM, rollups, account abstraction | Contratos y aplicaciones componibles | Contrato Foundry, dApp e indexador | Profunda |
| Arbitrum | Rollup optimista, Nitro, Orbit | L2 y cadenas configurables sobre Ethereum | ADR de seguridad, datos y salida | Comparativa |
| Optimism | OP Stack y Superchain | Stack modular de L2 y gobernanza de upgrades | ADR y threat model | Comparativa |
| Base | L2 construida con OP Stack | Operación de una L2 de distribución masiva | Análisis de dependencias y salida, no despliegue productivo | Introductoria |
| Polygon | PoS, zkEVM y CDK | Distintos compromisos bajo una misma marca | Matriz de modelo de confianza | Comparativa |
| Avalanche | Subredes/L1 y mensajería interoperable | Redes soberanas con validación configurable | ADR de validadores, costos y puentes | Introductoria |
| Polkadot | Relay Chain, parachains y Polkadot Hub | Seguridad compartida e interoperabilidad nativa | Diagrama de confianza y lifecycle de mensaje | Introductoria |
| Cosmos | Cosmos SDK, CometBFT e IBC | Appchains y protocolos de interoperabilidad | ADR de soberanía, validación e IBC | Comparativa |
| Solana | Runtime de cuentas y programas Rust | Paralelismo explícito y cuentas separadas del código | Modelo de cuentas y prueba local futura | Insuficiente para dominio |
| Stellar/Soroban | Ledger orientado a pagos y contratos Soroban | Pagos, activos y contratos con modelo distinto de EVM | Comparación arquitectónica futura | Sin laboratorio específico |
| Hyperledger Fabric | Red permisionada, canales y chaincode | Consorcios con identidad y gobierno explícitos | Caso de empresa y ADR pública/permisionada | Comparativa |

“Comparativa” significa que hay material suficiente para decidir y modelar riesgos, no para operar esa plataforma en producción. Ninguna mención equivale a competencia demostrada.

## Lenguajes y transferencia de competencias

| Lenguaje | Uso blockchain característico | Qué se transfiere | Qué debe reaprenderse |
|---|---|---|---|
| Solidity | Contratos EVM | Invariantes, pruebas, permisos y eventos | Storage, ABI, gas, llamadas y upgrades |
| Vyper | Contratos EVM con un lenguaje deliberadamente acotado | Modelo EVM y pruebas | Sintaxis, límites del lenguaje y herramientas |
| Rust | Solana, CosmWasm, Substrate/Polkadot SDK y clientes | Tipos, memoria, testing y sistemas | Runtime, macros, cuentas o almacenamiento de cada plataforma |
| Move | Aptos, Sui y entornos derivados | Recursos y control explícito de activos | Modelo de objetos/recursos y semántica de cada cadena |
| Cairo | Starknet y pruebas de ejecución | Especificación y razonamiento sobre estado | Modelo de cuentas, felt, costes y tooling |

Aprender Solidity no acredita Rust o Move; sí permite transferir hábitos como escribir invariantes, modelar autoridad y probar rutas adversas. Cada transferencia exige una evidencia nueva en el runtime objetivo.

## Criterios antes de elegir una plataforma

1. Define el activo, los escritores, los lectores y la autoridad de upgrade.
2. Compara finalidad, disponibilidad de datos, puentes y salida ante fallos.
3. Comprueba herramientas, operación de nodos, observabilidad y respuesta a incidentes.
4. Separa compatibilidad de lenguaje de equivalencia de seguridad: “EVM compatible” no iguala gobernanza ni garantías.
5. Evalúa costos completos —infraestructura, auditoría, datos, salida y operación—, no sólo la tarifa visible.
6. Descarta blockchain cuando una base de datos con responsables claros resuelve mejor el problema.

## Fuentes oficiales para profundizar

- [Bitcoin Developer Reference](https://developer.bitcoin.org/reference/)
- [Ethereum Developers](https://ethereum.org/developers/)
- [Arbitrum documentation](https://docs.arbitrum.io/)
- [Optimism documentation](https://docs.optimism.io/)
- [Base documentation](https://docs.base.org/)
- [Polygon documentation](https://docs.polygon.technology/)
- [Avalanche Builder Hub](https://build.avax.network/)
- [Polkadot Developer Docs](https://docs.polkadot.com/)
- [Cosmos Developer Portal](https://docs.cosmos.network/)
- [Solana documentation](https://solana.com/docs)
- [Soroban documentation](https://developers.stellar.org/docs/build/smart-contracts/overview)
- [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/)
- [Vyper documentation](https://docs.vyperlang.org/)
- [Move language](https://move-language.github.io/move/)

## Brechas priorizadas

- Crear evidencia ejecutable para al menos un runtime no EVM sólo cuando pueda mantenerse en CI y offline.
- Añadir un ejercicio Soroban si el caso de pagos demuestra una competencia diferenciada frente a las prácticas actuales.
- Profundizar Solana/Rust y Move mediante proyectos aislados antes de declararlos rutas profesionales completas.
- Revisar semestralmente los nombres y estados de stacks L2: cambian más rápido que los fundamentos de seguridad que esta guía utiliza para compararlos.
