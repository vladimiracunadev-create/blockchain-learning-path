# LE3 · Simular transferencias entre direcciones controladas

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE2](LE2-firmas-digitales.md) · ➡️ [LE4 · Delegación EIP-7702](LE4-delegacion-eip7702.md) · [Bloque 2](../bloques/02-cuentas-contratos-y-abstraccion.md)

**Nivel:** avanzado · **Duración:** 60–90 min · **Código:** [le3-transferencias-simuladas.mjs](../../labs/especializacion-seguridad/le3-transferencias-simuladas.mjs) y la red [red-lab.mjs](../../labs/especializacion-seguridad/nucleo/red-lab.mjs) · **Pruebas:** 7 (más 25 de la red)

## Prerrequisitos

- LE1 y LE2; [bloque 2](../bloques/02-cuentas-contratos-y-abstraccion.md) leído.
- Haber visto la anatomía de una transacción ([clases 15–16](../../curriculum/07-dapps/README.md)).

## Teoría

Una transacción **no mueve monedas**: es una instrucción firmada que la red valida y aplica a un libro de estado si cumple las reglas. Para que se acepte, una transacción de tipo 2 (EIP-1559) debe cumplir:

1. **Firma válida**: se recupera el remitente de `(r, s, v)`; no existe campo "from".
2. **Chain id correcto**: protege contra la repetición en otra red ([EIP-155](https://eips.ethereum.org/EIPS/eip-155)).
3. **Nonce exacto**: ni uno menos (ya usada) ni uno más (hueco).
4. **Saldo suficiente** para el valor más el gas máximo.

Si se acepta pero la ejecución falla, la transacción queda **incluida y revertida**: se consumen el nonce y el gas, y se deshacen los efectos. El invariante que ninguna transferencia puede romper es la **conservación**: el ETH final más las comisiones es igual al inicial, y los tokens no se crean ni se destruyen al transferirse.

## Instrucciones

1. Ejecuta el escenario completo:

   ```bash
   node labs/especializacion-seguridad/le3-transferencias-simuladas.mjs
   ```

2. Lee la tabla: cuatro transacciones, cada una en su bloque, con dos de ETH y dos de token.
3. Comprueba la línea de conservación y calcula a mano la comisión total: 4 transacciones × 21 000 de gas × 20 gwei.
4. Abre `probarRechazos` y relaciona cada rechazo con una de las cuatro reglas anteriores.
5. Añade tu propia transferencia: de `carol` a `alice`, 0,25 ETH. Verifica que el nonce de Carol avanza y que la conservación se mantiene.
6. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le3-transferencias-simuladas.test.mjs labs/especializacion-seguridad/nucleo/red-lab.test.mjs
   ```

> **Todas las billeteras son de prueba (LE1) y la "red" es un libro de estado en memoria.** Nada sale a ninguna red.

## Código comentado

- `crearEscenario`: tres billeteras de prueba, 10 ETH cada una, un token con 1 000 unidades para `alice`.
- `transferirEth` / `transferirToken`: construyen la transacción, la firman y la envían. Un token se transfiere llamando a su contrato con `transfer`.
- `medirValor` / `verificarConservacion`: suman ETH, comisiones y tokens, antes y después.
- `tablaDeMovimientos`: reconstruye lo que mostraría un explorador a partir de recibos y registros, decodificando los eventos `Transfer`.
- `probarRechazos`: intenta un nonce repetido, una cadena equivocada y un saldo insuficiente.

La red (`red-lab.mjs`) declara sus simplificaciones: un bloque por transacción, precio efectivo del gas igual a `maxFee` y datos de llamada en JSON en vez de ABI.

## Pruebas

Conservación del valor; saldos finales; nonce por remitente; reconstrucción de eventos; rechazos de red; reversión que consume nonce y gas; autotransferencia que solo cuesta comisión.

## Resultados esperados

```text
bloque  estado   valorEth  tokens
1       exito    2         0
2       exito    0         1
3       exito    0.5       0
4       exito    0         1
ETH antes/después (+comisiones): 30000000000000000000n 29998320000000000000n 1680000000000000n
Conservación del valor: { ethConservado: true, tokensConservados: true }
Rechazos esperados: {
  'nonce repetido': 'nonce 0 ≠ esperado 1',
  'otra cadena': 'chain id distinto: protección contra repetición entre redes',
  'saldo insuficiente': 'saldo insuficiente para gas y valor',
  'remitente declarado': 'aceptada'
}
```

La comisión total es `1 680 000 000 000 000` wei (0,00168 ETH) = 4 × 21 000 × 20 gwei.

## Ejercicios adicionales

1. **Hueco de nonce.** Firma una transacción de Bob con el nonce 5 siendo el actual 0. ¿Qué responde la red?
2. **Reversión.** Haz que Bob transfiera tokens sin tenerlos. Comprueba el estado, el nonce y el saldo de ETH.
3. **Conservación bajo error.** ¿Se conserva el valor tras una reversión? Argumenta.
4. **Reconciliación.** Calcula el saldo de tokens de Carol sumando los eventos `Transfer` y compáralo con el saldo en el estado.

## Soluciones

1. Se rechaza (`nonce 5 ≠ esperado 0`): un hueco no se acepta; la red no "espera".
2. Estado `revertida` con motivo `USDT-LAB: saldo insuficiente`; el nonce de Bob avanza en uno y el ETH baja por el gas; el saldo de tokens no cambia.
3. Sí: la reversión deshace los efectos, y lo único que sale del libro de cuentas es la comisión, que `medirValor` contabiliza.
4. `neto = Σ(monto si destino = Carol) − Σ(monto si origen = Carol)`. Debe coincidir con `red.saldoToken(TOKEN_LAB, carol)`; una discrepancia indicaría eventos falsos o incompletos (ver [bloque 7](../bloques/07-analisis-de-transacciones-eventos-y-logs.md)).

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE2](LE2-firmas-digitales.md) · ➡️ [LE4 · Delegación EIP-7702](LE4-delegacion-eip7702.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
