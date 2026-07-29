# Mapa de tecnologías

| Necesidad | Tecnología principal | Alternativas para comparar |
|---|---|---|
| Contratos EVM | Solidity + Foundry | Vyper, Hardhat |
| Cliente web | TypeScript + viem | ethers |
| Nodo local | Anvil | Hardhat Network, Geth dev |
| Seguridad | Slither, Echidna, Foundry fuzz | Mythril, Semgrep |
| Multisig | Safe | soluciones nativas de otras redes |
| Indexación | eventos + indexador propio | The Graph |
| Almacenamiento | IPFS con pinning | Arweave, almacenamiento tradicional |
| Oráculos | Chainlink (concepto/adaptador) | Pyth, API3 |
| L2 | Optimistic y ZK rollups | canales, validiums |
| Empresa | Hyperledger Fabric | Besu, Corda |

Las herramientas cambian; los conceptos, invariantes y modelos de amenaza son el centro del aprendizaje. Consulta siempre documentación oficial antes de desplegar.
