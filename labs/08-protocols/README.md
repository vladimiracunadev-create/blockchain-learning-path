# Laboratorio · Protocolos profesionales

> Navegación: [Inicio](../../README.md) · [Currículo](../../curriculum/README.md) · [Clases 17–18 · Tokens](../../curriculum/08-tokens/README.md) · [Catálogo de laboratorios](../CATALOG.md)

Tres componentes pequeños y comprobables que aparecen en casi todo protocolo real: un **token**, un **oráculo** y un **gobernador con timelock**. El objetivo no es reemplazar bibliotecas auditadas, sino poder **leer toda la lógica** de cada patrón antes de compararlo con una implementación de producción como OpenZeppelin.

## Qué contiene cada contrato

| Contrato | Archivo | Rol | Piezas clave |
|---|---|---|---|
| `CourseToken` | `src/CourseToken.sol` | ERC-20 educativo con tope de emisión | `cap`, `mint` solo `owner`, pausa global y transferencia de propiedad en dos pasos (`proposeOwner`/`acceptOwnership`) |
| `FreshOracle` | `src/FreshOracle.sol` | Feed de precio con autorización y rechazo de datos obsoletos | `updater` autorizado, `maxAge`, `read` revierte con `StalePrice` |
| `SimpleGovernor` | `src/SimpleGovernor.sol` | Gobernador con voto ponderado, quorum y timelock | `propose` → `vote` → `execute` tras `executableAt` |

## Invariantes por contrato

| Contrato | Invariante | Cómo se sostiene |
|---|---|---|
| `CourseToken` | `totalSupply <= cap` siempre | `mint` revierte con `CapExceeded` si lo supera |
| `CourseToken` | Solo el `owner` acuña; el cambio de dueño requiere aceptación | `Unauthorized` + patrón propose/accept |
| `CourseToken` | Durante una emergencia no se acuña ni transfiere | `pause`/`unpause`, solo `owner`, con eventos auditables |
| `FreshOracle` | Nunca devuelve un precio más viejo que `maxAge` | `read` compara `block.timestamp` con `updatedAt + maxAge` |
| `FreshOracle` | Solo el `updater` publica precios no nulos | `Unauthorized` / `InvalidPrice` |
| `SimpleGovernor` | Una propuesta se ejecuta solo con quorum y mayoría a favor, tras el timelock | `execute` valida `forVotes >= quorum`, `> againstVotes` y `executableAt` |
| `SimpleGovernor` | Un votante no vota dos veces la misma propuesta | `hasVoted` + `AlreadyVoted` |

## Ciclo de una propuesta en SimpleGovernor

```mermaid
flowchart LR

    A["propose"] --> B["vote ponderado"]
    B --> C{"Quorum y mayoría?"}
    C -->|"No"| D["ProposalFailed"]
    C -->|"Sí, tras timelock"| E["execute: llama al target"]
```

El timelock entre la aprobación y la ejecución da margen para reaccionar si una propuesta maliciosa alcanza el quorum: nada se ejecuta hasta pasado `executableAt`.

## Cómo probar

Requiere [Foundry](https://book.getfoundry.sh/):

```bash
forge install foundry-rs/forge-std --no-commit
forge build
forge test -vv
```

Salida esperada:

```text
Ran 4 tests for test/Protocols.t.sol:ProtocolsTest
[PASS] testTokenCapAndTransfer() (gas: …)
[PASS] testTokenPauseDocumentsEmergencyAuthority() (gas: …)
[PASS] testOracleRejectsStalePrice() (gas: …)
[PASS] testGovernorVotesWaitsAndExecutes() (gas: …)
Suite result: ok. 3 passed; 0 failed; 0 skipped
```

## Casos de prueba

| Prueba | Contrato | Qué verifica |
|---|---|---|
| `testTokenCapAndTransfer` | `CourseToken` | Acuñar, transferir y que exceder el `cap` revierta |
| `testTokenPauseDocumentsEmergencyAuthority` | `CourseToken` | Autoridad de pausa, bloqueo de mint/transfer y recuperación |
| `testOracleRejectsStalePrice` | `FreshOracle` | Lee un precio fresco; tras `maxAge` la lectura revierte |
| `testGovernorVotesWaitsAndExecutes` | `SimpleGovernor` | Propuesta con quorum se ejecuta solo tras el timelock |

## Relación con las clases

Cada contrato es la versión mínima de un tema del programa:

- `CourseToken` → [clases 17–18 · Tokens](../../curriculum/08-tokens/README.md): estándar ERC-20, tope de emisión y administración segura.
- `FreshOracle` → [clases 21–22 · Oráculos e indexación](../../curriculum/10-oraculos-indexacion/README.md): *freshness*, autorización y por qué un precio obsoleto es un riesgo.
- `SimpleGovernor` → [clases 23–24 · DAO y gobernanza](../../curriculum/11-dao-gobernanza/README.md): ciclo propuesta-voto-ejecución y el rol del timelock.

## Reto

Compara cada contrato con un estándar o biblioteca de producción (por ejemplo OpenZeppelin `ERC20`, Chainlink `AggregatorV3Interface`, `Governor` + `TimelockController`). Enumera las funciones, validaciones y amenazas que este laboratorio **omite** deliberadamente. Estos contratos no son reemplazo de implementaciones auditadas.

## Recorrido de creación y evidencia

`CourseToken` es el mint del laboratorio EVM. `name`, `symbol` y `decimals` son metadata
de presentación; `cap` limita la emisión; `owner` es la autoridad de mint y de pausa; y
`Transfer` permite reconstruir acuñaciones, transferencias y holders. ERC-20 no define una
*freeze authority* por cuenta como SPL Token: aquí existe una pausa global explícita.

Ejecuta `forge test -vvvv` y conserva la traza como explorer local. Identifica:

1. despliegue del contrato y cap;
2. mint desde `address(0)` hacia `alice`;
3. transferencia de `alice` a `bob`;
4. balances y supply después de cada evento;
5. intento no autorizado y revert;
6. pausa, bloqueo y reanudación.

Después ejecuta `pnpm lab:token-viral` desde la raíz para observar qué cambia cuando
wallets adquieren el activo desde un pool simulado. La teoría integrada está en
[Economía de un token viral](../../docs/economia-token-viral.md).
