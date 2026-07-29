# Despliegue integral local

## 1. Dependencias

Node.js LTS, pnpm y Foundry. Docker es necesario solo para Bitcoin regtest.

## 2. Contrato

Terminal A:

```bash
anvil --chain-id 31337
```

Terminal B:

```bash
cd projects/community-funding
forge install foundry-rs/forge-std --no-commit
cp ../../.env.example .env
# Usa una clave de prueba mostrada por Anvil.
set -a; source .env; set +a
forge script script/Deploy.s.sol:DeployCommunityFunding \
  --rpc-url "$RPC_URL" --broadcast
```

Registra la dirección desplegada, chain ID y bloque. No copies una clave fuera del entorno local.

## 3. Interfaz

```bash
cp apps/community-funding-web/.env.example apps/community-funding-web/.env
# Configura la dirección anterior.
pnpm --filter @blockchain-course/community-funding-web dev
```

Conecta una wallet configurada para Anvil, crea una campaña mediante `cast` o un script, y contribuye desde la interfaz.

## 4. Indexador

```bash
cp apps/event-indexer/.env.example apps/event-indexer/.env
set -a; source apps/event-indexer/.env; set +a
pnpm --filter @blockchain-course/event-indexer start
```

Inspecciona `event-indexer-state.json`, produce un evento nuevo y repite. Para producción debes agregar reorg handling, base transaccional y observabilidad.

## 5. Cierre

Detén servicios, elimina claves locales exportadas y conserva solo direcciones, txids locales y bitácora sin secretos.
