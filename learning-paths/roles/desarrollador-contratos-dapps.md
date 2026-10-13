# Desarrollador/a de contratos inteligentes y dApps

> [← Rutas por rol](../README.md) · [Matriz de trazabilidad](../TRACEABILITY.md) · Revisión: **2026-10-12**

<div class="route-progress" data-route-classes="curriculum/00-orientacion/clase-01-que-problema-intenta-resolver-blockchain.html,curriculum/00-orientacion/clase-02-decidir-y-comunicar-sin-vender-humo.html,curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.html,curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.html,curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.html,curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.html,curriculum/03-consenso/clase-07-elegir-un-historial-valido.html,curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.html,curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.html,curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.html,curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.html,curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.html,curriculum/06-solidity-foundry/clase-13-diseno-de-contratos-e-invariantes.html,curriculum/06-solidity-foundry/clase-14-pruebas-profundas-con-foundry.html,curriculum/07-dapps/clase-15-lecturas-rpc-y-estado-de-interfaz.html,curriculum/07-dapps/clase-16-firmas-y-experiencia-transaccional.html,curriculum/08-tokens/clase-17-estandares-y-derechos-del-token.html,curriculum/08-tokens/clase-18-permisos-distribucion-y-necesidad.html,curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.html,curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.html,curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.html,curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.html">El progreso se calcula localmente con las clases marcadas como leídas.</div>

## Identidad y propósito

**Denominaciones habituales en inglés:** Smart Contract Developer, Blockchain Developer, Web3 Full Stack Developer, dApp Developer.

Construye lógica on-chain y las interfaces, indexadores e integraciones que permiten usarla. El rol no termina al compilar: especifica invariantes, prueba estados adversos y documenta despliegue y operación.

**Propósito organizacional.** Entregar aplicaciones verificables que gestionen estado y valor sin ocultar al usuario qué firma, qué puede fallar ni quién conserva privilegios.

**Títulos y especializaciones agrupados:** Blockchain Developer, Smart Contract Developer, Web3 Full Stack Developer, dApp Developer.

## Responsabilidades y trabajo cotidiano

### Responsabilidades

- Traducir reglas de negocio a contratos y estados explícitos
- Implementar pruebas unitarias, fuzzing e invariantes
- Integrar wallet, RPC, eventos e indexador
- Preparar despliegues reproducibles y remediar hallazgos

### Actividades cotidianas

- Revisar especificaciones y pull requests
- Escribir contratos, clientes y pruebas
- Simular transacciones y fallos
- Coordinar con seguridad, producto e infraestructura

### Entornos de desempeño

- Protocolos y dApps
- Wallets y plataformas Web3
- Fintech y equipos de integración
- Proyectos open source

## Base de entrada

### Conocimientos básicos

- Programación y pruebas
- Git y línea de comandos
- Modelos UTXO y cuentas
- Firmas, ABI, gas y eventos

### Requisitos previos

- Completar el tronco común 1–12
- Poder leer JavaScript/TypeScript
- No usar claves ni fondos reales en ejercicios

## Competencias

### Técnicas

- Solidity y EVM
- Foundry
- TypeScript y viem
- Diseño de APIs e indexadores
- Seguridad de permisos y upgrades

### No técnicas

- Escritura de especificaciones
- Revisión por pares
- Comunicación de riesgo
- Disciplina de cambios

### Herramientas y tecnologías

- Solidity
- Foundry/Anvil
- OpenZeppelin Contracts
- viem
- Node.js/pnpm
- GitHub Actions

## Recorrido curricular reutilizable

### Clases obligatorias recomendadas

