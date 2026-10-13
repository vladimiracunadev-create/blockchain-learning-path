# Ingeniero/a de protocolos, interoperabilidad y ZK

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.html,curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.html,curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.html,curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.html,curriculum/03-consenso/clase-07-elegir-un-historial-valido.html,curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.html,curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.html,curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.html,curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.html,curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.html,curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.html,curriculum/14-privacidad-zk/clase-29-compromisos-y-pruebas-de-conocimiento-cero.html,curriculum/14-privacidad-zk/clase-30-snark-stark-y-privacidad-real.html,curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.html,curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.html,curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.html,curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Protocol Engineer, Distributed Systems Engineer, Zero-Knowledge Engineer, Consensus Engineer.

Diseña o modifica clientes, máquinas de estado, consenso, pruebas y protocolos entre cadenas. Es una ruta de alta profundidad que exige distinguir especificación, implementación y evidencia experimental.

**Propósito organizacional.** Producir cambios de protocolo interoperables y verificables bajo fallos bizantinos, límites de recursos y adversarios explícitos.

**Títulos y especializaciones agrupados:** Protocol Engineer, Distributed Systems Engineer especializado en blockchain, Zero-Knowledge Engineer, Consensus Protocol Researcher, Applied Cryptography Researcher.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Escribir especificaciones y propiedades
- prototipar mecanismos
- medir seguridad y rendimiento
- revisar compatibilidad y upgrades
- participar en procesos públicos de mejora

### Actividades cotidianas

- Leer papers y specs
- implementar prototipos
- ejecutar simulaciones
- revisar vectores de ataque y resultados

### Entornos de desempeño

- Equipos core L1/L2
- fundaciones
- laboratorios de investigación
- infraestructura de interoperabilidad

## Base de entrada

### Conocimientos básicos

- Algoritmos
- Rust o Go
- criptografía
- sistemas distribuidos
- método experimental

### Requisitos previos

- Clases 1–12 dominadas
- programación de sistemas
- matemática discreta y probabilidad
- lectura técnica en inglés

## Competencias

### Técnicas

- Consenso y redes P2P
- máquinas de estado
- pruebas ZK
- puentes y mensajería
- benchmarking y compatibilidad

### No técnicas

- Escritura científica
- revisión abierta
- manejo de incertidumbre
- colaboración entre implementaciones

### Herramientas y tecnologías

