# 📐 Rúbricas

> 🧭 [📝 Evaluación](README.md) · [🛡️ Especialización](../README.md) · [🧪 Laboratorios](../laboratorios/README.md) · [❓ Banco de preguntas](banco-de-preguntas.md)

Cada rúbrica suma **10 puntos** (las del caso y el proyecto, 20). El logro de un criterio se decide por la **evidencia observable** de la columna central, no por impresión. Las faltas críticas de la [evaluación](README.md#faltas-críticas) se aplican a todas.

## Rúbricas de los laboratorios

### R-LE1 · Billeteras de prueba

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Reproduce el laboratorio y sus pruebas | 3 | Salida coherente con los resultados esperados; las pruebas pasan sin editarlas |
| Explica cuenta, clave y dirección | 3 | Distingue clave privada, clave pública y dirección y qué se calcula de qué |
| Distingue clave de prueba de clave real | 2 | Explica por qué una clave derivada de una etiqueta no protege nada |
| Higiene de evidencia | 2 | La bitácora no incluye ninguna clave privada |

### R-LE2 · Firmas digitales

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Verifica correctamente | 2 | Separa recuperar de comparar con la dirección esperada |
| Explica qué prueba y qué no una firma | 3 | Cita al menos tres cosas que una firma válida no demuestra |
| Demuestra maleabilidad y repetición | 3 | Muestra la gemela rechazada y un mensaje con dominio que impide la reutilización |
| Explica la fuga por nonce repetido | 2 | Identifica la huella (mismo `r`) y la defensa (nonce determinista) |

### R-LE3 · Transferencias simuladas

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Ejecuta y concilia | 3 | La conservación del valor se comprueba con cifras, comisiones incluidas |
| Relaciona cada rechazo con su regla | 3 | Nonce, cadena y saldo asociados a la validación correspondiente |
| Explica reversión frente a rechazo | 2 | Una revertida consume nonce y gas; una rechazada no |
| Reconstruye movimientos desde eventos | 2 | El saldo de tokens deducido de los `Transfer` coincide con el estado |

### R-LE4 · Delegación EIP-7702

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Muestra el ciclo completo | 3 | Código antes, durante y después; revocación |
| Explica el nonce de autoridad y de remitente | 2 | Justifica el `+ 1` cuando el remitente es la autoridad |
| Compara los dos órdenes de la ventana | 3 | Cuantifica cuántas se aplican y el salto de nonce en cada orden |
| Distingue delegado seguro de hostil | 2 | Señala la diferencia de control de acceso y la persistencia |

### R-LE5 · Detector de delegaciones

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Interpreta resultados | 3 | Explica las reglas de al menos tres observaciones |
| Evalúa con honestidad | 3 | Reconoce que `b5` y `m4` no se separan por puntaje y explica por qué |
| Propone una mejora fundamentada | 2 | Una regla nueva con su peso y su falso positivo |
| Evita el sobreajuste | 2 | No elige un umbral solo porque «clasifica bien» el mismo conjunto |

### R-LE6 · Explorador de transacciones

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Lee una transacción tipo 4 | 3 | Identifica remitente, autoridades, delegado y `chain_id` |
| Distingue «firmó» de «aplicó» | 3 | Usa el código actual para el efecto |
| Trata los eventos con prudencia | 2 | Verifica emisor y saldos antes de fiarse de un `Transfer` |
| Usa el modo en vivo con seguridad | 2 | Solo lectura, sin credenciales en la URL, contraste con una segunda fuente |

### R-LE7 · Flujos entre direcciones

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Presenta la exposición como rango | 3 | Los tres métodos, con su sesgo, y la frase de informe |
| Rotula cada afirmación | 3 | Hecho, indicador, inferencia o hipótesis, sin atribución de identidad |
| Analiza la recuperabilidad | 2 | Los tres grupos suman el total y se identifica qué solicitar al emisor |
| Explica la dependencia del orden | 2 | Muestra que solo FIFO cambia al reordenar |

### R-LE8 · Monitor de riesgos para custodios

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Evalúa bajo las dos hipótesis | 3 | Pérdida con infraestructura comprometida y con clave exfiltrada |
| Mide el coste operativo | 2 | Alertas, pausas y operaciones legítimas bloqueadas en un día normal |
| Diseña una variante | 3 | Mejora un criterio sin empeorar otro, justificada con cifras |
| Reconoce los límites del freno | 2 | Explica por qué solo el tope actúa con clave exfiltrada |

## Rúbrica del informe del caso (R-CASO)

**20 puntos.** Entrega: un informe sobre el [incidente estudiado](../bloques/09-caso-binance-2026-10-29.md) o sobre otro incidente de custodia que elijas, con fecha de corte.

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Separa hechos, hipótesis y desconocidos | 5 | Cada afirmación en su categoría; al menos 8 hechos, 3 hipótesis y 5 desconocidos |
| Cita y contrasta fuentes | 4 | Fuente primaria o la más cercana; fecha; discrepancias explicadas |
| Trata las discrepancias de cifras | 3 | Explica qué mide cada una (valoración, activos, hora de corte) |
| Razona los controles bajo cada hipótesis | 4 | Tabla de controles contra al menos dos hipótesis, sin concluir más de lo que la evidencia permite |
| No atribuye ni acusa | 2 | Ninguna atribución individual; la de grupo, como evaluación de terceros con su confianza |
| Plan de actualización | 2 | Qué filas se reabrirán cuando haya información nueva |

## Rúbrica del proyecto integrador (R-PROY)

**20 puntos.** Entrega: la protección de una custodia ficticia ante el patrón estudiado.

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Arquitectura hot / warm / cold | 4 | Capas con propósito, tope, cuórum y reposición; la exposición máxima calculada |
| Política de firma como código | 4 | Tipos prohibidos por defecto (incluida la autorización de delegación), destinos, límites y aprobaciones |
| Monitor y comparación de variantes | 4 | Reglas con evidencia; resultados bajo las dos hipótesis y en un día normal |
| Delegaciones | 3 | Inventario, lista de delegados aprobados, detección y revocación |
| Respuesta | 3 | Contactos con emisores, lista de direcciones preparada, orden de acciones, comunicación honesta |
| Honestidad del informe | 2 | Clasifica sus afirmaciones y declara los límites de sus datos sintéticos |

## Niveles de desempeño

| Nivel | Puntaje | Descripción |
|---|---|---|
| Dominio | 90–100 % | Ejecuta, explica y extiende; detecta los límites de su propia evidencia |
| Logrado | 70–89 % | Ejecuta y explica correctamente; sus extensiones son menores |
| En desarrollo | 50–69 % | Ejecuta, pero sus explicaciones omiten límites o confunden conceptos |
| Inicial | menos de 50 % | No reproduce o no justifica |

Un resultado por debajo de «Logrado» en un laboratorio indica **repetirlo**, no avanzar.

## 🧭 Navegación

[📝 Evaluación](README.md) · [🛡️ Especialización](../README.md) · [❓ Banco de preguntas](banco-de-preguntas.md) · [🧪 Laboratorios](../laboratorios/README.md) · [🏠 Programa](../../README.md)
