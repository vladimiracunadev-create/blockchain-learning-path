# Guía del estudiante

Este directorio contiene tu registro personal de avance. Aquí se explica cómo llevarlo, cómo trabajar los laboratorios y qué hábitos hacen que el programa funcione.

## Registro de progreso

1. Copia `progress.example.json` a un archivo con tu nombre (por ejemplo, `student/progress.tu-nombre.json`).
2. Completa `student`, `startedAt` y `profile` (tu ruta de `learning-paths`).
3. Cambia cada módulo o práctica a `in_progress` al comenzar y a `completed` solo cuando tengas evidencia reproducible.
4. Registra la nota 0–100 por módulo en `score`.
5. Verifica tu estado con `pnpm course:status ruta/progress.json`.

La estructura del archivo (fragmento abreviado del ejemplo):

```json
{
  "student": "Tu nombre",
  "startedAt": "YYYY-MM-DD",
  "profile": "desarrollo",
  "modules": {
    "00": { "status": "pending", "score": null, "evidence": [] }
  },
  "labs": {
    "01": { "status": "pending", "evidence": "" }
  },
  "capstone": { "title": "", "status": "idea", "repository": "" },
  "instructorApproved": false
}
```

El ejemplo completo cubre los 28 módulos (00–27) y las 70 prácticas. Cuando todos los módulos y prácticas estén en `completed` con nota mínima de 80 y el capstone aprobado, ejecuta `pnpm course:certificate ruta/progress.json` para generar el certificado local.

Una evidencia puede ser una ruta a código, prueba, txid local, ADR o informe. Nunca registres claves, seeds, datos personales ni endpoints privados.

## Bitácora de laboratorios

Cada práctica del [cuaderno de laboratorios](../labs/CATALOG.md) merece una entrada corta en tu bitácora con cuatro campos:

- **Comando:** qué ejecutaste exactamente (copiable).
- **Resultado:** qué salió, resumido (salida clave, no volcado completo).
- **Sorpresa:** qué no esperabas; si no hubo sorpresa, di por qué el resultado era predecible.
- **Pregunta:** qué te queda abierto. Estas preguntas alimentan la siguiente sesión de estudio.

La bitácora es la evidencia que enlazas en tu `progress.json` y la materia prima de tu defensa del capstone.

## Hábitos de estudio que funcionan aquí

El programa está diseñado para el ciclo comprender → experimentar → explicar → construir → verificar:

1. **Comprender:** lee el modelo mental del módulo antes de tocar código.
2. **Experimentar:** ejecuta el laboratorio y cambia un parámetro a propósito para ver qué se rompe.
3. **Explicar:** escribe (o cuenta en voz alta) qué pasó y por qué; si no puedes explicarlo, no lo entendiste todavía.
4. **Construir:** aplica el concepto en algo tuyo, aunque sea diminuto.
5. **Verificar:** contrasta con los criterios de `solutions/conceptual-guide.md` y la [evaluación](../docs/evaluacion.md).

Sesiones cortas y frecuentes rinden más que maratones; una práctica bien registrada vale más que tres apuradas.

## Cómo autoevaluarte

- Cierra cada bloque con los [checkpoints](../assessments/checkpoints.md).
- Pon a prueba tu comprensión con el [banco de preguntas](../assessments/module-question-bank.md).
- Contrasta tu razonamiento con los criterios de [solutions/conceptual-guide.md](../solutions/conceptual-guide.md): son señales de buen trabajo, no respuestas para copiar.

## Elige tu ritmo

Según el tiempo del que dispongas:

- **Poco tiempo:** sigue la [ruta rápida](../docs/ruta-rapida.md) con lo esencial.
- **Curso completo:** avanza módulo a módulo con el [roadmap](../ROADMAP.md).
- **Enfoque por objetivo:** elige una de las [rutas de aprendizaje](../learning-paths/README.md).

Sé constante antes que veloz: un poco cada día, con evidencia y explicación propia, te lleva más lejos que maratones sin bitácora.

## Qué hacer cuando te atascas

1. Relee el modelo mental del módulo: la mayoría de los bloqueos son conceptuales, no técnicos.
2. Reduce el laboratorio a datos mínimos (una transacción, un bloque, un nodo) hasta que el comportamiento sea observable.
3. Formula la pregunta por escrito con lo que esperabas, lo que ocurrió y lo que ya descartaste; a menudo la respuesta aparece al escribirla, y si no, es una pregunta lista para el instructor.

## Seguridad del estudiante

- Usa **solo wallets de prueba** creadas para este curso; nunca importes una wallet con fondos reales a un entorno de desarrollo.
- Nunca uses fondos reales: todo el programa funciona en local y testnet.
- Desconfía de "airdrops", soporte por mensaje directo y ofertas dirigidas a aprendices: los estafadores buscan activamente a estudiantes de blockchain. Nadie legítimo te pedirá tu seed phrase, jamás.
- No publiques claves privadas ni endpoints con credenciales en tu repositorio, ni siquiera de testnet: los bots los recolectan en minutos.

## Navegación

- [Inicio del programa](../README.md) · [Currículo](../curriculum/README.md)
- [Catálogo de laboratorios](../labs/CATALOG.md) · [Evaluación](../docs/evaluacion.md)
- [Checkpoints](../assessments/checkpoints.md)
