# Guías 21–30 · EVM y desarrollo

## 21 · Transacción pública

Analiza una transacción con un explorador y RPC. Separa hechos on-chain de inferencias de identidad.

## 22 · Selector ABI

Ejecuta `pnpm lab:abi`. Verifica selectores conocidos y explica Keccak-256 frente a SHA3-256.

## 23 · Calldata

Codifica `transfer(address,uint256)`, identifica selector y dos palabras de 32 bytes. Decodifica el resultado manualmente.

## 24 · Eventos y topics

Toma un evento `Transfer`, separa firma, parámetros indexed y data. Explica qué puede filtrar eficientemente un nodo.

## 25 · Storage, memory y calldata

Implementa tres variantes de una operación con arrays. Mide gas en Foundry y explica vida útil y mutabilidad.

## 26 · Gas

Compara cold/warm access, cero/no cero y eventos/storage. Registra versión del compilador y optimizer.

## 27 · Vault

Ejecuta `forge test -vv` en `labs/06-solidity-vault`. Traza depósito y retiro.

## 28 · Fuzz e invariantes

Define rango de inputs, supuestos y dos invariantes. Una prueba sin asserts útiles no cuenta como evidencia.

## 29 · Lecturas viem

Usa `createPublicClient`, lee campaña y maneja RPC caído, contrato inexistente y chain ID incorrecto.

## 30 · Wallet segura

Conecta la dApp del proyecto, muestra red, contrato, cuenta, monto y simulación. Rechaza firma si la red no coincide.
