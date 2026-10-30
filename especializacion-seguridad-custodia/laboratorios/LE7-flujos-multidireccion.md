# LE7 · Analizar flujos entre múltiples direcciones

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE6](LE6-explorador-transacciones.md) · ➡️ [LE8 · Monitor](LE8-monitor-riesgos-custodio.md) · [Bloque 5](../bloques/05-trazabilidad-multicadena.md) · [Bloque 6](../bloques/06-stablecoins-congelamiento-y-recuperacion.md)

**Nivel:** avanzado · **Duración:** 120 min · **Código:** [le7-flujos-multidireccion.mjs](../../labs/especializacion-seguridad/le7-flujos-multidireccion.mjs) · **Datos:** [flujos-multicadena.json](../../labs/especializacion-seguridad/fixtures/flujos-multicadena.json) (100 % sintéticos) · **Pruebas:** 17

## Prerrequisitos

- LE6, y los bloques [5](../bloques/05-trazabilidad-multicadena.md) y [6](../bloques/06-stablecoins-congelamiento-y-recuperacion.md).
- La práctica de grafos de direcciones de las [clases 57–58](../../curriculum/28-data-analytics-onchain/README.md) y la distinción hecho / indicador / inferencia / hipótesis de [¿Y si cruzas la línea?](../../docs/y-si-cruzas-la-linea-blockchain.md).

## Teoría

Cuando fondos de procedencia distinta se mezclan en una dirección, lo que sale **no lleva etiqueta**. Hay que adoptar una convención de propagación, y la respuesta depende de ella:

| Método | Convención | Sesgo |
|---|---|---|
| `poison` | Toda salida de una cuenta con algo contaminado es contaminada | Sobrestima |
| `haircut` | Sale en proporción al saldo contaminado | Intermedio |
| `fifo` | El primero que entra es el primero que sale | Depende del orden |

Ninguno es "la verdad": **un informe responsable da el rango y nombra el método**. El laboratorio añade tres detectores de patrones (cadena de pelado, polvo semilla, puentes), un análisis de **recuperabilidad** (qué se puede congelar y qué no) y un informe que rotula cada afirmación como hecho, indicador, inferencia o hipótesis, **sin atribuir identidad**.

El conjunto de datos imita la *forma* descrita públicamente del caso estudiado —recolección en una dirección, intercambio de stablecoin por ETH, puente a una L2, cadena de pelado en Bitcoin, dispersión en Tron, congelamientos del emisor— sin copiar ninguna dirección ni cifra real. Los importes son «unidades de valor» abstractas.

## Instrucciones

1. Ejecuta el análisis:

   ```bash
   node labs/especializacion-seguridad/le7-flujos-multidireccion.mjs
   ```

