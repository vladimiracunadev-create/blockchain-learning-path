# Guías 72–83 · Blockchain Data Analytics y minería de datos on-chain

Este cuaderno resuelve las doce prácticas del [módulo 28](../../curriculum/28-data-analytics-onchain/README.md), que llevan de leer un bloque campo por campo a entregar un explorador analítico con su informe y sus limitaciones.

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Todas trabajan sobre una **cadena sintética determinista** ([`cadena-sintetica.mjs`](../28-data-analytics/cadena-sintetica.mjs)): dos modelos —UTXO y cuentas—, eventos de token, mempool, reorganizaciones y patrones plantados con su **verdad de campo**. Sin red, sin claves, sin fondos y sin datos personales. La misma semilla produce siempre el mismo dataset, así que cada criterio de aceptación es comprobable.

**Regla ética que atraviesa las doce:** una dirección no es una persona, un patrón es un indicador y no una prueba, y todo detector produce falsos positivos que paga alguien real.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 72 | Anatomía de un bloque campo por campo | auto | `pnpm lab:bloque` |
| 73 | Transacción Bitcoin frente a transacción EVM | auto | `pnpm lab:tx-comparada` |
| 74 | Extracción por RPC con checkpoint y reorganización | auto | `pnpm lab:extraccion` |
| 75 | Normalizar, validar y almacenar sin duplicar | auto | `pnpm lab:normalizar` |
| 76 | Direcciones activas, volumen y comisiones | auto | `pnpm lab:metricas-onchain` |
| 77 | Eventos de un contrato de token | auto | `pnpm lab:eventos-token` |
| 78 | Grafo de direcciones y transacciones | auto | `pnpm lab:grafo` |
| 79 | Rastreo de fondos en un caso simulado | auto | `pnpm lab:rastreo` |
| 80 | Fan-in, fan-out y cadena de pelado | auto | `pnpm lab:patrones` |
| 81 | Detección de anomalías y su evaluación | auto | `pnpm lab:anomalias` |
| 82 | Panel de indicadores on-chain | auto | `pnpm lab:panel` |
| 83 | Explorador analítico (proyecto final) | auto | `pnpm lab:explorador` |

Cada práctica se resuelve con la misma estructura: **objetivo**, **cómo se resuelve**, **comando**, **salida esperada**, **verificación**, **criterio de aceptación** y **error común**. Los ejercicios autónomos y las preguntas de reflexión cierran cada bloque de nivel.

## 72 · Anatomía de un bloque campo por campo

- **Nivel:** inicial · **Duración:** 20 min · **Requisitos previos:** módulos [01](../../curriculum/01-criptografia/README.md) y [04](../../curriculum/04-bitcoin/README.md).
- **Objetivo:** explicar qué significa cada campo de un bloque en los dos modelos, y qué información **no** contiene un bloque.
- **Cómo se resuelve:** [`anatomia-bloque.mjs`](../28-data-analytics/anatomia-bloque.mjs) recorre un bloque UTXO y uno de cuentas y devuelve, por cada campo, un objeto `{campo, valor, significa}`. `resumenBloqueUTXO` y `resumenBloqueCuentas` calculan lo que **no** es un campo del bloque: comisión total y ocupación.

```bash
pnpm lab:bloque
```

```text
altura / número      → posición en la cadena
hashPrevio           → encadenamiento: alterar un bloque antiguo invalida los siguientes
marcaTiempo          → la declara quien propone el bloque, con margen: no es un reloj fiable
confirmaciones       → coste de revertir, no un sello de validez
…
Criterio de aceptación: anatomiaBloqueUTXO y anatomiaBloqueCuentas describen todos los campos
estructurales de su bloque, y los resúmenes calculan comisión total y ocupación sin que esos
valores existan como campo directo.
```

- **Verificación:** `node --test labs/28-data-analytics/anatomia-bloque.test.mjs` (10 pruebas).
- **Error común:** tomar la marca de tiempo como hora exacta del hecho. Sirve para agregar por periodo; no para ordenar dos sucesos separados por segundos.

## 73 · Transacción Bitcoin frente a transacción EVM

