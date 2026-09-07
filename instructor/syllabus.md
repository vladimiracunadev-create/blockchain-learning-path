# Programa académico

> Navegación: [Inicio](../README.md) · [Kit del instructor](README.md) · [Checklist de laboratorio](lab-checklist.md) · [Rúbrica](../docs/evaluacion.md) · [Bibliografía](../docs/bibliografia.md)

## Descripción del curso

Curso práctico e integral de tecnología blockchain que va de los fundamentos criptográficos al desarrollo profesional, la seguridad y la implementación en la empresa. El estudiante construye, prueba y despliega software real en redes locales y de prueba, y aprende a justificar decisiones de arquitectura con evidencia. El curso cubre las clases 00.1–18.2 del [currículo](../curriculum/README.md) y culmina en un [proyecto final](../capstone/README.md). Las clases 19.1–27.2 (finanzas on-chain, custodia y regulación), 28.1–28.2 (analítica de datos) y 29.1–32.2 (custodia, auditoría y forensics) son extensiones profesionales; no reemplazan el tronco tecnológico.

## Prerrequisitos

- Programación general (funciones, estructuras de datos, control de versiones con Git).
- Uso de línea de comandos y de un editor moderno.
- Nociones de redes y de sistemas operativos.
- No se requiere experiencia previa en blockchain ni en criptografía.

## Resultados de aprendizaje del curso

Al finalizar, el estudiante será capaz de:

1. Explicar y aplicar primitivas criptográficas (hash, firma, Merkle) y sus límites.
2. Analizar mecanismos de consenso y sus supuestos de fallo bizantino.
3. Operar Bitcoin en `regtest` y razonar el modelo UTXO.
4. Desarrollar, probar (pruebas unitarias, fuzzing e invariantes) y desplegar contratos en la EVM con Foundry.
5. Construir dApps con flujos seguros de conexión e interacción.
6. Auditar contratos: identificar vulnerabilidades, escribir PoC y proponer correcciones.
7. Diseñar y documentar arquitectura mediante ADR, threat models e informes.
8. Evaluar infraestructura de nodos y casos de negocio empresariales.

## Calendario de 26 semanas

| Semana | Clases | Tema | Lectura | Entregable |
|---:|---|---|---|---|
| 1 | 00 | Orientación y decisión (blockchain vs. base de datos) | Clases 00.1–00.2 | ADR 001 |
| 2 | 01 | Hash, cadenas de hash y Merkle | Clases 01.1–01.2 | Labs 03–06 |
| 3 | 01 | Firmas y custodia de claves | Clases 01.1–01.2 | Labs 07–08 + checkpoint |
| 4 | 02 | Sistemas distribuidos y P2P | Clases 02.1–02.2 | Labs 09–10 |
| 5 | 03 | Consenso: PoW, PoS, BFT | Clases 03.1–03.2 | Labs 11–12 |
| 6 | 03 | Mini blockchain | Clases 03.1–03.2 | Labs 13–14 |
| 7 | 04 | Bitcoin y modelo UTXO | Clases 04.1–04.2 | Labs 15–16 |
| 8 | 04 | Regtest: wallet y transacciones · unidad transversal [Wallets desde cero](../docs/wallets-desde-cero.md) | Clases 04.1–04.2 + unidad de wallets | Labs 17–21 (transcript) + Lab 71 (`pnpm lab:wallet-segura`) |
| 9 | 05 | Ethereum y la EVM | Clases 05.1–05.2 | Labs 22–24 |
| 10 | 05 | Gas, storage y calldata | Clases 05.1–05.2 | Labs 25–26 (análisis) |
| 11 | 06 | Solidity y Foundry | Clases 06.1–06.2 | Lab 27 |
| 12 | 06 | Vault: fuzzing e invariantes | Clases 06.1–06.2 | Lab 28 (Vault) |
| 13 | 07 | dApps: lectura y wallet | Clases 07.1–07.2 | Labs 29–31 |
| 14 | 08 | Tokens: ERC-20 y roles | Clases 08.1–08.2 | Labs 32–33 |
| 15 | 08 | ERC-721 y estándares | Clases 08.1–08.2 | Labs 34–36 (protocolo) |
| 16 | 09 | Seguridad: reentrancia y control de acceso | Clases 09.1–09.2 | Retos 01–02 |
| 17 | 09 | Oráculos, firmas y proxies | Clases 09.1–09.2 | Retos 03–06 |
| 18 | 09 | Auditoría e informe | Clases 09.1–09.2 | Informe de auditoría |
| 19 | 10 | Oráculos e indexación | Clases 10.1–10.2 | Labs 37–40 |
| 20 | 11 | DAO y gobernanza | Clases 11.1–11.2 | ADR |
| 21 | 12 | Escalabilidad y L2 | Clases 12.1–12.2 | Comparativa L2 |
| 22 | 13 | Interoperabilidad y puentes | Clases 13.1–13.2 | ADR 005 |
| 23 | 14.1–15.2 | Privacidad, ZK y arquitectura | Clases 14.1–15.2 | Defensa de diseño |
| 24 | 16.1–17.2 | Infraestructura de nodos y empresa | Clases 16.1–17.2 | Plan + caso de negocio |
| 25 | 18 | Implementación empresarial | Clases 18.1–18.2 | Documento de arquitectura |
| 26 | Capstone | Proyecto final | [Capstone](../capstone/README.md) | Demo y defensa |

