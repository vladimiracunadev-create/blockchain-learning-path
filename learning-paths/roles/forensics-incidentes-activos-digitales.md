# Analista de forensics e incidentes de activos digitales

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.html,curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.html,curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.html,curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.html,curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.html,curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.html,curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.html,curriculum/26-custodia-identidad/clase-53-custodia-institucional-de-claves.html,curriculum/26-custodia-identidad/clase-54-identidad-y-autorizacion-verificable.html,curriculum/27-regulacion-cumplimiento/clase-55-leer-regulacion-desde-la-fuente.html,curriculum/27-regulacion-cumplimiento/clase-56-cumplimiento-basado-en-riesgo.html,curriculum/28-data-analytics-onchain/clase-57-extraer-y-normalizar-datos-on-chain.html,curriculum/28-data-analytics-onchain/clase-58-grafo-anomalias-y-limites-de-atribucion.html,curriculum/29-exchanges-operaciones-custodia/clase-59-exchanges-custodia-y-libros-internos.html,curriculum/29-exchanges-operaciones-custodia/clase-60-wallets-operacionales-y-evidencia-blockchain.html,curriculum/30-contabilidad-conciliacion/clase-61-tres-realidades-contables.html,curriculum/30-contabilidad-conciliacion/clase-62-conciliacion-y-gestion-de-diferencias.html,curriculum/31-proof-reserves-solvencia/clase-63-del-saldo-del-cliente-a-una-prueba-merkle.html,curriculum/31-proof-reserves-solvencia/clase-64-del-snapshot-a-una-conclusion-profesional.html,curriculum/32-forensics-auditoria-gobernanza/clase-65-forensics-con-evidencia-reproducible.html,curriculum/32-forensics-auditoria-gobernanza/clase-66-auditoria-cumplimiento-y-gobierno-custodial.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Blockchain Forensics Analyst, Blockchain Incident Response Specialist, On-chain Investigator.

Preserva, correlaciona y explica evidencia on-chain y operacional durante investigaciones e incidentes, separando hechos, inferencias y atribuciones.

**Propósito organizacional.** Ayudar a contener daño y reconstruir eventos sin destruir procedencia, violar privacidad ni convertir una heurística en acusación.

**Títulos y especializaciones agrupados:** Blockchain Forensics Analyst, Blockchain Incident Response Specialist, On-chain Anomaly Detection Specialist.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Preservar fuentes y cortes
- trazar fondos y eventos
- evaluar anomalías
- mantener cadena de custodia
- apoyar respuesta y post-mortem

### Actividades cotidianas

- Consultar transacciones y logs
- normalizar datasets
- construir grafos
- contrastar ledger, exchange y cadena
- redactar hipótesis acotadas

### Entornos de desempeño

- Exchanges y custodios
- equipos de incident response
- compliance analytics
- consultoría forense

## Base de entrada

### Conocimientos básicos

- Modelos UTXO y cuentas
- manejo de evidencia
- grafos y estadística
- privacidad
- procedimiento de incidentes

### Requisitos previos

- Clases 1–12 y 57–66
- nociones de respuesta a incidentes
- autoridad sobre los datos examinados

## Competencias

### Técnicas

- RPC e indexación
- trazado de fondos
- detección y evaluación
- conciliación
- PoR/PoL

### No técnicas

- Escritura probatoria
- prudencia de atribución
- trabajo bajo presión
- comunicación legal/técnica

### Herramientas y tecnologías