- **Nivel:** inicial · **Duración:** 25 min · **Requisitos previos:** práctica 72.
- **Objetivo:** comparar los dos modelos de datos y saber dónde vive el importe en cada uno.
- **Cómo se resuelve:** [`tx-btc-vs-evm.mjs`](../28-data-analytics/tx-btc-vs-evm.mjs) describe una transacción UTXO (entradas, salidas, **salida de cambio**, comisión deducida como entradas − salidas, sat/vB) y una de cuentas (`de`, `para`, `nonce`, `gasUsado × precioGas`), y `compararModelos()` tabula las diferencias.

```bash
pnpm lab:tx-comparada
```

```text
UTXO      → la comisión NO es un campo: es entradas − salidas
UTXO      → la salida de cambio vuelve al remitente (confundirla con un pago infla el volumen)
Cuentas   → en una transferencia de token, `valor` es 0: el importe vive en el LOG del evento
Criterio de aceptación: describirTxUTXO deduce la comisión y marca el cambio; describirTxCuentas
expone que el valor nativo es 0 en una transacción de token.
```

- **Verificación:** `node --test labs/28-data-analytics/tx-btc-vs-evm.test.mjs` (10 pruebas).
- **Error común:** analizar tokens leyendo `valor` de la transacción y concluir que no se movió nada.

### Ejercicios del nivel 1

- **Guiado:** toma otro bloque del dataset (`dataset().cuentas[30]`) y escribe con tus palabras qué ocurrió en él.
- **Autónomo:** calcula el volumen total del bloque UTXO 12 **sin** contar las salidas de cambio y compáralo con el total bruto. ¿Cuánto sobreestima?
- **Reflexión:** si dos direcciones pertenecen a la misma persona pero nunca interactúan entre sí, ¿puede notarlo alguien mirando solo la cadena?

## 74 · Extracción por RPC con checkpoint y reorganización

- **Nivel:** intermedio · **Duración:** 35 min · **Requisitos previos:** módulos [10](../../curriculum/10-oraculos-indexacion/README.md) y [16](../../curriculum/16-infraestructura-nodos/README.md).
- **Objetivo:** extraer datos como se hace de verdad: por rangos, reanudable, tolerante a fallos y consciente de las reorganizaciones.
- **Cómo se resuelve:** [`extraccion-rpc.mjs`](../28-data-analytics/extraccion-rpc.mjs) usa el [nodo simulado](../28-data-analytics/rpc-simulado.mjs). `extraerRango` pagina respetando el truncamiento del proveedor; `extraerConReintentos` sobrevive a un `ErrorRPC` transitorio; `extractorConCheckpoint` reanuda sin releer; `detectarReorganizacion` compara **hashes**, no números, y devuelve los bloques huérfanos.

```bash
pnpm lab:extraccion
```

```text
Bloques huérfanos detectados: 56, 57, 58, 59
Los bloques huérfanos deben RETIRARSE de cualquier agregado: sus transacciones nunca se
confirmaron en la cadena definitiva, y contarlas sería contar dinero que no se movió.
Criterio de aceptación: … detectarReorganizacion identifica por hash (no por número) los
bloques que hay que retirar.
```

- **Verificación:** `node --test labs/28-data-analytics/extraccion-rpc.test.mjs` (10 pruebas).
- **Error común:** dar por completa una respuesta truncada. Pedir mil bloques y recibir diez no es un error del proveedor: es su límite de página, y el extractor debe notarlo.

## 75 · Normalizar, validar y almacenar sin duplicar

- **Nivel:** intermedio · **Duración:** 35 min · **Requisitos previos:** práctica 74.
- **Objetivo:** convertir datos crudos en registros consultables y **idempotentes**.
- **Cómo se resuelve:** [`normalizar-almacenar.mjs`](../28-data-analytics/normalizar-almacenar.mjs) aplana cada transacción (importes como texto para no perder precisión, fecha ISO derivada, día), `validarRegistro` rechaza lo imposible y `crearAlmacen()` indexa por hash, por dirección y por bloque. Insertar dos veces el mismo hash **no duplica**.

