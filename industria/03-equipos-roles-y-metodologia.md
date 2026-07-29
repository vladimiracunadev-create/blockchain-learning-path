# 👥 Equipos, roles y metodología de trabajo

> **Audiencia:** Líderes técnicos, PMs y quienes buscan empleo en el sector · ⏱️ **Lectura:** 20 min · **Fuentes:** proceso EIP, foros de gobernanza y prácticas públicas de equipos del ecosistema
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🧩 Los roles reales del sector

El organigrama de un equipo blockchain se parece al de una empresa de software con tres diferencias: la seguridad es un rol de primera línea (no un consultor trimestral), existe gente dedicada a diseñar incentivos económicos, y varios roles trabajan de cara a comunidades públicas. La tabla resume los roles que aparecen en las ofertas reales del sector:

| Rol | Responsabilidad principal | Habilidades clave | Nota de mercado |
|---|---|---|---|
| Protocol engineer | Clientes de nodo, consenso, redes P2P, upgrades de protocolo | Go/Rust, sistemas distribuidos, criptografía aplicada | Pocos puestos, barrera alta, muy bien pagados |
| Smart contract engineer | Diseño e implementación de contratos y sus tests | Solidity/Vyper, Foundry, patrones de seguridad, gas | El rol de entrada más común al sector |
| Security engineer / auditor | Revisión de código, fuzzing, modelado de amenazas, auditorías | Exploits históricos, invariantes, Slither/Echidna | Demanda crónica superior a la oferta |
| Frontend web3 | Interfaces que firman transacciones reales | TypeScript, React, viem/wagmi, UX de wallets | Un bug de frontend puede firmar la transacción equivocada: no es "solo UI" |
| Infra / DevOps | Nodos, RPC, indexers, CI/CD, observabilidad | Kubernetes, Terraform, operación de nodos 24/7 | Transferible casi 1:1 desde DevOps tradicional |
| Researcher | Consenso, criptografía, MEV, diseño de mecanismos | Matemáticas, papers, prototipos | Concentrado en fundaciones y equipos core |
| Tokenomics / mechanism designer | Incentivos, emisión, gobernanza económica | Teoría de juegos, modelado, finanzas | Escaso; a menudo el fundador lo hace mal solo |
| Product manager | Priorización con restricciones únicas (inmutabilidad, gobernanza) | PM clásico + entender qué NO se puede iterar | Los ciclos de release no se parecen a Web2 |
| DevRel | Documentación, ejemplos, soporte a integradores | Escribir código y comunicarlo en público | Puerta de entrada frecuente para perfiles mixtos |
| Business development | Integraciones, partnerships, listados | Red de contactos del ecosistema | En cripto, las integraciones son también técnicas |
| Legal / compliance | Regulación por jurisdicción, estructura de entidades | MiCA (UE), normativa de valores por país | Involucrado desde el diseño del token, no después |

## 📡 Cómo se comunican los equipos: remoto, async y en público

La cultura dominante del sector se formó en proyectos open source globales y se nota:

- **Remote-first y asincronía real:** los equipos están repartidos en todos los husos horarios; la escritura clara sustituye a la reunión. Una propuesta que no está escrita, con contexto y trade-offs, en la práctica no existe.
- **Trabajo en público:** el código en GitHub, las decisiones de protocolo en foros abiertos (Ethereum Magicians para EIPs; los foros de gobernanza de Optimism y Arbitrum para sus DAOs), la conversación diaria en Discord. Un candidato puede leer las discusiones internas reales de la mayoría de los protocolos antes de la entrevista — y los buenos entrevistadores esperan que lo haya hecho.
- **Reputación por contribución:** en un ecosistema donde todo es público, el historial de PRs, propuestas y post-mortems escritos pesa tanto como el currículum.

El matiz honesto: "trabajo en público" también significa que los errores son públicos. Los equipos maduros lo asumen con post-mortems firmados; los inmaduros borran mensajes de Discord. La diferencia se nota y el mercado la recuerda.

Para quien busca empleo, esto es una ventaja asimétrica frente a Web2: el trabajo del equipo al que aspiras es legible de antemano. Antes de una entrevista con un equipo de protocolo, es razonable (y esperado) haber leído:

- Sus últimos PRs relevantes y cómo revisan código en GitHub.
- Las propuestas activas en su foro de gobernanza y las objeciones que recibieron.
- Su último post-mortem, si lo hay: dice más de la cultura que cualquier página de "valores".

