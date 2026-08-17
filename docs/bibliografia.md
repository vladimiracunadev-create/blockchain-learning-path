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

## 🧪 Cómo se valida este contenido (y qué NO garantiza)

Pregunta legítima: si el material es original y no reproduce los libros, **¿cómo
sabes que lo que afirma es cierto?** La respuesta honesta es que hay dos tipos de
afirmación en el programa y **se validan de forma distinta**.

### 1. Lo que se demuestra ejecutando

La mayor parte del contenido técnico no te pide que confíes en nadie: **lo puedes
correr**. Si el módulo 01 afirma que una prueba de Merkle de 8 hojas necesita 3
hashes, hay un test que lo comprueba; si el módulo 09 afirma que cierta línea
habilita una reentrancia, hay un exploit que drena el contrato y un fix que lo
resiste.

| Afirmación de | Se comprueba con |
|---|---|
| Hashes, Merkle, firmas | `pnpm test` — pruebas de `labs/01-cryptography` |
| Prueba de trabajo y dificultad | `pnpm test` — `labs/02-consensus` |
| Conservación de valor en UTXO | `pnpm test` — `labs/04-bitcoin` |
| Codificación ABI y selectores | `pnpm test` — `labs/05-evm` |
| Reentrancia, control de acceso, oráculo, replay, front-running, colisión de storage | `forge test` en [`security-challenges/`](../security-challenges/README.md) — cada reto trae su **exploit** y su **fix** |
| Contratos de bóveda, gobernanza y financiamiento | `forge test` en `labs/` y `projects/` |
| AMM, pérdida impermanente, factor de salud y liquidación | `pnpm test` — `labs/19-defi` |
| Colateral, paridad y cobertura accesible de reservas | `pnpm test` — `labs/21-stablecoins` |
| Coste de una remesa, prefondeo y pago contra pago atómico | `pnpm test` — `labs/23-pagos-fx` |
| Entrega contra pago, liquidez del neteo y ciclo de un bono | `pnpm test` — `labs/25-mercados-capitales` |
| Política de cuórum M-de-N frente a compromiso y a pérdida | `pnpm test` — `labs/26-custodia` |
| Enfoque basado en riesgo y Regla de Viaje | `pnpm test` — `labs/27-cumplimiento` |
| Mercado tokenizado: dinero mayorista simulado, bono y DvP atómico | `forge test` en [`labs/22-cbdc-mercado-tokenizado/`](../labs/22-cbdc-mercado-tokenizado/README.md) |

Son **186 pruebas automatizadas** (148 de Node y 38 de Foundry) que la CI ejecuta en
cada cambio. Una afirmación que se contradiga con el código hace fallar el build.
Eso es más fuerte que una cita: no apela a la autoridad de un autor, se comprueba.

Ese número tampoco es una promesa: `pnpm check` cuenta las pruebas del repositorio
y falla si esta página deja de coincidir con la realidad.

### 2. Lo que se apoya en fuentes

El resto —historia, decisiones de diseño, cifras del ecosistema, casos de empresa,
regulación— no se puede ejecutar. Ahí la garantía es la **trazabilidad**:

- Cada módulo **declara su fuente** en la cabecera (`**Fuente:**`).
- Cada módulo cierra con **Referencias** enlazando a la fuente primaria (mínimo 3
  enlaces; los módulos van de 3 a 9).
- `pnpm check` **falla** si un módulo no declara fuente, no tiene referencias
  enlazadas o no aparece en la tabla de abajo.
- Un workflow revisa **semanalmente** que esos enlaces siguen vivos y abre un issue
  si alguno muere. Una fuente que ya no se puede consultar deja de ser una fuente.

### Qué NO garantiza esto

Sé explícito sobre el límite: que el material cite una obra **no significa que un
tercero haya certificado que la interpretación sea fiel a ella**. Este programa no
tiene revisión académica por pares. Si vas a apoyar una decisión técnica o de
negocio en algo que leas aquí:

- **Contrástalo con la fuente primaria enlazada** — para eso están los enlaces.
- Desconfía especialmente de **cifras y estados del ecosistema**: cambian rápido.
  El material marca las fechas de cada hito por esa razón.
