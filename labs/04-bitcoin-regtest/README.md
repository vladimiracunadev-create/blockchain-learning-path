# Laboratorio · Bitcoin Core en regtest

> Navegación: [Inicio](../../README.md) · [Currículo](../../curriculum/README.md) · [Módulo 04 · Bitcoin](../../curriculum/04-bitcoin/README.md) · [Catálogo de laboratorios](../CATALOG.md)

Laboratorio para operar un nodo **Bitcoin Core** real en modo `regtest`: una cadena privada y local donde tú decides cuándo se mina cada bloque. Practicas wallets, direcciones, transacciones y UTXOs con Bitcoin auténtico, sin coste y sin riesgo.

## Qué es regtest y por qué

`regtest` (regression test) es una red de Bitcoin **completamente local** con dificultad mínima: los bloques se generan bajo demanda con un comando, en vez de esperar la minería real. Las direcciones y monedas **no tienen valor** fuera de tu instancia y no se conectan a ninguna red pública.

| Red | Bloques | Monedas | Uso |
|---|---|---|---|
| mainnet | ~10 min, minería real | Valor real | Producción |
| testnet | Minería pública | Sin valor, pero compartida | Pruebas de integración |
| **regtest** | Bajo demanda, instantáneos | Sin valor, solo tuyas | Aprendizaje y pruebas locales |

La ventaja pedagógica: controlas el tiempo. Puedes minar 101 bloques en un segundo para desbloquear una recompensa coinbase y observar cada UTXO.

## Cómo levantarlo

Requiere [Docker](https://docs.docker.com/get-docker/). El [`docker-compose.yml`](docker-compose.yml) arranca `bitcoin/bitcoin:28.1` con RPC habilitado (usuario `student`, contraseña `studentpass`) y un volumen persistente.

```bash
docker compose up -d
docker compose exec bitcoin bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass createwallet course
docker compose exec bitcoin bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass -generate 101
```

Para no repetir las banderas, define un alias dentro del contenedor:

```bash
docker compose exec bitcoin bash
btc() { bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass -rpcwallet=course "$@"; }
```

Al terminar, apaga y limpia el estado con `docker compose down -v`.

## Comandos clave de bitcoin-cli

| Comando | Qué hace | Salida típica |
|---|---|---|
| `btc getblockcount` | Altura actual de la cadena | `101` |
| `btc createwallet course` | Crea la wallet `course` | `{"name":"course"}` |
| `btc getnewaddress` | Genera una dirección receptora | `bcrt1q…` |
| `btc -generate 101` | Mina 101 bloques hacia una dirección de la wallet | lista de hashes de bloque |
| `btc getbalance` | Saldo gastable de la wallet | `50.00000000` |
| `btc sendtoaddress <addr> 1.0` | Envía 1 BTC de prueba | `txid` |
| `btc listunspent` | Lista los UTXOs disponibles | array de `{txid, vout, amount}` |
| `btc gettransaction <txid>` | Detalle de una transacción propia | inputs, outputs, comisión |

> Nota sobre madurez coinbase: la recompensa de un bloque minado no es gastable hasta pasadas **100 confirmaciones**. Por eso se minan 101 bloques: para poder gastar la del bloque 1.

## Ejercicio guiado

El script [`scripts/regtest-demo.sh`](scripts/regtest-demo.sh) resume el flujo básico (crear dirección, minar un bloque, leer altura y saldo):

```bash
docker compose exec bitcoin bash scripts/regtest-demo.sh
```

Salida esperada (los valores exactos varían):

```text
Altura: 102
Dirección local: bcrt1q…
Balance regtest: 50.00000000
```

Pasos manuales para consolidar el concepto de UTXO:

1. Genera una dirección: `btc getnewaddress practica`.
2. Envía 1 BTC de prueba a esa dirección con `btc sendtoaddress`.
3. Mina un bloque para confirmar: `btc -generate 1`.
4. Inspecciona con `btc listunspent` cómo el envío creó un UTXO de salida y otro de cambio.

## Evidencias a registrar

Guarda en tu bitácora: altura inicial, dirección receptora, `txid`, comisión pagada, bloque de confirmación y una explicación de inputs/outputs. **No copies credenciales de producción** en tus notas.

## Desafíos

1. Crea dos wallets y transfiere entre ellas.
2. Intenta gastar una recompensa coinbase antes de sus 100 confirmaciones y observa el error.
3. Construye una política multisig mediante *descriptors*.
4. Estima una comisión, genera un bloque y verifica el cambio de saldo.

## Seguridad

- **Solo regtest.** Este laboratorio usa credenciales RPC triviales (`student`/`studentpass`) y `rpcallowip=0.0.0.0/0`: son aceptables porque la cadena es local y desechable.
- **Nunca reutilices esta configuración en mainnet ni testnet pública**: exponer RPC con credenciales conocidas es una invitación a que te vacíen el nodo.
- Las monedas de regtest no tienen valor; no las presentes como bitcoins reales.

Fundamento conceptual en el [módulo 04 · Bitcoin](../../curriculum/04-bitcoin/README.md).
