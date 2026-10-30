# 🧮 Matriz de integración por unidad

> 🧭 [🛡️ Especialización](README.md) · [🧪 Laboratorios](laboratorios/README.md) · [📝 Evaluación](evaluacion/README.md) · [📖 Glosario](glosario.md) · [📚 Currículo](../curriculum/README.md)

Esta matriz responde a una pregunta: **¿dónde toca la especialización a cada una de las 33 unidades del currículo?** Las unidades conservan su identidad y su numeración (las clases 1–66 no se mueven ni se renumeran); la especialización se **acopla** a ellas, no las sustituye.

## Cómo leer los niveles de integración

| Nivel | Qué significa | Qué cambia en la unidad |
|---|---|---|
| **Ampliación directa** | La especialización profundiza un tema que la unidad ya enseña | Su README incluye una sección «Especialización» con enlaces a los bloques y laboratorios |
| **Complemento** | La unidad aporta una base que la especialización usa o contrasta | Solo se enlaza desde esta matriz y desde los bloques |
| **Contexto** | La relación es conceptual: marco, motivación o comparación | Solo se enlaza desde esta matriz |

Los identificadores de evaluación (`Q1`–`Q9`, `R-LE1`–`R-LE8`, `R-CASO`, `R-PROY`) se definen en [evaluación](evaluacion/README.md) y [rúbricas](evaluacion/rubricas.md).

## Matriz completa: 33 unidades