## 📜 RFC y EIP: la columna vertebral de la coordinación técnica

El mecanismo central de coordinación del ecosistema Ethereum es el proceso **EIP** (Ethereum Improvement Proposal), definido en EIP-1. Su ciclo de vida formal:

```text
 Idea ──▶ Draft ──▶ Review ──▶ Last Call ──▶ Final
             │          │           │
             │          │           └─ ventana mínima de 14 días para
             │          │              objeciones de última hora
             │          └─ discusión pública (Ethereum Magicians),
             │             revisión de editores, iteración
             └─ el autor escribe la especificación completa;
                sin spec escrita no hay discusión seria

 (estados adicionales: Stagnant si se abandona, Withdrawn si se retira)
```

Lo relevante para un profesional no es memorizar los estados sino la filosofía: **la especificación escrita precede al código**, cualquiera puede objetar en público, y una propuesta "Final" es un contrato social que decenas de equipos independientes implementan sin que nadie pueda obligarlos. EIP-4844 y EIP-7702 recorrieron exactamente este camino antes de llegar a Dencun (2024) y Pectra (2025).

Dentro de las empresas del sector, el equivalente son los **design docs** y los **ADRs** (Architecture Decision Records): el mismo principio — decisión escrita, revisada y archivada — a escala de equipo. Este programa lo practica en su propio [índice de ADRs](../adrs/README.md).

## 🐢 Por qué "move fast and break things" no aplica aquí

En Web2, un bug en producción se corrige con un deploy; el costo del error es acotado y reversible. En contratos inteligentes, el código desplegado es inmutable por defecto y custodia fondos: **el costo del error es instantáneo, público e irreversible**. La historia del sector — de The DAO (2016) a los cientos de millones drenados cada año que documentan las firmas de seguridad — es la factura de equipos que trasladaron hábitos de Web2 sin adaptarlos.

La metodología estándar que la industria destiló de esos fracasos:

1. **Especificación:** qué hace el sistema, qué no hace, quién puede hacer qué.
2. **Invariantes:** propiedades que deben cumplirse siempre ("nadie retira más de lo que depositó"), escritas antes que el código.
3. **Implementación** contra la spec, con librerías auditadas (OpenZeppelin) como base.
4. **Pruebas y fuzzing:** unitarias, de integración, fuzzing e invariant testing (Foundry/Echidna); cobertura alta como piso, no como meta.
5. **Revisión interna** por pares que no escribieron el código.
6. **Auditoría externa:** una o dos firmas independientes; los findings se corrigen y se re-auditan. Es un gate obligatorio, no un sello de marketing.
7. **Bug bounty** público (típicamente vía Immunefi) antes y después del despliegue.
8. **Despliegue controlado:** multisig (Safe) + timelock para toda función administrativa; límites iniciales conservadores.
9. **Monitoreo y respuesta:** alertas en tiempo real, runbooks de pausa/mitigación, guardias.

## 🔄 El pipeline, en bloque

```text
 Spec ──▶ Invariantes ──▶ Implementación ──▶ Tests + Fuzzing
                                                   │
                                                   ▼
 Despliegue ◀── Bug bounty ◀── Auditoría externa ◀── Revisión interna
 (multisig +        (público,      (1-2 firmas,         (pares)
  timelock)          continuo)      con re-check)
      │
      ▼
 Monitoreo 24/7 ──▶ Incidente ──▶ Post-mortem público ──▶ vuelta a Spec
```

El ciclo completo de un protocolo serio, de spec a mainnet, se mide en meses, y las auditorías de firmas reconocidas se reservan con semanas o meses de antelación (los precios varían mucho; consúltalo en vivo con las firmas). Planificar el calendario sin contar la auditoría es el error de PM más común del sector.

Dos observaciones prácticas sobre el pipeline:

- **No es cascada pura:** dentro de cada etapa se itera con normalidad; lo que no se negocia es saltarse un gate. Un cambio de una línea después de la auditoría reabre la auditoría, y los equipos que lo "olvidaron" protagonizan varios de los exploits mejor documentados.
- **El pipeline es también un artefacto de contratación:** preguntarle a un equipo cómo es su camino de spec a mainnet distingue en una conversación a los equipos profesionales de los que improvisan. Las etapas de pruebas e invariantes de este pipeline se practican en los [laboratorios del programa](../labs/CATALOG.md), sobre el stack descrito en el [currículo](../curriculum/README.md).

