# Auditoría · Duplicaciones y solapamientos

> [⬅️ Índice de la auditoría](README.md) · [⬅️ Brechas](GAP_ANALYSIS.md) · [➡️ Contenido obsoleto](OUTDATED_CONTENT.md)

Antes de escribir una sola línea nueva se buscó dónde el contenido **ya existía**,
aplicando el criterio `REUSE → EXTEND → REFACTOR → MOVE → CREATE`. Este documento
registra qué se encontró y qué se decidió, para que la decisión sea auditable y no
haya que repetir el análisis en la próxima evolución.

## Solapamientos reales encontrados

| Contenido | Dónde vivía | Decisión | Por qué |
|---|---|---|---|
| Stablecoins (mención) | `industria/04`, `industria/05`, `curriculum/17`, `adrs/006` | **EXTEND** | Eran menciones correctas en contexto de negocio; el módulo 21 las desarrolla y ellas ahora enlazan a él |
| RWA (mención) | `industria/04`, `curriculum/17` | **EXTEND** | Igual criterio: el caso de negocio se queda donde está, la mecánica va al módulo 24 |
| MiCA (mención) | `adrs/006`, `industria/05`, `docs/recursos-oficiales.md` | **EXTEND** | Se conservan las menciones; el desarrollo por dentro va al módulo 27 y a `regulation/european-union/` |
| Custodia (parcial) | `curriculum/18` (KMS/MPC/multisig), `docs/threat-model-project.md` | **REUSE + EXTEND** | El módulo 18 la trata como *componente de arquitectura*; el 26 la trata como *disciplina* con niveles, ceremonias y recuperación. Se enlazan mutuamente en lugar de repetirse |
| Regulación chilena | `docs/chile-regulacion-tributacion.md` | **REUSE, no duplicar** | Es un documento vivo y bien fuenteado. `regulation/chile/README.md` **enlaza** a él y añade lo que no cubría (Sistema de Finanzas Abiertas, MDBC), sin copiar una línea |
| Tokenomics | `curriculum/15`, `labs/15-tokenomics` | **REUSE** | El módulo 21 remite a él para emisión y concentración en vez de reexplicarlo |
| MEV | `curriculum/15` | **REUSE** | El módulo 19 lo aplica al caso concreto de mercados (sándwich sobre un AMM) y remite al 15 para el mecanismo |
| Puentes y su riesgo | `curriculum/13` | **REUSE** | El módulo 24 lo cita al hablar del riesgo de un RWA multi-cadena; no reexplica el modelo de amenazas |
| Oráculos | `curriculum/10` | **REUSE** | Módulos 21 y 24 los aplican (peg, prueba de reservas, NAV) remitiendo al 10 para el mecanismo y sus ataques |

## Duplicaciones que **sí** se corrigieron

| Duplicación | Estado previo | Corrección |
|---|---|---|
| Cifra de prácticas auto-verificadas | Escrita a mano en README y en el catálogo | Ya estaba contrastada por `check-repository.mjs`; se mantuvo el mecanismo al pasar de 50 a 70 prácticas |
| Recuento de módulos | Escrito a mano en `build-manual.mjs`, `verificar-apk.mjs`, README, `curriculum/README.md` | Los verificadores de app y el pie del manual se actualizaron a la cifra real; `build-landing.mjs` ya la calculaba sola |
| Definición de "finalidad" | Aparecía en 03 (probabilística) y en 12 (L2) con matices distintos | Se unificó el vocabulario en el glosario y el módulo 20 añade la acepción **jurídica** (firmeza), que faltaba y es la que usa la banca |

## Solapamiento aceptado a propósito

Tres conceptos se explican **más de una vez, desde ángulos distintos**, y eso es
diseño, no descuido:

1. **Liquidación (*settlement*)** — el módulo 20 la explica como proceso bancario,
   el 23 como pago, el 25 como entrega de valores. Un lector que solo haga el 25
   necesita la definición sin volver atrás.
2. **Riesgo de contraparte** — módulo 20 (Herstatt), 23 (PvP), 25 (DvP). El
   mecanismo de mitigación cambia en cada caso; repetir el problema es lo que
   hace visible por qué la solución difiere.
3. **Colateral** — módulo 19 (préstamo DeFi), 21 (respaldo de stablecoin), 24
   (activo subyacente). Son tres cosas distintas que comparten palabra: no
   distinguirlas es la causa de la mitad de los malentendidos del sector.

En los tres casos, cada aparición **enlaza explícitamente a las otras dos**, de
forma que el solapamiento se lee como refuerzo y no como redundancia.

---

## 🧭 Navegación

[⬅️ Brechas](GAP_ANALYSIS.md) · [📋 Índice](README.md) · ➡️ [Contenido obsoleto](OUTDATED_CONTENT.md)
