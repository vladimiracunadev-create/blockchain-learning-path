# 🔄 Ciclo de vida de un proyecto blockchain

> **Audiencia:** Equipos que llevan un protocolo de la idea a producción · ⏱️ **Lectura:** 25 min · **Fuentes:** prácticas públicas de despliegue y operación del ecosistema
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🗺️ El pipeline completo

Un protocolo serio no "se lanza": atraviesa un pipeline con puertas de calidad explícitas. Saltarse una fase no ahorra tiempo — traslada el costo a producción, donde los errores se pagan en fondos de usuarios. El pipeline de referencia:

```text
┌──────────────┐  ┌──────────────┐  ┌───────┐  ┌──────────────────┐  ┌──────────────┐
│ Descubrimiento│─►│ Diseño / spec│─►│  PoC  │─►│ Desarrollo +      │─►│ Testnet      │
│ ¿blockchain?  │  │ invariantes, │  │       │  │ pruebas (TDD,     │  │ pública      │
│ ¿qué problema?│  │ threat model │  │       │  │ fuzzing, invar.)  │  │              │
└──────────────┘  └──────────────┘  └───────┘  └──────────────────┘  └──────┬───────┘
                                                                            │
      ┌─────────────────────────────────────────────────────────────────────┘
      ▼
┌────────────┐  ┌────────────┐  ┌────────────────────┐  ┌─────────┐  ┌────────────┐
│ Auditorías │─►│ Bug bounty │─►│ Lanzamiento acotado │─►│ Mainnet │─►│ Operación  │
│ (≥1 firma, │  │ (público,  │  │ (caps, timelocks,   │  │ pleno   │  │ monitoreo, │
│ + contest) │  │ escalonado)│  │ multisig, breakers) │  │         │  │ runbooks   │
└────────────┘  └────────────┘  └────────────────────┘  └─────────┘  └─────┬──────┘
                                                                           │
                                              ┌────────────────────────────┤
                                              ▼                            ▼
                                     ┌─────────────────┐          ┌────────────────┐
                                     │ Evolución:       │          │ Sunset:        │
                                     │ upgrades con     │          │ apagado        │
                                     │ gobernanza       │          │ responsable    │
                                     └─────────────────┘          └────────────────┘
```

Cada flecha es una **puerta de calidad** con criterio de salida explícito:

| Fase | Criterio de salida (no se avanza sin esto) |
|---|---|
| Descubrimiento | Decisión documentada de que blockchain aporta valor; criterios de cancelación escritos |
| Diseño / spec | Spec aprobada, invariantes enumeradas, threat model revisado por alguien externo al equipo |
| PoC | Riesgos técnicos principales validados o descartados; decisión go/no-go registrada |
| Desarrollo + pruebas | CI verde, fuzzing e invariantes sin hallazgos abiertos, cobertura revisada, código congelado |
| Testnet pública | Flujos completos ejecutados por terceros; scripts de despliegue idénticos a los de mainnet |
| Auditorías | Hallazgos críticos y altos corregidos y re-verificados por el auditor; informe publicado |
| Bug bounty | Programa activo con pagos proporcionales al valor que se custodiará |
| Lanzamiento acotado | Caps, timelocks, multisig y monitoreo operativos y ensayados antes del primer depósito |
| Mainnet pleno | Evidencia de operación estable bajo caps; plan de subida de límites aprobado |

## 🔍 Descubrimiento y diseño

**Descubrimiento.** La primera puerta es la más barata de cruzar en la dirección correcta: ¿este problema necesita blockchain? Aplica la matriz de decisión del módulo 00 del programa (ver [currículo](../curriculum/README.md)): múltiples partes que escriben, ausencia razonable de intermediario confiable, valor en la liquidación programable. Si la respuesta es no, el mejor entregable del proyecto es un documento que lo diga.

**Diseño.** Antes de escribir Solidity se escribe la **especificación**: qué hace el sistema, qué no hace, y — crucial — qué debe ser siempre verdad. Los entregables de esta fase:

- **Spec funcional** con casos de uso y flujos de fondos explícitos.
- **Invariantes del sistema** ("la suma de balances internos es igual al balance del contrato", "nadie retira más de lo depositado más su rendimiento"): serán las propiedades que el fuzzing y las pruebas de invariantes atacarán después.
- **Threat model:** actores, capacidades (¿qué puede hacer un atacante con flash loans?, ¿y el propio equipo con las claves de admin?), superficies de ataque, supuestos de confianza documentados.
- **Tokenomics**, si aplica, con simulaciones de emisiones y presión vendedora — no una hoja de cálculo optimista.
- **ADRs** (Architecture Decision Records) para cada decisión estructural: por qué upgradeable o no, qué oráculo, qué L2. El formato del programa está en el [índice de ADRs](../adrs/README.md).

## 🛠️ Desarrollo, pruebas y testnet

