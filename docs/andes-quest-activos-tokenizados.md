# Andes Quest Assets · decidir entre base de datos y blockchain

> [🏠 Programa](../README.md) · [📚 Clases 17–18](../curriculum/08-tokens/README.md) · [🧪 Laboratorio local](../labs/23-andes-quest-assets/README.md) · [📖 Glosario](glosario.md)

**Pregunta rectora:** ¿cuándo tiene sentido representar un activo de videojuego
on-chain y cuándo una base de datos tradicional es mejor?

Andes Quest Assets es un caso ficticio para aplicar conocimientos ya enseñados.
No es un curso de diseño de juegos ni una invitación a especular. Su economía
virtual puede funcionar perfectamente sin blockchain; la cadena solo se considera
cuando una necesidad de coordinación externa compensa sus costes y riesgos.

## Inventario y derechos

| Activo | Naturaleza posible | Representación inicial | Derecho que reconoce el juego |
|---|---|---|---|
| `GEM` | moneda virtual fungible | saldo entero en PostgreSQL | comprar servicios dentro del juego |
| `SKIN_DRAGON_001` | item único | fila de inventario | usar una apariencia si la cuenta es apta |
| `SWORD_EPIC_01` | item seriado | fila o cantidad | equipar la espada bajo reglas vigentes |
| `LAND_PLOT_42` | entitlement único | asignación a una cuenta | acceder y construir en una zona |
| `BATTLE_PASS_2026` | licencia temporal | entitlement con expiración | acceder a contenido de la temporada 2026 |

Una *soft currency* ganada jugando, una *premium currency* adquirida, un item, una
licencia temporal y un NFT no son sinónimos. La misma skin puede ser una fila en
una base, un entitlement transferible dentro de la plataforma, un ERC-721 o una
unidad ERC-1155. La representación no decide por sí sola qué puede hacer el
jugador: lo decide el contrato de servicio y la lógica del juego.

## Cinco fases, cinco balances distintos

```text
Activo en base de datos
        ↓
Transferible dentro de plataforma
        ↓
Activo tokenizado
        ↓
Negociable fuera del juego
        ↓
Representado en otra red o aplicación
```

| Fase | Qué mejora | Qué empeora | Riesgo nuevo o dominante |
|---|---|---|---|
| A · PostgreSQL | latencia, privacidad, reversión, soporte y control de fraude | el jugador depende totalmente del operador | abuso interno, borrado o indisponibilidad del operador |
| B · transferencias internas | portabilidad entre cuentas del mismo servicio | crecen fraude, soporte y disputas | toma de cuentas, duplicación lógica y mercado gris |
| C · ERC-721/1155 | propiedad verificable y transferencia independiente | gas, UX de wallet, privacidad y finalidad eventual | phishing, permisos, contrato defectuoso y clave administrativa |
| D · mercado externo | descubrimiento y liquidación entre desconocidos | volatilidad, contraparte, moderación y posible cash-out | listings falsos, activos robados, wash trading y presión especulativa |
| E · puente | portabilidad entre dominios que hayan acordado semántica | más latencia, operaciones y confianza | fallo de validadores, replay, doble representación y pérdida de liquidez |

Una base tradicional suele ganar si existe un operador confiable y se necesitan
milisegundos, reversibilidad, privacidad, moderación, antifraude y soporte. Una
cadena puede justificar su complejidad cuando la transferibilidad independiente,
la verificabilidad pública, el settlement compartido o la ausencia de una sola
autoridad son requisitos reales, no eslóganes.

## GEM: saldo en base frente a ERC-20

`GEM` en PostgreSQL admite bloqueo, reembolso y corrección por soporte con una
transacción de base de datos. El operador define supply y acceso. `GEM` como ERC-20
añade `decimals`, `totalSupply`, `mint`, `burn`, `transfer`, allowances y composición
con contratos externos. También añade gas, gestión de claves, mempool, trazabilidad
pública y la posibilidad de cotización fuera del contexto previsto.

