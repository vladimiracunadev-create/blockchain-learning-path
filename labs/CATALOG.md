# 🧪 Catálogo de 50 prácticas

> [⬅️ Cuaderno de laboratorios](guides/README.md) · [📚 Currículo](../curriculum/README.md) · [🏠 Programa](../README.md)

Las 50 prácticas del programa, agrupadas por bloque. Cada fila enlaza al **módulo**
del currículo que la sustenta y a su **resolución explicada** (cómo se resuelve, el
comando, la salida esperada y el error común).

**Cómo moverte:** elige una práctica → abre su **Resolución** para ver el paso a paso →
vuelve al **módulo** para la teoría. Las marcadas **auto** traen verificación ejecutable
(`pnpm lab:*` o `node --test`); el resto produce una evidencia revisable con rúbrica.

| Marca | Significado |
|---|---|
| **auto** | Tiene verificación ejecutable incluida |
| Módulo | Enlace al módulo del currículo que da la teoría |
| Resolución | Enlace a la guía con el paso a paso y la salida esperada |

## Prácticas 01–10 · Fundamentos

📖 Resolución explicada del bloque: [01-foundations.md](guides/01-foundations.md) · Teoría: módulos 01–03.

| # | Práctica | Nivel | Evidencia | Módulo | Resolución |
|---:|---|---|---|---|---|
| 01 | Matriz blockchain vs. base tradicional | inicial | ADR | [00](../curriculum/00-orientacion/README.md) | [ver](guides/01-foundations.md) |
| 02 | Historia anotada de sistemas de dinero digital | inicial | línea temporal | [00](../curriculum/00-orientacion/README.md) | [ver](guides/01-foundations.md) |
| 03 | Propiedades y límites de SHA-256 | inicial | **auto** | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 04 | Cadena de hashes manipulada | inicial | **auto** | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 05 | Árbol y raíz de Merkle | inicial | **auto** | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 06 | Prueba de inclusión Merkle | inicial | **auto** | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 07 | Firma y verificación Ed25519 | inicial | **auto** | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 08 | Amenazas de custodia de claves | inicial | threat model | [01](../curriculum/01-criptografia/README.md) | [ver](guides/01-foundations.md) |
| 09 | Propagación P2P con retrasos | inicial | simulación | [02](../curriculum/02-sistemas-distribuidos/README.md) | [ver](guides/01-foundations.md) |
| 10 | Partición y reconciliación | inicial | informe | [02](../curriculum/02-sistemas-distribuidos/README.md) | [ver](guides/01-foundations.md) |

## Prácticas 11–20 · Consenso y Bitcoin

📖 Resolución explicada del bloque: [02-consensus-bitcoin.md](guides/02-consensus-bitcoin.md) · Teoría: módulos 03–04.