El estándar de la industria para contratos serios es el que practica este programa (ver [currículo](../curriculum/README.md)): **TDD con Foundry**, pruebas unitarias por función, **fuzzing** sobre entradas y **pruebas de invariantes** sobre las propiedades del diseño. Cobertura alta es necesaria pero no suficiente: la pregunta es si las invariantes correctas están escritas. A esto se suman análisis estático (Slither), revisión interna cruzada y un CI que bloquea cualquier merge con pruebas en rojo.

**Testnet pública** (Sepolia u Holesky para el ecosistema Ethereum; consulta las redes vigentes porque rotan): despliega con los mismos scripts que usarás en mainnet — el despliegue es código y se prueba como código. Sé honesto con lo que una testnet demuestra y lo que no:

- ✅ Demuestra: que el despliegue funciona, que las integraciones responden, que los flujos completos son ejecutables por terceros.
- ❌ No demuestra: comportamiento bajo valor económico real (en testnet nadie ataca porque no hay botín), condiciones de congestión y MEV reales, ni la conducta de usuarios adversariales. Las *incentivized testnets* mitigan esto solo parcialmente.

## 🛡️ Auditorías y bug bounty

**Auditoría externa.** Cómo elegir firma: historial público de informes, experiencia en tu tipo de protocolo (un AMM no se audita como un bridge), y disponibilidad real de sus auditores senior. Qué cubre: revisión manual experta del código congelado contra vulnerabilidades conocidas y lógica de negocio, en un tiempo acotado. Qué **no** cubre: código que cambies después del informe, dependencias fuera del alcance, riesgo económico/de oráculos si no se contrató específicamente, y en general la garantía de ausencia de bugs — una auditoría es una opinión experta con presupuesto finito, no un certificado. Costos: varían por alcance y firma en órdenes de magnitud — consúltalo en vivo.

La práctica madura para protocolos que custodian valor significativo es **defensa en profundidad**: dos auditorías independientes más un *contest* público (Code4rena, Sherlock), porque cientos de ojos con incentivos encuentran clases de bugs distintas a las que encuentra un equipo de tres auditores.

**Bug bounty.** Antes de mainnet, publica un programa (Immunefi es el estándar del sector) con severidades y pagos escalonados. La estructura típica:

- **Crítico:** robo o congelamiento directo de fondos de usuarios; paga el máximo del programa, frecuentemente como porcentaje de los fondos en riesgo con un tope.
- **Alto:** pérdida acotada o robo de fondos no depositados por usuarios (por ejemplo, de la tesorería del protocolo).
- **Medio/bajo:** griefing, denegación de servicio, desviaciones sin pérdida directa.
- **Informativo:** hallazgos de calidad de código sin impacto explotable.

El bounty debe ser proporcional al valor custodiado — un bounty máximo de 50 000 USD protegiendo 500 millones invita al atacante a elegir la otra opción. Y debe pagarse rápido y sin regateos: la reputación de pago del programa es lo que hace que el próximo investigador reporte en vez de explotar.

## 🚀 Estrategias de lanzamiento

El lanzamiento no es binario. Las tres estrategias arquetípicas:

| Criterio | Inmutable sin admin | Upgradeable con timelock + multisig | Guarded launch progresivo |
|---|---|---|---|
| Filosofía | "El código es la ley"; máxima confianza del usuario | Capacidad de corregir y evolucionar con transparencia | Exposición limitada mientras se gana evidencia en producción |
| Riesgo si hay un bug | No hay corrección posible: migración total o pérdida | Corregible dentro de la ventana del timelock | Acotado por los caps: el peor caso tiene techo conocido |
| Riesgo de gobernanza/claves | Mínimo (no hay llaves que robar) | El multisig y el proceso de upgrade son superficie de ataque | Intermedio; los controles temporales deben expirar de verdad |
| Confianza que exige al usuario | Solo en el código auditado | En el código y en los firmantes del multisig | En el código, el equipo y el plan de descentralización |
| Ejemplo de uso típico | Primitivas simples y maduras (estilo Uniswap v2 core) | Protocolos de préstamo y sistemas complejos | Casi todo lanzamiento serio nuevo desde 2021 |
| Trade-off central | Seguridad de gobernanza a cambio de rigidez total | Flexibilidad a cambio de un vector de ataque nuevo | Complejidad operacional a cambio de riesgo acotado |

Herramientas del **guarded launch**: caps de depósito por usuario y globales que suben gradualmente, **timelocks** en toda función administrativa (el usuario puede salir antes de que un cambio se aplique), **multisig** con firmantes independientes y umbral razonable, **circuit breakers** (pausas automáticas ante anomalías: retiros masivos, desviación de oráculo) y feature flags para activar módulos por etapas. Cada control temporal necesita fecha de expiración o plan de remoción: un "lanzamiento guardado" permanente es simplemente un protocolo centralizado.

Checklist mínima antes del primer depósito real:

- El bytecode desplegado corresponde exactamente al commit auditado (verificación reproducible).
- Contratos verificados públicamente en el explorador; direcciones oficiales publicadas y firmadas.
- Multisig probado con una transacción real; firmantes ensayaron el procedimiento de emergencia.
- Monitoreo y alertas activos **antes** del lanzamiento, no después del primer susto.
- Runbook de pausa/incidente ensayado en simulacro, con tiempos medidos.
- Programa de bug bounty publicado y canal de divulgación responsable visible.

## 📡 Operación

Mainnet es el comienzo del trabajo, no el final. La operación seria incluye:

- **Monitoreo on-chain:** alertas sobre las invariantes del diseño (si una se rompe en producción, quieres saberlo en segundos, no en el post-mortem), transacciones anómalas, salud de oráculos y colas de retiro. Herramientas del ecosistema: Tenderly, Forta, OpenZeppelin Defender.
- **Runbooks de incidentes:** quién puede pausar, con qué firma, en cuánto tiempo, y qué se comunica mientras tanto. El programa tiene una guía dedicada: [operación e incidentes](../docs/operacion-incidentes.md). Un runbook que nunca se ensayó es una hipótesis, no un plan.
- **Gestión de claves y multisig ops:** firmantes con hardware wallets dedicadas, verificación independiente de cada transacción propuesta (los firmantes que firman lo que les ponen delante son el eslabón débil — así cayeron varios multisigs), rotación documentada y simulacros.
- **Comunicación pública:** los mejores equipos publican post-mortems técnicos completos tras cada incidente (causa raíz, línea de tiempo, fondos afectados, correcciones). Esa transparencia — practicada por equipos como los de Compound o Lido ante incidentes — es hoy la norma de los protocolos respetados y una ventaja reputacional medible.

## 🔁 Evolución y sunset

**Evolución.** Los upgrades pasan por gobernanza: propuesta pública, revisión (idealmente auditoría del diff), votación o aprobación multisig, timelock, ejecución. Las migraciones de versión (v1 → v2) suelen convivir años: v1 inmutable sigue operando mientras la liquidez migra por incentivos, no por coerción. Deprecar exige avisos amplios, herramientas de migración y mantener la capacidad de retiro indefinidamente.

**Sunset.** Apagar un protocolo responsablemente es una fase de diseño, no una improvisación: desactivar depósitos nuevos, garantizar retiros permanentes, renunciar a permisos administrativos o transferirlos a la comunidad, y documentar el estado final. Aquí importa la decisión de diseño tomada años antes: los contratos **pausables** permiten un cierre ordenado pero exigen confianza en quien pausa; los **inmutables** no se pueden apagar — quedarán en la cadena para siempre, con o sin frontend. Si tu protocolo custodia fondos, "el equipo se disolvió" no puede implicar "los fondos quedaron atrapados".

Este ciclo completo — de la matriz de decisión al plan de sunset — es exactamente lo que se practica a escala en el proyecto final del programa: [capstone](../capstone/README.md).

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "La auditoría garantiza que el contrato es seguro" | Es una revisión experta acotada en tiempo y alcance; protocolos auditados pierden fondos cada año. Por eso: defensa en profundidad |
| "Funcionó estable en testnet, mainnet será igual" | En testnet no hay valor que robar ni MEV real; la ausencia de ataques no es evidencia de seguridad |
| "Somos descentralizados, no necesitamos operación" | Alguien monitorea, alguien propone upgrades, alguien responde incidentes; descentralizado significa responsabilidades distribuidas, no inexistentes |
| "Auditamos una vez y ya" | Cada cambio de código posterior al informe está sin auditar; el hash auditado y el desplegado deben coincidir |
| "El multisig nos protege" | Solo si los firmantes verifican independientemente lo que firman; un multisig con firmantes ciegos es teatro de seguridad |
| "Lanzamos sin caps para no frenar el crecimiento" | El costo de un cap es crecimiento diferido; el costo de no tenerlo es el TVL entero en el peor caso |
| "El bug bounty es opcional si ya auditamos" | Es la única capa que sigue activa en producción y alinea a los que encuentran bugs para reportarlos en vez de explotarlos |

## 🔗 Referencias

- Trail of Bits, *Building Secure Contracts*: <https://secure-contracts.com/>
- OpenZeppelin Defender — operación y monitoreo: <https://docs.openzeppelin.com/defender/>
- Immunefi — bug bounties y clasificación de severidades: <https://immunefi.com/>
- Code4rena — contests de auditoría competitiva: <https://code4rena.com/>
- Foundry Book — scripts de despliegue y pruebas: <https://book.getfoundry.sh/>
- ethereum.org — redes y testnets: <https://ethereum.org/developers/docs/networks/>

---

## 🧭 Navegación

⬅️ [05 · Modelos de negocio](05-modelos-de-negocio.md) · [Índice de industria](README.md) · [🏠 Programa](../README.md)