[1. Qué problema intenta resolver blockchain](../../curriculum/00-orientacion/clase-01-que-problema-intenta-resolver-blockchain.md) · [2. Decidir y comunicar sin vender humo](../../curriculum/00-orientacion/clase-02-decidir-y-comunicar-sin-vender-humo.md) · [3. Hashes, integridad y compromisos](../../curriculum/01-criptografia/clase-03-hashes-integridad-y-compromisos.md) · [4. Firmas, claves y ciclo de vida](../../curriculum/01-criptografia/clase-04-firmas-claves-y-ciclo-de-vida.md) · [5. Replicación, latencia y fallas](../../curriculum/02-sistemas-distribuidos/clase-05-replicacion-latencia-y-fallas.md) · [6. Redes P2P y adversarios](../../curriculum/02-sistemas-distribuidos/clase-06-redes-p2p-y-adversarios.md) · [7. Elegir un historial válido](../../curriculum/03-consenso/clase-07-elegir-un-historial-valido.md) · [8. PoW, PoS y BFT bajo amenaza](../../curriculum/03-consenso/clase-08-pow-pos-y-bft-bajo-amenaza.md) · [9. UTXO y anatomía de una transacción](../../curriculum/04-bitcoin/clase-09-utxo-y-anatomia-de-una-transaccion.md) · [10. Verificación, minería y operación segura](../../curriculum/04-bitcoin/clase-10-verificacion-mineria-y-operacion-segura.md) · [11. Cuentas, estado y transacciones Ethereum](../../curriculum/05-ethereum-evm/clase-11-cuentas-estado-y-transacciones-ethereum.md) · [12. EVM, ABI y costo de ejecución](../../curriculum/05-ethereum-evm/clase-12-evm-abi-y-costo-de-ejecucion.md) · [13. Diseño de contratos e invariantes](../../curriculum/06-solidity-foundry/clase-13-diseno-de-contratos-e-invariantes.md) · [14. Pruebas profundas con Foundry](../../curriculum/06-solidity-foundry/clase-14-pruebas-profundas-con-foundry.md) · [15. Lecturas, RPC y estado de interfaz](../../curriculum/07-dapps/clase-15-lecturas-rpc-y-estado-de-interfaz.md) · [16. Firmas y experiencia transaccional](../../curriculum/07-dapps/clase-16-firmas-y-experiencia-transaccional.md) · [17. Estándares y derechos del token](../../curriculum/08-tokens/clase-17-estandares-y-derechos-del-token.md) · [18. Permisos, distribución y necesidad](../../curriculum/08-tokens/clase-18-permisos-distribucion-y-necesidad.md) · [19. Modelado de amenazas y revisión manual](../../curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.md) · [20. Auditoría reproducible y remediación](../../curriculum/09-seguridad/clase-20-auditoria-reproducible-y-remediacion.md) · [21. Oráculos y calidad del dato](../../curriculum/10-oraculos-indexacion/clase-21-oraculos-y-calidad-del-dato.md) · [22. Eventos, indexación y disponibilidad](../../curriculum/10-oraculos-indexacion/clase-22-eventos-indexacion-y-disponibilidad.md)

### Clases complementarias

[23. Propuestas, voto y ejecución](../../curriculum/11-dao-gobernanza/clase-23-propuestas-voto-y-ejecucion.md) · [24. Captura y gobernanza de emergencia](../../curriculum/11-dao-gobernanza/clase-24-captura-y-gobernanza-de-emergencia.md) · [25. Familias de escalabilidad](../../curriculum/12-escalabilidad/clase-25-familias-de-escalabilidad.md) · [26. Riesgo operativo de una L2](../../curriculum/12-escalabilidad/clase-26-riesgo-operativo-de-una-l2.md) · [27. Mensajes y activos entre cadenas](../../curriculum/13-interoperabilidad/clase-27-mensajes-y-activos-entre-cadenas.md) · [28. Modelo de amenazas de puentes](../../curriculum/13-interoperabilidad/clase-28-modelo-de-amenazas-de-puentes.md) · [31. Cuentas programables y actualizaciones](../../curriculum/15-arquitectura-avanzada/clase-31-cuentas-programables-y-actualizaciones.md) · [32. MEV y arquitectura de producción](../../curriculum/15-arquitectura-avanzada/clase-32-mev-y-arquitectura-de-produccion.md) · [37. Integración end-to-end](../../curriculum/18-implementacion-empresarial/clase-37-integracion-end-to-end.md) · [38. Paso a producción y operación](../../curriculum/18-implementacion-empresarial/clase-38-paso-a-produccion-y-operacion.md)

### Laboratorios esenciales

