# Laboratorio 30 · Conciliación de tres registros

Compara pasivos del ledger de clientes, activos mantenidos en un exchange y saldos de wallets obtenidos de una cadena simulada.

```bash
pnpm lab:conciliacion
```

Los importes usan unidades mínimas enteras: satoshi para BTC, gwei para ETH y micro-USDC para USDC. Los tres archivos declaran su corte UTC.

## Extensión con nodos locales

- Bitcoin: levanta [`regtest`](../04-bitcoin-regtest/README.md) o usa `signet`; reemplaza `wallets.json` con salidas read-only de `scantxoutset`/`gettxout` y conserva altura y hash.
- Ethereum: usa Anvil o una red Geth local; consulta `eth_getBalance` y `eth_call` para tokens, sin importar cuentas reales.
- APIs públicas: solo lectura, con caché del resultado, timestamp, límites y contraste independiente. Nunca pegues API keys privadas en la evidencia.