## Extensión optativa: finanzas on-chain e institucional (semanas 27–34)

Ocho semanas adicionales que cubren las clases 19.1–27.2. Se pueden impartir como continuación
del curso o como asignatura independiente para perfiles del sector financiero, que en tal
caso necesitan al menos las clases 00.1–08.2 como prerrequisito.

| Semana | Clases | Tema | Lectura | Entregable |
|---|---|---|---|---|
| 27 | 19 | DeFi: AMM, préstamo, liquidación y riesgo | Clases 19.1–19.2 | Labs 51–54 |
| 28 | 20 | Dinero, banca, compensación y liquidación | Clases 20.1–20.2 | Labs 55–57 + informe |
| 29 | 21 | Stablecoins: respaldo, redención y desanclaje | Clases 21.1–21.2 | Labs 58–59 |
| 30 | 22 | Depósitos tokenizados y CBDC/MDBC | Clases 22.1–22.2 | Lab 60 + lab 68 (Foundry) |
| 31 | 23 | Pagos, cross-border y FX on-chain | Clases 23.1–23.2 | Labs 61–63 |
| 32 | 24 | Tokenización y activos del mundo real | Clases 24.1–24.2 | Labs 64–65 |
| 33 | 25 | Mercados de capitales on-chain | Clases 25.1–25.2 | Labs 66–67 + arquitectura |
| 34 | 26.1–27.2 | Custodia, identidad, regulación y cumplimiento | Clases 26.1–27.2 | Labs 69–70 + análisis regulatorio |

**Nota para el instructor.** Las clases 20.1–20.2 son la bisagra de todo el bloque: sin ellas, los
siguientes se aprenden como vocabulario. Si hay que recortar, recorta en cualquier otro
sitio. Y advierte desde la primera sesión que el material **no es asesoría financiera,
legal ni tributaria**, y que toda afirmación regulatoria debe verificarse en su fuente
oficial vigente ([regulación](../regulation/README.md)).

En formato intensivo de 8 semanas, agrupa las filas conceptuales y reduce el alcance del capstone; consulta el [kit del instructor](README.md).

## Extensión optativa: analítica de datos on-chain (semanas 35–36)

Las [clases 28.1–28.2](../curriculum/28-data-analytics-onchain/README.md) cierran el programa con la lectura de datos de la propia cadena. Dos semanas: la primera cubre los niveles 1 y 2 (anatomía de bloques y transacciones en ambos modelos, adquisición por RPC con checkpoint y reorganizaciones, normalización e idempotencia; prácticas 72–75); la segunda, los niveles 3 y 4 (indicadores, eventos de token, grafos, rastreo, patrones, anomalías con precisión y recall, panel y proyecto final; prácticas 76–83). **Entregable:** el explorador analítico con su informe, incluida la sección de limitaciones y la clasificación hecho / indicador / inferencia / hipótesis, que es lo que se califica con más peso.

## Especialización profesional: custodia, auditoría y forensics (semanas 37–40)

| Semana | Clases | Prácticas | Entregable |
|---:|---|---|---|
| 37 | 29 · Exchanges y custodia | 84–85 | Flujo CEX/DEX y política de wallets |
| 38 | 30 · Contabilidad y conciliación | 86–87 | Tres registros y excepciones |
| 39 | 31 · PoR/PoL y solvencia | 88–89 | Root, inclusión y conclusión acotada |
| 40 | 32 · Forensics y gobernanza | 90–91 | Defensa de [Aurora Custody](../capstone/empresa-custodial/README.md) |

## Política de evaluación

La calificación se rige por la [rúbrica maestra](../docs/evaluacion.md). Se combinan checkpoints formativos ([assessments/checkpoints.md](../assessments/checkpoints.md)), entregables de laboratorio revisados por rúbrica y el proyecto final. Un entregable con resultado correcto pero explicación incorrecta se considera no aprobado y se repite.

## Integridad académica

- El trabajo entregado debe ser propio; cita toda fuente y todo fragmento reutilizado.
- La carpeta `solutions/` ofrece criterios de revisión, no respuestas; copiarla es una falta.
- El uso de asistentes de IA debe declararse y comprenderse: se evalúa que el estudiante pueda explicar y defender su entrega.
- La colaboración permitida (discusión conceptual) se distingue de la copia (entregas idénticas).

## Materiales requeridos

- Node.js LTS y pnpm.
- Foundry (`forge`, `anvil`, `cast`).
- Docker (para Bitcoin Core en `regtest` y servicios auxiliares).
- Git y una cuenta para control de versiones.

Consulta versiones y guía de instalación en [tecnologías](../docs/tecnologias.md) y [despliegue local](../docs/despliegue-local.md).

## Bibliografía

La lista completa de fuentes primarias y recomendadas está en [docs/bibliografia.md](../docs/bibliografia.md) y los recursos oficiales en [docs/recursos-oficiales.md](../docs/recursos-oficiales.md).
