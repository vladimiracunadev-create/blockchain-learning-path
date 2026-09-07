# Cuaderno 08 · Custodia, conciliación, PoR y forensics

## 84 · CEX, DEX y punto de liquidación

- **Objetivo:** separar ejecución, custodia y liquidación.
- **Comando:** `pnpm lab:modelos-custodia`.
- **Evidencia:** tabla con orden CEX, operación DEX y retiro.
- **Aceptación:** la orden interna no recibe un txid inventado.

## 85 · Arquitectura hot/warm/cold y firmantes

- **Objetivo:** diseñar disponibilidad y control de claves.
- **Procedimiento:** matriz de decisión con límites, multisig/MPC/HSM y recuperación.
- **Evidencia:** política de una página y diagrama de autorización.
- **Aceptación:** cada capa tiene propósito, límite, cuórum y recuperación probada.

## 86 · Conciliación de tres registros

- **Objetivo:** comparar ledger, exchange y blockchain por activo.
- **Comando:** `pnpm lab:conciliacion`.
- **Evidencia:** salida completa y explicación del déficit USDC.
- **Aceptación:** no netea activos ni confunde un export con estado on-chain.

## 87 · Corte, procedencia y excepciones

- **Objetivo:** investigar diferencias temporales sin alterar fuentes.
- **Procedimiento:** modifica copias de fixtures y crea un puente de movimientos.
- **Evidencia:** excepción con corte, propietario, causa y resolución.
- **Aceptación:** conserva los datos originales y documenta el ajuste.

## 88 · Merkle Tree de pasivos

- **Objetivo:** comprometer balances y verificar inclusión.
- **Comando:** `pnpm lab:por`.
- **Evidencia:** root, prueba de un cliente y cambio de root tras alterar un saldo.
- **Aceptación:** la prueba original falla contra el saldo alterado.

## 89 · Assets vs liabilities

- **Objetivo:** evaluar cobertura acotada por activo.
- **Procedimiento:** ejecuta un caso cubierto y otro deficitario.
- **Evidencia:** activos, pasivos, diferencia, ratio y conclusión limitada.
- **Aceptación:** explica por qué PoR no equivale a auditoría financiera completa.

## 90 · Grafo, privacidad y falsa atribución

- **Objetivo:** distinguir hecho, indicador, inferencia e hipótesis.
- **Comando:** `pnpm lab:forensics`.
- **Evidencia:** vecindad de `bc1qbeta`, dos explicaciones alternativas y limitación.
- **Aceptación:** no atribuye identidad sin fuente y confianza.

## 91 · Caso Aurora Custody

- **Objetivo:** integrar ledger, wallets, transacciones y exports.
- **Comando:** `pnpm capstone:custodia`.
- **Evidencia:** informe con activos, obligaciones, on-chain/off-chain y discrepancias.
- **Aceptación:** cumple las puertas de calidad del [caso final](../../capstone/README.md).

## Navegación

[Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md) · [Caso final](../../capstone/README.md)
