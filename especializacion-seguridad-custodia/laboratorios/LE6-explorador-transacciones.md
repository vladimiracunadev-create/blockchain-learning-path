# LE6 · Crear un explorador de transacciones públicas

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE5](LE5-detector-delegaciones.md) · ➡️ [LE7 · Flujos](LE7-flujos-multidireccion.md) · [Bloque 7](../bloques/07-analisis-de-transacciones-eventos-y-logs.md)

**Nivel:** avanzado · **Duración:** 90–120 min · **Código:** [le6-explorador-transacciones.mjs](../../labs/especializacion-seguridad/le6-explorador-transacciones.mjs) · **Pruebas:** 15

## Prerrequisitos

- LE3 y LE4, y el [bloque 7](../bloques/07-analisis-de-transacciones-eventos-y-logs.md).
- Conocer las llamadas básicas de JSON-RPC ([documentación de Ethereum.org](https://ethereum.org/en/developers/docs/apis/json-rpc/)).

## Teoría

Un explorador es una **vista** sobre un nodo. Para verificar un incidente hay que poder reconstruir esa vista desde el nodo. Este explorador hace tres cosas que los exploradores genéricos suelen ocultar en transacciones EIP-7702:

1. **Recupera la autoridad** de cada autorización desde su firma (el RPC solo entrega `r`, `s` y `yParity`).
2. **Distingue "firmó" de "aplicó".** El RPC básico no informa qué tupla surtió efecto; se infiere contrastando con el código **actual** de la cuenta (`eth_getCode`).
3. **Decodifica los eventos `Transfer`** sin suponer que el token es honesto.

La arquitectura separa el **transporte** (de dónde vienen los datos) de la **exploración** (qué se hace con ellos). El transporte por defecto es una red de laboratorio; uno HTTP opcional apunta a un nodo público.

## Instrucciones

1. Ejecuta el explorador en modo laboratorio (sin red):

   ```bash
   node labs/especializacion-seguridad/le6-explorador-transacciones.mjs
   ```

2. Lee la salida: la transacción tipo 4, cuya `autoridad` es distinta del remitente, con sus advertencias; la cuenta delegada con su `delegadoA`; y la línea de tiempo de bloques.
3. Comprueba que `efectoVigenteHoy` dice "sí" mientras la cuenta siga delegada. Revoca la delegación en una copia del escenario y comprueba que cambia.
4. **Modo en vivo (opcional).** Contra un nodo público de **tu elección**:

   ```bash
   node labs/especializacion-seguridad/le6-explorador-transacciones.mjs --rpc https://TU-NODO-PUBLICO --direccion 0xTU_DIRECCION
   node labs/especializacion-seguridad/le6-explorador-transacciones.mjs --rpc https://TU-NODO-PUBLICO --tx 0xHASH
   ```

   > **Seguridad.** No pegues claves privadas ni semillas. No uses una URL con una clave de API en la ruta: el explorador rechaza credenciales en la URL, pero una clave en la ruta se imprimiría en tu bitácora. El modo en vivo envía consultas de **solo lectura**.
5. Ejecuta las pruebas (no usan red; el transporte HTTP se prueba con un `fetch` simulado):

   ```bash
   node --test labs/especializacion-seguridad/le6-explorador-transacciones.test.mjs
   ```

## Código comentado

- `crearTransporteSimulado(red)`: responde los métodos `eth_chainId`, `eth_blockNumber`, `eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getTransactionByHash`, `eth_getTransactionReceipt`, `eth_getBlockByNumber` y `eth_getLogs` con las **mismas formas** que un nodo real (campos en hexadecimal, `authorizationList` en transacciones tipo 4).
- `crearTransporteHttp(url, { fetchImpl })`: solo `http(s)`, sin credenciales en la URL, errores HTTP y de RPC propagados, sin reintentos silenciosos.
- `explorarTransaccion`: decodifica, recupera la autoridad de cada tupla con `recuperarAutoridad`, contrasta con `eth_getCode` y emite advertencias.
- `explorarDireccion` / `clasificarCodigo`: distingue EOA, EOA delegada y contrato.
- `historialDeToken`: usa `eth_getLogs` filtrando por el topic de `Transfer` y la dirección como emisor y como receptor, sin duplicar.
- `lineaDeTiempo`: recorre bloques en orden con su marca de tiempo.

## Pruebas

Autoridad distinta del remitente; "firmó" frente a "aplicó"; autorización sin efecto actual; clasificación por código; cuenta delegada; decodificación de eventos; historial sin duplicados; hash inexistente devuelve `null`; línea de tiempo ordenada; conciliación del saldo del token con los eventos; registros ajenos ignorados; método no soportado; transporte HTTP con esquema y credenciales; petición JSON-RPC 2.0; propagación de errores HTTP y RPC.

## Resultados esperados

Para el escenario de delegado hostil simulado:

```text
tipo: 4
autorizaciones[0].autoridad  → la cuenta del dueño (distinta del remitente)
autorizaciones[0].efectoVigenteHoy → "sí: la cuenta sigue delegada a este contrato"
advertencias:
  - Transacción tipo 4: la autoridad que delega NO es necesariamente el remitente.
  - Hay autorizaciones firmadas por cuentas distintas del remitente: alguien pagó el gas de una delegación ajena.
Cuenta delegada: tipo 'EOA delegada (EIP-7702)', nonce 1n
```

Los hash, direcciones y marcas de tiempo del escenario son **deterministas**: dos ejecuciones dan la misma salida.

## Ejercicios adicionales

1. **Ventana de nonces.** Aplica el explorador a una transacción con varias autorizaciones de la misma cuenta. ¿Qué advertencia debe aparecer?
2. **Eventos falsos.** Añade un registro `Transfer` emitido por un contrato que no es el token y comprueba cómo lo trata `decodificarTransferencias`. ¿Qué verificación adicional haría falta?
3. **Cuenta desconocida.** ¿Qué devuelve `explorarDireccion` para una dirección que nunca apareció?
4. **Contrastar con un explorador público.** En modo en vivo, compara el remitente que muestra un explorador con el que recupera tu herramienta desde la firma.

## Soluciones

1. «Varias autorizaciones de la misma cuenta: solo las que coinciden con su nonce en orden pueden haberse aplicado».
2. El decodificador solo comprueba la forma (tres topics, el hash del evento) y **no** el emisor; devuelve el evento con su `token` (la dirección emisora). La verificación adicional es comprobar que ese `token` es el contrato esperado y que el evento coincide con la variación de saldos ([bloque 7](../bloques/07-analisis-de-transacciones-eventos-y-logs.md)).
3. Saldo 0, nonce 0, código `0x` y tipo `EOA`: no se puede distinguir una cuenta nunca usada de una inexistente.
4. Deben coincidir. Si no, hay un error de transcripción o el explorador no usa la misma red; ambos casos exigen investigar antes de citar el dato.

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE5](LE5-detector-delegaciones.md) · ➡️ [LE7 · Flujos](LE7-flujos-multidireccion.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
