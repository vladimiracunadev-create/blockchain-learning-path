# 📝 Evaluación de la especialización

> 🧭 [🛡️ Especialización](../README.md) · [📐 Rúbricas](rubricas.md) · [❓ Banco de preguntas](banco-de-preguntas.md) · [🧪 Laboratorios](../laboratorios/README.md) · [🧮 Matriz](../MATRIZ-INTEGRACION.md)

La evaluación comprueba que sabes **hacer** y **justificar**, no solo recordar. Tiene cuatro componentes, todos con criterio observable.

## Componentes y ponderación

| Componente | Peso | Qué se entrega | Cómo se evalúa |
|---|---:|---|---|
| **Cuestionarios por bloque** (`Q1`–`Q9`) | 20 % | 45 preguntas autocorregibles, 5 por bloque | Automática, con explicación de cada respuesta ([quiz.json](quiz.json)) |
| **Laboratorios** (`R-LE1`–`R-LE8`) | 40 % | Evidencia de bitácora de cada laboratorio: comando, resultado, explicación y límite | [Rúbricas](rubricas.md), 10 puntos cada una |
| **Informe del caso** (`R-CASO`) | 25 % | Informe sobre el incidente con hechos, hipótesis y desconocidos | [Rúbrica del caso](rubricas.md#rúbrica-del-informe-del-caso-r-caso) |
| **Proyecto integrador** (`R-PROY`) | 15 % | Protección de una custodia ficticia | [Rúbrica del proyecto](rubricas.md#rúbrica-del-proyecto-integrador-r-proy) |

**Aprobación:** 70 % o más de la nota total **y ninguna falta crítica** (lista abajo). Las faltas críticas anulan la aprobación aunque la nota sea alta, porque son los errores que producen daño en un trabajo real.

## Faltas críticas

Una sola de estas faltas en cualquier entrega impide aprobar hasta repararla:

1. **Atribuir identidad** a una dirección o presentar la autoría de un grupo como hecho confirmado.
2. **Presentar una hipótesis como hecho**, o rellenar un desconocido con una certeza inventada.
3. **Usar material secreto real**: claves, semillas o endpoints privados en el laboratorio o en la bitácora.
4. **Dar una única cifra** de exposición de fondos sin nombrar el método ni el rango.
5. **Sumar activos distintos** para obtener una cobertura única (por ejemplo, compensar un déficit de USDC con un sobrante de BTC).
6. **Confundir prueba de reservas con auditoría o solvencia.**
7. **Citar direcciones o hash sin haberlos contrastado** con más de una fuente.

## Cuestionarios

El fichero [quiz.json](quiz.json) contiene nueve bloques de cinco preguntas con una respuesta correcta indicada por posición y una **explicación** que se muestra también al acertar. El validador del repositorio comprueba que ninguna respuesta apunte fuera de las opciones, que no haya opciones repetidas y que toda pregunta tenga explicación.

| Cuestionario | Bloque | Preguntas |
|---|---|---:|
| `Q1` | [1 · Criptografía y firmas](../bloques/01-criptografia-asimetrica-y-firmas.md) | 5 |
| `Q2` | [2 · Cuentas y abstracción](../bloques/02-cuentas-contratos-y-abstraccion.md) | 5 |
| `Q3` | [3 · Custodia y claves](../bloques/03-custodia-claves-y-politicas-de-firma.md) | 5 |
| `Q4` | [4 · Delegación de permisos](../bloques/04-delegacion-de-permisos.md) | 5 |
| `Q5` | [5 · Trazabilidad multicadena](../bloques/05-trazabilidad-multicadena.md) | 5 |
| `Q6` | [6 · Stablecoins y congelamiento](../bloques/06-stablecoins-congelamiento-y-recuperacion.md) | 5 |
| `Q7` | [7 · Transacciones, eventos y logs](../bloques/07-analisis-de-transacciones-eventos-y-logs.md) | 5 |
| `Q8` | [8 · Pruebas de reservas](../bloques/08-pruebas-de-reservas-y-sus-limites.md) | 5 |
| `Q9` | [9 · Caso Binance](../bloques/09-caso-binance-2026-10-29.md) | 5 |

## Cómo se documenta una entrega de laboratorio

Cada entrada de bitácora contiene, en este orden:

1. **Hipótesis**: qué esperabas que ocurriese.
2. **Procedimiento**: el comando exacto.
3. **Resultado**: lo observado, resumido.
4. **Explicación**: por qué ocurrió, con los conceptos del bloque.
5. **Límite**: qué **no** demuestra el resultado.
6. **Pregunta abierta**: qué te queda por resolver.

La evidencia debe poder repetirla otra persona. Nada de capturas sin contexto; nunca claves, semillas ni endpoints privados.

## Proyecto integrador (resumen)

**Tema:** proteger una custodia ficticia ante el patrón de ataque estudiado.

Entregables: (1) arquitectura hot / warm / cold con topes y cuórums; (2) política de firma como código; (3) configuración del monitor de [LE8](../laboratorios/LE8-monitor-riesgos-custodio.md) con su comparación de variantes; (4) inventario y reglas de detección de delegaciones ([LE5](../laboratorios/LE5-detector-delegaciones.md)); (5) plan de respuesta con emisores; (6) un informe breve que clasifique sus afirmaciones. Se puede apoyar en el [caso final](../../capstone/README.md) del programa.

## Relación con la evaluación del programa

Esta evaluación **no sustituye** a la del programa ni cuenta para sus 66 clases: la complementa. Los instrumentos del programa (`assessments/`, [evaluación general](../../docs/evaluacion.md)) siguen vigentes sin cambios.

## 🧭 Navegación

[🛡️ Especialización](../README.md) · [📐 Rúbricas](rubricas.md) · [❓ Banco de preguntas](banco-de-preguntas.md) · [🧮 Matriz](../MATRIZ-INTEGRACION.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
