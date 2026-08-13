# Auditoría · Análisis de brechas

> [⬅️ Índice de la auditoría](README.md) · [⬅️ Estado inicial](CURRENT_STATE.md) · [➡️ Arquitectura propuesta](PROPOSED_ARCHITECTURE.md)

## Cómo se mide la cobertura

Los porcentajes de las tablas **no son impresiones**. Cada tema se evaluó contra
cinco criterios verificables, cada uno vale 20 puntos:

| Criterio | Se cumple cuando… |
|---|---|
| **Definido** | El término aparece definido en el glosario o en un módulo, no solo mencionado |
| **Explicado** | Existe ≥1 sección que explica el mecanismo, no solo el nombre |
| **Comparado** | Se contrasta con su alternativa tradicional o con su sustituto |
| **Practicado** | Hay laboratorio, reto o práctica catalogada sobre el tema |
| **Fuenteado** | Hay al menos una fuente primaria enlazada (norma, whitepaper, organismo) |

La medición previa se hizo por conteo de ocurrencias por archivo (`grep -c`) y
lectura de los archivos con más apariciones, para distinguir **mención de paso**
de **tratamiento**.

## Matriz de brechas (estado 0.8.1 → acción tomada en 0.9.0)

| Tema | Existía | Cobertura previa | Qué faltaba | Acción |
|---|---|---:|---|---|
| Bitcoin | Sí | 100 % | — | Preservado |
| Ethereum / EVM | Sí | 100 % | — | Preservado |
| Smart contracts | Sí | 100 % | — | Preservado |
| Seguridad de contratos | Sí | 100 % | — | Preservado |
| Consenso | Sí | 100 % | — | Preservado |
| L2 y escalabilidad | Sí | 100 % | — | Preservado |
| Interoperabilidad y puentes | Sí | 100 % | — | Preservado |
| Privacidad y ZK | Sí | 100 % | — | Preservado |
| Oráculos | Sí | 100 % | — | Preservado |
| DAO y gobernanza | Sí | 100 % | — | Preservado |
| Infraestructura y nodos | Sí | 100 % | — | Preservado |
| Empresa e implementación | Sí | 100 % | — | Preservado |
| Tokenomics | Sí | 80 % | Práctica ampliada de emisiones | Preservado, enlazado desde 21 |
| **DeFi** | Mención | **20 %** | AMM, préstamo, liquidación, derivados, microestructura, métricas | **Módulo 19 nuevo** |
| **Dinero y banca** | No | **0 %** | Dinero bancario, reservas, clearing, liquidación, finalidad, Herstatt | **Módulo 20 nuevo** |
| **Stablecoins** | Mención | **20 %** | Tipos, mint/burn, reservas, peg, depeg, riesgos, comparación | **Módulo 21 nuevo** |
| **Depósitos tokenizados** | No | **0 %** | Todo | **Módulo 22 nuevo** |
| **CBDC / MDBC** | No | **0 %** | Todo, incluida la terminología chilena | **Módulo 22 nuevo** |
| **Pagos** | Mención | **20 %** | Flujo tradicional, PSP, esquemas, contracargo, finalidad | **Módulo 23 nuevo** |
| **Cross-border** | Mención | **10 %** | Corresponsalía, nostro/vostro, prefondeo, SWIFT | **Módulo 23 nuevo** |
| **FX on-chain** | No | **0 %** | Pares, PvP, swaps atómicos, riesgo de liquidación | **Módulo 23 nuevo** |
| **Tokenización** | Mención | **20 %** | Ciclo completo activo → redención, envoltorio legal | **Módulo 24 nuevo** |
| **RWA** | Mención | **20 %** | SPV, originación, valoración, NAV, incumplimiento | **Módulo 24 nuevo** |
| **Mercados de capitales** | No | **10 %** | Emisión, CSD, CCP, DvP, eventos corporativos | **Módulo 25 nuevo** |
| **DvP / PvP** | Mención (1) | **10 %** | Mecánica, atomicidad, riesgo de liquidación | **Módulos 23 y 25** |
| **Custodia institucional** | Parcial | **40 %** | Niveles, MPC/HSM, ceremonias, recuperación, custodia calificada | **Módulo 26 nuevo** |
| **Identidad digital / DID** | Mención | **10 %** | DID, credenciales verificables, divulgación selectiva | **Módulo 26 nuevo** |
| **Open Finance** | No | **0 %** | Ley 21.521 SFA, consentimiento, iniciación de pago | **Módulo 26 nuevo** |
| **Regulación internacional** | Mención | **20 %** | MiCA por dentro, GAFI, Basilea, IOSCO, EE. UU. | **Módulo 27 + `regulation/`** |
| **Regulación chilena** | Parcial | **50 %** | SFA, MDBC, comparación con otros marcos | **Ampliado + `regulation/chile/`** |
| **Casos reales de fracaso** | Parcial | **40 %** | Análisis estructurado con controles fallidos | **`docs/casos-reales/` nuevo** |

**Cobertura media previa de los 18 temas financieros/regulatorios: 16 %.**
Cobertura tras la evolución: los 18 alcanzan los cinco criterios.

## Brechas que **no** eran de contenido

Además de los temas ausentes, la auditoría encontró tres brechas estructurales:

1. **No existía puente TradFi → on-chain.** El programa saltaba de "tokens y
   estándares" (módulo 08) a "empresa" (módulo 17) sin explicar nunca qué es el
   dinero bancario, qué es liquidar, ni por qué la finalidad importa. Un alumno
   podía terminar sabiendo desplegar un ERC-20 sin poder responder qué cambia
   respecto de un depósito bancario. **Esa es la brecha central** y la que
   ordena todo lo demás: el módulo 20 se escribió antes que el 21 y el 22
   precisamente porque sin él los otros dos no se sostienen.

2. **La regulación estaba dispersa y sin jerarquía de fuente.** Aparecía en
   `docs/chile-regulacion-tributacion.md`, en ADR y en el módulo 17, sin
   distinguir nunca **ley / norma / circular / consulta pública / propuesta**.
   Esa distinción es la diferencia entre informar y desinformar.

3. **No había ninguna práctica financiera ejecutable.** Las 50 prácticas cubrían
   criptografía, consenso, EVM y seguridad. Ninguna calculaba un *health factor*,
   una pérdida impermanente, el costo de una remesa por corresponsalía o la
   atomicidad de una entrega contra pago.

## Lo que deliberadamente **no** se hizo

- **No se convirtió el programa en un curso de finanzas.** El criterio aplicado
  es el del encargo: los conceptos financieros entran **solo** hasta donde hacen
  falta para entender qué cambia al llevarlos a una cadena. El módulo 20 explica
  qué es un depósito bancario porque sin eso el 22 es incomprensible; no explica
  contabilidad, crédito ni riesgo de tasa.
- **No se creó un repositorio paralelo.** Todo vive en el mismo árbol, con la
  misma plantilla, el mismo validador y la misma navegación.
- **No se renumeraron los módulos existentes.** Ver
  [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md) para el razonamiento completo.

---

## 🧭 Navegación

[⬅️ Estado inicial](CURRENT_STATE.md) · [📋 Índice](README.md) · ➡️ [Duplicaciones](DUPLICATIONS.md)