El contrato necesita un tope o una política de emisión comprobable, roles mínimos,
eventos de procedencia y un proceso para compromisos de firmante. `approve` concede
un importe a un spender; un permit añade firma, `nonce` y `deadline`, pero no elimina
el riesgo de consentir algo que el usuario no entiende. Tokenizar GEM no es una
mejora automática: para una moneda encerrada en un solo juego suele ser una base de
datos más simple, rápida y recuperable.

## Skin única y colecciones mixtas

`SKIN_DRAGON_001` puede usar ERC-721: `tokenId` identifica la unidad, `ownerOf`
expone la dirección propietaria, `transferFrom` la mueve, `approve` autoriza una
unidad y `setApprovalForAll` autoriza a un operador sobre toda la colección. Esa
última comodidad amplía mucho el impacto de un marketplace malicioso o comprometido.

ERC-1155 puede alojar `100 × POTION`, `10 × KEY` y `1 × SKIN` en un contrato, con
cantidades y transferencias por lote. Ahorra despliegues y puede ahorrar gas, pero
no es automáticamente mejor que ERC-721: tooling, identidad individual, historial
y semántica pueden hacer preferible el estándar de unidad única.

### Token, metadata y archivo

```text
Token → token URI → JSON metadata → image / animation_url → archivo
```

Cada capa tiene disponibilidad y control distintos. Metadata mutable permite
corregir o evolucionar una temporada, pero quien controla la URI puede cambiar lo
que el token parece representar. Metadata inmutable o con hash reduce ese poder,
pero vuelve más difícil corregir errores. IPFS aporta direccionamiento por contenido;
no garantiza por sí solo que alguien siga alojando el contenido.

**¿Qué ocurre si desaparece el servidor donde vive la metadata?** El token y su
`owner` pueden seguir en la cadena, mientras la descripción, imagen o animación
dejan de estar disponibles. Si además cierra el backend del juego, puede quedar una
prueba transferible sin utilidad jugable.

## Ownership no equivale a entitlement ni propiedad intelectual

```text
Poseer NFT ≠ poseer copyright ≠ poseer marca
           ≠ poseer archivos fuente ≠ tener explotación comercial ilimitada
```

El token ownership dice qué dirección controla el token. El game entitlement dice
si una cuenta puede usar el activo. El juego aún puede exigir cuenta no suspendida,
licencia vigente, cliente compatible, asset permitido, metadata válida y temporada
activa. Copyright, marca, licencia de uso, metadata y archivo multimedia son capas
jurídicas y técnicas separadas.

Ejemplo de inconsistencia:

```text
Blockchain: wallet 0xA posee NFT #42
Indexer: aún no finalizó el bloque que lo transfirió
Game DB: la cuenta de 0xA no tiene entitlement
Cliente: no permite equipar LAND_PLOT_42
```

Debe declararse una fuente de verdad por decisión. Un flujo razonable es
`Blockchain → Indexer → Game Backend → Game Client`, con checkpoint, confirmaciones,
idempotencia y reconciliación. El cliente no debería recorrer la cadena en cada
acción. Una reorganización puede retirar un evento recién visto; “observado” no
significa “final”. La política de recuperación debe distinguir fallo del indexador,
reorg, wallet no vinculada, suspensión legítima y error del backend.

## Mint, burn y crafting

Un `MINT SKIN` necesita autoridad, supply policy y razón verificable: recompensa de
un evento firmado, compra confirmada o crafting válido. El evento debe permitir
reconstruir quién emitió, para quién y bajo qué identificador. `burn` on-chain hace
inutilizable la unidad en el contrato; eliminar lógicamente una fila off-chain puede
ser reversible y conservar auditoría.

Para `3 ITEM_A + 2 ITEM_B → 1 ITEM_C`, una transacción puede hacer burn y mint de
forma atómica. Antes necesita balances y approvals; cualquier fallo revierte todo.
La base de datos logra la misma atomicidad con una transacción local, con menor coste
y recuperación administrativa. La pregunta no es si Solidity puede hacerlo, sino
si otras partes necesitan verificar y liquidar el resultado sin confiar en Andes Quest.

