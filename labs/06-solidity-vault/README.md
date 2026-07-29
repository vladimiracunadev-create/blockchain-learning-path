# Laboratorio · Learning Vault

> Navegación: [Inicio](../../README.md) · [Currículo](../../curriculum/README.md) · [Módulo 06 · Solidity y Foundry](../../curriculum/06-solidity-foundry/README.md) · [Catálogo de laboratorios](../CATALOG.md)

Contrato deliberadamente pequeño para practicar los fundamentos de Solidity con Foundry: **estado, eventos, errores tipados, checks-effects-interactions (CEI), defensa de reentrancia y fuzzing**. Cabe entero en la cabeza, así que puedes concentrarte en el método —cómo se prueban propiedades— en lugar de en la lógica de negocio.

## Objetivo

`LearningVault` (en `src/LearningVault.sol`) permite a cada cuenta depositar ETH y retirar hasta su saldo. Todo lo interesante está en cómo se protege: el retiro aplica el efecto (bajar el saldo) **antes** de la interacción externa (`call`), y una guarda `nonReentrant` cierra la puerta a la reentrancia.

## Invariantes

Son las propiedades que las pruebas deben proteger. Formúlalas como afirmaciones verificables antes de escribir código:

| # | Invariante | Por qué importa |
|---|---|---|
| 1 | Un retiro nunca excede el saldo de la cuenta | Evita drenar fondos ajenos |
| 2 | La contabilidad cuadra con los fondos: la suma de `balances` iguala el ETH del contrato | Detecta fugas o doble conteo |
| 3 | Tras el retiro, el saldo baja exactamente en el monto retirado | Consistencia del estado |

## Cómo correr

Requiere [Foundry](https://book.getfoundry.sh/). Instala la dependencia estándar sin copiarla al repositorio:

```bash
forge install foundry-rs/forge-std --no-commit
forge build
forge test -vv
```

Salida esperada:

```text
Ran 2 tests for test/LearningVault.t.sol:LearningVaultTest
[PASS] testDepositAndWithdraw() (gas: …)
[PASS] testFuzzCannotWithdrawMoreThanBalance(uint96,uint96) (runs: 1000, …)
Suite result: ok. 2 passed; 0 failed; 0 skipped
```

Ajusta la intensidad del fuzzing con:

```bash
forge test --fuzz-runs 5000
```

## Qué demuestra el fuzzing

Una prueba unitaria comprueba un caso que tú elegiste; una prueba **fuzz** genera cientos de entradas aleatorias y busca una que rompa la propiedad. `testFuzzCannotWithdrawMoreThanBalance` deposita una cantidad arbitraria e intenta retirar más: si algún valor lograra pasar sin revertir, Foundry lo reportaría con un *counterexample* concreto y reproducible. Así se encuentran los límites que la lectura pasa por alto (desbordamientos, casos borde de cero, etc.).

## Casos de prueba

| Prueba | Tipo | Qué verifica |
|---|---|---|
| `testDepositAndWithdraw` | Unitaria | Depósito de 2 ETH y retiro de 1 dejan saldo 1 |
| `testFuzzCannotWithdrawMoreThanBalance` | Fuzz | Retirar más que el depósito siempre revierte |

## Errores comunes

- **Efecto después de la llamada externa:** actualizar el saldo tras el `call` abre la reentrancia. En este vault el orden correcto es saldo → `call` → evento.
- **Olvidar la guarda:** CEI reduce el riesgo, pero `nonReentrant` lo cierra ante reentrancia entre funciones.
- **Ignorar el retorno de `call`:** si no verificas `success`, un fallo silencioso deja el estado inconsistente. Aquí se revierte con `TransferFailed`.
- **Fuzzing con supuestos demasiado amplios:** sin `vm.assume` el fuzzer malgasta corridas en entradas triviales.

## Desafíos

1. Escribe una prueba de **invariante** para la propiedad 2 (contabilidad = fondos).
2. Construye un contrato atacante de reentrancia y verifica que la defensa lo detiene.
3. Explica el efecto del ETH forzado mediante `selfdestruct` sobre la invariante de contabilidad.
4. Añade pausado con roles usando una librería consolidada y prueba que un usuario sin rol no puede pausar.

No despliegues este ejemplo con fondos reales. Fundamento en el [módulo 06 · Solidity y Foundry](../../curriculum/06-solidity-foundry/README.md).
