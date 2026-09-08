# Proyecto final (capstone)

## Objetivo y qué demuestra

Construye un protocolo pequeño que resuelva un problema real y permita demostrar dominio integral del programa: diseño con criterio, contratos probados con rigor, una interfaz utilizable, datos accesibles y una defensa técnica honesta. El capstone no busca originalidad absoluta, sino evidencia de que sabes tomar decisiones, justificarlas y verificar que el sistema hace lo que afirmas.

Un capstone aprobado demuestra que puedes: elegir blockchain solo cuando corresponde, escribir contratos que resisten fuzzing e invariantes, razonar sobre amenazas antes de que ocurran y comunicar todo eso a un evaluador escéptico.

El programa ofrece además el caso profesional guiado **[Aurora Custody](empresa-custodial/README.md)**. Recibes ledger, wallets, transacciones y exports de exchange para demostrar activos, obligaciones, operaciones on-chain/off-chain y discrepancias. Es la opción recomendada para la línea de custodia, auditoría y forensics de las clases 59–66.

## Requisitos mínimos

1. **Protocolo con contratos probados con Foundry**, incluyendo pruebas unitarias, de integración, fuzzing e invariantes sobre las propiedades críticas del sistema. Contratos documentados con NatSpec.
2. **dApp o interfaz** accesible que permita ejercitar los flujos principales (no hace falta diseño pulido; sí estados de transacción claros y manejo de errores).
3. **Indexador o estrategia de datos** explícita: subgraph, indexador propio, eventos + consultas RPC o equivalente, con justificación de la elección.
4. **Documento de arquitectura** según las clases [37–38](../curriculum/18-implementacion-empresarial/README.md): contexto, ADR "¿por qué blockchain y qué alternativa se descartó?", diagrama de componentes y límites de confianza.
5. **Threat model**: actores, superficies de ataque, privilegios administrativos declarados, plan de incidentes. Puedes apoyarte en `docs/threat-model-project.md`.
6. **Despliegue reproducible** local y en testnet mediante scripts (quien clona el repositorio debe poder levantar todo con instrucciones de un solo documento).
7. **Estimación de gas y operación**: costos aproximados de las funciones principales y qué implica operar el sistema.
8. **Plan de infraestructura** según las clases [33–34](../curriculum/16-infraestructura-nodos/README.md): nodos requeridos, disponibilidad, monitoreo y respaldo, y cómo se opera el sistema en el tiempo.
9. **Caso de negocio** según las clases [35–36](../curriculum/17-blockchain-en-la-empresa/README.md): problema, usuarios, propuesta de valor y viabilidad; por qué el proyecto justifica su costo y mantenimiento.
10. **Límite de actuación** según [¿Y si cruzas la línea?](../docs/y-si-cruzas-la-linea-blockchain.md): matriz de acciones permitidas, sujetas a autorización y prohibidas; personas afectadas; evidencia que se preserva; y canal de escalamiento. La funcionalidad técnica no sustituye consentimiento ni mandato.

## Ideas de proyecto con alcance acotado

Además del protocolo de financiamiento comunitario que sirve de hilo conductor del repositorio, estas tres ideas tienen un alcance realista para un capstone individual:

### 1. Registro de certificados verificables

- Una institución emite credenciales ancladas on-chain (hash + Merkle root), con revocación y verificación pública.
- **Incluye:** emisión por lotes, revocación, verificación sin wallet desde la interfaz.
- **Queda fuera:** identidad soberana completa, estándares de credenciales verificables W3C, integración con sistemas reales.
- **Ejercita:** Merkle proofs, control de acceso, diseño de datos off-chain/on-chain.

### 2. Mercado de escrow con árbitro opcional

- Compraventa entre pares con depósito en garantía, disputa con timelock y árbitro designado.
- **Incluye:** máquina de estados completa del trato, disputa, expiración y reembolso.
- **Queda fuera:** reputación, catálogo de productos, pagos con múltiples tokens.
- **Ejercita:** máquinas de estados, invariantes de conservación de fondos, análisis de incentivos.

### 3. Tesorería con gobernanza mínima

- Bóveda multifirma con propuestas, votación ponderada y timelock de ejecución.
- **Incluye:** ciclo propuesta → votación → cola → ejecución, con quórum y cancelación.
- **Queda fuera:** token de gobernanza propio, delegación líquida, gobernanza cross-chain.
- **Ejercita:** patrones de la unidad [11-dao-gobernanza](../curriculum/11-dao-gobernanza/README.md) y ataques de gobernanza en el threat model.

Cualquier otra idea es válida si cabe en las fases siguientes y el instructor aprueba la propuesta. Regla práctica de alcance: si no puedes enumerar las invariantes críticas en cinco líneas, el proyecto es demasiado grande.

## Ideas de proyecto de finanzas on-chain (clases 39–56)

Alternativas para quien haya cursado la etapa financiera. Mismas puertas de calidad, mismo
alcance acotado — y una exigencia añadida: **el documento debe responder qué NO cambia**
respecto de la alternativa tradicional.

