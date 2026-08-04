# Guías 31–40 · Profesional y seguridad

Este cuaderno pasa de construir a atacar y defender: tokens con roles, allowance, oráculos y las vulnerabilidades clásicas con su exploit y su corrección. Acompaña a los módulos [tokens](../../curriculum/08-tokens/README.md) y [seguridad](../../curriculum/09-seguridad/README.md).

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Cada vulnerabilidad se demuestra dos veces: un PoC que la explota y un parche con prueba de regresión. Sin exploit reproducible no hay evidencia.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 31 | Estados de una transacción | máquina de estados | diagrama de 8 estados |
| 32 | ERC-20 con roles | Foundry | pruebas de `labs/08-protocols` |
| 33 | Allowance y permit | threat model | aprobación exacta + permit |
| 34 | ERC-721 y metadatos | contrato | metadata mutable/inmutable |
| 35 | Indexador de eventos | servicio | `apps/event-indexer` reanudable |
| 36 | Oráculo y dato obsoleto | pruebas | rango + circuit breaker |
| 37 | Reentrancia | exploit + fix | atacante + CEI/guard + regresión |
| 38 | Control de acceso | exploit + fix | toma de control + two-step |
| 39 | Manipulación de oráculo | exploit + fix | spot vs. TWAP |
| 40 | Repetición de firmas | exploit + fix | dominio + nonce + deadline |

## 31 · Estados de una transacción

- **Objetivo:** modelar el ciclo de vida completo de una transacción.
- **Cómo se resuelve:**
  1. Define ocho estados: preparado, simulado, esperando firma, rechazado, enviado, reemplazado, confirmado y revertido.
  2. Traza las transiciones válidas (p. ej. enviado → reemplazado por fee-bump; enviado → revertido).
  3. Marca los estados terminales y los reintentables.
- **Estructura de la respuesta:** máquina de estados con transiciones etiquetadas.
- **Criterio de aceptación:** incluye reemplazo (RBF) y revertido como caminos distintos de confirmado.
- **Error común:** tratar "enviado" como final → aún puede reemplazarse o revertir.
- **Verificación ejecutable:** `pnpm lab:tx` imprime la máquina de estados y `node --test labs/07-dapps/tx-lifecycle.test.mjs` comprueba que desde `pendiente` hay cuatro finales posibles y que ningún estado se queda sin salida.

## 32 · ERC-20 con roles

- **Objetivo:** verificar suministro, roles y transferencia de un token.
- **Cómo se resuelve:**
  1. Ejecuta las pruebas del token en `labs/08-protocols`.
  2. Comprueba el suministro inicial, que solo el rol autorizado acuña/quema y que las transferencias respetan balances.
  3. Anota qué ocurre cuando una cuenta sin rol intenta una acción privilegiada (revert).
- **Estructura de la respuesta:** salida de pruebas + tabla `acción | rol requerido | resultado sin rol`.
- **Criterio de aceptación:** verifica suministro, roles y transferencia con pruebas que pasan.
- **Error común:** conceder mint a cualquiera → inflación no controlada.

## 33 · Allowance y permit

- **Objetivo:** demostrar el riesgo de la aprobación ilimitada y su mitigación.
- **Cómo se resuelve:**
  1. Aprueba `type(uint256).max` a un contrato y muestra que puede vaciar el saldo aprobado en cualquier momento.
  2. Propón tres controles: aprobación exacta, revocación (`approve(0)`) y `permit` con nonce y deadline.
  3. Explica por qué `permit` evita una transacción previa de aprobación.
- **Estructura de la respuesta:** threat model con activo, amenaza (allowance persistente) y los tres controles.
- **Criterio de aceptación:** propone aprobación exacta, revocación y permit con nonce/deadline.
- **Error común:** aprobar ilimitado "por comodidad" → la allowance sobrevive a la operación.
- **Verificación ejecutable:** `node --test labs/07-dapps/token-amounts.test.mjs` comprueba que una allowance infinita expone el saldo entero y que lo recomendable es autorizar exactamente lo necesario.

## 34 · ERC-721 y metadatos

- **Objetivo:** decidir qué representa realmente un NFT y dónde vive su metadata.
- **Cómo se resuelve:**
  1. Diseña dos variantes: metadata mutable (URI cambiable) e inmutable (hash on-chain o IPFS fijo).
  2. Analiza disponibilidad (¿quién sirve la imagen?), propiedad intelectual y qué otorga el token.
  3. Concluye qué garantiza on-chain y qué depende de un servidor externo.
