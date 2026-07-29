# Planes de clase

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [👤 Kit docente](../instructor/README.md)

Planes listos para instructores. Cada módulo está pensado para **dos sesiones de 90
minutos** más trabajo autónomo. Este documento ofrece una plantilla de sesión, el mapa
de sesiones por módulo y planes completos de ejemplo con su minutaje. Ver también el
[syllabus](../instructor/syllabus.md) y el [kit docente](../instructor/README.md).

## Plantilla de sesión

Toda sesión se planifica con esta tabla: objetivo, actividad, tiempo y evidencia.

| Bloque | Tiempo | Actividad | Evidencia |
|---|---:|---|---|
| Apertura | 0–10 | Pregunta diagnóstica y objetivo | Respuestas iniciales |
| Modelo mental | 10–30 | Explicación y contraejemplo | Notas del estudiante |
| Demostración | 30–50 | El instructor ejecuta en vivo | Comandos reproducibles |
| Laboratorio | 50–75 | Práctica en parejas | Salida de laboratorio |
| Puesta en común | 75–85 | Explicación de resultados | Corrección de errores |
| Cierre | 85–90 | Ticket de salida | Decisión, riesgo y duda |

## Mapa de sesiones por módulo

| Módulo | Sesión A | Sesión B | Reto | Error que debe detectar |
|---:|---|---|---|---|
| 00 | confianza y coordinación | matriz de decisión | ADR 001 | usar blockchain por moda |
| 01 | hash y firmas | Merkle y custodia | prueba de inclusión | hash ≠ cifrado |
| 02 | replicación y particiones | P2P y Sybil | simulación de cinco nodos | descentralización binaria |
| 03 | PoW/PoS/BFT | finalidad y ataques | minería con dificultad | comparar solo por TPS |
| 04 | UTXO y scripts | nodos y Lightning | transacción regtest | dirección = persona |
| 05 | cuentas, gas y ABI | storage y eventos | decodificar calldata | estimación = costo garantizado |
| 06 | Solidity y CEI | Foundry, fuzz e invariantes | Vault | cobertura = corrección |
| 07 | RPC y wallet | UX de transacciones | interfaz funding | frontend = verdad |
| 08 | estándares | emisión y concentración | token responsable | token = producto |
| 09 | exploits técnicos | fallos económicos | tres CTF | auditoría = garantía |
| 10 | oráculos | indexación/IPFS | feed con fallback | dato firmado = dato verdadero |
| 11 | voto y delegación | multisig/timelock | propuesta | un token = una democracia |
| 12 | optimistic/ZK | disponibilidad y retiros | ADR L2 | TPS aislado |
| 13 | puentes | ecosistemas | threat model | "cross-chain" sin confianza |
| 14 | compromisos y pruebas | circuitos y metadatos | mayoría de edad | ZK = anonimato total |
| 15 | upgrades y MEV | operación/tokenomics | arquitectura final | desplegar = terminar |

Los módulos 16–18 (producción: infraestructura, empresa e implementación) usan la misma
plantilla con sesiones de laboratorio de operación y estudio de casos empresariales.

## Plan 1 · Fundamentos — Criptografía (módulo 01, Sesión A)

Objetivo: distinguir hash, cifrado y firma, y explicar por qué un hash prueba integridad.

| Tiempo | Actividad |
|---:|---|
| 0–10 | Diagnóstico: "¿un hash oculta el dato?" Recoger hipótesis |
| 10–30 | Modelo mental de función hash; romper la analogía "hash = cifrado" |
| 30–50 | Demo: calcular hashes, mostrar efecto avalancha y colisión intuitiva |
| 50–75 | Laboratorio en parejas: verificar integridad de un archivo alterado |
| 75–85 | Puesta en común: ¿por qué no se puede "descifrar" un hash? |
| 85–90 | Ticket de salida: un caso donde firmar ≠ cifrar |

## Plan 2 · Solidity — Vault seguro (módulo 06, Sesión A)

Objetivo: aplicar checks-effects-interactions y escribir un test de reentrancia.

| Tiempo | Actividad |
|---:|---|
| 0–10 | Diagnóstico: ¿dónde puede reingresar un atacante? |
| 10–30 | CEI y patrón pull-over-push con contraejemplo vulnerable |
| 30–50 | Demo: `forge test` mostrando un exploit de reentrancia que falla el test |
| 50–75 | Laboratorio: corregir el contrato y hacer pasar el test |
| 75–85 | Puesta en común: por qué el guard es defensa en profundidad |
| 85–90 | Ticket de salida: invariante del Vault en una frase |

## Plan 3 · Seguridad — CTF de exploits (módulo 09, Sesión A)

Objetivo: pensar como atacante y documentar un hallazgo con impacto y mitigación.

| Tiempo | Actividad |
|---:|---|
| 0–10 | Diagnóstico: enumerar la superficie de ataque de un contrato dado |
| 10–30 | Taxonomía de exploits técnicos con casos reales |
| 30–50 | Demo: resolver un reto guiado paso a paso |
| 50–75 | Laboratorio: resolver un segundo reto en parejas |
| 75–85 | Puesta en común: redactar el hallazgo (impacto, probabilidad, mitigación) |
| 85–90 | Ticket de salida: qué control habría prevenido el exploit |

## Plan 4 · Empresa — Blockchain empresarial (módulo 17, Sesión A)

Objetivo: decidir entre red pública, permisionada o base de datos para un caso real.

| Tiempo | Actividad |
|---:|---|
| 0–10 | Diagnóstico: ¿este caso necesita descentralización? |
| 10–30 | Criterios: confianza, partes, regulación, rendimiento |
| 30–50 | Demo: recorrer una matriz de decisión con un caso de trazabilidad |
| 50–75 | Laboratorio: completar la matriz para un caso propio |
| 75–85 | Puesta en común: defender la decisión ante objeciones |
| 85–90 | Ticket de salida: el riesgo principal de la opción elegida |

## Trabajo autónomo

El estudiante entrega comandos usados, resultado esperado/obtenido, explicación, riesgo
encontrado y siguiente experimento. Una captura sola no es evidencia suficiente.

## Recursos relacionados

- [Kit docente](../instructor/README.md) · [Syllabus](../instructor/syllabus.md)
- [Diseño pedagógico](diseno-pedagogico.md) · [Evaluación](evaluacion.md)
