# 🎯 Matriz de competencias

> [🏠 Programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🧭 Rutas por perfil](../learning-paths/README.md) · [📊 Evaluación](evaluacion.md)

Qué sabes hacer, en qué nivel, con qué módulos se aprende y **con qué evidencia se
demuestra**. La última columna es la que convierte esto en una matriz útil: un nivel sin
evidencia verificable es una opinión sobre uno mismo.

## Cómo leerla

| Nivel | Significa |
|---|---|
| **Inicial** | Reconoces el concepto y lo explicas con tus palabras |
| **Intermedio** | Lo aplicas en un caso guiado y detectas el error frecuente |
| **Avanzado** | Lo diseñas desde cero, justificas trade-offs y anticipas fallos |
| **Experto** | Lo evalúas críticamente en sistemas ajenos y defiendes decisiones ante contradicción |

La evidencia debe ser **reproducible por otra persona**: una salida de pruebas, un
documento con criterio de aceptación cumplido, un contrato con sus tests.

## Competencias técnicas

| Competencia | Inicial | Intermedio | Avanzado | Módulos | Evidencia |
|---|---|---|---|---|---|
| **Criptografía aplicada** | Distingues hash de cifrado | Verificas una prueba de Merkle | Diseñas un esquema de integridad | [01](../curriculum/01-criptografia/README.md) | Prácticas 03–08 en verde |
| **Sistemas distribuidos** | Explicas P2P y latencia | Reproduces una partición | Razonas trade-offs de consistencia | [02](../curriculum/02-sistemas-distribuidos/README.md) | Prácticas 09–10 |
| **Consenso** | Nombras PoW y PoS | Calculas coste de un ataque | Comparas modelos de finalidad | [03](../curriculum/03-consenso/README.md) | Práctica 11 + ADR |
| **Bitcoin y UTXO** | Lees una transacción | Seleccionas UTXO y calculas comisión | Diseñas política de gasto | [04](../curriculum/04-bitcoin/README.md) | `pnpm lab:utxo` + regtest |
| **EVM y Solidity** | Lees un ABI | Escribes contratos con pruebas | Diseñas protocolos con invariantes | [05](../curriculum/05-ethereum-evm/README.md)–[06](../curriculum/06-solidity-foundry/README.md) | `forge test` de tu contrato |
| **Seguridad de contratos** | Nombras reentrancia | Explotas y corriges en laboratorio | Auditas con informe y PoC | [09](../curriculum/09-seguridad/README.md) | 6 retos + informe de auditoría |
| **Oráculos** | Explicas el problema del oráculo | Consumes un feed con control de frescura | Diseñas resistencia a manipulación | [10](../curriculum/10-oraculos-indexacion/README.md) | `FreshOracle` + análisis |
| **Escalabilidad y L2** | Distingues L1 de L2 | Comparas rollups | Eliges arquitectura con ADR | [12](../curriculum/12-escalabilidad/README.md) | ADR de 6 ejes |
| **Interoperabilidad** | Sabes qué es un puente | Modelas sus amenazas | Evalúas un puente como custodio | [13](../curriculum/13-interoperabilidad/README.md) | Threat model + [caso Ronin](casos-reales/ronin-puente.md) |
| **Privacidad y ZK** | Enuncias las tres propiedades | Diseñas una prueba conceptual | Evalúas trade-offs de un sistema ZK | [14](../curriculum/14-privacidad-zk/README.md) | Diseño de prueba |
| **Infraestructura** | Distingues tipos de nodo | Operas un nodo con métricas | Diseñas topología y contingencia | [16](../curriculum/16-infraestructura-nodos/README.md) | Nodo + presupuesto |

## Competencias financieras

