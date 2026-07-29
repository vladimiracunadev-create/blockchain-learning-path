# Guías 41–50 · Avanzado y capstone

Este cuaderno cierra el programa: front-running, proxies, auditoría, gobernanza, rollups, puentes, ZK, tokenomics y el proyecto final con defensa técnica. Acompaña al módulo [arquitectura avanzada](../../curriculum/15-arquitectura-avanzada/README.md) y al capstone.

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Aquí integras todo lo anterior en decisiones de arquitectura y en un producto defendible. Cada entrega nombra sus supuestos de confianza y sus límites.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 41 | Front-running y commit-reveal | simulación | mempool local + commit-reveal |
| 42 | Colisión de storage en proxy | informe | layouts V1/V2 + verificación |
| 43 | Auditoría completa del Vault | reporte | plantilla de auditoría |
| 44 | Multisig y timelock | política | 2-de-3 + demora + emergencia |
| 45 | Propuesta y voto DAO | simulación | `SimpleGovernor` completo |
| 46 | Comparación de rollups | ADR | optimista vs. ZK, 6 ejes |
| 47 | Modelo de amenazas de puente | threat model | lock/mint + burn/release |
| 48 | Prueba ZK conceptual | diseño | mayoría de edad |
| 49 | Simulación de emisión y concentración | auto | `pnpm lab:tokenomics` |
| 50 | Capstone y defensa técnica | producto | todas las puertas del capstone |

## 41 · Front-running y commit-reveal

- **Objetivo:** reproducir un front-run y mitigarlo con commit-reveal.
- **Cómo se resuelve:**
  1. En una mempool local, observa una respuesta en claro y cópiala con más fee para adelantarla.
  2. Implementa commit-reveal: primero envías `hash(respuesta+sal)`, luego revelas.
  3. Identifica qué metadata sigue visible (dirección, timing, tamaño) pese al commit.
- **Estructura de la respuesta:** simulación del adelantamiento + esquema commit-reveal y su metadata residual.
- **Criterio de aceptación:** identifica la metadata aún visible tras el commit.
- **Error común:** revelar sin sal → el commit es adivinable por fuerza bruta.

## 42 · Colisión de storage en proxy

- **Objetivo:** demostrar cómo un upgrade desplaza slots y corrompe estado.
- **Cómo se resuelve:**
  1. Compara los layouts de storage de V1 y V2 de un contrato tras un proxy.
  2. Introduce una variable nueva en medio de V2 y muestra el slot desplazado leyendo un valor corrupto.
  3. Agrega una verificación previa a upgrades (comparar layouts o usar gaps de storage).
- **Estructura de la respuesta:** informe con ambos layouts, el slot desplazado y la verificación propuesta.
- **Criterio de aceptación:** demuestra el slot desplazado y añade la verificación previa al upgrade.
- **Error común:** insertar variables en medio del layout → todo lo posterior se corre un slot.

## 43 · Auditoría completa del Vault

- **Objetivo:** producir un reporte de auditoría estructurado.
- **Cómo se resuelve:**
  1. Usa `assessments/audit-report-template.md` sobre el contrato Community Funding.
  2. Define alcance, invariantes esperadas y prueba cada una con un PoC.
  3. Clasifica hallazgos por severidad y documenta el riesgo residual tras las correcciones.
- **Estructura de la respuesta:** reporte con alcance, invariantes, PoCs y riesgo residual.
- **Criterio de aceptación:** incluye alcance, invariantes, PoC y riesgo residual.
- **Error común:** listar hallazgos sin PoC → no se distingue riesgo real de teórico.

## 44 · Multisig y timelock

- **Objetivo:** diseñar una gobernanza operativa resistente a pérdida y compromiso.
- **Cómo se resuelve:**
  1. Diseña un 2-de-3 con demora (timelock) para acciones sensibles.
  2. Añade cancelación de propuestas en cola y una vía de emergencia acotada.
  3. Simula la pérdida de un firmante y el compromiso de otro; muestra que el sistema sobrevive a uno.
- **Estructura de la respuesta:** política con umbral, demora, cancelación y emergencia + los dos escenarios simulados.
- **Criterio de aceptación:** simula pérdida y compromiso de firmante y el sistema resiste.
- **Error común:** emergencia sin límites → se convierte en puerta trasera.

## 45 · Propuesta y voto DAO

- **Objetivo:** recorrer el ciclo completo de gobernanza on-chain.
- **Cómo se resuelve:**
  1. Ejecuta el protocolo `SimpleGovernor`: crea una propuesta.
  2. Vota, alcanza el quórum y espera el periodo de votación/timelock.
  3. Ejecuta la propuesta aprobada y verifica el efecto.
- **Estructura de la respuesta:** simulación con propuesta, voto, quórum, espera y ejecución.
- **Criterio de aceptación:** cubre propuesta, voto, quórum, espera y ejecución.
- **Error común:** ejecutar antes de cumplir el timelock → la propuesta no procede.

