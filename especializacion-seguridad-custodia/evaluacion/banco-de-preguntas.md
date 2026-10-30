# ❓ Banco de preguntas abiertas

> 🧭 [📝 Evaluación](README.md) · [📐 Rúbricas](rubricas.md) · [🛡️ Especialización](../README.md) · [🧮 Matriz](../MATRIZ-INTEGRACION.md)

Preguntas de razonamiento para debate, examen oral o ensayo breve. Complementan los [cuestionarios autocorregibles](quiz.json). Cada una lleva **criterios de revisión** (no una respuesta para copiar): una buena respuesta cita el concepto, lo aplica a un caso y declara su límite.

**Uso recomendado:** responde por escrito antes de leer los criterios; compara; reescribe lo que omitiste.

## Bloque 1 · Criptografía y firmas

1. Una billetera te pide firmar un mensaje «para verificar tu cuenta». ¿Qué tres preguntas harías antes de firmar y qué consecuencias tiene cada respuesta posible?
   *Criterios:* qué se firma exactamente (¿mensaje personal, datos tipados, transacción o autorización?); el dominio (cadena, contrato, nonce, caducidad); si la firma cede poder o solo prueba control.
2. Un servicio guarda las firmas de sus usuarios identificándolas por el hash de la firma. ¿Qué falla y cómo se arregla?
   *Criterios:* maleabilidad; la firma gemela produce otro hash; identificar por contenido o por hash de la transacción.
3. Explica por qué una clave derivada de una etiqueta pública es útil en un laboratorio y desastrosa fuera de él.
   *Criterios:* reproducibilidad frente a secreto; «no se puede recomputar» como definición de clave real.

## Bloque 2 · Cuentas y abstracción

1. Describe cinco «nonces» distintos y quién puede consumir cada uno.
   *Criterios:* nonce de cuenta, de autorización, de `UserOperation`, interno del delegado y de firma ECDSA; que el de firma no es un contador.
2. Un exchange valida que los pagos solo vayan a direcciones «sin código». ¿Sigue siendo una buena regla?
   *Criterios:* EIP-7702; `extcodesize` de una cuenta delegada; la regla no distingue persona de contrato.
3. Compara ERC-4337 y EIP-7702 para una wallet corporativa. ¿Cuándo elegirías cada uno o ambos?
   *Criterios:* nueva dirección frente a la misma; mercado paralelo de operaciones; compatibilidad; el riesgo de persistencia de 7702.

## Bloque 3 · Custodia y claves

1. Diseña los topes de una hot wallet para una entidad que mueve el 2 % de sus fondos al día. Justifica el saldo máximo.
   *Criterios:* demanda esperada, reposición, coste de liquidez frente a exposición; que el tope es una decisión de negocio explícita.
2. «Usamos MPC, así que no se puede robar la clave.» Discútelo.
   *Criterios:* MPC protege contra la exfiltración de la clave completa; no contra el abuso del flujo ni del orquestador.
3. Escribe cinco reglas de una política de firma para una billetera caliente y di cuáles rechazan por defecto.
   *Criterios:* tipos prohibidos (autorización de delegación, aprobación ilimitada, firma ciega), destinos, límites, aprobaciones, retardo.

## Bloque 4 · Delegación de permisos

1. Ordena por poder cedido: `permit`, `approve` ilimitado, `setApprovalForAll`, delegación EIP-7702, rol de contrato. Justifica el orden.
   *Criterios:* amplitud, persistencia, invisibilidad; la delegación de código incluye activos futuros.
2. Revisa en diez preguntas un delegado que «ejecuta cualquier llamada si trae una firma del dueño». ¿Qué falta?
   *Criterios:* nonce interno, cadena y cuenta en lo firmado, caducidad, inicialización protegida.
3. Tu detector marca una dApp nueva y legítima. ¿Qué haces: subes el umbral, añades una regla o cambias el proceso?
   *Criterios:* el puntaje no separa; confirmación del titular por un canal independiente; cola de revisión; coste de cada decisión.

## Bloque 5 · Trazabilidad multicadena

1. Un analista afirma que «el 80 % de los fondos del exchange X son robados». ¿Qué le preguntas?
   *Criterios:* método de propagación; rango; qué activos; qué corte temporal; si es hecho, inferencia o hipótesis.
2. ¿Por qué una cadena de pelado es un indicador y no una prueba?
   *Criterios:* otros actores pueden producir el mismo patrón; no demuestra autoría ni relación.
