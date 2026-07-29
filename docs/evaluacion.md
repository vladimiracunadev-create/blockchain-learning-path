# Evaluación y rúbrica

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [✅ Checkpoints](../assessments/checkpoints.md)

Este documento define cómo se mide el aprendizaje en el programa: los pesos de cada componente, la rúbrica por dimensión, la evidencia que se registra y las condiciones de aprobación.

## Componentes y pesos

| Componente | Peso | Qué mide |
|---|---:|---|
| Cuestionarios de módulo | 20 % | Comprensión conceptual verificada por checkpoint |
| Laboratorios y bitácora | 30 % | Práctica guiada, reproducibilidad y reflexión escrita |
| Proyectos de nivel | 30 % | Integración de habilidades al cierre de cada nivel |
| Proyecto final (capstone) | 20 % | Sistema completo con modelo de amenazas y demo ([capstone](../capstone/README.md)) |

## Rúbrica por entrega

Cada entrega (laboratorio, proyecto de nivel o capstone) se evalúa sobre 100 puntos:

| Dimensión | Puntos | Evidencia |
|---|---:|---|
| Comprensión | 20 | Explica decisiones, límites y alternativas |
| Corrección | 20 | Cumple requisitos e invariantes |
| Pruebas | 20 | Casos felices, fallos, fuzz/invariantes según nivel |
| Seguridad | 20 | Modelo de amenazas y mitigaciones |
| Calidad | 10 | Código legible, reproducible y documentado |
| Ética y operación | 10 | Privacidad, costos, gobernanza e incidentes |

Dos reglas no negociables:

- Una vulnerabilidad crítica no reconocida limita la calificación total a 60.
- Una clave real publicada implica detener y rotar credenciales antes de continuar.

## Niveles de desempeño por dimensión

### Comprensión

| Nivel | Descripción |
|---|---|
| Insuficiente | Repite definiciones sin poder justificar decisiones propias |
| Suficiente | Explica qué hizo y por qué, con imprecisiones menores |
| Bueno | Justifica decisiones frente a alternativas y reconoce límites |
| Sobresaliente | Anticipa casos borde y conecta el diseño con compromisos del ecosistema real |

### Corrección

| Nivel | Descripción |
|---|---|
| Insuficiente | No compila o incumple requisitos centrales |
| Suficiente | Cumple el criterio de aceptación del módulo en el camino feliz |
| Bueno | Cumple requisitos e invariantes también en entradas adversas |
| Sobresaliente | Documenta invariantes explícitos y demuestra que se preservan |

### Pruebas

| Nivel | Descripción |
|---|---|
| Insuficiente | Sin pruebas o solo pruebas triviales que no fallan nunca |
| Suficiente | Casos felices y de fallo básicos que pasan con `forge test` o `pnpm lab:*` |
| Bueno | Cobertura de reverts, límites y al menos un fuzz test donde aplica |
| Sobresaliente | Invariantes y fuzzing dirigidos por el modelo de amenazas |

### Seguridad

| Nivel | Descripción |
|---|---|
| Insuficiente | Vulnerabilidades conocidas sin mención (reentrancia, control de acceso) |
| Suficiente | Identifica los riesgos principales de su entrega |
| Bueno | Modelo de amenazas escrito con mitigaciones implementadas |
| Sobresaliente | Analiza vectores económicos (oráculos, MEV) además de los de código |

### Calidad, ética y operación

| Nivel | Descripción |
|---|---|
| Insuficiente | Código irreproducible o sin documentación mínima |
| Suficiente | README con pasos que funcionan desde cero |
| Bueno | Código legible, sin secretos, con costos y supuestos documentados |
| Sobresaliente | Considera operación real: pausas, monitoreo y plan de incidentes ([runbook](operacion-incidentes.md)) |

## Evidencia y registro de progreso

El avance se registra en el archivo de progreso del estudiante (plantilla en `student/progress.example.json`). Por cada módulo se guarda:

- Fecha de inicio y de cierre del módulo.
- Resultado del cuestionario del checkpoint ([assessments/checkpoints.md](../assessments/checkpoints.md)).
- Comandos de verificación ejecutados y su salida resumida (`pnpm lab:*`, `forge test`).
- Enlace o ruta a la bitácora de laboratorio (qué intentaste, qué falló, qué aprendiste).
- Nota de la entrega según la rúbrica anterior.

La bitácora no es burocracia: escribir por qué algo falló es la evidencia más fuerte de comprensión y pesa dentro del 30 % de laboratorios.

## Criterios de aprobación

- **Por módulo**: nota ≥ 80/100 en la entrega del módulo y checkpoint aprobado. Es el mismo umbral que exige el certificado del programa.
- **Retos verificables**: cada módulo define un criterio de aceptación explícito (una salida esperada, una prueba que debe pasar, un invariante que debe sostenerse). El reto está aprobado cuando el criterio se cumple de forma reproducible, no cuando "parece funcionar".
- **Por nivel**: todos los módulos del nivel aprobados más el proyecto de nivel con nota ≥ 80.
- **Programa completo**: todos los niveles más el capstone con nota ≥ 80.

Un módulo con nota entre 60 y 79 puede reentregarse una vez corrigiendo las observaciones; se registra la nota de la reentrega.

## Autoevaluación y evaluación con instructor

| Modalidad | Cómo funciona | Límite |
|---|---|---|
| Autoevaluación | Aplicas la rúbrica tú mismo usando los criterios de aceptación y las carpetas `solutions/` como pauta de revisión | Honesta solo si primero resolviste sin mirar la solución |
| Con instructor | El instructor revisa la entrega, la bitácora y hace preguntas de defensa oral | Es la modalidad válida para certificación formal |

En autoevaluación, el criterio operativo es: si no puedes explicar una línea de tu propia entrega, la dimensión Comprensión no supera "insuficiente".

## Integridad académica

- **Colaborar sí**: discutir enfoques, depurar en pareja y revisar código ajeno es parte del oficio y se fomenta.
- **Copiar soluciones no**: las carpetas `solutions/` existen como criterio de revisión posterior, no como punto de partida. Entregar una solución copiada anula la entrega.
- **Uso de IA**: puedes usar asistentes para explorar y depurar, pero debes poder defender cada decisión de tu entrega sin el asistente. La defensa oral existe precisamente para eso.
- **Citas**: si adaptas código de terceros (OpenZeppelin, ejemplos de documentación), decláralo en el README de la entrega.

La sanción por plagio es la nota mínima en la entrega y, en reincidencia, en el componente completo.
