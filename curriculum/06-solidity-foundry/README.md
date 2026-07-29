# 06 · Solidity y Foundry

## Temas

Tipos, visibilidad, modifiers, errores, eventos, herencia, interfaces, librerías, receive/fallback, layout de storage y patrones de acceso.

## Flujo

```bash
cd labs/06-solidity-vault
forge build
forge test -vv
forge test --fuzz-runs 1000
```

Antes de implementar, escribe invariantes: “los retiros nunca superan el saldo del usuario” y “la suma contable coincide con los fondos administrados”, considerando transferencias forzadas.
