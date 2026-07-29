# Guías 11–20 · Consenso y Bitcoin

Este cuaderno lleva del consenso (Proof of Work y sus alternativas) al modelo UTXO de Bitcoin y a un nodo local en regtest. Acompaña a los módulos [consenso](../../curriculum/03-consenso/README.md) y [Bitcoin](../../curriculum/04-bitcoin/README.md).

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Trabaja siempre en regtest: sin fondos ni direcciones reales. La bitácora registra hipótesis, comando exacto, resultado y el límite de lo demostrado.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 11 | Proof of Work y dificultad | auto | `pnpm lab:pow 4` |
| 12 | Comparación PoW, PoS y BFT | concepto | matriz de 5 ejes |
| 13 | Construcción de una mini blockchain | proyecto | `mini-chain.mjs` extendido |
| 14 | Detección de bloque alterado | auto | `node --test mini-chain.test.mjs` |
| 15 | Selección de UTXO | auto | `pnpm lab:utxo` |
| 16 | Comisión y cambio Bitcoin | auto | `node --test utxo-selection.test.mjs` |
| 17 | Bitcoin Core en regtest | transcript | altura y hash local |
| 18 | Wallet y direcciones regtest | transcript | dos wallets descriptor |
| 19 | Crear y confirmar una transacción | txid local | mempool → confirmada |
| 20 | Multisig/descriptor en regtest | política | descriptor 2-de-3 + PSBT |

## 11 · Proof of Work y dificultad

- **Objetivo:** relacionar dificultad con el número esperado de intentos.
- **Cómo se resuelve:** [`proof-of-work.mjs`](../02-consensus/proof-of-work.mjs) itera `nonce` hasta que `sha256(payload:nonce)` empiece con `difficulty` ceros. Corre dificultades 2 a 5, tres veces cada una.

```bash
pnpm lab:pow 4
```

```text
{
  difficulty: 4,
  nonce: <número de intentos hasta el hash válido>,
  hash: '0000<...>',           # empieza con 4 ceros hex
  elapsedMs: <milisegundos>
}
```

- Cada cero hexadecimal adicional multiplica por ~16 los intentos esperados; `nonce` sube en ese orden de magnitud.
- El `hash` siempre empieza con tantos ceros como `difficulty`; el tiempo varía por corrida aunque el promedio crezca.
- La dificultad está tope en 6 (`Math.min(..., 6)`) para no colgar la máquina.
- **Criterio de aceptación:** relaciona dificultad con intentos esperados, no con un tiempo exacto.
- **Error común:** concluir "tardó X, entonces la dificultad Y es lenta" → un solo dato; el trabajo es probabilístico.

## 12 · Comparación PoW, PoS y BFT

- **Objetivo:** comparar familias de consenso por sus garantías, no por marketing.
- **Cómo se resuelve:**
  1. Construye una matriz con cinco ejes: resistencia Sybil, finalidad, penalización, participación y gobierno.
  2. Llena PoW, PoS y BFT en cada eje con una afirmación verificable.
  3. Contrasta finalidad probabilística (PoW) con finalidad económica/absoluta (PoS/BFT).
- **Estructura de la respuesta:** tabla 3×5 con una nota por celda.
- **Criterio de aceptación:** no usa TPS como único criterio de comparación.
- **Error común:** ordenar solo por velocidad → ignora finalidad y coste de ataque.

## 13 · Construcción de una mini blockchain

- **Objetivo:** entender por qué una cadena minada localmente aún no es una red segura.
- **Cómo se resuelve:** [`mini-chain.mjs`](../03-mini-chain/mini-chain.mjs) mina cada bloque enlazando `previousHash` y exige un prefijo de ceros. Extiéndelo con timestamp y una regla de ajuste de dificultad.
  - Agrega `timestamp` al objeto que hashea `mine`.
  - Añade una regla que suba/baje `difficulty` según el tiempo entre bloques.
  - Verifica que `isValid()` siga en `true` tras tus cambios.
- **Estructura de la respuesta:** diff del archivo + una nota que explique qué le falta para ser segura (sin red P2P ni consenso distribuido, un solo minero puede reescribirla).
- **Criterio de aceptación:** documenta por qué, pese a minar, no es una red segura.
- **Error común:** creer que minar solo da seguridad → sin nodos independientes no hay a quién resistir.

## 14 · Detección de bloque alterado

- **Objetivo:** demostrar que alterar un bloque invalida la cadena.
- **Cómo se resuelve:** el test mina, valida, cambia una transacción del bloque 1 y vuelve a validar.

```bash
node --test labs/03-mini-chain/mini-chain.test.mjs
```

```text
✔ mina y detecta manipulación
# tests 1
# pass 1
```

- Antes de alterar, `isValid()` es `true`; tras cambiar `transactions[0]`, el hash recomputado no coincide y devuelve `false`.
- **Reto de bitácora:** remina el bloque alterado y observa que el bloque siguiente sigue apuntando al hash viejo, así que también se invalida.
- **Criterio de aceptación:** explica el costo acumulado de reminar toda la cola y el papel del consenso externo.
- **Error común:** reminar solo el bloque tocado → el enlace del siguiente ya no cuadra.

