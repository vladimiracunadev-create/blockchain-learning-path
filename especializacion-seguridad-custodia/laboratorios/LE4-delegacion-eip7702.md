# LE4 · Implementar una delegación EIP-7702 en una red de laboratorio

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE3](LE3-transferencias-simuladas.md) · ➡️ [LE5 · Detector](LE5-detector-delegaciones.md) · [Bloque 2](../bloques/02-cuentas-contratos-y-abstraccion.md) · [Bloque 4](../bloques/04-delegacion-de-permisos.md)

**Nivel:** avanzado · **Duración:** 90–120 min · **Código:** [le4-delegacion-eip7702.mjs](../../labs/especializacion-seguridad/le4-delegacion-eip7702.mjs) · **Pruebas:** 11 (más 25 de la red y 18 del núcleo)

## Prerrequisitos

- LE1 a LE3, [bloque 2](../bloques/02-cuentas-contratos-y-abstraccion.md) y [bloque 4](../bloques/04-delegacion-de-permisos.md).
- Haber leído la sección «Cómo funciona» de EIP-7702 en el bloque 2.

## Teoría

EIP-7702 permite que una EOA adopte el código de un contrato escribiendo en su campo de código el **designador** `0xef0100 ‖ dirección`. La cuenta conserva su clave, su saldo y su almacenamiento; cambia **quién puede ordenarle qué**, según el contrato delegado.

La red procesa una lista de autorizaciones **en orden**, antes de ejecutar la transacción y después de incrementar el nonce del remitente. Para cada tupla comprueba (entre otras cosas) la cadena, que la firma sea canónica y que el **nonce de la cuenta coincida con el de la tupla**. Si todo cuadra, instala el designador y **avanza el nonce**. Las tuplas inválidas se **omiten** sin invalidar la transacción, y si una cuenta aparece varias veces **gana la última válida**.

Tres hechos que este laboratorio demuestra:

1. La delegación **persiste** hasta que se firme otra.
2. La autorización es una **firma suelta**: la puede publicar un tercero, que paga el gas.
3. El **orden** de una lista de nonces consecutivos decide cuántas se aplican.

> **Este laboratorio no despliega nada en ninguna red real.** Los "contratos delegados" son objetos JavaScript sobre una red simulada; el delegado hostil es una función de dos transferencias que solo existe para enseñar la forma del daño y su detección.

## Instrucciones

1. Ejecuta el laboratorio completo:

   ```bash
   node labs/especializacion-seguridad/le4-delegacion-eip7702.mjs
   ```

2. **Ciclo de vida legítimo.** Sigue en el código `escenarioDelegacionLegitima`: antes (`0x`), tras delegar (`0xef0100…`), uso del lote por la propia cuenta, intento de un intruso (revierte) y revocación (vuelve a `0x`).
3. **Nonce del remitente-autoridad.** Cuando el dueño envía su propia autorización, esta debe llevar su nonce de transacción **+ 1**. Pruébalo con el nonce actual y comprueba que queda inerte.
4. **Patrocinio.** Ejecuta `escenarioPatrocinio` y observa que la repetición de la misma instrucción revierte por el nonce interno.
5. **Ventana de nonces.** Ejecuta `escenarioVentanaDeNonces` con `orden: "descendente"` y con `orden: "ascendente"` y tamaño 10. Anota cuántas se aplican y cuánto salta el nonce.
6. **Delegado hostil simulado.** Ejecuta `escenarioDelegadoHostil` y comprueba que un segundo barrido, con fondos depositados después, no necesita ninguna firma nueva.
7. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le4-delegacion-eip7702.test.mjs
   ```

## Código comentado

- `crearEntorno`: tres billeteras de prueba, un contrato delegado registrado, un token con saldo para el dueño.
- `autorizar(red, autoridad, direccion, { nonce, chainId })`: firma `0x05 ‖ rlp([chain_id, address, nonce])`.
- `publicarAutorizaciones`: envía la transacción tipo 4; quien la firma paga el gas y puede ser un tercero.
- `escenarioDelegacionLegitima`, `escenarioPatrocinio`, `escenarioVentanaDeNonces`, `escenarioDelegadoHostil`: cuatro experimentos que devuelven recibos y estados para comparar.
- En la red, `#procesarAutorizaciones` implementa los pasos de la especificación y devuelve, por tupla, `{ autoridad, aplicada, motivo }`.
- `LoteSeguro` (solo la propia cuenta) y `PatrocinioFirmado` (firma ligada a cadena, cuenta, nonce interno y contenido) son los dos patrones **seguros**; `crearBarredorSimulado` es el contraste.

La diferencia entre el delegado seguro y el hostil es **una línea de control de acceso**: quién puede ordenar.

## Pruebas

Designador instalado; dos nonces consumidos al autodelegar; lote propio frente a intruso; revocación; patrocinio con nonce interno; ventana descendente (una de 50), ventana ascendente (varias y salto de nonce); dependencia del orden; barrido persistente; autoridad distinta del remitente.

## Resultados esperados

```text
Antes:        0x nonce 0n
Delegada:     0xef010000000000000000000000000000000000000de1e9 → 0x00000000000000000000000000000000000de1e9
Lote propio:  exito | intruso: revertida (solo la propia cuenta puede ordenar el lote)
Revocada:     0x

Ventana descendente: 1 aplicadas, 9 inertes, el nonce saltó 1
Ventana ascendente: 6 aplicadas, 4 inertes, el nonce saltó 6

Patrocinio: exito → repetición: revertida
```

Con 50 autorizaciones y un nonce real de 30, el orden descendente aplica **una** y deja 49 inertes; el ascendente encadena las que coinciden. Este resultado es la razón de que el orden de la lista del [caso real](../bloques/09-caso-binance-2026-10-29.md) sea el desconocido U4.

## Ejercicios adicionales

1. **Cuenta de custodia.** ¿Qué cambia si la autoridad es una billetera caliente y quien envía es una cuenta recién creada? Descríbelo con las propiedades del bloque 4.
2. **`chain_id = 0`.** Firma una autorización con `chainId: 0n` y comprueba que se aplica. Explica el riesgo si esa firma se filtra.
3. **Orden mixto.** Construye una lista con nonces desordenados (por ejemplo 34, 30, 31, 29) y predice cuántas se aplican con nonce real 30.
4. **Salto de nonce como señal.** Tras la ventana ascendente, calcula cuántas transacciones "propias" tendría que haber enviado la cuenta para justificar su nonce.

## Soluciones

1. El remitente no es la autoridad, así que la billetera no envía nada y un monitor de "transacciones enviadas" no ve la delegación. Se detecta por el **cambio de código** y el **salto de nonce**.
2. Se aplica en cualquier red donde el nonce coincida. Una firma filtrada sirve entonces en todas las redes a la vez; por eso solo debe aceptarse hacia delegados aprobados.
3. Se procesa en orden: `34` (nonce 30 ≠ 34, omitida), `30` (aplica, nonce → 31), `31` (aplica, nonce → 32), `29` (29 ≠ 32, omitida). **Se aplican dos.**
4. Cero: el salto de seis no corresponde a ninguna transacción propia. Un nonce on-chain superior al registrado internamente es exactamente la regla `R-NONCE` de [LE8](LE8-monitor-riesgos-custodio.md).

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE3](LE3-transferencias-simuladas.md) · ➡️ [LE5 · Detector](LE5-detector-delegaciones.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