| Proyecto | Qué construyes | Qué demuestra |
|---|---|---|
| **Mercado de bono tokenizado** | Emisión, cupón por reclamación y DvP atómico sobre Anvil | Clases 49–52: liquidación atómica y eventos corporativos |
| **Prototipo de pago transfronterizo** | Corredor con dos patas y PvP, con su análisis de coste completo | Clases 47–48: prefondeo, última milla y riesgo de principal |
| **Stablecoin educativa sobrecolateralizada** | Emisión, oráculo, liquidación y subasta de deuda | Clases 39–40 y 43–44: colateral, paridad y procíclica |
| **Simulación de MDBC mayorista** | Dinero de liquidación restringido a participantes + DvP | Clases 45–46: acceso, emisión y redención |
| **Plataforma de custodia institucional** | Política M-de-N con escalones, retardos y recuperación probada | Clases 53–54: cuórum frente a compromiso **y** a pérdida |
| **Motor de cumplimiento** | Cribado por riesgo, Regla de Viaje y trazas auditables | Clases 55–56: enfoque basado en riesgo, sin datos personales reales |

**Requisitos adicionales para estos proyectos:**

1. **Sección de qué no cambia**, explícita: qué riesgo, coste o función permanece igual que
   en el sistema tradicional.
2. **Análisis regulatorio** con las cinco preguntas de las [clases 55–56](../curriculum/27-regulacion-cumplimiento/README.md),
   fuente oficial en cada afirmación y una sección de incertidumbres que no esté vacía.
3. **Etiqueta de simulación educativa** visible: sin fondos reales, sin mainnet, sin datos
   personales, y sin sugerir que reproduce un sistema en producción de ninguna entidad.
4. **Ninguna proyección de rentabilidad.** Un capstone que prometa rendimientos no aprueba,
   por bien construido que esté.

## Fases y entregables

| Fase | Entregable | Criterio de salida |
|---|---|---|
| 1. Propuesta | Problema, usuarios, criterios de éxito y ADR inicial | El instructor confirma que el alcance es realista |
| 2. Diseño | Documento de arquitectura, threat model v1, esquema de datos | Límites de confianza y privilegios declarados |
| 3. Construcción | Contratos + pruebas, interfaz, indexación, scripts de despliegue | Suite verde con fuzzing e invariantes |
| 4. Endurecimiento | Análisis estático, revisión del threat model, informe de auditoría propio | Hallazgos corregidos o justificados por escrito |
| 5. Demo y defensa | Demo funcional en testnet + defensa de 10 minutos | Responde la rúbrica sin depender de la suerte |

```mermaid
flowchart LR
  A["Propuesta"] --> B["Diseño"]
  B --> C["Construcción"]
  C --> D["Endurecimiento"]
  D --> E["Demo y defensa"]
```

## Rúbrica de defensa técnica

| Qué se pregunta | Qué se espera |
|---|---|
| ¿Por qué blockchain y no una base de datos? | ADR con alternativa concreta descartada y trade-offs honestos |
| ¿Cuáles son las invariantes críticas y cómo las pruebas? | Invariantes formuladas como propiedades y verificadas con Foundry |
| ¿Qué puede hacer el administrador y qué pasa si su clave se compromete? | Privilegios enumerados, mitigaciones (multisig, timelock) y plan de incidentes |
| ¿Cómo falla el sistema? (oráculo caído, reorg, front-running) | Modos de falla identificados en el threat model con respuesta definida |
| ¿Cuánto cuesta usarlo y operarlo? | Estimación de gas por función y análisis de operación |
| Muestra el peor bug que encontraste y cómo lo detectaste | Evidencia de proceso: prueba que falló, causa raíz, corrección |
| ¿Qué podrías ejecutar técnicamente pero no estás autorizado a hacer? | Límite concreto, persona afectada, control preventivo y ruta de escalamiento |

### Preparación de la demo y defensa

- Ensaya la demo de punta a punta en un entorno limpio; una demo que solo funciona en tu máquina no cuenta.
- Prepara datos de ejemplo que muestren también un camino de error (transacción revertida, disputa, revocación).
- Ten a mano la salida de la suite de pruebas y del análisis estático: te las van a pedir.
- La defensa dura 10 minutos: dos de contexto, cinco de demo, tres de preguntas de la rúbrica.

## Criterios de excelencia

- Invariantes no triviales encontradas por fuzzing antes que por lectura.
- Threat model que condicionó decisiones de diseño (y lo documenta).
- Interfaz que comunica estados intermedios de transacción y errores con lenguaje humano.
- Despliegue reproducible en un comando por entorno.
- Defensa que reconoce límites del sistema en lugar de ocultarlos.

## Qué NO hace falta

- **No mainnet**: local y testnet bastan; usar fondos reales es causa de reprobación.
- **No auditoría pagada**: el informe de auditoría lo elaboras tú con las técnicas de la unidad [09-seguridad](../curriculum/09-seguridad/README.md).
- **No token propio**: solo incluye un token si el problema lo exige y el análisis de tokenomics lo respalda.
- No frontend de producción ni marca comercial: la evaluación es técnica.

## Puertas de calidad

No se aprueba si usa fondos reales, expone secretos, oculta privilegios administrativos o carece de pruebas para invariantes críticas.

## Cómo presentarlo en el portafolio

- README propio del proyecto con problema, demo (capturas o video corto), decisiones clave y cómo reproducirlo.
- Enlaza el documento de arquitectura, el threat model y el informe de auditoría: son lo que diferencia tu repositorio de un tutorial.
- Describe qué harías distinto con más tiempo; la autocrítica fundada es señal de seniority.

## Navegación

- [Inicio del programa](../README.md) · [Currículo](../curriculum/README.md)
- [Catálogo de laboratorios](../labs/CATALOG.md) · [Evaluación](../docs/evaluacion.md)
- [Checkpoints](../assessments/checkpoints.md)
