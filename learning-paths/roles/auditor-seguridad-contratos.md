# Auditor/a de seguridad de contratos y protocolos

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.html,curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.html,curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.html,curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.html,curriculum/03-consenso/clase-07-elegir-un-historial-valido.html,curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/06-solidity-foundry/clase-13-diseno-de-contratos-e-invariantes.html,curriculum/06-solidity-foundry/clase-14-pruebas-profundas-con-foundry.html,curriculum/07-dapps/clase-15-lecturas-rpc-y-estado-de-interfaz.html,curriculum/07-dapps/clase-16-firmas-y-experiencia-transaccional.html,curriculum/08-tokens/clase-17-estandares-y-derechos-del-token.html,curriculum/08-tokens/clase-18-permisos-distribucion-y-necesidad.html,curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.html,curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.html,curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.html,curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.html,curriculum/11-dao-gobernanza/clase-23-propuestas-voto-y-ejecucion.html,curriculum/11-dao-gobernanza/clase-24-captura-y-gobernanza-de-emergencia.html,curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.html,curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Smart Contract Security Auditor, Blockchain Security Engineer, Protocol Security Engineer.

Identifica vulnerabilidades y fallos de diseño, demuestra impacto con pruebas controladas y verifica remediaciones sin convertir una auditoría en garantía.

**Propósito organizacional.** Reducir riesgo antes del despliegue mediante revisión reproducible, propiedades explícitas y comunicación accionable.

**Títulos y especializaciones agrupados:** Smart Contract Security Auditor, Blockchain Security Engineer, Digital Asset Security Specialist.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Definir alcance y amenaza
- revisión manual y automatizada
- fuzzing e invariantes
- PoC segura
- clasificación y retest

### Actividades cotidianas

- Leer specs y código
- formular invariantes
- construir tests adversariales
- escribir y discutir hallazgos

### Entornos de desempeño

- Firmas de auditoría
- equipos internos de seguridad
- protocolos DeFi
- bug bounty autorizado

## Base de entrada

### Conocimientos básicos

- EVM y Solidity
- patrones de contratos
- criptografía aplicada
- threat modeling
- ética y alcance

### Requisitos previos

- Clases 1–20
- capacidad de escribir contratos y tests
- permiso y alcance por escrito

## Competencias

### Técnicas

- Reentrancia y permisos
- firmas y replay
- oráculos y MEV
- proxies y storage
- fuzzing, invariantes y verificación formal

### No técnicas

- Redacción precisa
- gestión de conflicto
- priorización
- divulgación responsable

### Herramientas y tecnologías

