# LE5 · Construir un detector de delegaciones sospechosas

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE4](LE4-delegacion-eip7702.md) · ➡️ [LE6 · Explorador](LE6-explorador-transacciones.md) · [Bloque 4](../bloques/04-delegacion-de-permisos.md)

**Nivel:** avanzado · **Duración:** 90–120 min · **Código:** [le5-detector-delegaciones.mjs](../../labs/especializacion-seguridad/le5-detector-delegaciones.mjs) · **Datos:** [delegaciones-observadas.json](../../labs/especializacion-seguridad/fixtures/delegaciones-observadas.json) (100 % sintéticos) · **Pruebas:** 16

## Prerrequisitos

- LE4 completado y el [bloque 4](../bloques/04-delegacion-de-permisos.md) leído.
- Nociones de precisión y exhaustividad (falsos positivos y falsos negativos), vistas en las [clases 57–58](../../curriculum/28-data-analytics-onchain/README.md).

## Teoría

Una delegación EIP-7702 es una función del protocolo, no un ataque. Un detector que marque *toda* delegación es inservible; uno que no marque ninguna llega tarde. La solución es un **sistema de puntajes explicables**: cada regla aporta un peso y deja su evidencia, para que un analista pueda ver *por qué* una observación subió y discutirlo.

Las reglas observan **conducta pública**, nunca identidad:

| Regla | Señal | Peso |
|---|---|---|
| `DEL-01` | Delega en un contrato no aprobado | 30 |
| `DEL-02` | El delegado es reciente (menos de 72 h) o no está verificado | 15 |
| `DEL-03` | Cuenta de custodia con delegado no aprobado (no suma: fija un piso, ver abajo) | piso 70 |
| `DEL-04` | La envía un tercero que no es un relayer conocido | 10 |
| `DEL-05` | Tres o más autorizaciones de una misma cuenta en una transacción | 30 |
| `DEL-06` | `chain_id = 0` hacia un delegado no aprobado | 10 |
| `DEL-07` | El remitente se financió con un mezclador, es opaco o es muy reciente | 15 |
| `DEL-08` | Más de la mitad del saldo sale en los 900 s siguientes | 35 |
| `DEL-09` | La delegación no aprobada sigue activa tras 24 h | 10 |

Además, en una **cuenta de custodia** cualquier delegado no aprobado fija un piso de puntaje de 70 (crítica): la tolerancia es cero. Los niveles son: **crítica** (≥ 70), **alta** (40–69), **media** (20–39) y **baja**.

## Instrucciones

1. Ejecuta el detector sobre el conjunto sintético:

   ```bash
   node labs/especializacion-seguridad/le5-detector-delegaciones.mjs
   ```

2. Lee la tabla de resultados ordenada por puntaje y, para `m1`, explica cada regla que se disparó.
3. Observa el **barrido de umbrales**: ¿qué ocurre con precisión y exhaustividad al subir el umbral de 40 a 60 y a 70?
4. Localiza los dos casos que más importan: `b5` (legítimo, puntúa alto) y `m4` (malicioso, puntúa menos). Lee sus comentarios en el archivo de datos.
5. Abre `observacionesDesdeRed` y ejecuta el puente con LE4: el detector se aplica a lo que **tú mismo** simulaste.
6. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le5-detector-delegaciones.test.mjs
   ```

## Código comentado

- `REGLAS`: cada regla es un objeto `{ id, nombre, peso, falsoPositivo, evaluar }`. El campo `falsoPositivo` obliga a escribir **cuándo la regla se equivoca**.
- `analizarObservacion`: evalúa todas las reglas, suma (con tope de 100), aplica el piso de custodia y devuelve nivel, acción recomendada y la lista de hallazgos con su evidencia.
- `evaluar` / `barridoDeUmbrales`: matriz de confusión frente a la verdad de campo sintética.
- `observacionesDesdeRed`: convierte los recibos de la red de laboratorio en observaciones del detector; es el trabajo de un indexador real.
- `inspeccionarCodigo`: dice si un código obtenido de `eth_getCode` es una delegación y hacia dónde.

## Pruebas

Delegaciones legítimas puntúan 0; el patrón del caso estudiado llega a crítica con las reglas esperadas; cada hallazgo deja evidencia y su falso positivo; la misma firma `chain_id = 0` se detecta en cada red; la ventana de 50 se distingue aunque solo una se aplique; una revocación no alerta; el piso de custodia; la evaluación con umbral 40; el caso `b5` frente a `m4`; el coste de subir el umbral; el orden de salida; y el puente con el escenario de LE4.

## Resultados esperados

```text
id     puntaje  nivel      reglas
m1     100      crítica    DEL-01 DEL-02 DEL-04 DEL-05 DEL-07 DEL-08
m2     100      crítica    DEL-01 DEL-02 DEL-04 DEL-07 DEL-08 DEL-09
m3a    100      crítica    DEL-01 DEL-02 DEL-04 DEL-06 DEL-07 DEL-08
m3b     80      crítica    DEL-01 DEL-02 DEL-04 DEL-06 DEL-07
m3c     80      crítica    DEL-01 DEL-02 DEL-04 DEL-06 DEL-07
b5      65      alta       DEL-01 DEL-02 DEL-04 DEL-09
m4      55      alta       DEL-01 DEL-02 DEL-09
b1 b2 b3 b4 b6   0         baja

umbral  vp  fp  fn  precisión  exhaustividad
20      6   1   0   0.86       1.00
40      6   1   0   0.86       1.00
45      6   1   0   0.86       1.00
60      5   1   1   0.83       0.83
70      5   0   1   1.00       0.83
```

**La lección está en `b5` y `m4`.** El caso legítimo (una dApp nueva y patrocinada) puntúa **más** que el malicioso discreto (clave comprometida, delegación a la espera). Ningún umbral los separa: bajar el umbral mantiene el falso positivo; subirlo para eliminarlo pierde `m4`. Lo que los distingue es información que el detector no tiene: si el titular reconoce la delegación. El detector produce una **cola de revisión**, no veredictos.

## Ejercicios adicionales

1. **Nueva señal.** Diseña una regla `DEL-10` que use una señal que no esté en el conjunto (por ejemplo, el delegado nunca ha sido usado por otra cuenta). ¿Qué peso le darías y cuál es su falso positivo?
2. **Confirmación externa.** Añade un campo `confirmadoPorTitular` a la observación y haz que, si es verdadero, se reste puntaje. ¿Qué pasa con `b5` y con `m4`?
3. **Evitar el sobreajuste.** ¿Por qué no es válido elegir el umbral 45 porque "separa" los 12 casos?
4. **Custodia.** Cambia la etiqueta de `m4` a `custodio-hot`. ¿Qué nivel obtiene?

## Soluciones

1. Ejemplo: peso 10, "delegado sin uso previo por otras cuentas". Falso positivo: cualquier delegado legítimo que acaba de lanzarse. Debe sumar, no decidir.
2. Con `confirmadoPorTitular: true` en `b5`, su puntaje baja por debajo de `m4`; con `false` en `m4`, no cambia. Esa separación es la que el detector no podía producir solo.
3. Porque el umbral se eligió mirando las mismas 12 observaciones que se evalúan: es sobreajuste. En datos nuevos no hay garantía; la evaluación honesta usa datos separados y acepta el compromiso.
4. Pasa a **crítica**: el piso de custodia lo lleva a 70 aunque suma solo 55.

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE4](LE4-delegacion-eip7702.md) · ➡️ [LE6 · Explorador](LE6-explorador-transacciones.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