## 46 · Comparación de rollups

- **Objetivo:** decidir entre un rollup optimista y uno ZK con criterios técnicos.
- **Cómo se resuelve:**
  1. Compara ambos en seis ejes: seguridad heredada, disponibilidad de datos, secuenciador, sistema de prueba, retiro y mecanismo de escape.
  2. Contrasta ventana de fraude (optimista) contra validez inmediata (ZK).
  3. Redacta una decisión (ADR) según un caso de uso concreto.
- **Estructura de la respuesta:** ADR con la matriz de 6 ejes y la decisión justificada.
- **Criterio de aceptación:** cubre los seis ejes y decide según el caso, no por moda.
- **Error común:** elegir por TPS anunciado → ignora finalidad y salida de emergencia.

## 47 · Modelo de amenazas de puente

- **Objetivo:** enumerar los riesgos de un puente cross-chain.
- **Cómo se resuelve:**
  1. Modela los dos flujos: lock/mint (bloquear origen, acuñar destino) y burn/release.
  2. Enumera amenazas: conjunto de validadores, replay, finalidad divergente, upgrade malicioso y liquidez.
  3. Asigna un control a cada amenaza.
- **Estructura de la respuesta:** threat model con los dos flujos y la tabla amenaza→control.
- **Criterio de aceptación:** enumera validadores, replay, finalidad, upgrade y liquidez.
- **Error común:** asumir finalidad igual en ambas cadenas → un reorg en origen invalida el mint.

## 48 · Prueba ZK conceptual

- **Objetivo:** diseñar una prueba de conocimiento cero de mayoría de edad.
- **Cómo se resuelve:**
  1. Define el problema: probar edad ≥ 18 sin revelar la fecha exacta.
  2. Identifica emisor (quién certifica), witness (dato privado), señales públicas (el umbral) y revocación.
  3. Analiza qué metadata puede filtrar el flujo aunque la prueba sea de conocimiento cero.
- **Estructura de la respuesta:** diseño con emisor, witness, señales públicas, revocación y metadata.
- **Criterio de aceptación:** identifica emisor, witness, señales públicas, revocación y metadata.
- **Error común:** exponer la fecha como señal pública → deja de ser conocimiento cero.

## 49 · Simulación de emisión y concentración

- **Objetivo:** proyectar suministro y reparto bajo emisión compuesta.
- **Cómo se resuelve:** `simulate` en [`supply-simulator.mjs`](../15-tokenomics/supply-simulator.mjs) valida que las asignaciones sumen 1 y proyecta `initial * (1 + inflación)^año`, repartiendo por tenedor.

```bash
pnpm lab:tokenomics
```

```text
┌─────────┬──────┬─────────┬────────────┐
│ (index) │ year │ supply  │ holders    │
├─────────┼──────┼─────────┼────────────┤
│ 0       │ 0    │ 1000000 │ [Object]   │  # community 500000, team 200000, treasury 300000
│ 1       │ 1    │ 1030000 │ [Object]   │  # supply × 1.03 cada año
│ ...     │ ...  │ ...     │ [Object]   │
│ 5       │ 5    │ 1159274 │ [Object]   │
└─────────┴──────┴─────────┴────────────┘
```

- `supply` crece de forma compuesta: 1.000.000 × 1,03^año; el año 5 ronda 1.159.274.
- Cada tenedor recibe `supply × su share`; las proporciones (50/20/30) se mantienen aunque el suministro crezca.
- Si las asignaciones no suman 1, `simulate` lanza `"Las asignaciones deben sumar 1"`.
- Verificación: `node --test labs/15-tokenomics/supply-simulator.test.mjs` comprueba que con 100 al 10% en 2 años el suministro es 121 y que un reparto inválido lanza error.
- **Reto:** cambia emisión y asignación; calcula concentración (share del mayor tenedor) y dilución de los demás.
- **Criterio de aceptación:** relaciona la inflación con la dilución y el reparto con la concentración.
- **Error común:** asignaciones que no suman 1 → la simulación aborta antes de proyectar.

## 50 · Capstone y defensa técnica

- **Objetivo:** integrar todo el programa en un producto defendible.
- **Cómo se resuelve:**
  1. Entrega el paquete completo: problema, ADR, contratos, interfaz, pruebas, auditoría, operación, costos y defensa.
  2. Aplica todas las puertas de `capstone/README.md` antes de presentar.
  3. Prepara la defensa técnica: justifica cada decisión con evidencia de las prácticas previas.
- **Estructura de la respuesta:** producto con los nueve componentes y las puertas del capstone superadas.
- **Criterio de aceptación:** aplica todas las puertas de `capstone/README.md`.
- **Error común:** entregar código sin ADR ni costos → falta la justificación que exige la defensa.

## 🧭 Navegación

- Anterior: [Guías 31–40 · Profesional y seguridad](04-professional-security.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md)
