# Protocolos profesionales

Tres componentes pequeños y comprobables:

- `CourseToken`: ERC-20 educativo con cap y administración en dos pasos.
- `FreshOracle`: feed con autorización y rechazo de datos obsoletos.
- `SimpleGovernor`: propuestas, voto ponderado fijo, quorum y timelock.

No son reemplazo de implementaciones auditadas. Su objetivo es permitir leer toda la lógica antes de comparar con bibliotecas consolidadas.

```bash
forge install foundry-rs/forge-std --no-commit
forge test -vv
```

## Reto

Compara cada contrato con un estándar/biblioteca de producción. Enumera funciones, validaciones y amenazas que este laboratorio omite.