```bash
pnpm lab:normalizar
```

```text
duplicados descartados: 210 (debe igualar el total)
total en el almacén tras el reintento: 210 (no debe crecer)
Criterio de aceptación: OK — recargar el mismo lote no cambió el tamaño del almacén (210 → 210).
```

- **Verificación:** `node --test labs/28-data-analytics/normalizar-almacenar.test.mjs` (9 pruebas).
- **Error común:** confiar en que "cada bloque se lee una vez". Los reintentos y las reorganizaciones re-entregan datos: sin idempotencia, los agregados crecen solos.

### Ejercicios del nivel 2

- **Guiado:** provoca una reorganización con `nodo.reorganizar(50)` y comprueba cuántas transacciones desaparecen del agregado.
- **Autónomo:** añade al almacén un índice por día y una consulta `consultarPorDia`.
- **Reflexión:** ¿qué diferencia hay entre ETL y ELT aquí, y cuál elegirías si mañana cambia la definición de "transferencia"?

## 76 · Direcciones activas, volumen y comisiones

- **Nivel:** intermedio · **Duración:** 30 min · **Requisitos previos:** práctica 75.
- **Objetivo:** calcular los indicadores básicos y saber exactamente qué miden.
- **Cómo se resuelve:** [`metricas-actividad.mjs`](../28-data-analytics/metricas-actividad.mjs) calcula direcciones activas y nuevas, volumen y comisiones por periodo, y `concentracion()` la cuota del top-N con un índice **HHI** documentado.

```bash
pnpm lab:metricas-onchain
```

```text
cuota del top 5: 59.7%
índice HHI: 0.2418 (1 = una sola dirección concentra todo)
Criterio de aceptación: OK — las direcciones nuevas (59) no superan a las activas (59).
```

- **Verificación:** `node --test labs/28-data-analytics/metricas-actividad.test.mjs` (9 pruebas).
- **Error común:** traducir "direcciones activas" por "usuarios". Una persona controla muchas direcciones y un servicio atiende a miles con una sola.

## 77 · Eventos de un contrato de token

- **Nivel:** intermedio · **Duración:** 30 min · **Requisitos previos:** módulos [05](../../curriculum/05-ethereum-evm/README.md) y [08](../../curriculum/08-tokens/README.md).
- **Objetivo:** decodificar a mano un evento `Transfer` y reconstruir tenencias desde los logs.
- **Cómo se resuelve:** [`eventos-token.mjs`](../28-data-analytics/eventos-token.mjs) comprueba `topics[0]` contra la firma real de `Transfer(address,address,uint256)`, recorta el relleno de 32 bytes de `topics[1]`/`topics[2]`, parsea el importe con `BigInt` y contrasta el resultado con el campo ya decodificado del generador.

```bash
pnpm lab:eventos-token
```

```text
│ 4 │ '0x0006ed11ed11…' │ '6799 EDUSD' │
Criterio de aceptación: OK — la decodificación manual coincide con el campo "decodificado".
```

- **Verificación:** `node --test labs/28-data-analytics/eventos-token.test.mjs` (9 pruebas).
- **Error común:** ignorar los decimales del token. Con 6 decimales, `6799000000` no son seis mil ochocientos millones: son 6 799.

## 78 · Grafo de direcciones y transacciones

- **Nivel:** profesional · **Duración:** 40 min · **Requisitos previos:** prácticas 76 y 77.
- **Objetivo:** modelar la actividad como red y leer sus grados, caminos y componentes.
- **Cómo se resuelve:** [`grafo-direcciones.mjs`](../28-data-analytics/grafo-direcciones.mjs) extrae las transferencias (token desde los logs, más las nativas), agrega una arista por par origen→destino con `veces` e `importeTotal`, y calcula grados, vecinos, componentes conexas y exportación a DOT/CSV para visualizar.

```bash
pnpm lab:grafo
```

```text
Criterio de aceptación: el grafo tiene 59 nodos, 192 aristas agregadas, y la dirección de
colección alcanza grado de entrada >= 9: CUMPLE.
```

