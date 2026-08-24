# Programa académico

> Navegación: [Inicio](../README.md) · [Kit del instructor](README.md) · [Checklist de laboratorio](lab-checklist.md) · [Rúbrica](../docs/evaluacion.md) · [Bibliografía](../docs/bibliografia.md)

## Descripción del curso

Curso práctico e integral de tecnología blockchain que va de los fundamentos criptográficos al desarrollo profesional, la seguridad y la implementación en la empresa. El estudiante construye, prueba y despliega software real en redes locales y de prueba, y aprende a justificar decisiones de arquitectura con evidencia. El curso cubre los módulos 00–18 del [currículo](../curriculum/README.md) y culmina en un [proyecto final](../capstone/README.md). Los módulos 19–27 (finanzas on-chain, custodia y regulación) se imparten como extensión optativa de ocho semanas, detallada más abajo.

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
4. Desarrollar, probar (unidad, fuzzing e invariantes) y desplegar contratos en la EVM con Foundry.
5. Construir dApps con flujos seguros de conexión e interacción.
6. Auditar contratos: identificar vulnerabilidades, escribir PoC y proponer correcciones.
7. Diseñar y documentar arquitectura mediante ADR, threat models e informes.
8. Evaluar infraestructura de nodos y casos de negocio empresariales.

## Calendario de 26 semanas

| Semana | Módulo | Tema | Lectura | Entregable |
|---:|---|---|---|---|
| 1 | 00 | Orientación y decisión (blockchain vs. base de datos) | Módulo 00 | ADR 001 |
| 2 | 01 | Hash, cadenas de hash y Merkle | Módulo 01 | Labs 03–06 |
| 3 | 01 | Firmas y custodia de claves | Módulo 01 | Labs 07–08 + checkpoint |
| 4 | 02 | Sistemas distribuidos y P2P | Módulo 02 | Labs 09–10 |
| 5 | 03 | Consenso: PoW, PoS, BFT | Módulo 03 | Labs 11–12 |
| 6 | 03 | Mini blockchain | Módulo 03 | Labs 13–14 |
| 7 | 04 | Bitcoin y modelo UTXO | Módulo 04 | Labs 15–16 |
| 8 | 04 | Regtest: wallet y transacciones · unidad transversal [Wallets desde cero](../docs/wallets-desde-cero.md) | Módulo 04 + unidad de wallets | Labs 17–21 (transcript) + Lab 71 (`pnpm lab:wallet-segura`) |
| 9 | 05 | Ethereum y la EVM | Módulo 05 | Labs 22–24 |
| 10 | 05 | Gas, storage y calldata | Módulo 05 | Labs 25–26 (análisis) |
| 11 | 06 | Solidity y Foundry | Módulo 06 | Lab 27 |
| 12 | 06 | Vault: fuzzing e invariantes | Módulo 06 | Lab 28 (Vault) |
| 13 | 07 | dApps: lectura y wallet | Módulo 07 | Labs 29–31 |
| 14 | 08 | Tokens: ERC-20 y roles | Módulo 08 | Labs 32–33 |
| 15 | 08 | ERC-721 y estándares | Módulo 08 | Labs 34–36 (protocolo) |
| 16 | 09 | Seguridad: reentrancia y control de acceso | Módulo 09 | Retos 01–02 |
| 17 | 09 | Oráculos, firmas y proxies | Módulo 09 | Retos 03–06 |
| 18 | 09 | Auditoría e informe | Módulo 09 | Informe de auditoría |
| 19 | 10 | Oráculos e indexación | Módulo 10 | Labs 37–40 |
| 20 | 11 | DAO y gobernanza | Módulo 11 | ADR |
| 21 | 12 | Escalabilidad y L2 | Módulo 12 | Comparativa L2 |
| 22 | 13 | Interoperabilidad y puentes | Módulo 13 | ADR 005 |
| 23 | 14–15 | Privacidad, ZK y arquitectura | Módulos 14–15 | Defensa de diseño |
| 24 | 16–17 | Infraestructura de nodos y empresa | Módulos 16–17 | Plan + caso de negocio |
| 25 | 18 | Implementación empresarial | Módulo 18 | Documento de arquitectura |
| 26 | Capstone | Proyecto final | [Capstone](../capstone/README.md) | Demo y defensa |

## Módulo optativo: finanzas on-chain e institucional (semanas 27–34)

Ocho semanas adicionales que cubren los módulos 19–27. Se pueden impartir como continuación
del curso o como asignatura independiente para perfiles del sector financiero, que en tal
caso necesitan al menos los módulos 00–08 como prerrequisito.

| Semana | Módulo | Tema | Lectura | Entregable |
|---|---|---|---|---|
| 27 | 19 | DeFi: AMM, préstamo, liquidación y riesgo | Módulo 19 | Labs 51–54 |
| 28 | 20 | Dinero, banca, compensación y liquidación | Módulo 20 | Labs 55–57 + informe |
| 29 | 21 | Stablecoins: respaldo, redención y desanclaje | Módulo 21 | Labs 58–59 |
| 30 | 22 | Depósitos tokenizados y CBDC/MDBC | Módulo 22 | Lab 60 + lab 68 (Foundry) |
| 31 | 23 | Pagos, cross-border y FX on-chain | Módulo 23 | Labs 61–63 |
| 32 | 24 | Tokenización y activos del mundo real | Módulo 24 | Labs 64–65 |
| 33 | 25 | Mercados de capitales on-chain | Módulo 25 | Labs 66–67 + arquitectura |
| 34 | 26–27 | Custodia, identidad, regulación y cumplimiento | Módulos 26–27 | Labs 69–70 + análisis regulatorio |

**Nota para el instructor.** El módulo 20 es la bisagra de todo el bloque: sin él, los
siguientes se aprenden como vocabulario. Si hay que recortar, recorta en cualquier otro
sitio. Y advierte desde la primera sesión que el material **no es asesoría financiera,
legal ni tributaria**, y que toda afirmación regulatoria debe verificarse en su fuente
oficial vigente ([regulación](../regulation/README.md)).

En formato intensivo de 8 semanas, agrupa las filas conceptuales y reduce el alcance del capstone; consulta el [kit del instructor](README.md).

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