[21. Anatomía de una transacción pública](../../labs/CATALOG.md) · [22. Selector ABI](../../labs/CATALOG.md) · [23. Codificación de calldata](../../labs/CATALOG.md) · [24. Eventos y topics](../../labs/CATALOG.md) · [25. Storage, memory y calldata](../../labs/CATALOG.md) · [26. Estimación y comparación de gas](../../labs/CATALOG.md) · [27. Vault: depósito y retiro](../../labs/CATALOG.md) · [28. Vault: fuzzing e invariantes](../../labs/CATALOG.md) · [29. Cliente de lectura con viem](../../labs/CATALOG.md) · [30. Flujo seguro de conexión de wallet](../../labs/CATALOG.md) · [31. Estados de una transacción](../../labs/CATALOG.md) · [32. ERC-20 con roles](../../labs/CATALOG.md) · [33. Allowance y permit](../../labs/CATALOG.md) · [35. Indexador de eventos](../../labs/CATALOG.md) · [36. Oráculo y dato obsoleto](../../labs/CATALOG.md)

### Laboratorios avanzados

[37. Reentrancia](../../labs/CATALOG.md) · [38. Control de acceso](../../labs/CATALOG.md) · [39. Manipulación de oráculo](../../labs/CATALOG.md) · [40. Repetición de firmas](../../labs/CATALOG.md) · [41. Front-running y commit-reveal](../../labs/CATALOG.md) · [42. Colisión de storage en proxy](../../labs/CATALOG.md) · [43. Auditoría completa del Vault](../../labs/CATALOG.md) · [46. Comparación de rollups](../../labs/CATALOG.md) · [47. Modelo de amenazas de puente](../../labs/CATALOG.md) · [50. Capstone y defensa técnica](../../labs/CATALOG.md)

## Niveles de desempeño demostrado

| Nivel | Evidencia observable |
|---|---|
| Fundamental | Explica EVM, ABI, gas y estados de una transacción |
| Aplicado | Completa prácticas 21–30 con resultados interpretados |
| Autónomo | Construye una feature sin receta y corrige un fallo |
| Avanzado | Diseña invariantes, upgrades y observabilidad |
| Profesional integrador | Entrega y defiende la dApp integral |

Estos niveles describen aprendizaje demostrado; no equivalen a antigüedad, seniority ni experiencia laboral real.

## Proyecto profesional integrador

### dApp integral con contrato verificable

Contrato, interfaz e indexador local con modelo de amenazas, invariantes, estados de transacción y despliegue reproducible.

**Criterios de aceptación**

- pruebas unitarias, fuzzing e invariantes en verde
- la interfaz distingue simulación, firma, pendiente y finalidad
- roles, upgrades y dependencias quedan documentados
- un tercero puede reproducir build y demo

**Consideración ética y de seguridad.** Sin mainnet, fondos ni claves reales; consentimiento legible antes de firmar.

## Evidencias y evaluación

### Evidencias de aprendizaje

- Repositorio reproducible
- salida de pruebas
- threat model
- demo y ADR
- manual de despliegue y rollback

### Métodos de evaluación

- Revisión de código
- ejecución limpia desde cero
- prueba adversarial
- defensa oral de trade-offs

## Juicio profesional

### Errores frecuentes

- Copiar contratos sin entender privilegios
- probar solo la ruta feliz
- confundir confirmación con finalidad
- hacer que la UI oculte el efecto firmado

### Seguridad, ética y normativa

- Mínimo privilegio y timelock
- dependencias fijadas y auditables
- ninguna promesa financiera
- pruebas locales antes de cualquier testnet

### Diferencias frente a roles relacionados

- Frente a protocol engineer: trabaja principalmente sobre una red existente
- Frente a auditor: entrega el sistema; la revisión independiente conserva separación
- Frente a frontend Web2: cada firma puede mover valor de forma irreversible

### Posibles especializaciones

- Contratos EVM
- Frontend Web3
- Account abstraction
- Indexación e integraciones
- Move, Solana/Rust o Soroban tras dominar diferencias de ejecución

### Evolución profesional posible

- Contribuidor de dApp
- responsable de un contrato o integración
- líder técnico de producto on-chain

## Cobertura y brechas

**Cobertura actual:** Completa y verificada.

- El currículo EVM es profundo; Move, Solana/Rust y Soroban quedan como especializaciones comparativas, no como dominio demostrado

La cobertura sólo se considera completa cuando hay contenido suficiente y evidencia evaluable; una mención temática no cuenta como dominio.

## Fuentes utilizadas

- [Ethereum · Smart contracts](https://ethereum.org/developers/docs/smart-contracts/)
- [Solidity · Security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