3. Un puente muestra una salida de 150 y una entrada de 149 a los 8 segundos. ¿Qué confianza das al emparejamiento y qué más pedirías?
   *Criterios:* importe, tiempo, identificador; candidatos ambiguos; el contrato del puente.

## Bloque 6 · Stablecoins y congelamiento

1. Se roban 100 en ETH y 100 en un stablecoin con emisor. Describe la respuesta en la primera hora.
   *Criterios:* congelar lo congelable ya; contactar al emisor; identificar direcciones; el ETH no se puede congelar, pero se puede seguir su rastro y avisar a exchanges.
2. ¿Qué riesgos tiene que un emisor pueda congelar cualquier dirección?
   *Criterios:* congelamiento erróneo; apelación; concentración de poder; privacidad.
3. Un comunicado dice «hemos recuperado 3 000 millones». ¿Qué matizas?
   *Criterios:* congelado no es recuperado; cifras con corte horario; restitución posterior; lo no congelable.

## Bloque 7 · Transacciones, eventos y logs

1. Un token emite un `Transfer` de una dirección que nunca tuvo saldo. ¿Cómo lo detectas y qué concluyes?
   *Criterios:* contrastar con saldos; verificar contrato emisor; token malicioso.
2. ¿Qué cinco cosas lees en una transacción tipo 4 que un explorador genérico quizá no te muestre?
   *Criterios:* remitente frente a autoridades; delegado; `chain_id`; varias tuplas por autoridad; efecto vigente.
3. ¿Por qué una conclusión sobre `latest` debe llevar un aviso?
   *Criterios:* reorganizaciones; finalidad; `safe` y `finalized`.

## Bloque 8 · Pruebas de reservas

1. Una entidad publica una raíz de Merkle de pasivos y una firma de desafío. ¿Qué puedes afirmar y qué no?
   *Criterios:* inclusión de tu hoja; control de las claves; no completitud, no titularidad, no solvencia.
2. ¿Cómo se maquilla una prueba de reservas y cómo se contrarresta?
   *Criterios:* préstamos temporales, omisión de pasivos, doble uso, valoración; fechas imprevisibles, auditoría de completitud.
3. ¿Qué evidencia pedirías a una entidad que afirma que cubrirá las pérdidas de un incidente?
   *Criterios:* cobertura por activo posterior; mecanismo de absorción; quién puede verificarlo.

## Bloque 9 · Caso Binance

1. Clasifica estas afirmaciones: «se robaron 6 300 millones», «fue Corea del Norte», «el acceso fue un portátil», «el contrato delegado solo obedecía a un operador», «el contenedor de servicio fue la vía».
   *Criterios:* declaración de Binance con cifra provisional; evaluación de terceros; declaración de Binance de una investigación inicial; hecho verificable en cadena por una fuente técnica; no verificado.
2. ¿Por qué las diez cadenas importan más que el mecanismo de Ethereum para entender la causa?
   *Criterios:* EIP-7702 solo explica Ethereum; en las otras nueve hubo firmas normales; apunta a una capa común.
3. Redacta, en diez líneas, qué publicarías a las 24 horas si fueras la entidad afectada.
   *Criterios:* hechos contenidos, importe identificado, congelado con su corte, desconocidos, próximo informe; sin atribución prematura.

## Preguntas integradoras

1. «El ataque funcionó porque la firma era válida.» ¿Qué parte es cierta y qué controles actúan sobre lo que una firma válida no resuelve?
2. Dos custodios con las mismas tecnologías pierden cantidades muy distintas. ¿Qué diferencias de diseño lo explican?
   *Criterios:* topes, independencia real, política de firma, detección, tiempo de respuesta.
3. Diseña un simulacro de incidente para una custodia: escenario, métricas y criterio de éxito.
   *Criterios:* hipótesis múltiples, tiempo hasta la primera alerta y hasta la contención, coste operativo, día normal de contraste.
4. ¿Qué cambiarías en el diseño si el informe definitivo confirmara que se copiaron claves? ¿Y si se abusó de un servicio de firma?
   *Criterios:* tabla de controles por hipótesis; tope y detección en ambos casos; política de firma y freno solo en el segundo.
5. Explica a un directivo no técnico por qué «tenemos seguros y congelamiento» no sustituye al tope de saldo.
   *Criterios:* congelamiento posterior y parcial; activos no congelables; el tope actúa antes y siempre.

## 🧭 Navegación

[📝 Evaluación](README.md) · [📐 Rúbricas](rubricas.md) · [🛡️ Especialización](../README.md) · [🧮 Matriz](../MATRIZ-INTEGRACION.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)
