# 📚 Bibliografía y fuentes

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🔗 Recursos oficiales](recursos-oficiales.md)

Todo el contenido de este programa es **original en su redacción** y se apoya en la
literatura de referencia del área. Aquí se listan las obras y fuentes primarias que
sustentan cada módulo. **No se reproduce el contenido de los libros**: las referencias
apuntan a las obras para que profundices en la fuente.

Cuando una obra tiene varias ediciones, usa **la más reciente**: el ecosistema cambia
rápido y las ediciones nuevas corrigen detalles de protocolo. Las fechas de las
especificaciones (EIPs, upgrades) están indicadas para que distingas lo estable de lo
que aún evoluciona.

## Libros de referencia por área

| Área | Obras de referencia |
|---|---|
| **Fundamentos y panorama** | Bashir — *Mastering Blockchain* (4.ª ed.) · Narayanan, Bonneau, Felten, Miller, Goldfeder — *Bitcoin and Cryptocurrency Technologies* (Princeton) · Werbach — *The Blockchain and the New Architecture of Trust* |
| **Criptografía** | Aumasson — *Serious Cryptography* (2.ª ed.) · Ferguson, Schneier, Kohno — *Cryptography Engineering* · Katz, Lindell — *Introduction to Modern Cryptography* (3.ª ed.) |
| **Sistemas distribuidos** | Cachin, Guerraoui, Rodrigues — *Introduction to Reliable and Secure Distributed Programming* · Tanenbaum, van Steen — *Distributed Systems* · Kleppmann — *Designing Data-Intensive Applications* |
| **Consenso** | Lamport — *The Part-Time Parliament* (Paxos) · Castro, Liskov — *Practical Byzantine Fault Tolerance* · Nakamoto — *Bitcoin: A Peer-to-Peer Electronic Cash System* · Buterin, Griffith — *Casper the Friendly Finality Gadget* |
| **Bitcoin** | Antonopoulos — *Mastering Bitcoin* (3.ª ed.) · Antonopoulos, Osuntokun, Pickhardt — *Mastering the Lightning Network* |
| **Ethereum / EVM** | Antonopoulos, Wood — *Mastering Ethereum* · Wood — *Ethereum Yellow Paper* · documentación de [ethereum.org](https://ethereum.org/developers/docs/) |
| **Solidity / Foundry** | [Documentación de Solidity](https://docs.soliditylang.org/) · [The Foundry Book](https://book.getfoundry.sh/) · [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) |
| **Seguridad de contratos** | Trail of Bits — *Building Secure Contracts* · ConsenSys — *Smart Contract Best Practices* · [SWC Registry](https://swcregistry.io/) · *Damn Vulnerable DeFi* |
| **Oráculos e indexación** | [Chainlink — documentación](https://docs.chain.link/) y whitepaper 2.0 · [The Graph — docs](https://thegraph.com/docs/) · [IPFS — docs](https://docs.ipfs.tech/) |
| **DAO y gobernanza** | [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/governance) · [Compound Governance](https://docs.compound.finance/) · Voshmgir — *Token Economy* |
| **Escalabilidad / L2** | Buterin — *An Incomplete Guide to Rollups* · [ethereum.org — Escalado](https://ethereum.org/developers/docs/scaling/) · [L2BEAT](https://l2beat.com/) |
| **Interoperabilidad** | [Cosmos IBC](https://ibc.cosmos.network/) · [Polkadot XCM](https://wiki.polkadot.network/) · [Chainlink CCIP](https://docs.chain.link/ccip) |
| **Privacidad y ZK** | Thaler — *Proofs, Arguments, and Zero-Knowledge* · *The MoonMath Manual to zk-SNARKs* · [ZKProof — Community Reference](https://zkproof.org/) |
| **Arquitectura avanzada** | ERC-4337 y EIP-7702 (abstracción de cuenta) · [Flashbots — investigación MEV](https://writings.flashbots.net/) · [OpenZeppelin — Proxies y Upgrades](https://docs.openzeppelin.com/upgrades-plugins/) |

## Fuentes primarias (whitepapers y especificaciones)

- **Bitcoin** — Nakamoto, *Bitcoin: A Peer-to-Peer Electronic Cash System* (2008): <https://bitcoin.org/bitcoin.pdf>
- **Ethereum** — Buterin, *Ethereum Whitepaper*: <https://ethereum.org/whitepaper/> · Wood, *Yellow Paper*: <https://ethereum.github.io/yellowpaper/paper.pdf>
- **Estándares (EIP/ERC)** — <https://eips.ethereum.org/> — en especial ERC-20, ERC-721, ERC-1155, ERC-4626 (bóvedas), ERC-2612 (permit), ERC-4337 y EIP-7702 (abstracción de cuenta), EIP-1559 (comisiones) y EIP-4844 (blobs).
- **Registro de vulnerabilidades** — SWC Registry: <https://swcregistry.io/> · Solodit / informes de auditoría públicos.

## Actualidad del ecosistema (hitos recientes)

El contenido se mantiene al día con la hoja de ruta de Ethereum y del ecosistema.
Hitos relevantes que el material tiene en cuenta:

- **The Merge** (2022) — Ethereum pasó de Proof of Work a Proof of Stake.
- **Shapella** (2023) — habilitó el retiro de *staking*.
- **Dencun / EIP-4844** (marzo 2024) — *blobs* de datos que abarataron drásticamente los rollups (proto-danksharding).
- **Pectra / EIP-7702** (2025) — mejoras de abstracción de cuenta para EOAs y más capacidad de *blobs*.
- **Roadmap en curso** — danksharding completo, *statelessness* (árboles Verkle), separación proponente-constructor (PBS) y *restaking*. Se presentan como **dirección**, no como hechos consumados.

> ⚠️ Verifica siempre contra la fuente primaria. Las cifras concretas (TPS, comisiones,
> número de validadores, TVL de un puente) cambian a diario; este material enseña los
> **principios** y señala explícitamente qué datos debes consultar en vivo.

---

## 🧭 Navegación

[📚 Currículo](../curriculum/README.md) · [🔗 Recursos oficiales](recursos-oficiales.md) · [🗺️ Roadmap](../ROADMAP.md) · [🏠 Inicio](../README.md)