- **Verificación:** `node --test labs/28-data-analytics/grafo-direcciones.test.mjs` (9 pruebas).
- **Error común:** leer un grado altísimo como sospecha. Un nodo muy conectado suele ser un servicio con miles de clientes.

## 79 · Rastreo de fondos en un caso simulado

- **Nivel:** profesional · **Duración:** 40 min · **Requisitos previos:** práctica 78.
- **Objetivo:** seguir el recorrido del dinero y entender por qué el resultado depende del criterio.
- **Cómo se resuelve:** [`rastreo-fondos.mjs`](../28-data-analytics/rastreo-fondos.mjs) implementa BFS para el camino más corto, rastreo hacia delante y hacia atrás con límite de saltos, y `propagarMarca` con criterio **proporcional**, documentando que FIFO, LIFO o *haircut* darían otro reparto.

```bash
pnpm lab:rastreo
```

```text
Recuerda: este porcentaje depende del criterio (proporcional). Con FIFO, LIFO o haircut el
número cambiaría. Por eso un rastreo de fondos es evidencia a INVESTIGAR, no una prueba cerrada.
Criterio de aceptación: existe camino en la cadena de pelado (SÍ) y la propagación alcanza al
menos una dirección aguas abajo (SÍ).
```

- **Verificación:** `node --test labs/28-data-analytics/rastreo-fondos.test.mjs` (11 pruebas).
- **Error común:** presentar el porcentaje marcado como un hecho. Sin declarar el criterio, la cifra no es reproducible ni refutable.

## 80 · Fan-in, fan-out y cadena de pelado

- **Nivel:** profesional · **Duración:** 40 min · **Requisitos previos:** práctica 79.
- **Objetivo:** detectar patrones estructurales y medir el detector contra la verdad de campo.
- **Cómo se resuelve:** [`patrones-fan.mjs`](../28-data-analytics/patrones-fan.mjs) implementa los cuatro detectores (fan-in, fan-out, transferencias rápidas y pelado, este último encadenando por dirección y no por posición) y `evaluarDetecciones` calcula precisión y recall.

```bash
pnpm lab:patrones
```

```text
Recuerda: fan-in, fan-out y peel chain son INDICADORES, no pruebas. Una dirección no es una persona.
Criterio de aceptación: se recupera el fan-in de 9, el fan-out de 8 y la cadena de pelado: CUMPLE.
```

- **Verificación:** `node --test labs/28-data-analytics/patrones-fan.test.mjs` (11 pruebas).
- **Error común:** encadenar los pasos del pelado por orden de bloque. El tráfico de fondo se cuela entre medias y parte la cadena en fragmentos: hay que seguir la dirección del resto.

### Ejercicios del nivel 3

- **Guiado:** exporta el grafo con `aDot()` y ábrelo con Graphviz; localiza visualmente el fan-in.
- **Autónomo:** afloja el umbral de transferencias rápidas de 24 a 120 segundos y cuenta cuántos casos aparecen. ¿Cuántos revisarías a mano?
- **Reflexión:** ¿qué actividad perfectamente legítima produce un fan-out de ocho destinos en pocos minutos?

## 81 · Detección de anomalías y su evaluación

- **Nivel:** avanzado · **Duración:** 45 min · **Requisitos previos:** práctica 80.
- **Objetivo:** detectar lo atípico, **medirlo** y explicar cada decisión.
- **Cómo se resuelve:** [`deteccion-anomalias.mjs`](../28-data-analytics/deteccion-anomalias.mjs) implementa estadísticas a mano, z-score y regla de Tukey (IQR), evalúa contra la verdad de campo con precisión, recall, F1 y tasa de falsos positivos —con divisiones protegidas para no devolver `NaN`—, dibuja la curva del umbral y `explicar()` traduce cada detección a lenguaje llano.

```bash
pnpm lab:anomalias
```

```text
… en datos reales solo se puede auditar la PRECISIÓN (revisar a mano lo marcado), nunca el
recall, salvo con una auditoría exhaustiva aparte.
Criterio de aceptación: con factor 1.5 el detector encuentra las 3 anomalías plantadas
(recall = 1) con precisión > 0 → OK.
```