## 🗳️ Ceremonias y coordinación: del standup a la gobernanza

Las ceremonias ágiles clásicas existen (standups async, sprints, retros), pero el sector añade capas de coordinación sin equivalente en Web2:

- **All-core-devs calls de Ethereum:** llamadas públicas y grabadas donde los equipos de clientes — empresas independientes entre sí — acuerdan el contenido y calendario de cada hard fork. Es el ejemplo más visible de coordinación técnica multi-equipo sin autoridad central: nadie puede ordenar, solo convencer.
- **Gobernanza off-chain:** foros (propuestas, temperatura), snapshot votes sin gas. Ahí se decide la dirección.
- **Gobernanza on-chain:** votos con token que ejecutan cambios reales en contratos, generalmente con timelock. Ahí se ejecuta — y el equipo debe diseñar qué está bajo gobernanza y qué no.
- **Coordinación de upgrades:** un cambio de protocolo exige que operadores de nodos independientes actualicen a tiempo; la comunicación pública (blogs, foros, Discord) es parte del trabajo de ingeniería, no del de marketing.

Para un PM o líder técnico que llega de Web2, la diferencia operativa es que una parte de los stakeholders no son empleados: son delegados de una DAO, operadores anónimos de nodos o usuarios con derecho a voto. Los plazos se negocian en público.

## 🌐 Diferencias concretas con Web2

| Dimensión | Web2 típico | Sector blockchain |
|---|---|---|
| Gate de release | QA + feature flags | Auditoría externa obligatoria + bug bounty |
| Corrección de errores | Deploy inmediato | Gobernanza/multisig/timelock; a veces imposible sin migración |
| Incident response | Statuspage y comunicación controlada | Incidente visible on-chain en tiempo real; los atacantes y los usuarios lo ven a la vez |
| Post-mortems | Internos, a veces públicos | Públicos por norma del sector; su calidad define la reputación del equipo |
| Roadmap | Privado hasta el anuncio | Discutido en foros públicos con la comunidad |
| Stakeholders | Management y clientes | Además: DAO, validadores, holders, auditores, reguladores |

La respuesta a incidentes merece estudio propio — el programa la desarrolla en [operación e incidentes](../docs/operacion-incidentes.md) — pero la regla cultural es clara: en un sistema transparente, ocultar un incidente es imposible y intentarlo destruye más valor que el exploit mismo.

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "Es una startup: iteramos rápido y arreglamos después" | Con código inmutable que custodia fondos, "después" puede no existir; el proceso spec→auditoría→timelock es el mínimo profesional. |
| "La auditoría garantiza que no habrá exploits" | Protocolos auditados caen cada año; la auditoría reduce riesgo y demuestra diligencia, no compra certeza. |
| "Los roles son como en Web2 con otro nombre" | Auditores, mechanism designers y DevRel de protocolo no tienen equivalente directo; y el frontend firma transacciones irreversibles. |
| "La gobernanza es teatro, decide el equipo" | A veces es cierto — y es un riesgo señalado públicamente; en protocolos maduros la DAO ha revertido decisiones del equipo core. La honestidad exige mirar caso por caso. |
| "Para entrar al sector necesito años de cripto" | Los equipos valoran fundamentos sólidos de ingeniería + evidencia pública (contribuciones, CTFs, auditorías practicadas); el contexto se aprende en meses. |
| "Discord es ruido, lo importante está en Jira" | Las decisiones reales de los protocolos abiertos se cocinan en foros y llamadas públicas; ignorarlos es trabajar a ciegas. |

## 🔗 Referencias

- EIP-1, propósito y proceso de los EIPs: <https://eips.ethereum.org/EIPS/eip-1>
- Ethereum Magicians (foro de discusión de EIPs): <https://ethereum-magicians.org/>
- Trail of Bits, *Building Secure Contracts*: <https://secure-contracts.com/>
- a16z crypto (investigación y prácticas del sector): <https://a16zcrypto.com/>
- Comunidad Ethereum, all-core-devs y contribución: <https://ethereum.org/community/>
- Foro de gobernanza de Optimism: <https://gov.optimism.io/>
- Immunefi (bug bounties del sector): <https://immunefi.com/>

---

## 🧭 Navegación

⬅️ [02 · Stack tecnológico](02-stack-tecnologico.md) · [Índice de industria](README.md) · ➡️ [04 · Blockchain para empresas](04-blockchain-para-empresas.md)
