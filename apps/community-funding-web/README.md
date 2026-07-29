# Interfaz Community Funding

Interfaz real con viem: lee estado, conecta una wallet EIP-1193, simula la llamada, solicita firma y espera confirmación.

```bash
cp .env.example .env
# despliega el contrato en Anvil y actualiza VITE_CONTRACT_ADDRESS
pnpm --filter @blockchain-course/community-funding-web dev
```

Usa solo Anvil o testnet. La interfaz nunca solicita ni almacena claves.
