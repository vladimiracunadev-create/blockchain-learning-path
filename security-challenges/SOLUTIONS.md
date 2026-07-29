# Criterios de resolución

> Navegación: [Retos de seguridad](README.md) · [Módulo 09 · Seguridad](../curriculum/09-seguridad/README.md) · [Inicio](../README.md)

Este documento explica **cómo se razona la solución** de cada reto: el patrón de vulnerabilidad, cómo se detecta y el arreglo correcto. **No contiene exploits listos para copiar y atacar**: los snippets muestran el *patrón seguro*, no un ataque ejecutable contra terceros.

> **Regla ética.** Estas técnicas se practican **solo en entornos propios o explícitamente autorizados** (Anvil local o testnet). Usarlas contra sistemas de terceros es un delito. Intenta cada reto por tu cuenta antes de leer esta guía; copiar no enseña a auditar.

Los retos viven en [`contracts/`](contracts/) con un contrato vulnerable y su contraparte corregida. Una mitigación de código **no** corrige automáticamente una falla económica o de gobernanza.

## Reto 01 · Reentrancia

- **Contratos:** `VulnerableReentrancy` / `FixedReentrancy`.
- **Vulnerabilidad:** `withdraw` hace la llamada externa (`call`) **antes** de poner el saldo a cero, así que el receptor puede volver a entrar y retirar de nuevo con el saldo aún intacto.
- **Cómo se detecta:** Slither marca `reentrancy-eth`; en revisión manual, cualquier `call` seguida de una escritura de estado es sospechosa; un PoC en Foundry con un contrato atacante que reingresa en su `receive` demuestra el drenaje.
- **Fix (checks-effects-interactions + guarda):**

```solidity
function withdraw() external nonReentrant {
    uint256 amount = balance[msg.sender];
    balance[msg.sender] = 0;               // efecto ANTES de la interacción
    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok, "transfer failed");
}
```

