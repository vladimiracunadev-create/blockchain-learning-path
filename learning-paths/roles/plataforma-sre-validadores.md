# Ingeniero/a de plataforma blockchain, SRE y validadores

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.html,curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.html,curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.html,curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.html,curriculum/03-consenso/clase-07-elegir-un-historial-valido.html,curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.html,curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.html,curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.html,curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.html,curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.html,curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.html,curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.html,curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.html,curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.html,curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.html,curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.html,curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Blockchain SRE, Blockchain DevOps Engineer, Node Operator, Validator Infrastructure Engineer, Blockchain Platform Engineer.

Despliega y opera nodos, RPC, validadores e indexadores con observabilidad, automatización, recuperación y custodia operacional de claves.

**Propósito organizacional.** Mantener disponibilidad e integridad sin sacrificar seguridad por velocidad ni confundir uptime de un nodo con salud de toda la red.

**Títulos y especializaciones agrupados:** Blockchain DevOps Engineer, Blockchain SRE, Node Operator, Validator Infrastructure Engineer, Blockchain Platform Engineer.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Infraestructura como código
- actualizaciones y rollback
- SLO, métricas y alertas
- backups y recuperación
- gestión de claves y respuesta a incidentes

### Actividades cotidianas

- Revisar salud y capacidad
- automatizar despliegues
- ensayar failover
- investigar reorgs, peers y latencia
- mantener runbooks

### Entornos de desempeño

- Operadores de validadores
- proveedores RPC
- exchanges y custodios
- equipos de protocolo

## Base de entrada

### Conocimientos básicos

- Linux y redes
- contenedores
- sistemas distribuidos
- seguridad de secretos
- on-call

### Requisitos previos

- Clases 5–12
- operación Linux
- redes TCP/IP
- automatización con un lenguaje

## Competencias

### Técnicas

- Clientes y tipos de nodo
- observabilidad
- CI/CD y GitOps
- alta disponibilidad
- ceremonias y slashing

### No técnicas

- Comunicación de incidentes
- disciplina operacional
- priorización bajo presión
- post-mortem sin culpa

### Herramientas y tecnologías