- **Estructura de la respuesta:** contrato + nota que separe "el token" de "el contenido apuntado".
- **Criterio de aceptación:** explica disponibilidad, propiedad intelectual y qué representa el token.
- **Error común:** creer que poseer el NFT es poseer la imagen → solo posees el apuntador.

## 35 · Indexador de eventos

- **Objetivo:** construir un indexador que reanude sin perder ni duplicar eventos.
- **Cómo se resuelve:**
  1. Ejecuta `apps/event-indexer` y deja que persista el último bloque procesado.
  2. Detén el proceso, genera nuevos eventos y reanuda.
  3. Verifica que retoma desde el último bloque persistido, sin releer ni saltar.
- **Estructura de la respuesta:** servicio con checkpoint + evidencia de reanudación idempotente.
- **Criterio de aceptación:** reanuda desde el último bloque persistido sin duplicar.
- **Error común:** guardar el checkpoint antes de procesar → se pierden eventos si cae en medio.

## 36 · Oráculo y dato obsoleto

- **Objetivo:** proteger un consumidor de precios inválidos u obsoletos.
- **Cómo se resuelve:**
  1. Prueba cuatro casos: precio válido, cero, obsoleto (timestamp viejo) y actualización no autorizada.
  2. Añade validación de rango y un circuit breaker que rechace datos fuera de banda o vencidos.
  3. Confirma que el consumidor revierte ante cada caso inválido.
- **Estructura de la respuesta:** pruebas de los cuatro casos + la lógica de rango y breaker.
- **Criterio de aceptación:** rechaza cero, obsoleto y no autorizado; acepta solo el válido en rango.
- **Error común:** confiar en el último precio sin mirar su timestamp → dato obsoleto usado como fresco.

## 37 · Reentrancia

- **Objetivo:** reproducir un drenaje por reentrancia y corregirlo.
- **Cómo se resuelve:**
  1. Escribe un contrato atacante local cuyo `receive` vuelva a llamar a `withdraw`.
  2. Reproduce el drenaje del saldo antes de que el balance se actualice.
  3. Aplica Checks-Effects-Interactions y/o un guard de reentrancia; añade una prueba de regresión.
- **Estructura de la respuesta:** PoC del drenaje + parche + test que falla sin el fix y pasa con él.
- **Criterio de aceptación:** el exploit drena antes del fix y la regresión lo bloquea después.
- **Error común:** poner el guard pero seguir transfiriendo antes de actualizar estado → sigue vulnerable a otras rutas.

## 38 · Control de acceso

- **Objetivo:** tomar control de un contrato mal protegido y corregirlo.
- **Cómo se resuelve:**
  1. Identifica una función privilegiada sin verificación de rol y toma el control (cambia el owner).
  2. Corrige con verificación de rol y una transferencia de propiedad en dos pasos (propose/accept).
  3. Verifica que la transferencia en dos pasos impide capturas por dirección errónea.
- **Estructura de la respuesta:** exploit de toma de control + fix con two-step ownership.
- **Criterio de aceptación:** verifica la transferencia en dos pasos en la corrección.
- **Error común:** `transferOwnership` en un paso a una dirección equivocada → propiedad perdida.

## 39 · Manipulación de oráculo

- **Objetivo:** mostrar cómo un precio spot manipulable rompe un protocolo.
- **Cómo se resuelve:**
  1. Modela un préstamo que valora colateral con el precio spot de un pool.
  2. Manipula el spot con un swap grande (préstamo temporal) y extrae valor.
  3. Compara mitigaciones: TWAP y fuente externa, con las nuevas confianzas que introduce cada una.
- **Estructura de la respuesta:** simulación del ataque + comparación spot vs. TWAP vs. externo.
- **Criterio de aceptación:** compara TWAP y fuente externa con sus nuevos supuestos de confianza.
- **Error común:** usar el spot de un pool de baja liquidez → barato de mover en un bloque.

## 40 · Repetición de firmas

- **Objetivo:** impedir que una firma válida se reutilice.
- **Cómo se resuelve:**
  1. Intenta repetir una firma en el mismo contrato, en otro contrato y en otro chain ID.
  2. Observa qué repeticiones tienen éxito sin protección.
  3. Añade separación de dominio (EIP-712), nonce y deadline; vuelve a intentar los tres casos.
- **Estructura de la respuesta:** exploit de replay + fix con dominio, nonce y deadline.
- **Criterio de aceptación:** la aceptación exige dominio, nonce y deadline verificados.
- **Error común:** firmar sin chain ID en el dominio → la firma se replica entre redes.

## 🧭 Navegación

- Anterior: [Guías 21–30 · EVM y desarrollo](03-evm-development.md)
- Siguiente: [Guías 41–50 · Avanzado y capstone](05-advanced-capstone.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md)
