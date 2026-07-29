# Guías 21–30 · EVM y desarrollo

Este cuaderno entra en la máquina virtual de Ethereum: selectores, calldata, eventos, gas y el primer contrato con Foundry. Acompaña a los módulos [Ethereum y EVM](../../curriculum/05-ethereum-evm/README.md) y [Solidity y Foundry](../../curriculum/06-solidity-foundry/README.md).

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Aquí separas los hechos on-chain (bytes, gas, eventos) de las inferencias de identidad. La bitácora registra el compilador, el optimizer y la medición exacta.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 21 | Anatomía de una transacción pública | concepto | informe explorador + RPC |
| 22 | Selector ABI | auto | `pnpm lab:abi` |
| 23 | Codificación de calldata | auto | `pnpm lab:abi` + decode manual |
| 24 | Eventos y topics | auto | descomposición de `Transfer` |
| 25 | Storage, memory y calldata | medición | tres variantes + gas |
| 26 | Estimación y comparación de gas | tabla | `forge test --gas-report` |
| 27 | Vault: depósito y retiro | Foundry | `forge test -vv` |
| 28 | Vault: fuzzing e invariantes | Foundry | fuzz + invariant |
| 29 | Cliente de lectura con viem | TypeScript | `createPublicClient` |
| 30 | Flujo seguro de conexión de wallet | interfaz | dApp con validación de red |

## 21 · Anatomía de una transacción pública

- **Objetivo:** leer una transacción real separando datos de identidad.
- **Cómo se resuelve:**
  1. Elige una transacción en un explorador y recupera el mismo hash por RPC (`eth_getTransactionByHash`).
  2. Identifica `from`, `to`, `value`, `input` (calldata), `gas` y estado.
  3. Marca qué es hecho on-chain y qué es una inferencia (un `from` no es una identidad legal).
- **Estructura de la respuesta:** informe con los campos crudos + una columna "hecho vs. inferencia".
- **Criterio de aceptación:** separa hechos on-chain de inferencias de identidad.
- **Error común:** llamar "dueño" a una dirección → solo sabes qué clave firmó.

## 22 · Selector ABI

- **Objetivo:** obtener el selector de 4 bytes de una función.
- **Cómo se resuelve:** [`abi-selector.mjs`](../05-evm/abi-selector.mjs) mapea firmas canónicas a sus 4 bytes y explica que la EVM usa Keccak-256.

```bash
pnpm lab:abi
```

```text
transfer(address,uint256) 0xa9059cbb
balanceOf(address) 0x70a08231
approve(address,uint256) 0x095ea7b3
totalSupply() 0x18160ddd
EVM usa Keccak-256, que no es idéntico al SHA3-256 estandarizado.
```

- El selector es los primeros 4 bytes del Keccak-256 de la firma canónica (sin nombres de parámetro ni espacios).
- Verificación adicional: `node --test labs/05-evm/abi-selector.test.mjs` comprueba `transfer` → `0xa9059cbb` y `balanceOf` → `0x70a08231`.
- Una firma no mapeada lanza error pidiendo calcular Keccak-256 a mano.
- **Criterio de aceptación:** explica por qué Keccak-256 (EVM) no es idéntico al SHA3-256 estandarizado (distinta constante de padding).
- **Error común:** usar SHA3-256 de librería y obtener otro selector → no es el Keccak original.

## 23 · Codificación de calldata

- **Objetivo:** construir la calldata completa de `transfer(address,uint256)`.
- **Cómo se resuelve:**
  1. Toma el selector `0xa9059cbb` de la práctica 22 (`pnpm lab:abi`).
  2. Codifica cada argumento como una palabra de 32 bytes: la dirección rellenada a la izquierda con ceros y el monto en hex a 32 bytes.
  3. Concatena `selector + palabra_dirección + palabra_monto` y decodifícalo de vuelta para comprobar.

```bash
pnpm lab:abi
```

```text
0xa9059cbb                                                         # 4 bytes: selector
000000000000000000000000<20 bytes de dirección>                   # palabra 1: address (padded)
0000000000000000000000000000000000000000000000000000000000000064  # palabra 2: uint256 = 100
```

- La calldata mide `4 + 32*n` bytes; aquí 4 + 32 + 32 = 68 bytes.
- Decodificar es partir por longitudes fijas: 4 bytes de selector y luego palabras de 32.
- **Criterio de aceptación:** identifica selector y las dos palabras de 32 bytes y decodifica el monto.
- **Error común:** no rellenar la dirección a 32 bytes → el decodificador lee campos corridos.

## 24 · Eventos y topics

- **Objetivo:** descomponer un log en firma, `topics` indexados y `data`.
- **Cómo se resuelve:**
  1. Toma un evento `Transfer(address indexed from, address indexed to, uint256 value)`.
  2. `topic[0]` es el Keccak-256 de la firma; los parámetros `indexed` van en `topic[1..]`; lo no indexado va en `data`.
  3. Explica qué puede filtrar un nodo eficientemente (los topics) y qué obliga a leer `data`.
