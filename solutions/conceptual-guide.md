# Guía conceptual para revisión

Este directorio no es un solucionario para copiar. Entrega **criterios de revisión** con los que puedes contrastar tu razonamiento y decidir, con honestidad, si tu entrega está lista. Copiar una respuesta te deja sin la única evidencia que importa: poder defenderla.

## Principios conceptuales de referencia

- Un hash prueba consistencia respecto de una entrada, no verdad, autoría o disponibilidad.
- Una firma prueba control de una clave sobre bytes concretos; la interfaz y el dominio forman parte del problema.
- Una Merkle proof prueba inclusión respecto de una raíz aceptada; queda por justificar quién aceptó esa raíz.
- Consenso coordina el historial; replicación y propagación por sí solas no resuelven participantes bizantinos.
- En UTXO debe conservarse valor y distinguir receptor, cambio y comisión sin asignar identidad por intuición.
- Una estimación de gas depende de estado, calldata y condiciones de inclusión.
- Las invariantes describen propiedades del sistema completo, no ejemplos puntuales.
- CEI y guardas reducen reentrancia, pero deben revisarse llamadas cruzadas y dependencias externas.
- Un oráculo firmado puede seguir siendo incorrecto, obsoleto o capturado.
- Multisig reduce dependencia de una clave; timelock ofrece tiempo de observación; ninguno corrige una mala decisión.
- Un rollup añade confianza en secuenciación, disponibilidad y puentes aunque herede verificación de una L1.
- ZK minimiza revelación del enunciado diseñado, no toda correlación externa.
- Tokenomics debe analizar derechos, concentración, emisión, demanda, salida y gobernanza; una curva no demuestra sostenibilidad.

## Qué debe demostrar una solución correcta, por nivel

### Fundamentos (módulos 00–03, prácticas 01–10)

- **Demuestra:** que distingues qué garantiza cada primitiva (hash, firma, Merkle, consenso) y qué no; que puedes predecir un resultado antes de ejecutarlo.
- **Errores que invalidan:** atribuir a una primitiva garantías que no da ("el hash prueba que es verdad"); ejecutar sin hipótesis previa; confundir replicación con consenso.
- **Autoverificación:** ¿puedo explicar qué se rompe si cambio un byte de la entrada, un participante miente o la raíz aceptada es otra?

### Desarrollo (módulos 04–07, prácticas 11–30)

- **Demuestra:** transacciones y contratos que manejas de punta a punta: construcción, firma, inclusión, estados de error; separación entre hechos on-chain e inferencias.
- **Errores que invalidan:** pruebas que solo cubren el camino feliz; ignorar reverts y estados intermedios; asignar identidad a direcciones por intuición.
- **Autoverificación:** ¿mi prueba falla si introduzco el bug a propósito? ¿Sé cuánto gas consume y por qué?

### Profesional (módulos 08–11, prácticas 31–40)

- **Demuestra:** invariantes formuladas como propiedades del sistema y verificadas con fuzzing; privilegios administrativos declarados y mitigados; análisis de incentivos, no solo de código.
- **Errores que invalidan:** invariantes triviales ("el total es un número"); confiar en un oráculo por estar firmado; multisig o timelock presentados como solución total.
- **Autoverificación:** ¿qué puede hacer el rol más privilegiado y qué pasa si su clave se compromete? ¿Encontró el fuzzer algo que yo no vi?

### Avanzado y producción (módulos 12–18, prácticas 41–50 y capstone)

- **Demuestra:** que identificas las nuevas suposiciones de confianza que introduce cada capa (secuenciador, puente, prover, comité); decisiones de arquitectura con alternativa descartada por escrito.
- **Errores que invalidan:** tratar un rollup o puente como "gratis" en confianza; ADR sin alternativa real; despliegue que solo funciona en tu máquina.
- **Autoverificación:** ¿puede otra persona reproducir mi despliegue desde el README? ¿Mi threat model condicionó alguna decisión o es decorativo?

## Tabla rápida por grupo de módulos

| Grupo | Tu solución está bien si... | Revísala si... |
|---|---|---|
| 00–03 fundamentos | Predices el resultado antes de ejecutar y explicas los límites de cada primitiva | Solo describes lo que salió en pantalla |
| 04–05 Bitcoin y EVM | Conservas valor en UTXO y explicas cada campo de una transacción | Hay "saldo perdido" o campos que no sabes justificar |
| 06–07 desarrollo | Las pruebas fallan cuando insertas el bug intencionalmente | La suite pasa incluso con el contrato roto |
| 08–09 tokens y seguridad | Declaraste privilegios y el fuzzer corrió sobre invariantes reales | El "análisis de seguridad" es una lista de patrones sin aplicar |
| 10–11 oráculos y DAO | Analizaste captura, obsolescencia e incentivos de gobernanza | Asumes que firmado = correcto o que votar = legítimo |
| 12–14 escalado y ZK | Enumeraste las suposiciones de confianza nuevas de cada capa | Presentas L2, puentes o ZK como mejora sin costo |
| 15–18 arquitectura y empresa | Hay ADR con alternativa descartada y despliegue reproducible | La decisión es "porque blockchain" y solo corre en tu equipo |

## Cómo comparar sin autoengañarte

1. Escribe tu respuesta o corre tu solución **antes** de leer los criterios; comparar de memoria infla la nota.
2. Contrasta contra los "errores que invalidan" primero: buscar dónde fallas es más informativo que confirmar dónde aciertas.
3. Explica la solución en voz alta o por escrito sin mirar el código; los huecos que aparecen son lo que falta estudiar.
4. Si un criterio te parece que "no aplica" a tu entrega, trátalo como señal de alarma y justifícalo por escrito; la mayoría de las veces sí aplica.
5. En caso de duda, la referencia de notas es [la guía de evaluación](../docs/evaluacion.md) y los [checkpoints](../assessments/checkpoints.md), no tu intuición.

## Navegación

- [Inicio del programa](../README.md) · [Currículo](../curriculum/README.md)
- [Catálogo de laboratorios](../labs/CATALOG.md) · [Evaluación](../docs/evaluacion.md)