- Docker
- Kubernetes
- Terraform
- Prometheus/Grafana
- Geth y clientes de consenso
- HSM/KMS según entorno

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[3. Hashes, integridad y compromisos](../../curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.md) · [4. Firmas, claves y ciclo de vida](../../curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.md) · [5. Replicación, latencia y fallas](../../curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.md) · [6. Redes P2P y adversarios](../../curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.md) · [7. Elegir un historial válido](../../curriculum/03-consenso/clase-07-elegir-un-historial-valido.md) · [8. PoW, PoS y BFT bajo amenaza](../../curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.md) · [9. UTXO y anatomía de una transacción](../../curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.md) · [10. Verificación, minería y operación segura](../../curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md) · [25. Familias de escalabilidad](../../curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.md) · [26. Riesgo operativo de una L2](../../curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [33. Operar nodos con objetivos medibles](../../curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.md) · [34. Resiliencia, actualización e incidentes](../../curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.md) · [37. Integración end-to-end](../../curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.md) · [38. Paso a producción y operación](../../curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.md)

### Clases complementarias

[19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [31. Cuentas programables y actualizaciones](../../curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.md) · [32. MEV y arquitectura de producción](../../curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.md) · [53. Custodia institucional de claves](../../curriculum/26-custodia-identidad/clase-53-custodia-institucional-de-claves.md) · [54. Identidad y autorización verificable](../../curriculum/26-custodia-identidad/clase-54-identidad-y-autorizacion-verificable.md) · [59. Exchanges, custodia y libros internos](../../curriculum/29-exchanges-operaciones-custodia/clase-59-exchanges-custodia-y-libros-internos.md) · [60. Wallets operacionales y evidencia blockchain](../../curriculum/29-exchanges-operaciones-custodia/clase-60-wallets-operacionales-y-evidencia-blockchain.md) · [61. Tres realidades contables](../../curriculum/30-contabilidad-conciliacion/clase-61-tres-realidades-contables.md) · [62. Conciliación y gestión de diferencias](../../curriculum/30-contabilidad-conciliacion/clase-62-conciliacion-y-gestion-de-diferencias.md)

### Laboratorios esenciales

[08. Amenazas de custodia de claves](../../labs/CATALOG.md) · [09. Propagación P2P con retrasos](../../labs/CATALOG.md) · [10. Partición y reconciliación](../../labs/CATALOG.md) · [11. Proof of Work y dificultad](../../labs/CATALOG.md) · [12. Comparación PoW, PoS y BFT](../../labs/CATALOG.md) · [17. Bitcoin Core en regtest](../../labs/CATALOG.md) · [18. Wallet y direcciones regtest](../../labs/CATALOG.md) · [19. Crear y confirmar una transacción regtest](../../labs/CATALOG.md) · [20. Multisig/descriptor en regtest](../../labs/CATALOG.md) · [35. Indexador de eventos](../../labs/CATALOG.md)

### Laboratorios avanzados

[46. Comparación de rollups](../../labs/CATALOG.md) · [47. Modelo de amenazas de puente](../../labs/CATALOG.md) · [50. Capstone y defensa técnica](../../labs/CATALOG.md) · [69. Política de custodia M-de-N](../../labs/CATALOG.md) · [74. Extracción por RPC con checkpoint y reorganización](../../labs/CATALOG.md) · [75. Normalizar, validar y almacenar sin duplicar](../../labs/CATALOG.md) · [85. Arquitectura hot/warm/cold y firmantes](../../labs/CATALOG.md) · [86. Conciliación de tres registros](../../labs/CATALOG.md) · [87. Corte, procedencia y excepciones](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Distingue clientes, nodos y métricas |
| Aplicado | Opera un nodo guiado |
| Autónomo | Automatiza despliegue y recuperación |
| Avanzado | Diseña SLO, HA y upgrades |
| Profesional integrador | Supera un simulacro integral y defiende el runbook |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### plataforma de nodo reproducible con recuperación

Nodo local o testnet, métricas, alertas, backup, upgrade y restauración ensayada.

**Criterios de aceptación**

- deploy automatizado
- SLO y alertas accionables
- upgrade y rollback documentados
- prueba de recuperación con tiempos medidos

**Consideración ética y de seguridad.** Claves segregadas; no operar fondos o validadores reales como práctica educativa.

## Evidencias y evaluación

### Evidencias de aprendizaje

- IaC
- dashboard
- runbook
- registro de simulacro
- post-mortem

### Métodos de evaluación

- despliegue desde cero
- inyección segura de fallo
- recuperación observada
- revisión de seguridad

## Juicio profesional

### Errores frecuentes

- Alertar sin SLO
- backup nunca restaurado
- upgrade sin compatibilidad
- guardar claves junto al nodo

### Seguridad, ética y normativa

- Mínimo privilegio
- secretos fuera del repo
- doble control para claves
- pruebas de recuperación periódicas

### Diferencias frente a roles relacionados

- DevOps general aporta base, pero debe aprender finalidad, peers, reorgs y claves de validador
- Node operator puede ser alcance menor; SRE diseña confiabilidad transversal
- No equivale a protocol engineer

### Posibles especializaciones

- Validadores PoS
- RPC e indexación
- SRE de L2
- Plataforma custodial
- Observabilidad multichain

### Evolución profesional posible

- Operador de nodo
- ingeniero de plataforma
- SRE/owner de red

## Cobertura y brechas

**Cobertura actual:** Parcial.

- No hay clúster Kubernetes ni validador con slashing real; la evidencia es local y segura

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [Ethereum · Run a node](https://ethereum.org/developers/docs/nodes-and-clients/run-a-node/)
- [Ethereum · Monitoring a node](https://ethereum.org/developers/docs/nodes-and-clients/run-a-node/#monitoring-the-node)
- [SRE fundamentals](https://sre.google/sre-book/table-of-contents/)
