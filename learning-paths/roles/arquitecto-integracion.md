# Arquitecto/a blockchain e integración

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/00-orientacion/clase-01-que-problema-intenta-resolver-blockchain.html,curriculum/00-orientacion/clase-02-decidir-y-comunicar-sin-vender-humo.html,curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.html,curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.html,curriculum/03-consenso/clase-07-elegir-un-historial-valido.html,curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.html,curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.html,curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.html,curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.html,curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.html,curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.html,curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.html,curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.html,curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.html,curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.html,curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.html,curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.html,curriculum/17-blockchain-en-la-empresa/clase-35-valor-empresarial-y-limites.html,curriculum/17-blockchain-en-la-empresa/clase-36-comunicacion-piloto-y-medicion.html,curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.html,curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Blockchain Architect, Blockchain Integration Engineer, Blockchain Solutions Architect, Interoperability Architect.

Decide qué datos, confianza y controles viven on-chain y cuáles permanecen fuera; compara L1, L2, redes permisionadas e integración tradicional con criterios medibles.

**Propósito organizacional.** Evitar tanto blockchain innecesaria como arquitecturas que ignoran custodia, finalidad, privacidad, operación o salida de proveedores.

**Títulos y especializaciones agrupados:** Blockchain Architect, Blockchain Integration Engineer, Interoperability Engineer.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Modelar actores, confianza y amenazas
- Comparar plataformas y costos totales
- Definir contratos entre cadena, RPC, indexador y sistemas legados
- Registrar decisiones, contingencias y criterios de abandono

### Actividades cotidianas

- Talleres de requisitos
- ADRs y diagramas
- revisión de integraciones
- pruebas de concepto y análisis de fallos

### Entornos de desempeño

- Enterprise y fintech
- Protocolos multichain
- Pagos y mercados
- Consultoría técnica

## Base de entrada

### Conocimientos básicos

- Arquitectura de software
- sistemas distribuidos
- seguridad
- datos y APIs
- economía operativa

### Requisitos previos

- Tronco 1–12
- experiencia general en integración o backend
- capacidad de estimar operación y recuperación

## Competencias

### Técnicas

- L1/L2 y finalidad
- interoperabilidad y puentes
- nodos, RPC e indexación
- identidad y custodia
- ADR y threat modeling

### No técnicas

- Facilitación
- negociación
- comunicación ejecutiva
- pensamiento sistémico

### Herramientas y tecnologías

