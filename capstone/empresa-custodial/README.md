# Caso final · Aurora Custody

Aurora Custody SpA es una empresa **completamente ficticia**. El paquete entrega al estudiante cuatro fuentes con el mismo corte aproximado:

- [`ledger.json`](data/ledger.json): obligaciones por cliente;
- [`wallets.json`](data/wallets.json): wallets Bitcoin regtest y Ethereum local;
- [`transactions.json`](data/transactions.json): operaciones internas, on-chain y pendientes;
- [`exchange-export.json`](data/exchange-export.json): activo mantenido en un tercero.

## Encargo

Demuestra qué activos existen, qué obligaciones existen, qué está on-chain, qué está off-chain y qué discrepancias requieren investigación. No supongas que una etiqueta prueba control ni que un saldo en exchange es una wallet propia.

```bash
pnpm capstone:custodia
node --test capstone/empresa-custodial/auditar.test.mjs
```

## Entregables

1. Inventario de fuentes, hashes, unidades y cortes.
2. Conciliación por activo con puente de diferencias temporales.
3. Root Merkle de pasivos y prueba de inclusión de un cliente ficticio.
4. Evidencia de control propuesta para cada wallet, sin claves ni fondos reales.
5. Grafo de transacciones con hecho, indicador, inferencia y limitación.
6. Hallazgos, recomendaciones, responsable y fecha objetivo.
7. Conclusión que distingue PoR, procedimientos acordados y auditoría financiera.

## Puertas de calidad

- No compensa un déficit USDC con excedente BTC.
- Conserva la orden interna sin txid y el retiro con txid.
- Identifica el depósito pendiente como diferencia de timing, no como fraude.
- Declara que `Internal Ledger != Exchange Reality != Blockchain State` y demuestra la relación entre los tres.
- No atribuye direcciones a personas ni usa datos reales.

## Navegación

[Proyecto final](../README.md) · [Clases 29.1–32.2](../../curriculum/README.md) · [Laboratorios](../../labs/CATALOG.md)
