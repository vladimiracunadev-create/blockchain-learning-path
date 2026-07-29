# Guías 11–20 · Consenso y Bitcoin

## 11 · Proof of Work

- **Comando:** `node labs/02-consensus/proof-of-work.mjs 4`.
- **Medición:** dificultades 2–5, tres ejecuciones cada una.
- **Aceptación:** relaciona dificultad con intentos esperados, no con tiempo exacto.

## 12 · PoW, PoS y BFT

- **Evidencia:** matriz con Sybil resistance, finalidad, penalización, participación y gobierno.
- **Aceptación:** no usa TPS como único criterio.

## 13 · Mini blockchain

- **Archivo:** `labs/03-mini-chain/mini-chain.mjs`.
- **Reto:** agrega timestamps y regla de ajuste.
- **Aceptación:** documenta por qué sigue sin ser una red segura.

## 14 · Manipulación

- **Prueba:** `node --test labs/03-mini-chain/mini-chain.test.mjs`.
- **Reto:** remina el bloque alterado y observa el siguiente.
- **Aceptación:** explica costo acumulado y consenso externo.

## 15 · Selección UTXO

- **Comando:** `pnpm lab:utxo`.
- **Reto:** implementa estrategia de mayor a menor y compara cambio.
- **Aceptación:** conserva entradas = salidas + comisión.

## 16 · Comisión y cambio

- **Actividad:** calcula tres transacciones con distinta cantidad de inputs.
- **Aceptación:** explica por qué monto transferido no determina por sí solo la comisión.

## 17 · Nodo regtest

- **Guía:** `labs/04-bitcoin-regtest/README.md`.
- **Evidencia:** versión, altura y hash de bloque local.
- **Aceptación:** no usa direcciones ni fondos reales.

## 18 · Wallet regtest

- **Actividad:** crea dos wallets descriptors y direcciones.
- **Aceptación:** explica madurez coinbase y backup de descriptors.

## 19 · Transacción regtest

- **Actividad:** transfiere entre wallets, inspecciona mempool, mina y confirma.
- **Evidencia:** txid local, inputs, outputs, fee y cambio.

## 20 · Multisig

- **Actividad:** crea descriptor 2-de-3 y una PSBT.
- **Aceptación:** demuestra que una clave no puede finalizar y documenta recuperación.