- C4/Mermaid
- ADRs
- Docker
- clientes RPC
- modelos de costo
- matrices de riesgo

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[1. Qué problema intenta resolver blockchain](../../curriculum/00-orientacion/clase-01-que-problema-intenta-resolver-blockchain.md) · [2. Decidir y comunicar sin vender humo](../../curriculum/00-orientacion/clase-02-decidir-y-comunicar-sin-vender-humo.md) · [5. Replicación, latencia y fallas](../../curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.md) · [6. Redes P2P y adversarios](../../curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.md) · [7. Elegir un historial válido](../../curriculum/03-consenso/clase-07-elegir-un-historial-valido.md) · [8. PoW, PoS y BFT bajo amenaza](../../curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.md) · [9. UTXO y anatomía de una transacción](../../curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.md) · [10. Verificación, minería y operación segura](../../curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md) · [25. Familias de escalabilidad](../../curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.md) · [26. Riesgo operativo de una L2](../../curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [31. Cuentas programables y actualizaciones](../../curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.md) · [32. MEV y arquitectura de producción](../../curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.md) · [33. Operar nodos con objetivos medibles](../../curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.md) · [34. Resiliencia, actualización e incidentes](../../curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.md) · [35. Valor empresarial y límites](../../curriculum/17-blockchain-en-la-empresa/clase-35-valor-empresarial-y-limites.md) · [36. Comunicación, piloto y medición](../../curriculum/17-blockchain-en-la-empresa/clase-36-comunicacion-piloto-y-medicion.md) · [37. Integración end-to-end](../../curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.md) · [38. Paso a producción y operación](../../curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.md)

### Clases complementarias

[19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [23. Propuestas, voto y ejecución](../../curriculum/11-dao-gobernanza/clase-23-propuestas-voto-y-ejecucion.md) · [24. Captura y gobernanza de emergencia](../../curriculum/11-dao-gobernanza/clase-24-captura-y-gobernanza-de-emergencia.md) · [29. Compromisos y pruebas de conocimiento cero](../../curriculum/14-privacidad-zk/clase-29-compromisos-y-pruebas-de-conocimiento-cero.md) · [30. SNARK, STARK y privacidad real](../../curriculum/14-privacidad-zk/clase-30-snark-stark-y-privacidad-real.md) · [41. Qué es dinero bancario](../../curriculum/20-dinero-banca-liquidacion/clase-41-que-es-dinero-bancario.md) · [42. Finalidad, liquidez y riesgo de liquidación](../../curriculum/20-dinero-banca-liquidacion/clase-42-finalidad-liquidez-y-riesgo-de-liquidacion.md) · [53. Custodia institucional de claves](../../curriculum/26-custodia-identidad/clase-53-custodia-institucional-de-claves.md) · [54. Identidad y autorización verificable](../../curriculum/26-custodia-identidad/clase-54-identidad-y-autorizacion-verificable.md) · [55. Leer regulación desde la fuente](../../curriculum/27-regulacion-cumplimiento/clase-55-leer-regulacion-desde-la-fuente.md) · [56. Cumplimiento basado en riesgo](../../curriculum/27-regulacion-cumplimiento/clase-56-cumplimiento-basado-en-riesgo.md)

### Laboratorios esenciales

[01. Matriz blockchain vs. base tradicional](../../labs/CATALOG.md) · [09. Propagación P2P con retrasos](../../labs/CATALOG.md) · [10. Partición y reconciliación](../../labs/CATALOG.md) · [12. Comparación PoW, PoS y BFT](../../labs/CATALOG.md) · [21. Anatomía de una transacción pública](../../labs/CATALOG.md) · [35. Indexador de eventos](../../labs/CATALOG.md) · [36. Oráculo y dato obsoleto](../../labs/CATALOG.md) · [46. Comparación de rollups](../../labs/CATALOG.md) · [47. Modelo de amenazas de puente](../../labs/CATALOG.md)

### Laboratorios avanzados

[42. Colisión de storage en proxy](../../labs/CATALOG.md) · [44. Multisig y timelock](../../labs/CATALOG.md) · [48. Prueba ZK conceptual](../../labs/CATALOG.md) · [50. Capstone y defensa técnica](../../labs/CATALOG.md) · [60. Opciones de diseño de una MDBC](../../labs/CATALOG.md) · [63. Análisis de un corredor de pagos](../../labs/CATALOG.md) · [69. Política de custodia M-de-N](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Explica modelos de confianza y capas |
| Aplicado | Produce un ADR guiado |
| Autónomo | Diseña una integración completa |
| Avanzado | Compara fallos, costos y contingencias |
| Profesional integrador | Defiende una arquitectura verificable ante negocio, seguridad y operación |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### arquitectura integral con ADR, amenazas y costos

Diseño para un caso realista que compare al menos una alternativa tradicional y dos opciones DLT.

**Criterios de aceptación**

- requisitos y supuestos trazables
- modelo de confianza y amenazas
- TCO, SLO, recuperación y salida
- decisión y criterio para revertirla

**Consideración ética y de seguridad.** No presentar inmutabilidad como verdad del dato ni descentralización como propiedad binaria.

## Evidencias y evaluación

### Evidencias de aprendizaje

- ADR
- diagramas
- presupuesto
- threat model
- plan de operación y migración

### Métodos de evaluación

- Revisión de arquitectura
- tabletop de incidente
- contradicción por pares
- defensa de alternativa descartada

## Juicio profesional

### Errores frecuentes

- Elegir red por marca
- olvidar la lectura off-chain
- subestimar claves y upgrades
- no definir finalidad ni rollback

### Seguridad, ética y normativa

- Datos personales minimizados
- portabilidad y contingencia
- dependencias y supuestos explícitos
- validación legal por jurisdicción

### Diferencias frente a roles relacionados

- Frente a protocol engineer: integra componentes antes que modificar consenso
- Frente a consultor: responde por coherencia técnica detallada
- Frente a DevOps: diseña el sistema; operación implementa SLO y runbooks

### Posibles especializaciones

- Interoperabilidad
- Arquitectura enterprise
- Pagos y tokenización
- Identidad y custodia
- L2 y account abstraction

### Evolución profesional posible

- Diseñador de integración
- arquitecto de solución
- responsable de arquitectura de plataforma

## Cobertura y brechas

**Cobertura actual:** Completa y verificada.

- La estimación de costos de proveedores exige cotizaciones vigentes fuera del material offline

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [Ethereum · Node architecture](https://ethereum.org/developers/docs/nodes-and-clients/node-architecture/)
- [OP Stack documentation](https://docs.optimism.io/stack/getting-started)
- [Cosmos SDK documentation](https://docs.cosmos.network/)
- [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/)
