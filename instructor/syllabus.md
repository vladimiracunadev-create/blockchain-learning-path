# Programa académico

> Navegación: [Inicio](../README.md) · [Kit del instructor](README.md) · [Checklist de laboratorio](lab-checklist.md) · [Rúbrica](../docs/evaluacion.md) · [Bibliografía](../docs/bibliografia.md)

## Descripción del curso

Curso práctico e integral de tecnología blockchain que va de los fundamentos criptográficos al desarrollo profesional, la seguridad y la implementación en la empresa. El estudiante construye, prueba y despliega software real en redes locales y de prueba, y aprende a justificar decisiones de arquitectura con evidencia. El curso cubre las clases 1–38 del [currículo](../curriculum/README.md) y culmina en un [proyecto final](../capstone/README.md). Las clases 39–56 (finanzas on-chain, custodia y regulación), 57–58 (analítica de datos) y 59–66 (custodia, auditoría y forensics) son extensiones profesionales; no reemplazan el tronco tecnológico.

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

| Semana | Tema | Clases | Entregable |
|---:|---|---:|---|
| 1 | Orientación y decisión (blockchain vs. base de datos) | 1–2 | ADR 001 |
| 2 | Hash, cadenas de hash y Merkle | 3–4 | Labs 03–06 |
| 3 | Firmas y custodia de claves | 3–4 | Labs 07–08 + checkpoint |
| 4 | Sistemas distribuidos y P2P | 5–6 | Labs 09–10 |
| 5 | Consenso: PoW, PoS, BFT | 7–8 | Labs 11–12 |
| 6 | Mini blockchain | 7–8 | Labs 13–14 |
| 7 | Bitcoin y modelo UTXO | 9–10 | Labs 15–16 |
| 8 | Regtest: wallet y transacciones; apoyo de [Wallets desde cero](../docs/wallets-desde-cero.md) | 9–10 | Labs 17–21 (transcript) + Lab 71 (`pnpm lab:wallet-segura`) |
| 9 | Ethereum y la EVM | 11–12 | Labs 22–24 |
| 10 | Gas, storage y calldata | 11–12 | Labs 25–26 (análisis) |
| 11 | Solidity y Foundry | 13–14 | Lab 27 |
| 12 | Vault: fuzzing e invariantes | 13–14 | Lab 28 (Vault) |
| 13 | dApps: lectura y wallet | 15–16 | Labs 29–31 |
| 14 | Tokens: ERC-20 y roles | 17–18 | Labs 32–33 |
| 15 | ERC-721 y estándares | 17–18 | Labs 34–36 (protocolo) |
| 16 | Seguridad: reentrancia y control de acceso | 19–20 | Retos 01–02 |
| 17 | Oráculos, firmas y proxies | 19–20 | Retos 03–06 |
| 18 | Auditoría e informe | 19–20 | Informe de auditoría |
| 19 | Oráculos e indexación | 21–22 | Labs 37–40 |
| 20 | DAO y gobernanza | 23–24 | ADR |
| 21 | Escalabilidad y L2 | 25–26 | Comparativa L2 |
| 22 | Interoperabilidad y puentes | 27–28 | ADR 005 |
| 23 | Privacidad, ZK y arquitectura | 29–32 | Defensa de diseño |
| 24 | Infraestructura de nodos y empresa | 33–36 | Plan + caso de negocio |
| 25 | Implementación empresarial | 37–38 | Documento de arquitectura |
| 26 | Proyecto final | — | [Capstone](../capstone/README.md) · demo y defensa |

## Extensión optativa: finanzas on-chain e institucional (semanas 27–34)

Ocho semanas adicionales que cubren las clases 39–56. Se pueden impartir como continuación
del curso o como asignatura independiente para perfiles del sector financiero, que en tal
caso necesitan al menos las clases 1–18 como prerrequisito.

| Semana | Tema | Clases | Entregable |
|---:|---|---:|---|
| 27 | DeFi: AMM, préstamo, liquidación y riesgo | 39–40 | Labs 51–54 |
| 28 | Dinero, banca, compensación y liquidación | 41–42 | Labs 55–57 + informe |
| 29 | Stablecoins: respaldo, redención y desanclaje | 43–44 | Labs 58–59 |
| 30 | Depósitos tokenizados y CBDC/MDBC | 45–46 | Lab 60 + lab 68 (Foundry) |
| 31 | Pagos, cross-border y FX on-chain | 47–48 | Labs 61–63 |
| 32 | Tokenización y activos del mundo real | 49–50 | Labs 64–65 |
| 33 | Mercados de capitales on-chain | 51–52 | Labs 66–67 + arquitectura |
| 34 | Custodia, identidad, regulación y cumplimiento | 53–56 | Labs 69–70 + análisis regulatorio |

**Nota para el instructor.** Las clases 41–42 son la bisagra de todo el bloque: sin ellas, los
siguientes se aprenden como vocabulario. Si hay que recortar, recorta en cualquier otro
sitio. Y advierte desde la primera sesión que el material **no es asesoría financiera,
legal ni tributaria**, y que toda afirmación regulatoria debe verificarse en su fuente
oficial vigente ([regulación](../regulation/README.md)).

En formato intensivo de 8 semanas, agrupa las filas conceptuales y reduce el alcance del capstone; consulta el [kit del instructor](README.md).

## Extensión optativa: analítica de datos on-chain (semanas 35–36)

Las [clases 57–58](../curriculum/28-data-analytics-onchain/README.md) cierran el programa con la lectura de datos de la propia cadena. Dos semanas: la primera cubre los niveles 1 y 2 (anatomía de bloques y transacciones en ambos modelos, adquisición por RPC con checkpoint y reorganizaciones, normalización e idempotencia; prácticas 72–75); la segunda, los niveles 3 y 4 (indicadores, eventos de token, grafos, rastreo, patrones, anomalías con precisión y recall, panel y proyecto final; prácticas 76–83). **Entregable:** el explorador analítico con su informe, incluida la sección de limitaciones y la clasificación hecho / indicador / inferencia / hipótesis, que es lo que se califica con más peso.

## Especialización profesional: custodia, auditoría y forensics (semanas 37–40)

| Semana | Clases | Prácticas | Entregable |
|---:|---|---|---|
| 37 | 59–60 · Exchanges y custodia | 84–85 | Flujo CEX/DEX y política de wallets |
| 38 | 61–62 · Contabilidad y conciliación | 86–87 | Tres registros y excepciones |
| 39 | 63–64 · PoR/PoL y solvencia | 88–89 | Root, inclusión y conclusión acotada |
| 40 | 65–66 · Forensics y gobernanza | 90–91 | Defensa de [Aurora Custody](../capstone/empresa-custodial/README.md) |

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