- Si encuentras un error, [abre un issue](https://github.com/vladimiracunadev-create/blockchain-learning-path/issues):
  corregir el material es una contribución tan válida como añadirlo.

## 🔗 Qué obra sustenta cada módulo

Cada módulo declara su fuente en la cabecera. Esta tabla invierte esa relación: te
dice **dónde se usa cada obra**, para que puedas ir del libro al módulo o del módulo
al libro. Los enlaces apuntan a la fuente oficial —cuando la obra tiene una edición
legalmente gratuita, se enlaza esa.

| Módulo | Obra que lo sustenta |
|---|---|
| [00 · Orientación](../curriculum/00-orientacion/README.md) | Bashir — *Mastering Blockchain* · Werbach — [*The Blockchain and the New Architecture of Trust*](https://mitpress.mit.edu/9780262038935/the-blockchain-and-the-new-architecture-of-trust/) |
| [01 · Criptografía](../curriculum/01-criptografia/README.md) | Aumasson — [*Serious Cryptography*](https://nostarch.com/serious-cryptography-2nd-edition) · Katz, Lindell — [*Introduction to Modern Cryptography*](http://www.cs.umd.edu/~jkatz/imc.html) |
| [02 · Sistemas distribuidos](../curriculum/02-sistemas-distribuidos/README.md) | Cachin, Guerraoui, Rodrigues — [*Reliable and Secure Distributed Programming*](https://link.springer.com/book/10.1007/978-3-642-15260-3) · Tanenbaum, van Steen — [*Distributed Systems*](https://www.distributed-systems.net/index.php/books/ds4/) (PDF gratuito) |
| [03 · Consenso](../curriculum/03-consenso/README.md) | Nakamoto — [whitepaper de Bitcoin](https://bitcoin.org/bitcoin.pdf) · Castro, Liskov — [*Practical Byzantine Fault Tolerance*](https://www.usenix.org/conference/osdi-99/practical-byzantine-fault-tolerance) |
| [04 · Bitcoin](../curriculum/04-bitcoin/README.md) | Antonopoulos — [*Mastering Bitcoin*](https://github.com/bitcoinbook/bitcoinbook) (libre) · [*Mastering the Lightning Network*](https://github.com/lnbook/lnbook) (libre) |
| [05 · Ethereum y EVM](../curriculum/05-ethereum-evm/README.md) | Antonopoulos, Wood — [*Mastering Ethereum*](https://github.com/ethereumbook/ethereumbook) (libre) · Wood — [*Yellow Paper*](https://ethereum.github.io/yellowpaper/paper.pdf) |
| [06 · Solidity y Foundry](../curriculum/06-solidity-foundry/README.md) | [Documentación de Solidity](https://docs.soliditylang.org/) · [The Foundry Book](https://book.getfoundry.sh/) |
| [07 · dApps](../curriculum/07-dapps/README.md) | [ethereum.org — Developers](https://ethereum.org/developers/docs/) · [documentación de viem](https://viem.sh/) |
| [08 · Tokens](../curriculum/08-tokens/README.md) | [EIPs de Ethereum](https://eips.ethereum.org/) · [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) |
| [09 · Seguridad](../curriculum/09-seguridad/README.md) | Trail of Bits — [*Building Secure Contracts*](https://secure-contracts.com/) · ConsenSys — [*Smart Contract Best Practices*](https://consensysdiligence.github.io/smart-contract-best-practices/) |
| [10 · Oráculos e indexación](../curriculum/10-oraculos-indexacion/README.md) | [Chainlink docs](https://docs.chain.link/) · [The Graph docs](https://thegraph.com/docs/) |
| [11 · DAO y gobernanza](../curriculum/11-dao-gobernanza/README.md) | [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/governance) · [Compound Governance](https://docs.compound.finance/) |
| [12 · Escalabilidad](../curriculum/12-escalabilidad/README.md) | Buterin — [*An Incomplete Guide to Rollups*](https://vitalik.eth.limo/general/2021/01/05/rollup.html) · [L2BEAT](https://l2beat.com/) |
| [13 · Interoperabilidad](../curriculum/13-interoperabilidad/README.md) | [Cosmos IBC](https://ibc.cosmos.network/) · [Polkadot XCM](https://wiki.polkadot.network/) |
| [14 · Privacidad y ZK](../curriculum/14-privacidad-zk/README.md) | Thaler — [*Proofs, Arguments, and Zero-Knowledge*](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html) (libre) · [ZKProof Community Reference](https://zkproof.org/) |
| [15 · Arquitectura avanzada](../curriculum/15-arquitectura-avanzada/README.md) | [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) y [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) · [Flashbots — investigación](https://writings.flashbots.net/) |
| [16 · Infraestructura y nodos](../curriculum/16-infraestructura-nodos/README.md) | [ethereum.org — Nodos y clientes](https://ethereum.org/developers/docs/nodes-and-clients/) · [EthStaker](https://ethstaker.org/) |
| [17 · Empresa](../curriculum/17-blockchain-en-la-empresa/README.md) | Informes del [BIS](https://www.bis.org/) y del [WEF](https://www.weforum.org/) · Werbach — *The Blockchain and the New Architecture of Trust* |
| [18 · Implementación](../curriculum/18-implementacion-empresarial/README.md) | Prácticas públicas de integración del sector financiero y documentación de cada componente citado |
| [19 · DeFi](../curriculum/19-defi/README.md) | Documentación de [Uniswap](https://docs.uniswap.org/), [Aave](https://aave.com/docs) y [Sky/MakerDAO](https://docs.makerdao.com/) · investigación del [BIS](https://www.bis.org/) sobre finanzas descentralizadas |
| [20 · Dinero, banca y liquidación](../curriculum/20-dinero-banca-liquidacion/README.md) | [CPMI-BIS](https://www.bis.org/cpmi/index.htm) — sistemas de pago y [PFMI](https://www.bis.org/cpmi/publ/d101.htm) · Banco de Inglaterra — [*Money creation in the modern economy*](https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy) |
| [21 · Stablecoins](../curriculum/21-stablecoins/README.md) | [BIS](https://www.bis.org/) y [FSB](https://www.fsb.org/) sobre stablecoins · [Reglamento (UE) 2023/1114 (MiCA)](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32023R1114) |
| [22 · Depósitos tokenizados y CBDC/MDBC](../curriculum/22-deposito-tokenizado-cbdc/README.md) | [BIS Innovation Hub](https://www.bis.org/about/bisih/about.htm) · [Banco Central de Chile](https://www.bcentral.cl/) · [BCE — euro digital](https://www.ecb.europa.eu/euro/digital_euro/html/index.es.html) |
| [23 · Pagos, cross-border y FX](../curriculum/23-pagos-fx-onchain/README.md) | [FSB — hoja de ruta del G20 para pagos transfronterizos](https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/cross-border-payments/) · [Banco Mundial — *Remittance Prices Worldwide*](https://remittanceprices.worldbank.org/) |
| [24 · Tokenización y RWA](../curriculum/24-tokenizacion-rwa/README.md) | [BIS](https://www.bis.org/) e [IOSCO](https://www.iosco.org/) sobre tokenización · estándares [ERC](https://eips.ethereum.org/) y [ERC-3643](https://www.erc3643.org/) |
| [25 · Mercados de capitales on-chain](../curriculum/25-mercados-capitales-onchain/README.md) | [CPMI-IOSCO — *Principles for Financial Market Infrastructures*](https://www.bis.org/cpmi/publ/d101.htm) · [BCE — T2S](https://www.ecb.europa.eu/paym/target/t2s/html/index.en.html) |
| [26 · Custodia e identidad](../curriculum/26-custodia-identidad/README.md) | [BIPs 32/39/44](https://github.com/bitcoin/bips) · [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) · [W3C — DID](https://www.w3.org/TR/did-core/) y [credenciales verificables](https://www.w3.org/TR/vc-data-model-2.0/) · [NIST SP 800-57](https://csrc.nist.gov/projects/key-management) |
| [27 · Regulación y cumplimiento](../curriculum/27-regulacion-cumplimiento/README.md) | [MiCA](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32023R1114) · [GAFI/FATF](https://www.fatf-gafi.org/) · [Comité de Basilea](https://www.bis.org/bcbs/) · [IOSCO](https://www.iosco.org/) · [CMF](https://www.cmfchile.cl/) y [Ley Chile](https://www.bcn.cl/leychile) |

> **Obras libres.** *Mastering Bitcoin*, *Mastering Ethereum*, *Mastering the Lightning
> Network*, *Distributed Systems*, *Proofs, Arguments, and Zero-Knowledge* y el
> *MoonMath Manual* tienen edición legalmente gratuita: puedes seguir el programa
> completo sin comprar un solo libro.

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