- Bitcoin Core
- JSON-RPC EVM
- Node.js
- SQL/grafos como extensión
- hashing y registro de evidencia

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[3. Hashes, integridad y compromisos](../../curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.md) · [4. Firmas, claves y ciclo de vida](../../curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.md) · [9. UTXO y anatomía de una transacción](../../curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.md) · [10. Verificación, minería y operación segura](../../curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [33. Operar nodos con objetivos medibles](../../curriculum/16-infraestructura-nodos/clase-33-operar-nodos-con-objetivos-medibles.md) · [34. Resiliencia, actualización e incidentes](../../curriculum/16-infraestructura-nodos/clase-34-resiliencia-actualizacion-e-incidentes.md) · [53. Custodia institucional de claves](../../curriculum/26-custodia-identidad/clase-53-custodia-institucional-de-claves.md) · [54. Identidad y autorización verificable](../../curriculum/26-custodia-identidad/clase-54-identidad-y-autorizacion-verificable.md) · [55. Leer regulación desde la fuente](../../curriculum/27-regulacion-cumplimiento/clase-55-leer-regulacion-desde-la-fuente.md) · [56. Cumplimiento basado en riesgo](../../curriculum/27-regulacion-cumplimiento/clase-56-cumplimiento-basado-en-riesgo.md) · [57. Extraer y normalizar datos on-chain](../../curriculum/28-data-analytics-onchain/clase-57-extraer-y-normalizar-datos-on-chain.md) · [58. Grafo, anomalías y límites de atribución](../../curriculum/28-data-analytics-onchain/clase-58-grafo-anomalias-y-limites-de-atribucion.md) · [59. Exchanges, custodia y libros internos](../../curriculum/29-exchanges-operaciones-custodia/clase-59-exchanges-custodia-y-libros-internos.md) · [60. Wallets operacionales y evidencia blockchain](../../curriculum/29-exchanges-operaciones-custodia/clase-60-wallets-operacionales-y-evidencia-blockchain.md) · [61. Tres realidades contables](../../curriculum/30-contabilidad-conciliacion/clase-61-tres-realidades-contables.md) · [62. Conciliación y gestión de diferencias](../../curriculum/30-contabilidad-conciliacion/clase-62-conciliacion-y-gestion-de-diferencias.md) · [63. Del saldo del cliente a una prueba Merkle](../../curriculum/31-proof-reserves-solvencia/clase-63-del-saldo-del-cliente-a-una-prueba-merkle.md) · [64. Del snapshot a una conclusión profesional](../../curriculum/31-proof-reserves-solvencia/clase-64-del-snapshot-a-una-conclusion-profesional.md) · [65. Forensics con evidencia reproducible](../../curriculum/32-forensics-auditoria-gobernanza/clase-65-forensics-con-evidencia-reproducible.md) · [66. Auditoría, cumplimiento y gobierno custodial](../../curriculum/32-forensics-auditoria-gobernanza/clase-66-auditoria-cumplimiento-y-gobierno-custodial.md)

### Clases complementarias

[21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [29. Compromisos y pruebas de conocimiento cero](../../curriculum/14-privacidad-zk/clase-29-compromisos-y-pruebas-de-conocimiento-cero.md) · [30. SNARK, STARK y privacidad real](../../curriculum/14-privacidad-zk/clase-30-snark-stark-y-privacidad-real.md) · [37. Integración end-to-end](../../curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.md) · [38. Paso a producción y operación](../../curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.md) · [39. AMM, liquidez y formación de precio](../../curriculum/19-defi/clase-39-amm-liquidez-y-formacion-de-precio.md) · [40. Préstamo, colateral y riesgo DeFi](../../curriculum/19-defi/clase-40-prestamo-colateral-y-riesgo-defi.md)

### Laboratorios esenciales

[15. Selección de UTXO](../../labs/CATALOG.md) · [16. Comisión y cambio Bitcoin](../../labs/CATALOG.md) · [17. Bitcoin Core en regtest](../../labs/CATALOG.md) · [18. Wallet y direcciones regtest](../../labs/CATALOG.md) · [19. Crear y confirmar una transacción regtest](../../labs/CATALOG.md) · [20. Multisig/descriptor en regtest](../../labs/CATALOG.md) · [72. Anatomía de un bloque campo por campo](../../labs/CATALOG.md) · [73. Transacción Bitcoin frente a transacción EVM](../../labs/CATALOG.md) · [74. Extracción por RPC con checkpoint y reorganización](../../labs/CATALOG.md) · [75. Normalizar, validar y almacenar sin duplicar](../../labs/CATALOG.md) · [78. Grafo de direcciones y transacciones](../../labs/CATALOG.md) · [79. Rastreo de fondos en un caso simulado](../../labs/CATALOG.md) · [80. Fan-in, fan-out y cadena de pelado](../../labs/CATALOG.md) · [90. Grafo, privacidad y falsa atribución](../../labs/CATALOG.md)

### Laboratorios avanzados

[81. Detección de anomalías y su evaluación](../../labs/CATALOG.md) · [82. Panel de indicadores on-chain](../../labs/CATALOG.md) · [83. Explorador analítico (proyecto final de la unidad)](../../labs/CATALOG.md) · [84. CEX, DEX y punto de liquidación](../../labs/CATALOG.md) · [85. Arquitectura hot/warm/cold y firmantes](../../labs/CATALOG.md) · [86. Conciliación de tres registros](../../labs/CATALOG.md) · [87. Corte, procedencia y excepciones](../../labs/CATALOG.md) · [88. Merkle Tree de pasivos](../../labs/CATALOG.md) · [89. Assets vs liabilities](../../labs/CATALOG.md) · [91. Caso Aurora Custody](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Lee tx y distingue modelos |
| Aplicado | Ejecuta trazado guiado |
| Autónomo | Reconstruye un caso sin atribución indebida |
| Avanzado | Evalúa detectores y fuentes contradictorias |
| Profesional integrador | Defiende el caso integral y sus límites |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### investigación reproducible de Aurora Custody

Línea temporal, conciliación, grafo, hipótesis, confianza, controles y límites usando datos sintéticos.

**Criterios de aceptación**

- procedencia y hash de fuentes
- hecho separado de inferencia
- métricas de detección
- acciones de contención justificadas

**Consideración ética y de seguridad.** No atribuir identidades sin evidencia independiente; minimizar datos personales.

## Evidencias y evaluación

### Evidencias de aprendizaje

- timeline
- dataset normalizado
- grafo
- matriz hecho/inferencia
- informe y post-mortem

### Métodos de evaluación

- repetibilidad
- precisión/recall
- revisión de procedencia
- tabletop de incidente

## Juicio profesional

### Errores frecuentes

- Dirección igual a persona
- saldo igual a propiedad
- heurística igual a prueba
- modificar originales

### Seguridad, ética y normativa

- Cadena de custodia
- privacidad por diseño
- alcance legal
- no interactuar con fondos sospechosos

### Diferencias frente a roles relacionados

- Frente a auditor: investiga hechos posteriores y datos, no solo código
- Frente a AML analyst: aporta evidencia técnica; compliance decide controles y obligaciones
- Anomaly detection es una técnica, no un cargo separado en todos los equipos

### Posibles especializaciones

- Tracing
- Respuesta a incidentes
- Conciliación forense
- Anomalías
- Investigación de bridges y mixers

### Evolución profesional posible

- Analista de datos forenses
- investigador autónomo
- líder de incidente o especialista forense

## Cobertura y brechas

**Cobertura actual:** Completa y verificada.

- No sustituye herramientas comerciales ni procedimientos judiciales de una jurisdicción

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [NIST SP 800-61r3 · Incident Response](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [Bitcoin Core developer reference](https://developer.bitcoin.org/reference/)
- [FATF · Virtual assets guidance](https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Guidance-rba-virtual-assets.html)