- **Referencia:** [SWC-107](https://swcregistry.io/docs/SWC-107) · patrón CEI.

## Reto 02 · Control de acceso

- **Contratos:** `VulnerableAccess` / `FixedAccess`.
- **Vulnerabilidad:** `setOwner` no comprueba quién llama: cualquiera se hace dueño.
- **Cómo se detecta:** Slither reporta `suicidal`/`access-control`; en revisión, toda función que cambia un privilegio debe tener una comprobación de autorización; un PoC llama a la función desde una cuenta ajena y verifica que se apropia del rol.
- **Fix (autorización explícita + transferencia en dos pasos):**

```solidity
function proposeOwner(address next) external {
    require(msg.sender == owner && next != address(0), "unauthorized");
    pendingOwner = next;
}

function acceptOwner() external {
    require(msg.sender == pendingOwner, "not pending");
    owner = pendingOwner;
    pendingOwner = address(0);
}
```

- **Referencia:** [SWC-105](https://swcregistry.io/docs/SWC-105) · mínimo privilegio y `Ownable2Step`.

## Reto 03 · Manipulación de oráculo

- **Contratos:** `VulnerableOracleConsumer` / `GuardedOracleConsumer`.
- **Vulnerabilidad:** `collateralValue` toma el precio de una única fuente **spot** (`spotPrice`), que un atacante mueve puntualmente con liquidez temporal (por ejemplo, un flash loan) dentro de un mismo bloque.
- **Cómo se detecta:** revisión de dependencias externas de precio; señal de alarma cuando el precio proviene de un pool con liquidez manipulable y sin verificación de antigüedad; un PoC altera la liquidez y observa el valor inflado.
- **Fix (freshness + fuente resistente):** validar antigüedad y usar TWAP o múltiples fuentes; el patrón mínimo rechaza precios obsoletos:

```solidity
function value(uint256 amount, uint256 price, uint256 updatedAt)
    external view returns (uint256)
{
    require(price > 0 && block.timestamp - updatedAt <= maxAge, "stale");
    return amount * price;
}
```

- **Referencia:** [Chainlink · uso seguro de feeds](https://docs.chain.link/data-feeds) · TWAP y circuit breakers.

## Reto 04 · Repetición de firma (replay)

- **Contratos:** `ReplayLesson` (`vulnerableDigest` vs `boundedDigest`).
- **Vulnerabilidad:** `vulnerableDigest` firma solo `(recipient, amount)`; sin dominio, nonce ni expiración, la misma firma vale en otra cadena, otro contrato o repetida.
- **Cómo se detecta:** revisión de qué campos entran al `keccak256` de un mensaje firmado; falta de `chainid`, dirección del contrato, nonce o `deadline`; un PoC reutiliza una firma válida en un segundo contexto.
- **Fix (dominio + nonce + expiración, y marcar el nonce antes del efecto):**

```solidity
bytes32 digest = keccak256(abi.encode(
    block.chainid, address(this), recipient, amount, nonce, deadline
));
require(!consumed[digest] && block.timestamp <= deadline, "invalid");
consumed[digest] = true;   // consumir ANTES de ejecutar el efecto
```

- **Referencia:** [EIP-712](https://eips.ethereum.org/EIPS/eip-712) · datos tipados con dominio.

## Reto 05 · Front-running

- **Contratos:** `VulnerableQuiz` / `CommitRevealQuiz`.
- **Vulnerabilidad:** `answer` envía la respuesta en claro; un observador del mempool ve la transacción pendiente, copia la respuesta y se adelanta con más gas para llevarse la recompensa.
- **Cómo se detecta:** identificar valores sensibles que viajan en claro y cuyo orden importa; señal de alarma cuando ganar depende de ser el primero en revelar; un PoC en un entorno con mempool observable reproduce el adelantamiento.
- **Fix (commit-reveal, atando el commit al remitente):**

```solidity
function commit(bytes32 commitment) external {
    commitments[msg.sender] = commitment;   // hash de (msg.sender, respuesta, salt)
}

function reveal(string calldata plain, bytes32 salt) external view returns (bool) {
    return commitments[msg.sender] == keccak256(abi.encode(msg.sender, plain, salt));
}
```

Complementa con *slippage*, `deadline` y privacidad del flujo cuando aplique.

- **Referencia:** [SWC-114](https://swcregistry.io/docs/SWC-114) · esquemas commit-reveal.

## Reto 06 · Storage collision (proxy)

- **Contratos:** `ProxyLayoutV1`, `UnsafeProxyLayoutV2`, `AppendOnlyLayoutV2`.
- **Vulnerabilidad:** en un patrón proxy, `UnsafeProxyLayoutV2` inserta `newValue` al inicio y desplaza `owner` y `limit`; tras actualizar, las variables se leen del slot equivocado y el estado se corrompe.
- **Cómo se detecta:** comparar el *layout* de almacenamiento entre versiones (`forge inspect <Contrato> storage-layout`); cualquier variable nueva que no vaya al final rompe la compatibilidad; herramientas de upgrade validan el layout antes de desplegar.
- **Fix (append-only: agregar variables solo al final):**

```solidity
contract AppendOnlyLayoutV2 {
    address public owner;   // slot 0 preservado
    uint256 public limit;   // slot 1 preservado
    uint256 public newValue; // slot 2 nuevo, sin desplazar los anteriores
}
```

Usa estándares probados (slots definidos, *storage gaps*) y una herramienta que compare layouts antes de actualizar.

- **Referencia:** [OpenZeppelin · Proxy Upgrade Pattern](https://docs.openzeppelin.com/upgrades-plugins/proxies) · reglas de storage.

## Qué se evalúa en tu resolución

- El PoC **falla antes del fix** y demuestra impacto concreto (fondos o control), no solo describe el patrón.
- La corrección es **mínima** y justificada por la causa raíz, no una reescritura.
- Hay una **prueba de regresión** que volvería a fallar si el bug reaparece.
- Distingues causa raíz, exploit, impacto, mitigación y **riesgo residual**.

El fundamento conceptual está en el [módulo 09 · Seguridad](../curriculum/09-seguridad/README.md).