2. **Rango de exposición.** Compara las tres columnas de `eth:hop-2` y del depósito en el exchange. Escribe una frase que presentaría el resultado a un tercero.
3. **Patrones.** Comprueba que detecta una cadena de pelado de 4 pasos que termina en `btc:p4`, y las tres direcciones sembradas con 1 TRX.
4. **Puente.** Lee el emparejamiento `b1`: ¿por qué su confianza es «media» y no «alta»?
5. **Recuperabilidad.** Anota los tres totales (ya congelado, congelable pendiente, no congelable) y comprueba que **suman el total contaminado**.
6. **Informe.** Revisa que cada afirmación tenga su categoría y que `atribucion` sea `null`.
7. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le7-flujos-multidireccion.test.mjs
   ```

## Código comentado

- `propagar(datos, metodo)`: aplica las operaciones en orden temporal sobre un libro por (dirección, activo). Cada método decide cuánta contaminación sale al retirar un importe. Un swap conserva la **fracción** contaminada (supuesto declarado).
- `exposicion` / `rangoDeExposicion`: separan lo que **llegó** a una dirección (`recibido`) de lo que **sigue** en su saldo (`contaminado`). Para «¿pasó dinero robado por aquí?» importa lo recibido; para recuperar, lo que queda.
- `detectarCadenasDePelado`: busca transacciones de dos salidas, con el grueso hacia delante, encadenadas.
- `detectarSemillasDePolvo`: direcciones cuya primera entrada fue exactamente la cantidad indicada. Es un **indicador débil**.
- `emparejarPuentes`: une salida y entrada por `refId`; una **inferencia** de confianza media.
- `analizarRecuperabilidad`: clasifica cada saldo en congelado, congelable pendiente o no congelable, de forma que los grupos sumen el total.
- `informe`: construye las afirmaciones etiquetadas y rechaza la atribución.

## Pruebas

Rango distinto por método; `poison` no subestima nunca; conservación de la contaminación en `haircut` y `fifo`; `poison` arrastra dinero limpio; errores explícitos ante métodos desconocidos o datos inconsistentes; cadena de pelado; división equilibrada que no lo es; polvo semilla; puentes con y sin pareja; recuperabilidad aditiva; saldo parcialmente congelado; informe sin atribución y con las cuatro categorías.

## Resultados esperados

```text
direccion                  poison  haircut  fifo   minimo  maximo
eth:deposito-exchange-A    200     148.05   200    148.05  200
eth:hop-2                  150     111.04   50     50      150

Cadenas de pelado: 4 pasos → btc:p4
Puente b1: eth:hop-2 → l2a:hop-3, montoSalida 150, montoEntrada 149, diferencia 1, 8 s, confianza media

Recuperabilidad (fifo): contaminado 3060 | congelado 700 | congelable pendiente 575 | no congelable 1785
```

El total se explica: se partió de 3 100 unidades contaminadas, el intercambio de stablecoin por ETH perdió 40 por el tipo de cambio, y quedan 3 060, que suman `700 + 575 + 1 785`. **Más de la mitad está en activos sin emisor.**

## Ejercicios adicionales

1. **Qué cambia al ordenar distinto.** Mueve en el archivo de datos la salida de `eth:hop-1` hacia el exchange antes de la salida hacia `hop-2` y vuelve a calcular. ¿Cuál de los tres métodos cambia?
2. **Falso emparejamiento.** Añade una segunda entrada de puente con importe y tiempo parecidos y distinto `refId`. ¿Qué te dice sobre la fiabilidad del emparejamiento por importe y tiempo?
3. **Pedir un bloqueo.** Ordena por importe las filas «congelable pendiente» y redacta la lista que enviarías primero al emisor. ¿Qué evidencia incluirías por dirección?
4. **Informe.** Redacta tres afirmaciones nuevas del informe y clasifícalas.

## Soluciones

1. Cambia solo `fifo`: la exposición del depósito pasa de 200 a **100**, porque ahora salen primero los 100 limpios que `hop-1` tenía antes. `poison` (200) y `haircut` (148,05) no cambian: el primero no mira el orden y el segundo trabaja con proporciones. Es la prueba de que el resultado de un método depende de una convención que la cadena no impone.
2. Que el emparejamiento por importe y tiempo puede ser ambiguo: ambos candidatos son plausibles. Solo un identificador del puente o el contrato del puente lo resuelve; sin eso, queda como inferencia de confianza baja.
3. Las filas son, en orden: `tron:protocolo-prestamo` (300), `tron:hop-d` (200) y `eth:parada-1` (75 restantes). Para cada una: txid de entrada, saldo actual, emisor del token y el hecho de que el activo sea congelable. Sin hipótesis de autoría.
4. Ejemplo: *Hecho* — «`eth:coleccion` recibió 1 000 USDT-LAB de `eth:origen-hot` en el paso 1»; *Indicador* — «cuatro pasos consecutivos con un trozo fijo hacia una hoja»; *Hipótesis* — «las hojas pertenecen a una única entidad».

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE6](LE6-explorador-transacciones.md) · ➡️ [LE8 · Monitor](LE8-monitor-riesgos-custodio.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
