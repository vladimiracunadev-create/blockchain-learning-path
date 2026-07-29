# ADR-002 · ¿Red pública o permisionada?

> **Estado:** guía educativa · **Ámbito:** selección de red · [⬅️ Índice de ADRs](README.md)

## Contexto

Decidido que el caso justifica una blockchain ([ADR-001](001-blockchain-vs-database.md)), toca elegir el tipo de red. Una red pública maximiza verificabilidad, neutralidad y participación abierta; una permisionada controla identidad, privacidad y gobernanza a cambio de reintroducir confianza en un club cerrado. "Privada" no implica confidencialidad automática: hay que definir con precisión quién ve, quién valida y quién administra.

El péndulo de la industria es instructivo. Entre 2016 y 2020 los consorcios permisionados (Hyperledger Fabric, Quorum, Corda) dominaron la agenda empresarial; buena parte fracasó no por tecnología sino por **gobernanza**: nadie quería pagar la infraestructura común ni ceder el control. El cierre de TradeLens (IBM/Maersk, 2023) es la señal canónica. Desde entonces el movimiento real —incluida la banca tradicional con fondos tokenizados y stablecoins reguladas— apunta a **redes públicas con privacidad selectiva** (pruebas de conocimiento cero, datos cifrados con anclaje público), abaratadas además por las L2 tras EIP-4844.

## Opciones

| Criterio | L1 pública | L2 pública (rollup) | Permisionada de consorcio | Híbrida (permisionada anclada a pública) |
| --- | --- | --- | --- | --- |
| Verificabilidad externa | Máxima | Alta (hereda de la L1) | Solo miembros | Parcial: compromisos públicos |
| Privacidad por defecto | Baja | Baja | Alta | Alta dentro, prueba pública fuera |
| Costo por transacción | Alto en congestión | Bajo post EIP-4844 (consúltalo en vivo) | Costo fijo de operación de nodos | Suma de ambos |
| Gobernanza | Del protocolo (neutral) | Equipo del rollup + protocolo | Del consorcio (riesgo de cartel) | Doble capa, compleja |
| Ejemplos | Ethereum | Arbitrum, OP Mainnet, zkSync | Hyperledger Besu, Fabric | Cadenas empresariales con anclaje a Ethereum |

## Criterios de decisión

- ¿Los verificadores relevantes son **abiertos e imprevisibles** (usuarios, reguladores, mercado) o un grupo cerrado y estable?
- ¿La confidencialidad requerida puede resolverse con **cifrado, ZK o datos off-chain** manteniendo la red pública?
- ¿Existe un consorcio con **incentivos y financiamiento sostenibles** para operar infraestructura común durante años?
- ¿Se necesita **composabilidad** con activos y protocolos existentes (stablecoins, DeFi, identidad)?
- ¿Qué exige el marco regulatorio: control de acceso estricto o transparencia auditable?

## Decisión educativa

El programa recomienda por defecto **redes públicas, típicamente una L2 sobre Ethereum**, con privacidad selectiva cuando el dominio lo exige. Las permisionadas se estudian (Besu es útil para entender el stack) pero se tratan como excepción justificable solo con un consorcio real, financiado y con gobernanza resuelta *antes* de escribir código.

## Consecuencias

Positivas:

- Se hereda seguridad, liquidez, herramientas y talento del ecosistema público.
- No hay que resolver el problema más difícil de los consorcios: quién manda y quién paga.

Negativas:

- La privacidad requiere diseño explícito (nunca es gratis en una red pública).
- Se depende de la hoja de ruta y la gobernanza de la L2 elegida (ver [ADR-005](005-l1-l2-appchain.md)).

## Señales para reconsiderar

- Regulación sectorial que prohíba explícitamente registrar compromisos en redes públicas.
- Un consorcio con contrato de financiamiento plurianual firmado y gobernanza neutral operativa.
- Madurez de privacidad ZK insuficiente para el requisito concreto de confidencialidad.

## Referencias

- Hyperledger Besu (documentación): <https://besu.hyperledger.org/>
- Anuncio de discontinuación de TradeLens (Maersk, 2022): <https://www.maersk.com/news/articles/2022/11/29/maersk-and-ibm-to-discontinue-tradelens>
- Ethereum.org, capas 2: <https://ethereum.org/en/layer-2/>
- BIS, *The tokenisation continuum*: <https://www.bis.org/publ/bisbull72.htm>