- Foundry
- Slither
- Echidna/Medusa como extensión
- Certora u otra herramienta formal como extensión
- OpenZeppelin

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[3. Hashes, integridad y compromisos](../../curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.md) · [4. Firmas, claves y ciclo de vida](../../curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.md) · [5. Replicación, latencia y fallas](../../curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.md) · [6. Redes P2P y adversarios](../../curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.md) · [7. Elegir un historial válido](../../curriculum/03-consenso/clase-07-elegir-un-historial-valido.md) · [8. PoW, PoS y BFT bajo amenaza](../../curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [13. Diseño de contratos e invariantes](../../curriculum/06-solidity-foundry/clase-13-diseno-de-contratos-e-invariantes.md) · [14. Pruebas profundas con Foundry](../../curriculum/06-solidity-foundry/clase-14-pruebas-profundas-con-foundry.md) · [15. Lecturas, RPC y estado de interfaz](../../curriculum/07-dapps/clase-15-lecturas-rpc-y-estado-de-interfaz.md) · [16. Firmas y experiencia transaccional](../../curriculum/07-dapps/clase-16-firmas-y-experiencia-transaccional.md) · [17. Estándares y derechos del token](../../curriculum/08-tokens/clase-17-estandares-y-derechos-del-token.md) · [18. Permisos, distribución y necesidad](../../curriculum/08-tokens/clase-18-permisos-distribucion-y-necesidad.md) · [19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md) · [23. Propuestas, voto y ejecución](../../curriculum/11-dao-gobernanza/clase-23-propuestas-voto-y-ejecucion.md) · [24. Captura y gobernanza de emergencia](../../curriculum/11-dao-gobernanza/clase-24-captura-y-gobernanza-de-emergencia.md) · [31. Cuentas programables y actualizaciones](../../curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.md) · [32. MEV y arquitectura de producción](../../curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.md)

### Clases complementarias

[25. Familias de escalabilidad](../../curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.md) · [26. Riesgo operativo de una L2](../../curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [29. Compromisos y pruebas de conocimiento cero](../../curriculum/14-privacidad-zk/clase-29-compromisos-y-pruebas-de-conocimiento-cero.md) · [30. SNARK, STARK y privacidad real](../../curriculum/14-privacidad-zk/clase-30-snark-stark-y-privacidad-real.md) · [39. AMM, liquidez y formación de precio](../../curriculum/19-defi/clase-39-amm-liquidez-y-formacion-de-precio.md) · [40. Préstamo, colateral y riesgo DeFi](../../curriculum/19-defi/clase-40-prestamo-colateral-y-riesgo-defi.md) · [53. Custodia institucional de claves](../../curriculum/26-custodia-identidad/clase-53-custodia-institucional-de-claves.md) · [54. Identidad y autorización verificable](../../curriculum/26-custodia-identidad/clase-54-identidad-y-autorizacion-verificable.md)

### Laboratorios esenciales

[21. Anatomía de una transacción pública](../../labs/CATALOG.md) · [22. Selector ABI](../../labs/CATALOG.md) · [25. Storage, memory y calldata](../../labs/CATALOG.md) · [27. Vault: depósito y retiro](../../labs/CATALOG.md) · [28. Vault: fuzzing e invariantes](../../labs/CATALOG.md) · [32. ERC-20 con roles](../../labs/CATALOG.md) · [33. Allowance y permit](../../labs/CATALOG.md) · [36. Oráculo y dato obsoleto](../../labs/CATALOG.md) · [37. Reentrancia](../../labs/CATALOG.md) · [38. Control de acceso](../../labs/CATALOG.md) · [39. Manipulación de oráculo](../../labs/CATALOG.md) · [40. Repetición de firmas](../../labs/CATALOG.md)

### Laboratorios avanzados

[41. Front-running y commit-reveal](../../labs/CATALOG.md) · [42. Colisión de storage en proxy](../../labs/CATALOG.md) · [43. Auditoría completa del Vault](../../labs/CATALOG.md) · [44. Multisig y timelock](../../labs/CATALOG.md) · [47. Modelo de amenazas de puente](../../labs/CATALOG.md) · [48. Prueba ZK conceptual](../../labs/CATALOG.md) · [50. Capstone y defensa técnica](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Reconoce clases de vulnerabilidad |
| Aplicado | Resuelve retos 37–40 |
| Autónomo | Audita un contrato sin checklist paso a paso |
| Avanzado | Diseña propiedades y combina técnicas |
| Profesional integrador | Entrega informe, parche y retest defendibles |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### auditoría y remediación de un protocolo

Informe con alcance, invariantes, hallazgos, PoC local, parche y retest.

**Criterios de aceptación**

- alcance y limitaciones
- cada hallazgo reproduce impacto
- severidad justificada
- remediación comprobada sin regresión

**Consideración ética y de seguridad.** Solo objetivos autorizados; datos mínimos; divulgación coordinada.

## Evidencias y evaluación

### Evidencias de aprendizaje

- informe
- suite adversarial
- PoC local
- diff de remediación
- retest

### Métodos de evaluación

- hallazgo ciego
- calidad de PoC
- falsos positivos
- defensa de severidad

## Juicio profesional

### Errores frecuentes

- Confiar solo en scanners
- exagerar severidad
- probar en producción
- llamar certificado a un informe

### Seguridad, ética y normativa

- Autorización explícita
- no custodia de fondos
- reproducibilidad
- separación entre auditoría y garantía

### Diferencias frente a roles relacionados

- Frente a developer: independencia de revisión
- Frente a forensics: previene y valida código; forensics reconstruye hechos
- Security engineer puede abarcar nodos e infraestructura además de contratos

### Posibles especializaciones

- DeFi
- ZK y bridges
- Formal verification
- Wallets y account abstraction
- Protocol security

### Evolución profesional posible

- Revisor guiado
- auditor autónomo
- líder de engagement o protocol security engineer

## Cobertura y brechas

**Cobertura actual:** Completa y verificada.

- La verificación formal se documenta como ampliación; no existe laboratorio dedicado con una herramienta formal

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [Trail of Bits · Building Secure Contracts](https://secure-contracts.com/)
- [Solidity · Security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)
