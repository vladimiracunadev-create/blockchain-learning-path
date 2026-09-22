# Laboratorio local · Andes Quest Assets

> [⬅️ Caso transversal](../../docs/andes-quest-activos-tokenizados.md) · [📚 Clases 17–18](../../curriculum/08-tokens/README.md) · [🧪 Catálogo](../CATALOG.md)

Compara un entitlement off-chain con ownership on-chain sin red pública, fondos ni
claves reales. `GameAsset.sol` es deliberadamente pequeño para que cada regla sea
visible; implementa la superficie ERC-721 necesaria para el ejercicio, no un contrato
de producción completo. En producción se preferiría una implementación mantenida,
auditoría independiente y controles operativos adicionales.

## Objetivo

Al terminar podrás demostrar que:

- solo la autoridad ficticia puede mintear;
- el supply cap se hace cumplir en código;
- owner, transfer, metadata y approvals son estado on-chain;
- `setApprovalForAll` amplía el poder del marketplace;
- poseer el token no obliga al backend a conceder el entitlement;
- una base local puede ser la solución correcta cuando no existe coordinación externa.

## Requisitos y aislamiento

- Foundry (`forge` y, opcionalmente, `anvil`);
- Node.js 22 para la comparación en memoria;
- ninguna RPC externa, seed, wallet real ni dinero.

Las direcciones creadas por `makeAddr` solo existen durante las pruebas. No copies
claves de Anvil a redes públicas.

## Ejecutar

```bash
cd labs/23-andes-quest-assets
forge install foundry-rs/forge-std
forge test -vv
node --test entitlement.test.mjs
node entitlement.mjs
```

Para observar un despliegue local, en otra terminal inicia `anvil` y usa únicamente
sus cuentas efímeras. No es necesario para completar el laboratorio: los tests
despliegan el contrato en una EVM local, mintean, consultan owner y URI, aprueban y
transfieren.

Salida conceptual de la comparación:

```json
{
  "ownsToken": true,
  "entitlement": false,
  "reasons": ["account suspended"]
}
```

La cadena responde quién posee `#42`; el backend responde si esa cuenta puede usarlo.
Ninguno de los dos campos debe ocultarse bajo una sola palabra “propiedad”.

## Reto verificable

1. Añade una regla temporal para `BATTLE_PASS_2026`.
2. Demuestra con un test que el token puede seguir teniendo owner tras expirar la licencia.
3. Diseña una reconciliación idempotente para un evento `Transfer` con confirmaciones.
4. Escribe un ADR de una página: base de datos, ERC-721 o ERC-1155 para cada activo.

**Aceptación:** todos los tests siguen verdes y el ADR separa ownership, entitlement,
metadata, licencia, custodia, latencia, privacidad, coste y recuperación.

## Checklist de auditoría

- autoridad de mint y compromiso de la clave;
- cap, duplicados, dirección cero y procedencia del evento;
- transferencias inválidas y approvals residuales;
- alcance de `setApprovalForAll` y revocación;
- base URI, mutabilidad, disponibilidad y hash del asset;
- reentrancia de receptores si se añade `safeTransferFrom`;
- proxy admin, storage layout, pause y timelock si se añade upgradeability;
- indexador, confirmaciones, reorg y reconciliación;
- derechos de copyright, marca y licencia fuera del contrato.

---

## 🧭 Navegación

[⬅️ Caso transversal](../../docs/andes-quest-activos-tokenizados.md) · [📚 Clases 17–18](../../curriculum/08-tokens/README.md) · [🧪 Catálogo](../CATALOG.md)
