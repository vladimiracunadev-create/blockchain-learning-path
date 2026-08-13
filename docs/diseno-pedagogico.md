# Diseño pedagógico

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [📝 Evaluación](evaluacion.md)

Este documento describe **cómo está diseñado el aprendizaje** del programa: el ciclo
de trabajo de cada módulo, la taxonomía de objetivos, la construcción de una lección,
el manejo de la carga cognitiva y la estrategia de evaluación. No es un temario; es la
ingeniería instruccional que sostiene los 28 módulos.

## Principios

- La aprobación no depende solo de compilar. El estudiante justifica decisiones,
  identifica riesgos y reproduce resultados.
- Cada concepto se estudia por su modelo mental, no por su sintaxis.
- Los casos reales anclan la teoría; las analogías se usan y luego se rompen.
- La evidencia es reproducible: comando, resultado esperado y resultado obtenido.

## Competencias finales

Al completar el programa, el estudiante puede:

1. decidir justificadamente si un problema necesita blockchain;
2. explicar criptografía, consenso, Bitcoin y EVM con modelos propios;
3. implementar, probar y conectar contratos;
4. descubrir fallos técnicos y económicos;
5. diseñar operación, gobernanza y respuesta ante incidentes;
6. comparar ecosistemas sin depender de marketing;
7. presentar un producto con costos, riesgos y límites explícitos.

## El ciclo de aprendizaje

Cada módulo recorre cinco fases. No se avanza a "construir" sin haber "experimentado",
ni se cierra sin "verificar". El ciclo es iterativo: verificar puede devolver a comprender.

```mermaid
flowchart LR

    A["Comprender"] --> B["Experimentar"]
    B --> C["Explicar"]
    C --> D["Construir"]
    D --> E["Verificar"]
    E -->|"brecha detectada"| A
```

| Fase | Pregunta que responde | Actividad típica |
|---|---|---|
| Comprender | ¿Qué problema resuelve y por qué? | Modelo mental, contraejemplo |
| Experimentar | ¿Qué ocurre si lo ejecuto? | Laboratorio guiado, demo reproducible |
| Explicar | ¿Puedo enseñarlo con mis palabras? | Nota técnica, diagrama propio |
| Construir | ¿Puedo aplicarlo a un caso nuevo? | Reto independiente, ADR |
| Verificar | ¿Cómo sé que funciona y dónde falla? | Pruebas, rúbrica, criterio de dominio |

## Taxonomía de objetivos

Cada nivel cognitivo se mapea a un verbo observable, un tipo de actividad y una
evidencia calificable. Un módulo maduro cubre desde recordar hasta crear.

| Nivel | Verbo observable | Tipo de actividad | Evidencia |
|---|---|---|---|
| Recordar | identificar | cuestionario diagnóstico | test corto |
| Entender | explicar | nota técnica, diagrama | documento |
| Aplicar | ejecutar | laboratorio | comandos y salida |
| Analizar | comparar | matriz de decisión | ADR o tabla |
| Evaluar | auditar | revisión, CTF | informe de hallazgos |
| Crear | diseñar | reto, proyecto final | artefacto verificable |

## Construcción de una lección

Cada módulo usa la plantilla de [`curriculum/MODULE_TEMPLATE.md`](../curriculum/MODULE_TEMPLATE.md).
Cada sección tiene un propósito instruccional explícito.

| Sección | Propósito |
|---|---|
| Diagnóstico breve | Activar conocimiento previo y detectar brechas |
| Explicación y demostración | Presentar el modelo mental con un ejemplo real |
| Práctica guiada | Reducir carga cognitiva con andamiaje |
| Reto independiente | Transferir a un contexto nuevo sin ayuda |
| Reflexión y bitácora | Consolidar y hacer visible el razonamiento |
| Prueba o rúbrica | Verificar el dominio con evidencia objetiva |
| Criterio de dominio | Definir el umbral para avanzar |

## Andamiaje y carga cognitiva

El programa gestiona la **carga cognitiva** para que el esfuerzo se invierta en aprender,
no en pelear con el entorno.

- **Andamiaje decreciente:** la práctica guiada da estructura; el reto la retira.
- **Un concepto nuevo por vez:** las herramientas se introducen cuando el concepto ya
  se entiende, no antes.