- Rust/Go
- simuladores
- clientes de nodo
- Polkadot SDK/Cosmos SDK como referencias
- circuits y verificadores según especialidad

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[3. Hashes, integridad y compromisos](../../curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.md) · [4. Firmas, claves y ciclo de vida](../../curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.md) · [5. Replicación, latencia y fallas](../../curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.md) · [6. Redes P2P y adversarios](../../curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.md) · [7. Elegir un historial válido](../../curriculum/03-consenso/clase-07-elegir-un-historial-valido.md) · [8. PoW, PoS y BFT bajo amenaza](../../curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.md) · [9. UTXO y anatomía de una transacción](../../curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.md) · [10. Verificación, minería y operación segura](../../curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [25. Familias de escalabilidad](../../curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.md) · [26. Riesgo operativo de una L2](../../curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [29. Compromisos y pruebas de conocimiento cero](../../curriculum/14-privacidad-zk/clase-29-compromisos-y-pruebas-de-conocimiento-cero.md) · [30. SNARK, STARK y privacidad real](../../curriculum/14-privacidad-zk/clase-30-snark-stark-y-privacidad-real.md) · [31. Cuentas programables y actualizaciones](../../curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.md) · [32. MEV y arquitectura de producción](../../curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.md) · [33. Operar nodos con objetivos medibles](../../curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.md) · [34. Resiliencia, actualización e incidentes](../../curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.md)

### Clases complementarias

[19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md) · [23. Propuestas, voto y ejecución](../../curriculum/11-dao-gobernanza/clase-23-propuestas-voto-y-ejecucion.md) · [24. Captura y gobernanza de emergencia](../../curriculum/11-dao-gobernanza/clase-24-captura-y-gobernanza-de-emergencia.md) · [37. Integración end-to-end](../../curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.md) · [38. Paso a producción y operación](../../curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.md) · [57. Extraer y normalizar datos on-chain](../../curriculum/28-data-analytics-onchain/clase-57-extraer-y-normalizar-datos-on-chain.md) · [58. Grafo, anomalías y límites de atribución](../../curriculum/28-data-analytics-onchain/clase-58-grafo-anomalias-y-limites-de-atribucion.md)

### Laboratorios esenciales

[03. Propiedades y límites de SHA-256](../../labs/CATALOG.md) · [04. Cadena de hashes manipulada](../../labs/CATALOG.md) · [05. Árbol y raíz de Merkle](../../labs/CATALOG.md) · [06. Prueba de inclusión Merkle](../../labs/CATALOG.md) · [07. Firma y verificación Ed25519](../../labs/CATALOG.md) · [09. Propagación P2P con retrasos](../../labs/CATALOG.md) · [10. Partición y reconciliación](../../labs/CATALOG.md) · [11. Proof of Work y dificultad](../../labs/CATALOG.md) · [12. Comparación PoW, PoS y BFT](../../labs/CATALOG.md) · [13. Construcción de una mini blockchain](../../labs/CATALOG.md) · [14. Detección de bloque alterado](../../labs/CATALOG.md) · [46. Comparación de rollups](../../labs/CATALOG.md) · [47. Modelo de amenazas de puente](../../labs/CATALOG.md) · [48. Prueba ZK conceptual](../../labs/CATALOG.md)

### Laboratorios avanzados

[41. Front-running y commit-reveal](../../labs/CATALOG.md) · [42. Colisión de storage en proxy](../../labs/CATALOG.md) · [43. Auditoría completa del Vault](../../labs/CATALOG.md) · [50. Capstone y defensa técnica](../../labs/CATALOG.md) · [74. Extracción por RPC con checkpoint y reorganización](../../labs/CATALOG.md) · [75. Normalizar, validar y almacenar sin duplicar](../../labs/CATALOG.md) · [81. Detección de anomalías y su evaluación](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Explica consenso, P2P y estado |
| Aplicado | Reproduce simulaciones 09–14 |
| Autónomo | Implementa una variante y evalúa fallos |
| Avanzado | Compara seguridad y rendimiento con medición |
| Profesional integrador | Publica réplica defendible y revisión técnica |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### réplica y extensión acotada de un protocolo

Reproducir un resultado publicado o una propiedad de consenso/ZK, declarar divergencias y proponer una extensión mínima.

**Criterios de aceptación**

- spec y amenaza explícitas
- experimento reproducible
- resultados negativos conservados
- compatibilidad y límites defendidos

**Consideración ética y de seguridad.** Divulgación responsable; ninguna prueba sobre redes ajenas sin autorización.

## Evidencias y evaluación

### Evidencias de aprendizaje

- nota técnica
- código mínimo
- dataset y parámetros
- benchmark
- revisión de amenazas

### Métodos de evaluación

- reproducción independiente
- revisión de supuestos
- prueba diferencial
- defensa ante contraejemplos

## Juicio profesional

### Errores frecuentes

- Confundir paper con sistema de producción
- medir solo throughput
- ignorar incentivos
- afirmar seguridad sin modelo adversario

### Seguridad, ética y normativa

- Resultados reproducibles
- licencias respetadas
- cripto revisada por pares
- no inventar propiedades de seguridad

### Diferencias frente a roles relacionados

- Frente a smart contract developer: trabaja por debajo de la aplicación
- Frente a researcher: debe mantener implementación operable
- ZK es especialización; no todo protocol engineer diseña circuitos

### Posibles especializaciones

- Consenso
- clientes de ejecución
- ZK y privacidad
- interoperabilidad
- MEV y construcción de bloques

### Evolución profesional posible

- Contribuidor de cliente
- owner de componente
- diseñador de protocolo o investigador aplicado

## Cobertura y brechas

**Cobertura actual:** Parcial.

- No existe laboratorio de circuitos ZK ni implementación de cliente en Rust/Go; la ruta demuestra fundamentos y diseño, no dominio productivo

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [Bitcoin whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Ethereum consensus specifications](https://github.com/ethereum/consensus-specs)
- [Polkadot Developer Docs](https://docs.polkadot.com/)
- [ZKProof Community Reference](https://docs.zkproof.org/reference.pdf)
