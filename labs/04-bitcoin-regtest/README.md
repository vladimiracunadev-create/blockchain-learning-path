# Bitcoin Core en regtest

`regtest` crea una cadena privada en la que el estudiante genera bloques cuando lo necesita. Las direcciones y monedas no tienen valor fuera de esa instancia.

## Inicio

```bash
docker compose up -d
docker compose exec bitcoin bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass createwallet course
docker compose exec bitcoin bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass -generate 101
./scripts/regtest-demo.sh
```

## Evidencias

Guarda la altura inicial, dirección receptora, txid, comisión, bloque de confirmación y una explicación de inputs/outputs. No copies credenciales de producción.

## Desafíos

1. Crea dos wallets y transfiere entre ellas.
2. Intenta gastar una recompensa antes de sus 100 confirmaciones.
3. Construye una política multisig mediante descriptors.
4. Estima una comisión, genera un bloque y verifica el cambio.
