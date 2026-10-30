# LE8 · Diseñar un monitor de riesgos para custodios

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE7](LE7-flujos-multidireccion.md) · [Bloque 3](../bloques/03-custodia-claves-y-politicas-de-firma.md) · [Bloque 9](../bloques/09-caso-binance-2026-10-29.md)

**Nivel:** avanzado · **Duración:** 120–150 min · **Código:** [le8-monitor-riesgos-custodio.mjs](../../labs/especializacion-seguridad/le8-monitor-riesgos-custodio.mjs) · **Datos:** [politica-custodio.json](../../labs/especializacion-seguridad/fixtures/politica-custodio.json) y [linea-de-tiempo-custodio.json](../../labs/especializacion-seguridad/fixtures/linea-de-tiempo-custodio.json) (100 % sintéticos) · **Pruebas:** 17

## Prerrequisitos

- LE4 a LE7 y los bloques [3](../bloques/03-custodia-claves-y-politicas-de-firma.md), [4](../bloques/04-delegacion-de-permisos.md) y [9](../bloques/09-caso-binance-2026-10-29.md).
- Las prácticas 84 y 85 del [catálogo](../../labs/CATALOG.md) (modelos de custodia y arquitectura hot/warm/cold).

## Teoría

Un monitor de custodia evalúa **eventos** (salidas, delegaciones, firmas, saltos de nonce) contra una **política** (límites, destinos permitidos, delegados aprobados). Cada alerta nombra su regla y su evidencia:

| Regla | Evento | Severidad | Qué detecta |
|---|---|---|---|
| `R-DEL` | Delegación | Crítica | Una billetera gestionada adopta código no aprobado |
| `R-FIRMA` | Firma | Crítica | Una firma sin solicitud registrada en el flujo de aprobación |
| `R-NONCE` | Nonce | Crítica | Nonce on-chain distinto del interno: firmas consumidas fuera del sistema |
| `R-DEST` | Salida | Alta | Destino fuera de la lista y sin ticket |
| `R-VEL` | Salida | Alta | Salida acumulada en la ventana por encima del límite |
| `R-CORR` | Correlación | Crítica | Salidas anómalas en 3 o más cadenas dentro de 30 min |

La lección central es un **límite de diseño que el laboratorio mide**:

> **El freno de emergencia detiene lo que pasa por tus sistemas. Si el atacante firma con material robado fuera de tu servicio, el freno no detiene nada. Lo único que acota la pérdida en ese caso es cuánto valor había expuesto: el tope de la billetera caliente.**

Por eso el laboratorio simula **dos hipótesis** sobre la misma secuencia de hechos —infraestructura de firma comprometida frente a clave exfiltrada— y **dos días**: un ataque y un día normal. Una política evaluada solo contra el ataque parece perfecta y paraliza la operación real.

## Instrucciones

1. Ejecuta la comparación:

   ```bash
   node labs/especializacion-seguridad/le8-monitor-riesgos-custodio.mjs
   ```

2. **Exposición.** Lee la primera tabla: todas las billeteras calientes de la política superan su tope. ¿Qué significa para la pérdida máxima?
3. **Comparación de variantes.** Anota, por variante: pérdida si la infraestructura fue comprometida, pérdida si la clave fue exfiltrada, segundos hasta la pausa, alertas en un día normal, pausas en un día normal y operaciones legítimas bloqueadas.
4. **Lee el día normal.** Identifica los dos falsos positivos (`n5` por velocidad y `n9` por destino sin ticket) y explica por qué la variante `estricta` pausa el servicio.
5. **Diseña tu variante.** Añade a `politica-custodio.json` una variante que combine pausa por correlación con topes más bajos y mide su resultado. Intenta bajar la pérdida sin bloquear operaciones legítimas.
6. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le8-monitor-riesgos-custodio.test.mjs
   ```

## Código comentado

- `MonitorCustodio.procesar(evento)`: evalúa las reglas y devuelve las alertas generadas. Cada alerta aparece `latenciaDeteccionSegundos` después del evento.
- `#alertar`: registra la alerta y, si la variante tiene freno y la regla está en `pausaCon`, fija el instante de pausa.
- `simular(politica, linea, variante, hipotesis)`: repite la línea de tiempo. Con `"infraestructura"`, los eventos del ataque pasan por el servicio y se bloquean tras la pausa; con `"clave"`, el atacante firma fuera y el freno no actúa. Con topes, cada billetera pierde como máximo su tope.
- `compararVariantes`: una fila por variante con las dos pérdidas, la pausa y el coste operativo.
- `verificarExposicion`: la regla estática sobre saldos y topes.

