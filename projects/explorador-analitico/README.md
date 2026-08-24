# 🔎 Explorador analítico de actividad blockchain

> Navegación: [🏠 Programa](../../README.md) · [📚 Módulo 28 · Data Analytics on-chain](../../curriculum/28-data-analytics-onchain/README.md) · [🧪 Catálogo de prácticas](../../labs/CATALOG.md) · [📖 Glosario](../../docs/glosario.md)

Proyecto final del [módulo 28](../../curriculum/28-data-analytics-onchain/README.md) (**práctica 83**).
Integra en una sola herramienta lo construido en los once laboratorios previos: importar un
dataset, consultar bloques y transacciones, buscar direcciones, calcular indicadores, construir
el grafo, filtrar, detectar patrones, dibujar los resultados y **exportar un informe que
declara sus propias limitaciones**.

> ⚠️ **Qué es y qué no es.** Es material **educativo** sobre datos **sintéticos**. No es una
> herramienta certificada para acusar, bloquear ni identificar a nadie. Los patrones que marca
> son **indicadores** compatibles con explicaciones legítimas, no pruebas. Una dirección no es
> una persona. No hay red, ni claves, ni fondos, ni datos personales.

## Cómo se ejecuta

```bash
pnpm lab:explorador
```

Con filtros (todos combinables):

```bash
node projects/explorador-analitico/explorador.mjs --desde 20 --hasta 40 --activo token
```

| Opción | Qué hace |
|---|---|
| `--desde N` / `--hasta N` | Acota el rango de bloques |
| `--dia AAAA-MM-DD` | Restringe a un día concreto |
| `--activo token\|nativo\|todos` | Filtra por tipo de activo |
| `--direccion 0x…` | Solo transferencias donde participa esa dirección |
| `--informe ruta.md` | Exporta el informe en Markdown a esa ruta |

Salida esperada (resumida):

```text
🔎 Explorador analítico de actividad blockchain — datos SINTÉTICOS, sin red ni fondos.

Transferencias que cumplen el filtro: 210 de 210
Bloque 0: 1 transacciones, 1 eventos, día 2026-01-05

Perfil de 0x9002ed11ed11…: recibió 9, envió 0, 9 contrapartes distintas (papel en el dataset: coleccion)

Grafo: 3 componente(s) conexa(s). Direcciones más conectadas: …
Patrones: fan-in 10 · fan-out 6 · pelado 1 · rápidas 67 · anomalías 12
Calidad de las anomalías: precisión 0.25, recall 1.00 (medible SOLO porque el dataset es sintético).
```

Ese resultado es la lección central del módulo: **recall 1,00 con precisión 0,25** significa que
encuentra las tres anomalías plantadas… y arrastra nueve falsos positivos. Bajar el umbral
encuentra más y ensucia más. Ese compromiso no se elimina, se decide y se declara.

## Qué reutiliza (y por qué no reimplementa nada)

Cada capacidad viene del laboratorio donde se enseñó. Si un cálculo cambia allí, cambia aquí:
no hay dos versiones de la misma fórmula compitiendo.

| Capacidad | De dónde viene |
|---|---|
| Dataset sintético y verdad de campo | [`cadena-sintetica.mjs`](../../labs/28-data-analytics/cadena-sintetica.mjs) |
| Transferencias y grafo (nodos, aristas, grados, componentes) | Laboratorio 78 · [`grafo-direcciones.mjs`](../../labs/28-data-analytics/grafo-direcciones.mjs) |
| Fan-in, fan-out, pelado y transferencias rápidas | Laboratorio 80 · [`patrones-fan.mjs`](../../labs/28-data-analytics/patrones-fan.mjs) |
| Anomalías, evaluación y explicación | Laboratorio 81 · [`deteccion-anomalias.mjs`](../../labs/28-data-analytics/deteccion-anomalias.mjs) |
| Indicadores, serie diaria, panel y CSV | Laboratorio 82 · [`panel-indicadores.mjs`](../../labs/28-data-analytics/panel-indicadores.mjs) |
| Tenencias del token desde eventos | Laboratorio 77 · [`eventos-token.mjs`](../../labs/28-data-analytics/eventos-token.mjs) |

## El informe

`explorador.informe(filtro)` devuelve un Markdown con seis secciones: consulta, indicadores
observados, grafo, patrones detectados con su calidad de detección, **clasificación de las
afirmaciones** y limitaciones. Las dos últimas no son opcionales y las pruebas lo verifican:

| Tipo | Qué sostiene el informe |
|---|---|
| **Hecho** | Movimientos, importes y bloques: están en los datos y se verifican |
| **Indicador** | Los patrones: compatibles con varias explicaciones |
| **Inferencia** | El papel de una dirección; depende de supuestos declarados |
| **Hipótesis** | Cualquier atribución a una persona: **el informe no la sostiene** |

## Verificación

```bash
node --test projects/explorador-analitico/explorador.test.mjs
```

20 pruebas que comprueban, entre otras cosas, que los filtros se combinan bien, que el perfil de
una dirección **no contiene campos de identidad**, que solo se cuentan como anomalías las
observaciones marcadas (el error de composición más fácil de cometer), que el informe incluye
siempre sus limitaciones, que el HTML del panel es autocontenido y que dos ejecuciones producen
exactamente el mismo informe.

## Ideas para extenderlo

- Añadir un criterio de rastreo alternativo (FIFO o *haircut*) y comparar cómo cambia el reparto.
- Persistir el almacén del laboratorio 75 en SQLite y consultar por SQL.
- Exportar el grafo a `.dot` y renderizarlo con Graphviz para inspección visual.
- Añadir una vista de la mempool y medir cuántas transacciones pendientes acaban confirmándose.

---

## 🧭 Navegación

[🏠 Programa](../../README.md) · [📚 Módulo 28](../../curriculum/28-data-analytics-onchain/README.md) · [🧪 Cuaderno del bloque](../../labs/guides/07-data-analytics.md) · [🎓 Capstone](../../capstone/README.md)