## 15 · Selección de UTXO

- **Objetivo:** seleccionar entradas suficientes para cubrir monto más comisión.
- **Cómo se resuelve:** `selectUtxos` en [`utxo-selection.mjs`](../04-bitcoin/utxo-selection.mjs) ordena de menor a mayor y acumula hasta cubrir `target + fee`, devolviendo el cambio.

```bash
pnpm lab:utxo
```

```text
{
  selected: [ { id: 'a:0', value: 8000 }, { id: 'b:1', value: 12000 } ],
  total: 20000,
  target: 17000,
  fee: 1000,
  change: 2000        # total - target - fee
}
```

- Ordena ascendente y toma UTXOs hasta que `total >= target + fee`; con 8000 y 12000 llega a 20000 y no necesita el de 30000.
- El `change` es lo que vuelve a tu wallet; `total - target - fee`.
- **Reto:** implementa una variante de mayor a menor y compara el cambio y el número de entradas.
- **Criterio de aceptación:** conserva la identidad entradas = salidas + comisión (`total = target + fee + change`).
- **Error común:** olvidar sumar `fee` al objetivo → la transacción no cubre la comisión y quedaría inválida.

## 16 · Comisión y cambio Bitcoin

- **Objetivo:** ver que la comisión depende del tamaño (entradas), no del monto enviado.
- **Cómo se resuelve:** el test verifica la conservación con dos UTXOs y rechaza fondos insuficientes.

```bash
node --test labs/04-bitcoin/utxo-selection.test.mjs
```

```text
✔ conserva entradas = salidas + comisión
✔ rechaza fondos insuficientes
# tests 2
# pass 2
```

- La primera prueba comprueba `total === target + fee + change`; la segunda que sin fondos `selectUtxos` lanza error.
- **Reto de bitácora:** calcula tres transacciones con 1, 2 y 3 entradas y observa que más entradas encarecen la comisión aunque el monto sea igual.
- **Criterio de aceptación:** explica por qué el monto transferido no determina por sí solo la comisión.
- **Error común:** ligar comisión al monto → la comisión escala con el peso en bytes (número de inputs).

## 17 · Bitcoin Core en regtest

- **Objetivo:** levantar un nodo local aislado y leer su estado.
- **Cómo se resuelve:**
  1. Sigue la guía de `labs/04-bitcoin-regtest/README.md` para arrancar `bitcoind` en regtest.
  2. Consulta versión y `getblockchaininfo`; mina bloques con `generatetoaddress`.
  3. Registra versión, altura y hash del último bloque local.
- **Estructura de la respuesta:** transcript con los tres datos (versión, altura, hash).
- **Criterio de aceptación:** no usa direcciones ni fondos reales; todo ocurre en regtest.
- **Error común:** confundir la red → verifica que `chain` sea `regtest`, nunca `main`.

## 18 · Wallet y direcciones regtest

- **Objetivo:** crear wallets descriptor y entender la madurez coinbase.
- **Cómo se resuelve:**
  1. Crea dos wallets descriptor y genera direcciones en cada una.
  2. Mina hacia una y observa que la recompensa coinbase no es gastable hasta 100 confirmaciones.
  3. Exporta y guarda los descriptors como respaldo.
- **Estructura de la respuesta:** transcript con las dos wallets, direcciones y una nota de backup.
- **Criterio de aceptación:** explica la madurez coinbase (100 bloques) y el backup de descriptors.
- **Error común:** intentar gastar la coinbase recién minada → aún inmadura.

## 19 · Crear y confirmar una transacción regtest

- **Objetivo:** recorrer el ciclo de una transacción de mempool a confirmada.
- **Cómo se resuelve:**
  1. Transfiere entre las dos wallets e inspecciona la mempool antes de minar.
  2. Mina un bloque y confirma la transacción.
  3. Registra txid, entradas, salidas, comisión y cambio.
- **Estructura de la respuesta:** txid local + desglose de inputs/outputs/fee/change.
- **Criterio de aceptación:** la transacción pasa de mempool a confirmada con los datos registrados.
- **Error común:** leer la comisión antes de minar y darla por final → puede cambiar hasta confirmarse.

## 20 · Multisig/descriptor en regtest

- **Objetivo:** construir una política 2-de-3 y demostrar que una sola clave no basta.
- **Cómo se resuelve:**
  1. Crea un descriptor multisig 2-de-3 y una PSBT que gaste de él.
  2. Firma con una sola clave e intenta finalizar: falla.
  3. Firma con la segunda clave y finaliza correctamente.
- **Estructura de la respuesta:** política del descriptor + evidencia de que una firma no finaliza y dos sí.
- **Criterio de aceptación:** demuestra que una clave no puede finalizar y documenta la recuperación.
- **Error común:** perder un descriptor sin backup → sin él no se reconstruye la política de gasto.

## 🧭 Navegación

- Anterior: [Guías 01–10 · Fundamentos](01-foundations.md)
- Siguiente: [Guías 21–30 · EVM y desarrollo](03-evm-development.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md)
