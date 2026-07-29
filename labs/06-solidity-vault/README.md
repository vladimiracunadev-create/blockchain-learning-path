# Learning Vault

Contrato deliberadamente pequeño para practicar estado, eventos, errores, CEI, reentrancia y fuzzing.

Instala `forge-std` sin copiar su contenido al repositorio:

```bash
forge install foundry-rs/forge-std --no-commit
forge test -vv
```

## Desafíos

1. Escribe una prueba de invariante.
2. Construye un atacante de reentrancia y verifica la defensa.
3. Explica el efecto de Ether enviado mediante `selfdestruct`.
4. Añade pausado con roles usando una librería consolidada.

No despliegues este ejemplo con fondos reales.
