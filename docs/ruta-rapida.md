# Ruta rápida

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🗺️ Hoja de ruta completa](../ROADMAP.md)

Ruta intensiva para quien ya tiene experiencia sólida de programación (idealmente backend) y puede dedicar **15-20 horas semanales durante 8 semanas**. Es una compresión honesta: cubre los módulos 00-18 sacrificando profundidad de práctica, no temas de seguridad.

**Advertencia clara**: la ruta recomendada del programa es la completa de 26 semanas descrita en [ROADMAP.md](../ROADMAP.md). Elige esta ruta solo si de verdad tienes la experiencia previa y las horas; si no, la compresión produce lagunas que se pagan caras en los módulos de seguridad y en el capstone.

## Plan de 8 semanas

| Semana | Módulos | Foco | Entregable de la semana |
|---:|---|---|---|
| 1 | 00-03 | Orientación, criptografía, sistemas distribuidos y consenso | Cadena de hashes y árbol de Merkle funcionando; explicar PoW vs PoS por escrito |
| 2 | 04-05 | Bitcoin (UTXO, Script) y Ethereum/EVM | Selección de UTXO resuelta; transacción en regtest; selectores ABI calculados a mano |
| 3 | 06 | Solidity y Foundry a fondo | Vault con pruebas unitarias y de fuzzing en verde |
| 4 | 07-08 | dApps y tokens | dApp mínima (frontend + contrato) y un ERC-20 con pruebas de casos de fallo |
| 5 | 09-10 | Seguridad, oráculos e indexación | Explotar y corregir una reentrancia; consumir un oráculo con protección TWAP |
| 6 | 11-12 | DAO/gobernanza y escalabilidad | Propuesta con timelock ejecutada en local; desplegar el vault en una testnet L2 (Sepolia o L2 de prueba) |
| 7 | 13-15 | Interoperabilidad, privacidad/ZK y arquitectura avanzada | Verificar una prueba de Merkle cross-chain; explicar SNARK vs STARK; simulación de tokenomics |
| 8 | 16-18 + capstone | Infraestructura, empresa y cierre | Capstone reducido: contrato + pruebas + modelo de amenazas + demo grabada |

## Hitos de verificación semanales

Al cerrar cada semana, estos comandos deben pasar. Si algo falla, no avances: la deuda se acumula.

| Semana | Verificación |
|---:|---|
| 1 | `pnpm lab:hash` · `pnpm lab:merkle` · `pnpm lab:pow` |
| 2 | `pnpm lab:utxo` · `pnpm lab:abi` |
| 3 | `forge test` en `labs/06-solidity-vault` (unitarias y fuzz en verde) |
| 4 | `forge test` del token; la dApp corre en local de punta a punta |
| 5 | Prueba que demuestra el exploit y prueba que demuestra el arreglo, ambas en verde |
| 6 | Propuesta de gobernanza ejecutada tras el timelock; despliegue verificado en testnet |
| 7 | `pnpm lab:tokenomics` · prueba de Merkle verificada |
| 8 | Suite completa del capstone en verde más los criterios de [evaluación](evaluacion.md) |

## Qué puede saltear un dev backend (y qué arriesga)

| Módulo | ¿Saltear? | Riesgo si lo haces |
|---|---|---|
| 00 Orientación | Lectura rápida (1-2 h) | Bajo: es contexto y setup |
| 02 Sistemas distribuidos | Parcial si ya operaste sistemas distribuidos reales | Medio: el modelo de fallas bizantinas no es el de tus microservicios |
| 07 dApps | Parcial si dominas frontend web3 | Medio: firma de transacciones y manejo de errores RPC tienen trampas propias |
| 16 Infraestructura de nodos | Parcial si eres SRE/DevOps | Medio: los cuellos de botella (IOPS, checkpoint sync) son específicos |
| 17-18 Empresa | Solo si tu meta es exclusivamente DeFi público | Medio: pierdes el contexto regulatorio y de consorcios |
| 01, 05, 06, 09 | **Nunca** | Criptografía, EVM, Solidity/pruebas y seguridad son el núcleo; saltearlos invalida la ruta |

## Si solo tienes X semanas

| Tiempo | Subconjunto realista | Qué obtienes | Qué NO obtienes |
|---|---|---|---|
| 2 semanas | 00-01, 05-06 (hasta el vault con pruebas) | Leer y escribir un contrato simple con pruebas | Ningún criterio de seguridad ni despliegue: no publiques nada con fondos |
| 4 semanas | Semanas 1-5 del plan (00-10) | Base técnica más el mínimo de seguridad y oráculos | Escalabilidad, gobernanza, ZK y capstone |
| 8 semanas | Plan completo de esta página | Panorama completo con práctica comprimida | La profundidad de práctica de la ruta de 26 semanas |

## Variante sprint de 30 días

La versión anterior de esta ruta era un sprint de 30 días a dedicación casi completa. Sigue siendo viable solo con jornada completa disponible:

- Días 1-4: módulos 00-03 y laboratorios criptográficos.
- Días 5-9: módulos 04-06; EVM, Solidity y Foundry.
- Días 10-13: módulo 07 y una dApp mínima.
- Días 14-18: tokens, seguridad y fuzzing.
- Días 19-22: oráculos, indexación y gobernanza.
- Días 23-26: L2, interoperabilidad y privacidad.
- Días 27-30: capstone, informe de amenazas y demo.

## Reglas de la ruta rápida

- No omitas seguridad por acelerar. Si una prueba falla o no puedes explicar un concepto, vuelve al módulo correspondiente.
- Los checkpoints de [assessments/checkpoints.md](../assessments/checkpoints.md) aplican igual que en la ruta completa: nota ≥ 80 por módulo.
- Si al final de la semana 4 vas retrasado más de una semana, cambia a la ruta completa: es la señal de que la compresión no está funcionando para ti.
- Otras rutas por perfil están en [learning-paths](../learning-paths/README.md).
