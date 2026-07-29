# Indexador de eventos

Reconstruye una vista de campañas desde logs y conserva el último bloque procesado.

```bash
cp .env.example .env
set -a; source .env; set +a
pnpm --filter @blockchain-course/event-indexer start
```

## Limitaciones que el estudiante debe resolver

- ordenar logs de eventos distintos por bloque/índice;
- manejar reorganizaciones y confirmaciones;
- volver a consultar rangos con paginación;
- persistir de forma transaccional;
- verificar que el contrato y la red sean los esperados.