## Mercado, royalties y señales de precio

```text
Seller → approval → Marketplace → payment + transfer → Buyer
```

Un mercado necesita listing, cancelación, autorización, pago, fee, transferencia y
tratamiento de errores. Debe mostrar dirección oficial del contrato y procedencia:
una colección `Official SKIN` y una copia con el mismo nombre pueden tener metadata
idéntica pero direcciones distintas. Hay que defenderse de listings falsos, NFT
robados, spoofing, phishing, wash trading y approvals maliciosos, sin enseñar a
ejecutar esas conductas.

ERC-2981 devuelve receptor e importe sugerido de royalty; no obliga a todos los
marketplaces a pagarlo. Floor price, última venta, liquidez y volatilidad describen
actividad de mercado, no valor fundamental ni rentabilidad garantizada.

Los modelos play-to-earn o play-and-earn deben analizar emisión, inflación, sinks,
presión vendedora, dependencia de participantes nuevos, jugadores reales y costes.
Comprar una espada para disfrutar el juego no es lo mismo que comprar un token con
expectativa de apreciación; la segunda expectativa puede alterar el riesgo jurídico.

## Wallets, custodia, gas y privacidad

| Modelo | Quién controla la clave | Ventaja | Coste y responsabilidad |
|---|---|---|---|
| cuenta custodial | operador | onboarding y recuperación conocidos | custodia, concentración y obligación de soporte |
| wallet externa | jugador | control directo y portabilidad | seed, phishing, gas y pérdida irreversible |
| embedded wallet | proveedor o esquema repartido | UX integrada | dependencia del proveedor y modelo de recuperación |
| smart account | lógica programable | límites, patrocinio y recuperación social | contrato, bundler, paymaster y administración |
| multisig | varios firmantes | reduce punto único de fallo | coordinación y política de emergencia |

No hace falta obligar a cada jugador a aprender criptografía. Si el operador patrocina
gas mediante meta-transacciones o account abstraction, la operación no es gratis:
un paymaster u otra parte paga. Vincular identidad real, wallet y gameplay en una
cadena pública revela balances, transferencias y grafo social; se debe minimizar la
correlación y explicar que dirección seudónima no significa anonimato.

## Interoperabilidad no es “funciona en cualquier juego”

Una cadena puede transportar ownership, no semántica de gameplay. Dos aplicaciones
deben acordar asset ID, formatos, modelos, texturas, animaciones, físicas, escala,
stats, balance, rareza, licencia, significado y reglas. `SKIN_DRAGON_001` puede ser
una armadura en Andes Quest, un objeto decorativo en otra aplicación o no estar
soportada. La interoperabilidad existe por acuerdos y adaptadores, no por el logo NFT.

Un puente añade lock/mint o burn/mint, validadores, cuórum, replay protection,
contratos y liquidez. El caso Ronin del repositorio ilustra que comprometer un cuórum
puede dominar toda la seguridad del activo. Si no existe un consumidor real en la
otra red, el puente solo añade superficie de ataque.

## Riesgo técnico y gobierno

Checklist mínimo antes de producción:

- acceso a mint, burn, pause, URI y retiro de fees;
- supply cap, precisión, invariantes y eventos de procedencia;
- reentrancia y llamadas externas del marketplace o receptores ERC-1155;
- approvals por unidad, allowances y `setApprovalForAll`;
- mutabilidad de metadata, almacenamiento y disponibilidad del asset;
- dependencia de oráculos, fuentes, dato obsoleto, agregación y fallback;
- bridge, validadores, cuórum, replay y representación canónica;
- claves de upgrade, `GameAssetsProxy`, compatibilidad de storage y rollback;
- multisig, timelock, pausa de emergencia y segregación de funciones;
- indexador, finality, reorg, reconciliación y recuperación.