- **Entorno estable:** el mismo stack (Foundry, viem, Anvil) en todo el programa evita
  recargar memoria de trabajo con configuraciones cambiantes.
- **Fragmentación:** se construyen "trozos" reutilizables (hash, cuenta, invariante)
  que luego se combinan en sistemas.

## Contenido en capas: servir al principiante y al experto a la vez

Un curso que va de cero a producción tiene un problema estructural: el mismo texto lo
lee alguien que nunca escribió un contrato y alguien que lleva años en el sector. Bajar
el nivel aburre al segundo; subirlo expulsa al primero.

La solución en este programa **no** es escribir dos cursos, sino escribir cada bloque
denso en **cuatro capas visibles**, para que cada lector sepa dónde entrar y qué puede
saltarse sin perder el hilo:

| Capa | Qué contiene | Para quién |
|---|---|---|
| 1 · **La idea en llano** | El concepto en lenguaje corriente, con una analogía y sin jerga sin glosar | Quien llega sin base. Nadie debería tener que buscar un término fuera para seguir leyendo |
| 2 · **El cálculo trabajado** | El ejemplo completo, con números reales y cada paso a la vista | Quien está aprendiendo haciendo. Aquí es donde se resuelve el atasco |
| 3 · **🎓 Si ya dominas esto** | Bordes, excepciones y detalle fino, en un bloque **plegable** | Quien ya conoce el tema. Plegado, no intimida a quien no lo necesita |
| 4 · **💡 En una frase** | La idea que hay que retener si solo se retiene una | Todos. Fija el aprendizaje y sirve de repaso |

Reglas de aplicación:

- **La capa 3 va siempre plegada** (`<details>`). Que exista no debe aumentar la carga
  cognitiva de quien no la abre.
- **Ningún término de la capa 1 se usa sin glosar.** Si aparece "vbyte" o "calldata",
  se explica en la misma frase, no en un enlace.
- **La capa 2 usa números concretos, no símbolos.** "209 vB × 12 sat/vB = 2 508 sat"
  enseña más que "tamaño × tasa = comisión".
- **La capa 4 nunca introduce información nueva.** Si algo solo aparece ahí, está en el
  sitio equivocado.
- **Un bloque puede omitir la capa 3** si el tema no tiene profundidad extra honesta.
  Inventar detalle para rellenar la plantilla es peor que no tenerla.

Ejemplos aplicados: la comisión de Bitcoin en el
[módulo 04](../curriculum/04-bitcoin/README.md), el desglose de gas en el
[módulo 05](../curriculum/05-ethereum-evm/README.md), la lectura de trazas en el
[módulo 06](../curriculum/06-solidity-foundry/README.md) y los decimales en el
[módulo 07](../curriculum/07-dapps/README.md).

## Evaluación formativa y sumativa

Ambas conviven; ver [Evaluación](evaluacion.md) para rúbricas y umbrales.

| Tipo | Cuándo | Función | Ejemplos |
|---|---|---|---|
| Formativa | Durante el módulo | Corregir el rumbo, dar retroalimentación | Diagnóstico, ticket de salida, revisión en pareja |
| Sumativa | Al cerrar el módulo o etapa | Certificar dominio | Reto verificable, CTF, proyecto final |

La retroalimentación formativa es frecuente y de bajo costo; la sumativa es escasa y
exige evidencia reproducible.

## Casos reales y límites de la analogía

- **Casos reales:** cada módulo ancla la teoría en incidentes o protocolos concretos
  (reentrancia del DAO, congestión de gas, fallos de oráculo). Un modelo sin caso queda
  como abstracción inerte.
- **Límites de la analogía:** toda analogía se presenta y luego **se rompe** de forma
  explícita ("hash ≠ cifrado", "dirección ≠ persona"). Nombrar dónde falla la analogía
  previene modelos mentales erróneos que cuestan caro en producción.

## Recursos relacionados

- [Planes de clase](planes-de-clase.md) — sesiones listas para instructores.
- [Evaluación](evaluacion.md) — rúbricas y criterios de dominio.
- [Glosario](glosario.md) — vocabulario común del programa.