## Pruebas

Cada regla por separado (delegación aprobada y no, firma sin ticket, nonce, destino, velocidad acumulada, correlación una sola vez); que dos cadenas no bastan; que sin freno se pierde todo; que el freno acota la pérdida solo bajo la hipótesis de infraestructura; que con clave exfiltrada ninguna variante sin topes mejora; que el tope es lo único que acota; el tiempo de alerta; los falsos positivos de un día normal; el coste operativo de la política estricta; y la tabla comparativa completa.

## Resultados esperados

```text
variante          perdida si infraestructura   perdida si clave   pausa (s)   alertas día normal   pausas   bloqueadas
solo-alertas      5 190 000                    5 190 000          —           2                    0        0
base              1 862 000                    5 190 000          930         2                    0        0
estricta            296 000                    5 190 000          30          2                    1        4
base-con-topes      205 000                      535 000          930         2                    0        0
```

Cómo leerlo:

- **`estricta` gana cuando el compromiso es de la infraestructura** (pierde 296 000) **pero no cambia nada si la clave fue copiada** (5 190 000) **y bloquea 4 operaciones legítimas en un día normal.**
- **Solo los topes bajan la pérdida con clave exfiltrada**: de 5,19 M a 0,535 M, sin freno y sin falsos positivos adicionales.
- Con `base`, la pausa llega a los 930 s porque la correlación necesita **tres cadenas**: ya han salido XRP, Solana y Bitcoin.

## Ejercicios adicionales

1. **Tu variante.** Diseña una variante que logre una pérdida menor que `base` con clave exfiltrada **y** cero operaciones legítimas bloqueadas en un día normal.
2. **Correlación.** Cambia `minimoCadenasCorrelacionadas` a 2 y a 4. ¿Qué ocurre con la pausa del ataque y con los falsos positivos?
3. **Reconciliación de nonce.** Escribe un evento `nonce` con `nonceOnchain: 44, nonceInterno: 41`. ¿Qué regla se activa y qué hipótesis sobre el acceso apoya?
4. **Hipótesis.** Argumenta qué evidencia del informe del [caso Binance](../bloques/09-caso-binance-2026-10-29.md) permitiría decidir entre las dos hipótesis.

## Soluciones

1. La respuesta es una variante con **topes bajos** (como `base-con-topes`), sin añadir `R-DEST` ni `R-VEL` a `pausaCon`: reduce la pérdida con clave exfiltrada a 535 000 y no pausa nada en un día normal.
2. Medido con la variante `base` y la hipótesis de infraestructura: con **2 cadenas** la pausa llega a los 90 s y se pierden 392 000; con **3**, a los 930 s y 1 862 000; con **4**, a los 990 s y 2 490 000. En el día normal del laboratorio no hay ningún falso positivo de correlación en ninguno de los casos, porque toda su actividad anómala ocurre en una sola cadena. Eso **no** garantiza que en una operación real no los haya (un día con retiradas legítimas simultáneas en varias cadenas sí podría dispararlos): la correlación es un compromiso entre rapidez y falsos positivos que debe calibrarse con datos propios.
3. `R-NONCE` (crítica): el nonce on-chain se adelantó a lo que el sistema firmó. Apoya la hipótesis de **firmas producidas fuera del flujo**, compatible con una clave copiada.
4. Si se confirma que se abusó de un **servicio de firma** o que se copió material de clave (U1 y U2 del caso). Mientras sean desconocidos, la conclusión de diseño es la del laboratorio: los controles que actúan en ambos casos son el tope y la detección.

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE7](LE7-flujos-multidireccion.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
