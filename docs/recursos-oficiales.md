# Recursos oficiales y fuentes primarias

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [📖 Bibliografía](bibliografia.md)

Catálogo curado de recursos por categoría. Revisado: 2026-07-28. Las URL y el estado (activo/gratuito) pueden cambiar: verifica antes de citar.

## Documentación oficial

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| Bitcoin Developer Reference | <https://developer.bitcoin.org/reference/> | Referencia técnica del protocolo Bitcoin | Gratuito |
| Bitcoin Core | <https://bitcoincore.org/> | Cliente de referencia, notas de versión | Gratuito |
| Ethereum Developer Docs | <https://ethereum.org/developers/docs/> | Punto de entrada oficial al desarrollo en Ethereum | Gratuito |
| Seguridad de smart contracts (ethereum.org) | <https://ethereum.org/developers/docs/smart-contracts/security/> | Guía oficial de seguridad de contratos | Gratuito |
| Solidity | <https://docs.soliditylang.org/> | Referencia del lenguaje y registro de bugs del compilador | Gratuito |
| Especificaciones EIP/ERC | <https://eips.ethereum.org/> | Texto normativo de estándares (ERC-20, EIP-1559, EIP-4844…) | Gratuito |
| Cosmos SDK | <https://docs.cosmos.network/> | Desarrollo de cadenas de aplicación | Gratuito |
| Solana Developers | <https://solana.com/docs> | Documentación oficial de Solana | Gratuito |
| Hyperledger Fabric | <https://hyperledger-fabric.readthedocs.io/> | Redes permisionadas empresariales | Gratuito |

## Libros de referencia

Los libros del programa, con edición y capítulos recomendados por módulo, están catalogados en [bibliografia.md](bibliografia.md). Regla general: prefiere la edición más reciente (el ecosistema deja obsoletos los detalles en 2-3 años) y contrasta cualquier afirmación técnica con la especificación vigente.

## Exploradores y datos

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| Etherscan | <https://etherscan.io/> | Explorar transacciones, contratos verificados y eventos en Ethereum | Gratuito (API con plan pago) |
| mempool.space | <https://mempool.space/> | Mempool, tarifas y bloques de Bitcoin en vivo | Gratuito |
| L2BEAT | <https://l2beat.com/> | Estado, riesgos y supuestos de confianza de cada L2 (no solo TVL) | Gratuito |
| DefiLlama | <https://defillama.com/> | TVL, volúmenes y métricas DeFi entre cadenas | Gratuito |
| Dune | <https://dune.com/> | Consultas SQL sobre datos on-chain, dashboards comunitarios | Gratuito (planes pagos para uso intensivo) |

## Testnets y faucets

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| Sepolia (documentación) | <https://ethereum.org/developers/docs/networks/> | Testnet recomendada para probar contratos y dApps | Gratuito |
| Faucets de Sepolia | <https://faucetlink.to/sepolia> | Directorio de faucets activos (rotan con frecuencia; verifica cuál funciona) | Gratuito |

Nunca uses claves de testnet en mainnet ni viceversa; trata las claves de prueba como desechables.

## Herramientas

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| Foundry Book | <https://book.getfoundry.sh/> | Herramienta principal del programa: forge, cast, anvil | Gratuito |
| Remix | <https://remix.ethereum.org/> | IDE en el navegador; útil para explorar y prototipar, no para proyectos serios | Gratuito |
| viem | <https://viem.sh/> | Cliente TypeScript para interactuar con EVM desde dApps | Gratuito |
| Tenderly | <https://tenderly.co/> | Simulación, depuración y monitoreo de transacciones | Plan gratuito limitado; pago para equipos |

## Seguridad

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| OWASP Smart Contract Top 10 | <https://owasp.org/www-project-smart-contract-top-10/> | Clases de vulnerabilidad más frecuentes | Gratuito |
| SWC Registry | <https://swcregistry.io/> | Catálogo histórico de debilidades de contratos (útil, aunque ya no se actualiza activamente) | Gratuito |
| secure-contracts (Trail of Bits) | <https://secure-contracts.com/> | Guías de desarrollo seguro, Slither y Echidna | Gratuito |
| Registro de bugs de Solidity | <https://docs.soliditylang.org/en/latest/bugs.html> | Bugs conocidos por versión del compilador | Gratuito |
| Immunefi | <https://immunefi.com/> | Recompensas por vulnerabilidades y divulgación responsable | Gratuito para investigadores |
| Security Alliance (SEAL) | <https://securityalliance.org/> | Respuesta a incidentes (SEAL 911) y ejercicios; ver [operacion-incidentes.md](operacion-incidentes.md) | Gratuito |

## Comunidades y noticias serias

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| Ethereum Magicians | <https://ethereum-magicians.org/> | Discusión de EIPs y estándares | Gratuito |
| ethresear.ch | <https://ethresear.ch/> | Investigación de protocolo (consenso, DA, MEV) | Gratuito |
| Boletines tipo "Week in Ethereum" | — | El boletín original cesó en 2024-2025 y surgieron sucesores; verifica cuál sigue activo antes de suscribirte | Gratuito |
| EIPs en GitHub | <https://github.com/ethereum/EIPs> | Seguir propuestas en tiempo real | Gratuito |

## Regulación

| Recurso | URL | Para qué sirve | Costo |
|---|---|---|---|
| MiCA (texto oficial, EUR-Lex) | <https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32023R1114> | Reglamento europeo de criptoactivos, en aplicación plena desde diciembre de 2024 | Gratuito |
| CMF Chile | <https://www.cmfchile.cl/> | Regulador financiero chileno; Ley Fintech y registro de proveedores | Gratuito |

Contexto local ampliado en [chile-regulacion-tributacion.md](chile-regulacion-tributacion.md).

## Criterio de uso de fuentes

- **Documentación no es marketing**: los sitios de proyectos mezclan ambas; las afirmaciones sobre comportamiento, versiones o seguridad deben verificarse en especificaciones, código fuente y documentación oficial.
- **Cuidado con "influencers" financieros**: quien recomienda comprar un activo suele tener posición o patrocinio en él. Este programa enseña tecnología, no decisiones de inversión.
- **Verifica fechas**: un artículo de 2021 sobre tarifas, L2 o staking está casi con certeza desactualizado. Toda fuente externa debe registrar fecha de consulta.
- **Cifras volátiles** (TVL, tarifas, rankings de L2): no las cites de memoria ni de artículos; consúltalas en vivo en L2BEAT, DefiLlama o el explorador correspondiente.
- Los blogs ayudan a comprender, pero no sustituyen a la fuente primaria cuando la afirmación importa.
