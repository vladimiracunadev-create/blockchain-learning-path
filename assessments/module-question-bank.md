# Banco de preguntas

> Navegación: [Inicio](../README.md) · [Currículo](../curriculum/README.md) · [Checkpoints](checkpoints.md) · [Evaluación](../docs/evaluacion.md)

Banco de preguntas de **razonamiento**, no de memoria: cada una busca que argumentes, no que recites una definición. Están organizadas por etapa del programa. Cada pregunta se marca como de respuesta **objetiva** (O, tiene una respuesta correcta demostrable) o **abierta** (A, admite varias respuestas defendibles según supuestos).

## Cómo usarlas

- **Autoevaluación:** responde por escrito con supuesto, argumento, contraejemplo y evidencia. Si no puedes dar un contraejemplo, probablemente no entiendes el límite del concepto.
- **Quiz entre pares:** una persona pregunta y la otra defiende; luego se intercambian. Las preguntas abiertas se evalúan por la calidad del razonamiento, no por coincidir con una clave.
- Una respuesta objetiva mal fundamentada sigue siendo incorrecta: exige la demostración, no solo el resultado.

## Fundamentos (etapas 01–03)

1. (A) ¿Qué cambia en la confianza al pasar de una base de datos firmada a una blockchain?
2. (A) ¿Por qué una firma válida no demuestra que el firmante comprendió lo que firmaba?
3. (O) ¿Qué información **no** aporta una prueba Merkle sobre un elemento?
4. (A) ¿Cómo afecta una partición de red a las propiedades de seguridad y vivacidad?
5. (O) ¿Qué costo económico impide crear identidades Sybil en cada mecanismo de consenso?
6. (O) Dado un árbol Merkle de 8 hojas, ¿cuántos hashes necesita una prueba de inclusión?
7. (A) ¿En qué escenario un timestamp de bloque es una fuente de aleatoriedad insegura?
8. (A) Si dos nodos honestos ven cadenas distintas, ¿qué regla decide cuál prevalece y por qué?

## Bitcoin y EVM (etapas 04–05)

1. (O) Demuestra la conservación de valor en una transacción UTXO con inputs y outputs concretos.
2. (A) ¿Por qué se dice que una wallet no "contiene" bitcoins?
3. (O) Distingue el nonce de una cuenta Ethereum del nonce de la prueba de trabajo.
4. (A) ¿Cuándo conviene emitir un evento y cuándo escribir en storage?
5. (O) ¿Por qué una llamada `view` invocada desde otro contrato puede consumir gas?
6. (O) ¿Por qué una recompensa coinbase no es gastable hasta 100 confirmaciones?
7. (A) ¿Qué implica para la privacidad reutilizar una misma dirección en Bitcoin?
8. (O) ¿Cuál es la diferencia de coste de gas entre `SSTORE` de un slot nuevo y uno ya usado, y por qué?

## Desarrollo y seguridad (etapas 06–09)

1. (A) Escribe tres invariantes de un contrato **antes** de implementarlo.
2. (O) ¿Por qué CEI no resuelve por sí solo toda forma de reentrancia?
3. (O) ¿Cómo se manipula un precio spot usando liquidez temporal en un solo bloque?
4. (O) ¿Qué campos impiden reutilizar una firma en otra cadena o contrato?
5. (A) ¿Qué riesgo añade un patrón proxy aunque uses una librería conocida?
6. (O) Ante `call` que devuelve `false`, ¿qué pasa si no verificas el retorno?
7. (A) ¿Cómo diseñarías una prueba de invariante para "la contabilidad iguala los fondos"?
8. (O) ¿Por qué un `require` después de una transferencia externa puede ser demasiado tarde?
9. (A) ¿Qué distingue una corrección mínima de una reescritura al arreglar una vulnerabilidad?
10. (O) En un ataque de reentrancia clásico, ¿qué línea concreta habilita el drenaje?

## Tokens, oráculos y gobernanza (etapas 08, 10, 11)

1. (A) ¿Qué derecho real representa el token de tu proyecto? ¿Existe ese derecho sin el token?
2. (O) ¿Por qué un oráculo debe rechazar datos más viejos que cierto `maxAge`?
3. (A) ¿Cómo mitigas la manipulación de precio: TWAP, múltiples fuentes, circuit breaker? Justifica.
4. (O) ¿Qué garantiza un timelock entre la aprobación y la ejecución de una propuesta?
5. (A) ¿Cómo se captura una gobernanza con voto ponderado y cómo lo defiendes?
6. (A) ¿Cómo sale un usuario si la gobernanza queda capturada?
7. (O) ¿Por qué `mint` sin un `cap` verificable rompe la escasez declarada del token?
8. (A) ¿Cuándo un proyecto **no** necesita un token propio?

## Avanzado (etapas 12–15)

1. (A) ¿Qué supuesto de confianza añade un rollup optimista frente a la L1?
2. (A) ¿Dónde está el punto único de falla de un puente y cómo lo mitigas?
3. (O) ¿Qué distingue una prueba de validez de una prueba de fraude en cuanto a finalidad?
4. (A) ¿Qué datos quedan correlacionables pese a usar una técnica de privacidad?
5. (A) ¿Cuándo justifica una appchain su coste frente a desplegar en una L2 existente?
6. (A) ¿Qué comprometes al elegir disponibilidad de datos fuera de la L1?

## Producto y operación (etapas 16–18)

1. (A) ¿Quién puede censurar, pausar, actualizar o retirar fondos en tu sistema?
2. (A) ¿Cuál es el costo total de operar el sistema frente a una alternativa sin blockchain?
3. (A) ¿Qué datos personales quedarían almacenados o correlacionables, y cómo lo evitas?
4. (A) ¿Cómo respondes a un incidente (clave comprometida, oráculo caído) sin improvisar?
5. (A) ¿Qué nodos e infraestructura exige tu proyecto para estar disponible y monitoreado?
6. (A) ¿Por qué el proyecto justifica su costo de mantenimiento en el tiempo?
7. (A) ¿Qué obligaciones regulatorias podrían aplicar según la actividad real del proyecto?
8. (A) Si tuvieras más tiempo, ¿qué harías distinto y por qué?