Un proxy “descentralizado” puede esconder una clave administrativa central. Las
actualizaciones necesitan política pública, multisig, timelock, pruebas de storage y
respuesta de emergencia. Un oráculo solo se introduce si el juego necesita un dato
externo como un resultado o precio; usarlo por moda crea riesgo de manipulación y
staleness sin aportar valor.

## Cash-out y árbol regulatorio

Un mercado externo puede crear convertibilidad de facto aunque el operador llame
“puntos” a GEM. Eso introduce custodia, tributación, AML/KYC potencial, protección
del consumidor y clasificación regulatoria. No existe una respuesta mundial única
ni esta guía es asesoría legal.

```text
¿Es transferible?
 └─ ¿existe mercado externo o cash-out?
     └─ ¿hay custodia o intermediación?
         └─ ¿se ofrece al público con expectativa de beneficio?
             └─ revisar activos virtuales, AML, valores, consumo y, si hay azar, juego
```

En Chile se consulta la fuente vigente de CMF, BCN, UAF, Banco Central y SII; para
otros ámbitos, la autoridad correspondiente, FATF/GAFI, BIS, IOSCO o MiCA según el
caso. Una jurisdicción no se extrapola al resto. El análisis detallado permanece en
[Regulación y cumplimiento](../regulation/README.md).

## Decisión final de arquitectura

El equipo debe poder completar esta tabla antes de tokenizar:

| Pregunta | Si la respuesta es “no” |
|---|---|
| ¿Hay una parte externa que necesite verificar propiedad o settlement? | usar base de datos |
| ¿La transferencia fuera del operador es un requisito autorizado? | mantener inventario interno |
| ¿Los consumidores acordaron semántica, licencia y formato? | no prometer interoperabilidad |
| ¿Usuarios aceptan custodia, gas, privacidad y finalidad? | rediseñar UX o no tokenizar |
| ¿Existe operación para contratos, indexador, incidentes y conciliación? | no salir a producción |
| ¿El beneficio supera coste, fraude y carga regulatoria? | escoger la solución más simple |

Si el servidor de Andes Quest desaparece, un NFT puede seguir transferible, pero el
usuario quizá solo conserve un identificador y metadata disponibles. Esa respuesta
—no “propiedad digital para siempre”— es el criterio de comprensión del caso.

## Límites y fronteras con otros programas

Aquí se estudia qué cambia al pasar un activo digital a infraestructura blockchain.
Diseño de juegos pertenece a `modern-gamedev-program`; economía y finanzas profundas
a `finance-and-banking-evolution-program`; pagos a `universal-payments-engineering-lab`;
comercio a `commerce-operating-system`; ciberseguridad general a
`modern-cybersecurity-program`; diagnóstico especializado a
`rootcause-blockchain-security`; y empresa/regulación chilena a
`modern-business-creation-program`.

## Fuentes primarias

- [ERC-20](https://eips.ethereum.org/EIPS/eip-20), [ERC-721](https://eips.ethereum.org/EIPS/eip-721) y [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155).
- [ERC-2612 · permit](https://eips.ethereum.org/EIPS/eip-2612), [ERC-2981 · royalty](https://eips.ethereum.org/EIPS/eip-2981) y [ERC-4337 · account abstraction](https://eips.ethereum.org/EIPS/eip-4337).
- [Solidity · consideraciones de seguridad](https://docs.soliditylang.org/en/latest/security-considerations.html) y [Foundry Book](https://getfoundry.sh/).
- [IPFS · content addressing](https://docs.ipfs.tech/concepts/content-addressing/) y [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/).
- [FATF/GAFI · activos virtuales](https://www.fatf-gafi.org/en/topics/virtual-assets.html) y [EUR-Lex · MiCA](https://eur-lex.europa.eu/eli/reg/2023/1114/oj).

---

## 🧭 Navegación

[🏠 Programa](../README.md) · [📚 Clases 17–18](../curriculum/08-tokens/README.md) · [🧪 Laboratorio local](../labs/23-andes-quest-assets/README.md) · [📖 Glosario](glosario.md)