| Unidad (clases) | Integración | Qué aporta o amplía la especialización | Bloques | Laboratorios | Evaluación |
|---|---|---|---|---|---|
| [00 · Orientación (1–2)](../curriculum/00-orientacion/README.md) | Contexto | Decidir con honestidad qué se afirma: el método hecho / hipótesis / desconocido nace aquí | [9](bloques/09-caso-binance-2026-10-29.md) | — | `R-CASO` |
| [01 · Criptografía (3–4)](../curriculum/01-criptografia/README.md) | Ampliación directa | Curvas elípticas, ECDSA, nonce de firma, maleabilidad, qué prueba una firma | [1](bloques/01-criptografia-asimetrica-y-firmas.md) | [LE1](laboratorios/LE1-billeteras-de-prueba.md), [LE2](laboratorios/LE2-firmas-digitales.md) | `Q1`, `R-LE1`, `R-LE2` |
| [02 · Sistemas distribuidos (5–6)](../curriculum/02-sistemas-distribuidos/README.md) | Complemento | Detección en sistemas distribuidos: correlación de eventos entre cadenas | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | [LE8](laboratorios/LE8-monitor-riesgos-custodio.md) | `R-LE8` |
| [03 · Consenso (7–8)](../curriculum/03-consenso/README.md) | Complemento | Finalidad y reorganizaciones: por qué analizar `latest` no es analizar lo definitivo | [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE6](laboratorios/LE6-explorador-transacciones.md) | `Q7` |
| [04 · Bitcoin (9–10)](../curriculum/04-bitcoin/README.md) | Ampliación directa | UTXO frente a cuentas, multisig y Taproot, cadenas de pelado, heurística de entradas comunes | [3](bloques/03-custodia-claves-y-politicas-de-firma.md), [5](bloques/05-trazabilidad-multicadena.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q5`, `R-LE7` |
| [05 · Ethereum y EVM (11–12)](../curriculum/05-ethereum-evm/README.md) | Ampliación directa | EOA frente a contrato, transacciones tipo 2 y 4, EIP-7702, nonces, registros | [2](bloques/02-cuentas-contratos-y-abstraccion.md), [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE3](laboratorios/LE3-transferencias-simuladas.md), [LE4](laboratorios/LE4-delegacion-eip7702.md), [LE6](laboratorios/LE6-explorador-transacciones.md) | `Q2`, `Q7`, `R-LE3`, `R-LE4`, `R-LE6` |
| [06 · Solidity y Foundry (13–14)](../curriculum/06-solidity-foundry/README.md) | Complemento | Escribir un delegado seguro: control de acceso, nonce interno, invariantes | [4](bloques/04-delegacion-de-permisos.md) | [LE4](laboratorios/LE4-delegacion-eip7702.md) | `R-LE4` |
| [07 · dApps (15–16)](../curriculum/07-dapps/README.md) | Complemento | Ciclo de vida de una transacción y lo que ve el usuario al firmar | [2](bloques/02-cuentas-contratos-y-abstraccion.md) | [LE3](laboratorios/LE3-transferencias-simuladas.md) | `R-LE3` |
| [08 · Tokens (17–18)](../curriculum/08-tokens/README.md) | Ampliación directa | `approve`, `setApprovalForAll`, `permit`, el evento `Transfer` y su falsificación | [4](bloques/04-delegacion-de-permisos.md), [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE5](laboratorios/LE5-detector-delegaciones.md), [LE6](laboratorios/LE6-explorador-transacciones.md) | `Q4`, `R-LE5` |
| [09 · Seguridad (19–20)](../curriculum/09-seguridad/README.md) | Ampliación directa | Delegación de permisos como superficie de ataque, repetición, auditoría de delegados | [4](bloques/04-delegacion-de-permisos.md) | [LE2](laboratorios/LE2-firmas-digitales.md), [LE4](laboratorios/LE4-delegacion-eip7702.md), [LE5](laboratorios/LE5-detector-delegaciones.md) | `Q4`, `R-LE2`, `R-LE5` |
| [10 · Oráculos e indexación (21–22)](../curriculum/10-oraculos-indexacion/README.md) | Complemento | Indexar eventos y trazas sin confundir un índice con la verdad | [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE6](laboratorios/LE6-explorador-transacciones.md) | `Q7` |
| [11 · DAO y gobernanza (23–24)](../curriculum/11-dao-gobernanza/README.md) | Complemento | Gobernanza de emergencia: la intervención de un consejo de seguridad en una L2 como caso | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | — | `Q6` |
| [12 · Escalabilidad y capas 2 (25–26)](../curriculum/12-escalabilidad/README.md) | Complemento | Rastrear a través de L2: lotes en L1, retiros con ventana, puentes | [5](bloques/05-trazabilidad-multicadena.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q5` |
| [13 · Interoperabilidad (27–28)](../curriculum/13-interoperabilidad/README.md) | Ampliación directa | Puentes: independencia real de los validadores, emparejamiento como inferencia | [3](bloques/03-custodia-claves-y-politicas-de-firma.md), [5](bloques/05-trazabilidad-multicadena.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q3`, `Q5`, `R-LE7` |
| [14 · Privacidad y ZK (29–30)](../curriculum/14-privacidad-zk/README.md) | Complemento | Mezcladores y rastreo probabilístico; pruebas de solvencia con ZK como idea | [5](bloques/05-trazabilidad-multicadena.md), [8](bloques/08-pruebas-de-reservas-y-sus-limites.md) | — | `Q5`, `Q8` |
| [15 · Arquitectura avanzada (31–32)](../curriculum/15-arquitectura-avanzada/README.md) | Ampliación directa | Cuentas programables: ERC-4337, EIP-7702, recuperación sin llave maestra invisible | [2](bloques/02-cuentas-contratos-y-abstraccion.md) | [LE4](laboratorios/LE4-delegacion-eip7702.md) | `Q2`, `R-LE4` |
| [16 · Infraestructura de nodos (33–34)](../curriculum/16-infraestructura-nodos/README.md) | Complemento | Fuentes de datos fiables: nodos con trazas, RPC y verificación cruzada | [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE6](laboratorios/LE6-explorador-transacciones.md) | `R-LE6` |
| [17 · Blockchain en la empresa (35–36)](../curriculum/17-blockchain-en-la-empresa/README.md) | Contexto | Comunicar un incidente sin prometer más de lo que se sabe | [9](bloques/09-caso-binance-2026-10-29.md) | — | `R-CASO` |
| [18 · Implementación empresarial (37–38)](../curriculum/18-implementacion-empresarial/README.md) | Contexto | Lo que debe estar listo antes de que una transacción tenga consecuencias reales | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | — | `R-PROY` |
| [19 · DeFi (39–40)](../curriculum/19-defi/README.md) | Complemento | Préstamos y mercados como vía de salida del valor robado; mercados pausables | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q6` |
| [20 · Dinero, banca y liquidación (41–42)](../curriculum/20-dinero-banca-liquidacion/README.md) | Contexto | Finalidad y reversibilidad: cuándo un pago deja de poder revertirse | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | — | `Q6` |
| [21 · Stablecoins (43–44)](../curriculum/21-stablecoins/README.md) | Ampliación directa | Listas de bloqueo, quemar y reemitir, carrera entre congelar y convertir | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q6`, `R-LE7` |
| [22 · Depósitos tokenizados y CBDC (45–46)](../curriculum/22-deposito-tokenizado-cbdc/README.md) | Contexto | Controles del emisor y su coste de privacidad | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | — | `Q6` |
| [23 · Pagos y FX on-chain (47–48)](../curriculum/23-pagos-fx-onchain/README.md) | Contexto | Rutas de salida transfronterizas y su relación con el cumplimiento | [5](bloques/05-trazabilidad-multicadena.md) | — | `Q5` |
| [24 · Tokenización y RWA (49–50)](../curriculum/24-tokenizacion-rwa/README.md) | Complemento | Tokens con restricciones y facultades de intervención del emisor | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | — | `Q6` |
| [25 · Mercados de capitales on-chain (51–52)](../curriculum/25-mercados-capitales-onchain/README.md) | Contexto | Liquidación atómica frente a cadenas de custodia | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | — | `Q3` |
| [26 · Custodia e identidad (53–54)](../curriculum/26-custodia-identidad/README.md) | Ampliación directa | MPC, multisig, HSM y hardware; políticas de firma; EIP-7702 y ERC-4337 en custodia | [3](bloques/03-custodia-claves-y-politicas-de-firma.md), [4](bloques/04-delegacion-de-permisos.md) | [LE8](laboratorios/LE8-monitor-riesgos-custodio.md) | `Q3`, `R-LE8`, `R-PROY` |
| [27 · Regulación y cumplimiento (55–56)](../curriculum/27-regulacion-cumplimiento/README.md) | Complemento | Límites de la atribución y proporcionalidad del análisis | [5](bloques/05-trazabilidad-multicadena.md) | [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q5` |
| [28 · Analítica on-chain (57–58)](../curriculum/28-data-analytics-onchain/README.md) | Ampliación directa | Rastreo multicadena, propagación de contaminación, eventos y trazas | [5](bloques/05-trazabilidad-multicadena.md), [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE6](laboratorios/LE6-explorador-transacciones.md), [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q5`, `Q7`, `R-LE6`, `R-LE7` |
| [29 · Exchanges y custodia (59–60)](../curriculum/29-exchanges-operaciones-custodia/README.md) | Ampliación directa | Arquitectura hot / warm / cold, topes, detección, caso de estudio | [3](bloques/03-custodia-claves-y-politicas-de-firma.md), [9](bloques/09-caso-binance-2026-10-29.md) | [LE8](laboratorios/LE8-monitor-riesgos-custodio.md) | `Q3`, `R-LE8`, `R-CASO` |
| [30 · Contabilidad y conciliación (61–62)](../curriculum/30-contabilidad-conciliacion/README.md) | Complemento | Conciliar el nonce interno con el on-chain; reconciliar saldos tras un incidente | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | [LE8](laboratorios/LE8-monitor-riesgos-custodio.md) | `R-LE8` |
| [31 · Proof of Reserves y solvencia (63–64)](../curriculum/31-proof-reserves-solvencia/README.md) | Ampliación directa | Distorsiones de la foto, cobertura por activo, por qué la prueba no detecta un incidente de claves | [8](bloques/08-pruebas-de-reservas-y-sus-limites.md) | Prácticas 88–89 | `Q8` |
| [32 · Forensics y gobernanza (65–66)](../curriculum/32-forensics-auditoria-gobernanza/README.md) | Ampliación directa | Cuatro niveles de certeza aplicados a un incidente real; informe sin atribución | [5](bloques/05-trazabilidad-multicadena.md), [9](bloques/09-caso-binance-2026-10-29.md) | [LE5](laboratorios/LE5-detector-delegaciones.md), [LE7](laboratorios/LE7-flujos-multidireccion.md) | `Q5`, `Q9`, `R-CASO` |

**Recuento:** 13 unidades con ampliación directa, 13 de complemento y 7 de contexto. Las 33 aparecen una sola vez.

## Cobertura inversa: de los temas exigidos a su ubicación

| Tema de la especialización | Bloque principal | Laboratorio | Unidades que lo sustentan |
|---|---|---|---|
| Criptografía asimétrica y firmas digitales | [1](bloques/01-criptografia-asimetrica-y-firmas.md) | LE1, LE2 | 01, 09 |
| Cuentas EOA, contratos y abstracción de cuentas | [2](bloques/02-cuentas-contratos-y-abstraccion.md) | LE3, LE4 | 05, 15 |
| EIP-7702, ERC-4337 y gestión de nonces | [2](bloques/02-cuentas-contratos-y-abstraccion.md) | LE4 | 05, 15, 26 |
| Custodia hot, warm y cold | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | LE8 | 26, 29 |
| MPC, multisig y hardware wallets | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | — | 04, 26 |
| Riesgos de la delegación de permisos | [4](bloques/04-delegacion-de-permisos.md) | LE4, LE5 | 08, 09 |
| Gestión de claves y políticas de firma | [3](bloques/03-custodia-claves-y-politicas-de-firma.md) | LE8 | 26, 29 |
| Rastreabilidad en Ethereum, Bitcoin, Tron y L2 | [5](bloques/05-trazabilidad-multicadena.md) | LE6, LE7 | 04, 12, 28 |
| Stablecoins, congelamientos y recuperación | [6](bloques/06-stablecoins-congelamiento-y-recuperacion.md) | LE7 | 21, 22, 24 |
| Transacciones, eventos y logs | [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | LE6 | 05, 10, 28 |
| Pruebas de reservas y sus limitaciones | [8](bloques/08-pruebas-de-reservas-y-sus-limites.md) | prácticas 88–89 | 31 |
| Estudio del incidente de Binance (hechos / hipótesis / desconocidos) | [9](bloques/09-caso-binance-2026-10-29.md) | LE4, LE5, LE7, LE8 | 29, 32 |

> **Honestidad sobre un hueco.** MPC, multisig y hardware wallets se estudian de forma **conceptual y comparativa** (bloque 3) y se evalúan con preguntas y con el diseño de políticas de LE8; no hay un laboratorio que implemente un protocolo de firma por umbral, porque una implementación de MPC propia sin auditoría sería un mal ejemplo. La ampliación natural es una práctica con una biblioteca auditada.

## Lo que no cambia

- Las **66 clases**, su numeración y sus documentos.
- Las **91 prácticas** del catálogo y las cifras que el repositorio valida.
- El **capstone** de la empresa custodial y su evaluación.
- La **autonomía** de este repositorio: la especialización no depende de otros programas ni se fusiona con ellos.

## 🧭 Navegación

[🛡️ Especialización](README.md) · [🧪 Laboratorios](laboratorios/README.md) · [📝 Evaluación](evaluacion/README.md) · [📖 Glosario](glosario.md) · [🏠 Programa](../README.md)