| # | Práctica | Nivel | Evidencia | Módulo | Resolución |
|---:|---|---|---|---|---|
| 11 | Proof of Work y dificultad | inicial | **auto** | [03](../curriculum/03-consenso/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 12 | Comparación PoW, PoS y BFT | inicial | matriz | [03](../curriculum/03-consenso/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 13 | Construcción de una mini blockchain | intermedio | proyecto | [03](../curriculum/03-consenso/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 14 | Detección de bloque alterado | intermedio | **auto** | [03](../curriculum/03-consenso/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 15 | Selección de UTXO | intermedio | **auto** | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 16 | Comisión y cambio Bitcoin | intermedio | **auto** | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 17 | Bitcoin Core en regtest | intermedio | transcript | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 18 | Wallet y direcciones regtest | intermedio | transcript | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 19 | Crear y confirmar una transacción regtest | intermedio | txid local | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |
| 20 | Multisig/descriptor en regtest | intermedio | política | [04](../curriculum/04-bitcoin/README.md) | [ver](guides/02-consensus-bitcoin.md) |

## Prácticas 21–30 · Desarrollo EVM

📖 Resolución explicada del bloque: [03-evm-development.md](guides/03-evm-development.md) · Teoría: módulos 05–07.

| # | Práctica | Nivel | Evidencia | Módulo | Resolución |
|---:|---|---|---|---|---|
| 21 | Anatomía de una transacción pública | intermedio | informe | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 22 | Selector ABI | intermedio | **auto** | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 23 | Codificación de calldata | intermedio | **auto** | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 24 | Eventos y topics | intermedio | **auto** | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 25 | Storage, memory y calldata | intermedio | medición | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 26 | Estimación y comparación de gas | intermedio | tabla | [05](../curriculum/05-ethereum-evm/README.md) | [ver](guides/03-evm-development.md) |
| 27 | Vault: depósito y retiro | intermedio | Foundry | [06](../curriculum/06-solidity-foundry/README.md) | [ver](guides/03-evm-development.md) |
| 28 | Vault: fuzzing e invariantes | intermedio | Foundry | [06](../curriculum/06-solidity-foundry/README.md) | [ver](guides/03-evm-development.md) |
| 29 | Cliente de lectura con viem | intermedio | TypeScript | [07](../curriculum/07-dapps/README.md) | [ver](guides/03-evm-development.md) |
| 30 | Flujo seguro de conexión de wallet | intermedio | interfaz | [07](../curriculum/07-dapps/README.md) | [ver](guides/03-evm-development.md) |

## Prácticas 31–40 · Profesional y seguridad

📖 Resolución explicada del bloque: [04-professional-security.md](guides/04-professional-security.md) · Teoría: módulos 07–10.

| # | Práctica | Nivel | Evidencia | Módulo | Resolución |
|---:|---|---|---|---|---|
| 31 | Estados de una transacción | intermedio | máquina de estados | [07](../curriculum/07-dapps/README.md) | [ver](guides/04-professional-security.md) |
| 32 | ERC-20 con roles | profesional | Foundry | [08](../curriculum/08-tokens/README.md) | [ver](guides/04-professional-security.md) |
| 33 | Allowance y permit | profesional | threat model | [08](../curriculum/08-tokens/README.md) | [ver](guides/04-professional-security.md) |
| 34 | ERC-721 y metadatos | profesional | contrato | [08](../curriculum/08-tokens/README.md) | [ver](guides/04-professional-security.md) |
| 35 | Indexador de eventos | profesional | servicio | [10](../curriculum/10-oraculos-indexacion/README.md) | [ver](guides/04-professional-security.md) |
| 36 | Oráculo y dato obsoleto | profesional | pruebas | [10](../curriculum/10-oraculos-indexacion/README.md) | [ver](guides/04-professional-security.md) |
| 37 | Reentrancia | profesional | exploit + fix | [09](../curriculum/09-seguridad/README.md) | [ver](guides/04-professional-security.md) |
| 38 | Control de acceso | profesional | exploit + fix | [09](../curriculum/09-seguridad/README.md) | [ver](guides/04-professional-security.md) |
| 39 | Manipulación de oráculo | profesional | exploit + fix | [09](../curriculum/09-seguridad/README.md) | [ver](guides/04-professional-security.md) |
| 40 | Repetición de firmas | profesional | exploit + fix | [09](../curriculum/09-seguridad/README.md) | [ver](guides/04-professional-security.md) |

## Prácticas 41–50 · Avanzado y capstone

📖 Resolución explicada del bloque: [05-advanced-capstone.md](guides/05-advanced-capstone.md) · Teoría: módulos 09–15 y capstone.

| # | Práctica | Nivel | Evidencia | Módulo | Resolución |
|---:|---|---|---|---|---|
| 41 | Front-running y commit-reveal | profesional | simulación | [09](../curriculum/09-seguridad/README.md) | [ver](guides/05-advanced-capstone.md) |
| 42 | Colisión de storage en proxy | profesional | informe | [09](../curriculum/09-seguridad/README.md) | [ver](guides/05-advanced-capstone.md) |
| 43 | Auditoría completa del Vault | profesional | reporte | [09](../curriculum/09-seguridad/README.md) | [ver](guides/05-advanced-capstone.md) |
| 44 | Multisig y timelock | profesional | política | [11](../curriculum/11-dao-gobernanza/README.md) | [ver](guides/05-advanced-capstone.md) |
| 45 | Propuesta y voto DAO | profesional | simulación | [11](../curriculum/11-dao-gobernanza/README.md) | [ver](guides/05-advanced-capstone.md) |
| 46 | Comparación de rollups | avanzado | ADR | [12](../curriculum/12-escalabilidad/README.md) | [ver](guides/05-advanced-capstone.md) |
| 47 | Modelo de amenazas de puente | avanzado | threat model | [13](../curriculum/13-interoperabilidad/README.md) | [ver](guides/05-advanced-capstone.md) |
| 48 | Prueba ZK conceptual | avanzado | diseño | [14](../curriculum/14-privacidad-zk/README.md) | [ver](guides/05-advanced-capstone.md) |
| 49 | Simulación de emisión y concentración | avanzado | **auto** | [15](../curriculum/15-arquitectura-avanzada/README.md) | [ver](guides/05-advanced-capstone.md) |
| 50 | Capstone y defensa técnica | avanzado | producto | [Capstone](../capstone/README.md) | [ver](guides/05-advanced-capstone.md) |

---

## 🧭 Navegación

[🧪 Cuaderno de laboratorios](guides/README.md) · [📚 Currículo](../curriculum/README.md) · [🎓 Capstone](../capstone/README.md) · [🏠 Programa](../README.md)