| Competencia | Inicial | Intermedio | Avanzado | Módulos | Evidencia |
|---|---|---|---|---|---|
| **Microestructura y AMM** | Defines diferencial y profundidad | Calculas impacto y deslizamiento | Comparas AMM, libro y híbrido | [19](../curriculum/19-defi/README.md) | `pnpm lab:amm` |
| **Riesgo DeFi** | Nombras los seis riesgos | Calculas factor de salud y liquidación | Auditas un protocolo con evidencia | [19](../curriculum/19-defi/README.md) | `pnpm lab:prestamo` + ficha (práctica 54) |
| **Dinero y liquidación** | Distingues las cuatro formas de dinero | Separas compensación de liquidación | Distingues las tres finalidades y las aplicas | [20](../curriculum/20-dinero-banca-liquidacion/README.md) | Informe «Qué se mueve cuando pago» |
| **Stablecoins** | Clasificas por respaldo | Calculas colateral y precio de liquidación | Analizas un desanclaje con el control que falló | [21](../curriculum/21-stablecoins/README.md) | `pnpm lab:peg` + ficha comparada |
| **Dinero digital institucional** | Distingues depósito tokenizado, MDBC y stablecoin | Explicas la singularidad del dinero | Diseñas opciones con límites justificados | [22](../curriculum/22-deposito-tokenizado-cbdc/README.md) | Documento de opciones (práctica 60) |
| **Pagos y FX** | Dibujas un pago transfronterizo | Descompones el coste con margen de cambio | Evalúas un corredor contra las cuatro fricciones | [23](../curriculum/23-pagos-fx-onchain/README.md) | `pnpm lab:remesa` · `pnpm lab:pvp` |
| **Tokenización y RWA** | Distingues activo de derecho | Mapeas los cinco puntos de fallo | Escribes el memorando con estructura jurídica | [24](../curriculum/24-tokenizacion-rwa/README.md) | Memorando (práctica 65) |
| **Mercados de capitales** | Nombras CSD y CCP | Distingues los tres modelos de DvP | Diseñas un mercado sin dejar funciones huérfanas | [25](../curriculum/25-mercados-capitales-onchain/README.md) | `pnpm lab:dvp` + `forge test` del laboratorio 22 |

## Competencias de seguridad, custodia y cumplimiento

| Competencia | Inicial | Intermedio | Avanzado | Módulos | Evidencia |
|---|---|---|---|---|---|
| **Modelado de amenazas** | Identificas activos y actores | Escribes un threat model completo | Priorizas por impacto y detectabilidad | [09](../curriculum/09-seguridad/README.md) · [13](../curriculum/13-interoperabilidad/README.md) | Threat model del capstone |
| **Custodia** | Distingues los cuatro modelos | Diseñas un cuórum M-de-N | Documentas ceremonia y recuperación probada | [26](../curriculum/26-custodia-identidad/README.md) | `pnpm lab:quorum` + política |
| **Identidad digital** | Defines DID y credencial verificable | Modelas emisor, tenedor y verificador | Diseñas divulgación selectiva y revocación | [26](../curriculum/26-custodia-identidad/README.md) | Flujo de credencial (práctica 69) |
| **Cumplimiento** | Distingues ley de propuesta | Aplicas enfoque basado en riesgo | Escribes un análisis regulatorio con incertidumbres | [27](../curriculum/27-regulacion-cumplimiento/README.md) | `pnpm lab:cumplimiento` + análisis |
| **DevSecOps** | Ejecutas la CI del repo | Añades una comprobación nueva | Diseñas el pipeline completo con puertas | [18](../curriculum/18-implementacion-empresarial/README.md) | Workflow propio en verde |

## Competencias transversales

| Competencia | Cómo se demuestra |
|---|---|
| **Decidir cuándo NO usar blockchain** | Matriz del [módulo 00](../curriculum/00-orientacion/README.md) resuelta con un caso donde la respuesta es «una base de datos» |
| **Explicar a no técnicos** | Discurso de 30 segundos y manejo de objeciones ([guía](explicar-blockchain-a-no-tecnicos.md)) |
| **Citar con trazabilidad** | Toda afirmación normativa con fuente oficial, rango y fecha |
| **Neutralidad analítica** | Un informe tuyo donde la conclusión favorece a la alternativa tradicional |
| **Documentar decisiones** | ADR con alternativas descartadas y su porqué ([adrs](../adrs/README.md)) |

## Autoevaluación

1. Marca tu nivel actual en cada fila **con la evidencia en la mano**, no de memoria.
2. Las filas sin evidencia se marcan un nivel por debajo: es la regla que hace útil la matriz.
3. Elige las tres competencias más bajas que tu [perfil objetivo](../learning-paths/README.md)
   exige y trabájalas antes de avanzar.
4. Repite al terminar cada etapa; guarda las versiones para ver el progreso real.

---

## 🧭 Navegación

[🏠 Programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🧭 Rutas por perfil](../learning-paths/README.md) · [📊 Evaluación](evaluacion.md)