- **Estructura de la respuesta:** tabla `topic0 | topic1 (from) | topic2 (to) | data (value)` con la separación justificada.
- **Criterio de aceptación:** explica qué campos permiten filtrado eficiente y por qué (indexación de topics).
- **Error común:** poner `value` como indexed en el análisis → no lo está; vive en `data`.

## 25 · Storage, memory y calldata

- **Objetivo:** medir el impacto de la ubicación de datos en gas.
- **Cómo se resuelve:**
  1. Implementa tres variantes de una operación sobre arrays: leyendo de `storage`, copiando a `memory` y usando `calldata`.
  2. Mide el gas de cada una con Foundry (`forge test --gas-report`).
  3. Explica vida útil y mutabilidad: `storage` persiste y es caro, `memory` es temporal, `calldata` es de solo lectura y barato.
- **Estructura de la respuesta:** tabla `variante | ubicación | gas | mutable?`.
- **Criterio de aceptación:** relaciona el gas medido con la ubicación y su mutabilidad.
- **Error común:** copiar `calldata` a `memory` sin necesidad → gasto extra evitable.

## 26 · Estimación y comparación de gas

- **Objetivo:** comparar costos entre patrones equivalentes.
- **Cómo se resuelve:**
  1. Compara acceso frío vs. caliente (EIP-2929), escribir cero vs. no cero, y emitir evento vs. escribir storage.
  2. Usa `forge test --gas-report` y registra la versión del compilador y del optimizer.
  3. Interpreta: el primer `SLOAD`/`SSTORE` a un slot es más caro (frío) que los siguientes (caliente).
- **Estructura de la respuesta:** tabla comparativa con la config de compilación anotada.
- **Criterio de aceptación:** registra versión del compilador y estado del optimizer junto a cada medición.
- **Error común:** comparar medidas con optimizer distinto → los números no son comparables.

## 27 · Vault: depósito y retiro

- **Objetivo:** trazar el ciclo depósito → retiro en un contrato con Foundry.
- **Cómo se resuelve:**
  1. En `labs/06-solidity-vault`, ejecuta las pruebas con verbosidad para ver las trazas.
  2. Sigue cómo el depósito actualiza el balance interno y el retiro lo descuenta antes de transferir.
  3. Anota los eventos emitidos en cada paso.

```bash
forge test -vv
```

```text
[PASS] test_Deposit() ...
[PASS] test_Withdraw() ...
Traza: Deposit(usuario, monto) → balance += monto ; Withdraw → balance -= monto → transfer
```

- **Criterio de aceptación:** la traza muestra el orden efecto-interacción y los eventos coherentes.
- **Error común:** transferir antes de actualizar el balance → abre la puerta a reentrancia (ver práctica 37).

## 28 · Vault: fuzzing e invariantes

- **Objetivo:** validar propiedades que deben cumplirse ante cualquier entrada.
- **Cómo se resuelve:**
  1. Define el rango de inputs y los supuestos (`vm.assume`) para el fuzzer.
  2. Formula dos invariantes, p. ej. "la suma de balances nunca excede el balance del contrato".
  3. Ejecuta las pruebas de fuzz e invariantes y confirma que fallan si rompes la propiedad a propósito.
- **Estructura de la respuesta:** dos invariantes con asserts significativos y el reporte de corridas del fuzzer.
- **Criterio de aceptación:** una prueba sin asserts útiles no cuenta como evidencia.
- **Error común:** invariante trivial (`true == true`) → no prueba nada.

## 29 · Cliente de lectura con viem

- **Objetivo:** leer estado de un contrato y manejar fallos de red.
- **Cómo se resuelve:**
  1. Crea un `createPublicClient` de viem apuntando al RPC del proyecto.
  2. Lee un dato de la campaña (p. ej. total recaudado) con `readContract`.
  3. Maneja explícitamente tres fallos: RPC caído, contrato inexistente y chain ID incorrecto.
- **Estructura de la respuesta:** script TypeScript con los tres caminos de error controlados.
- **Criterio de aceptación:** lee el dato y degrada con un mensaje claro en cada fallo.
- **Error común:** asumir que el RPC siempre responde → sin manejo, la app se rompe en silencio.

## 30 · Flujo seguro de conexión de wallet

- **Objetivo:** conectar una wallet mostrando contexto antes de firmar.
- **Cómo se resuelve:**
  1. Conecta la dApp del proyecto y muestra red, contrato, cuenta, monto y una simulación de la operación.
  2. Compara el chain ID conectado con el esperado.
  3. Rechaza la firma si la red no coincide, con un mensaje explícito.
- **Estructura de la respuesta:** interfaz que expone el contexto y bloquea la firma en red incorrecta.
- **Criterio de aceptación:** rechaza firmar si la red no coincide con la esperada.
- **Error común:** firmar sin validar la red → la transacción se envía a la cadena equivocada.

## 🧭 Navegación

- Anterior: [Guías 11–20 · Consenso y Bitcoin](02-consensus-bitcoin.md)
- Siguiente: [Guías 31–40 · Profesional y seguridad](04-professional-security.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md)