- **Verificación:** `node --test labs/28-data-analytics/deteccion-anomalias.test.mjs` (12 pruebas).
- **Error común:** usar media y desviación con datos de cola larga: la propia anomalía infla la media y se esconde detrás de ella. La mediana y el IQR resisten.

## 82 · Panel de indicadores on-chain

- **Nivel:** avanzado · **Duración:** 40 min · **Requisitos previos:** prácticas 76 y 81.
- **Objetivo:** presentar los indicadores sin inducir conclusiones falsas.
- **Cómo se resuelve:** [`panel-indicadores.mjs`](../28-data-analytics/panel-indicadores.mjs) calcula los indicadores, construye la serie temporal con la **granularidad adecuada a la ventana** (esta cadena dura doce minutos, así que se agrega por minuto; con años de historia se agregaría por día), y renderiza en texto con barras ASCII, en HTML autocontenido y en CSV. La advertencia de lectura va impresa dentro del panel, no en una nota al pie.

```bash
pnpm lab:panel
```

```text
2026-01-05 00:10  [########################################]  vol= 323318.00  tx= 14
ADVERTENCIA: Estos indicadores describen actividad OBSERVADA en la cadena, no comportamiento
de personas…
Criterio de aceptación: los totales de `calcularIndicadores` y `serieTemporal` cuadran → OK.
```

- **Verificación:** `node --test labs/28-data-analytics/panel-indicadores.test.mjs` (11 pruebas).
- **Error común:** elegir la granularidad por costumbre. Agregar doce minutos "por día" produce un único punto y un gráfico que aparenta información sin tenerla.

## 83 · Explorador analítico (proyecto final)

- **Nivel:** avanzado · **Duración:** 90 min · **Requisitos previos:** las once anteriores.
- **Objetivo:** integrar todo en una herramienta consultable que **exporte un informe con sus limitaciones**.
- **Cómo se resuelve:** [`projects/explorador-analitico/`](../../projects/explorador-analitico/README.md) compone los módulos anteriores sin reimplementar nada: importa el dataset, consulta bloques, transacciones y direcciones, filtra por rango, día, activo y dirección, calcula métricas, construye el grafo, aplica los detectores y genera el informe.

```bash
pnpm lab:explorador
node projects/explorador-analitico/explorador.mjs --desde 20 --hasta 40 --activo token --informe informe.md
```

```text
Patrones: fan-in 10 · fan-out 6 · pelado 1 · rápidas 67 · anomalías 12
Calidad de las anomalías: precisión 0.25, recall 1.00 (medible SOLO porque el dataset es sintético).
Criterio de aceptación: la consulta devuelve resultados, el informe incluye sus limitaciones y
ninguna afirmación atribuye identidad.
```

- **Verificación:** `node --test projects/explorador-analitico/explorador.test.mjs` (20 pruebas), incluidas las que comprueban que el perfil de una dirección **no contiene campos de identidad** y que el informe siempre lleva sus limitaciones.
- **Error común:** tratar la salida completa del detector como "detecciones". `detectarAnomalias` puntúa **todas** las observaciones y marca las atípicas: sin filtrar por la marca, la precisión se desploma al 1 %.

### Ejercicios del nivel 4 y cierre

- **Guiado:** genera el informe de la ventana 20–40 y localiza en él la frontera entre hecho, indicador, inferencia e hipótesis.
- **Autónomo:** implementa el reto del módulo (detector de pelado con criterio propio) y mide su precisión y recall.
- **Desafío:** añade un criterio de rastreo FIFO y compara, sobre el mismo caso, qué porcentaje de fondos queda marcado frente al criterio proporcional. Documenta por qué ambos son defendibles.
- **Reflexión final:** ¿qué te haría falta —fuera de la cadena— para convertir una de tus inferencias en una afirmación sobre una persona, y quién debería autorizar ese paso?

---

## 🧭 Navegación

- Anterior: [Guías 51–70 · Finanzas on-chain](06-finanzas-onchain.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md) · [Módulo 28](../../curriculum/28-data-analytics-onchain/README.md)
