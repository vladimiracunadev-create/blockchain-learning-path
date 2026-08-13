# Kit del instructor

> Navegación: [Inicio](../README.md) · [Currículo](../curriculum/README.md) · [Rúbrica](../docs/evaluacion.md) · [Programa](syllabus.md) · [Checklist de laboratorio](lab-checklist.md)

Esta guía explica cómo llevar el programa a un aula real: cómo planificarlo según el calendario disponible, cómo preparar el entorno, cómo evaluar con criterios y no con respuestas, y cómo manejar con seguridad los laboratorios que trabajan con contratos vulnerables.

## Cómo usar el programa

El material está diseñado para dos formatos. Ambos cubren los módulos 00–18 y el proyecto final; cambia el ritmo, no el alcance. La etapa de finanzas on-chain e institucional (módulos 19–27) se imparte como [extensión optativa de ocho semanas](syllabus.md).

- **Semestre largo (24–26 semanas).** Una sesión conceptual y una de laboratorio por semana. Es el formato de referencia del [programa académico](syllabus.md). Deja espacio para checkpoints, retroalimentación y una defensa amplia del capstone.
- **Intensivo (8 semanas).** Dos o tres módulos por semana, laboratorios seleccionados y capstone reducido en alcance. Prioriza fundamentos (00–06), seguridad (09) y un proyecto acotado; convierte los módulos avanzados (12–18) en lecturas guiadas.

En cualquier formato mantén el ciclo pedagógico: comprender, experimentar, explicar, construir y verificar. El detalle didáctico está en [diseño pedagógico](../docs/diseno-pedagogico.md) y [planes de clase](../docs/planes-de-clase.md).

## Preparación previa

Antes de la primera sesión:

1. Ejecuta `pnpm check` y `pnpm test` para confirmar que el repositorio está sano.
2. Fija las versiones del semestre (Node, pnpm, Foundry, Docker) y comunícalas por escrito.
3. Prepara Anvil y Bitcoin Core en `regtest` sin acceso a redes con fondos reales.
4. Aplica el diagnóstico (`pnpm course:diagnostic`) y asigna una ruta con [rutas de aprendizaje](../learning-paths/README.md).
5. Define un canal privado para reportes de seguridad y explica la política de divulgación de [SECURITY.md](../SECURITY.md).

## Estructura de cada clase

1. Enuncia un objetivo observable y verificable.
2. Demuestra un caso correcto y un contraejemplo.
3. Pide al estudiante predecir el resultado antes de ejecutar.
4. Exige bitácora razonada, no solo capturas.
5. Cierra con un riesgo identificado y una decisión justificada.

## Laboratorios peligrosos

Los módulos de seguridad usan contratos deliberadamente vulnerables. Trátalos como material de laboratorio controlado:

- Solo en red local (Anvil) o testnet; nunca en mainnet ni contra sistemas de terceros.
- Wallets exclusivas sin fondos reales; jamás claves o seeds de valor.
- Los exploits se escriben y ejecutan como pruebas (`forge test`), no como despliegues.
- Refuerza la [regla ética](../security-challenges/README.md) en cada sesión.

El [checklist de laboratorio](lab-checklist.md) formaliza estas verificaciones antes, durante y después de cada práctica.

## Evaluación

La rúbrica maestra vive en [docs/evaluacion.md](../docs/evaluacion.md); úsala como fuente única de criterios. Complementa con:

- [Checkpoints](../assessments/checkpoints.md) para cortes formativos.
- [Banco de preguntas](../assessments/module-question-bank.md) para exámenes y quizzes.
- [Plantilla de informe de auditoría](../assessments/audit-report-template.md) para el módulo de seguridad.

## Uso de `solutions/`

La carpeta [`../solutions/`](../solutions/conceptual-guide.md) contiene **criterios de revisión, no respuestas para entregar**. Úsala para calibrar tu corrección y para señalar al estudiante en qué se distingue un buen trabajo de uno pobre. Copiar de allí no acredita aprendizaje; la [guía conceptual](../solutions/conceptual-guide.md) lo explica por tipo de entrega.

## Cómo dar retroalimentación

Primero corrige el modelo mental, después la implementación. Un resultado correcto con una explicación falsa debe repetirse. En seguridad, separa siempre cinco planos: causa raíz, exploit, impacto, mitigación y riesgo residual.

## Módulos, tiempo de clase y entregable

| Módulos | Tema | Clase sugerida | Entregable |
|---|---|---:|---|
| 00–01 | Orientación y criptografía | 3 sesiones | ADR + checkpoint |
| 02–03 | Distribuidos y consenso | 3 sesiones | mini blockchain |
| 04 | Bitcoin y UTXO | 2 sesiones | transcript regtest |
| 05 | Ethereum y EVM | 2 sesiones | análisis de transacción |
| 06 | Solidity y Foundry | 3 sesiones | Vault con invariantes |
| 07 | dApps | 2 sesiones | interfaz accesible |
| 08 | Tokens y estándares | 2 sesiones | protocolo con roles |
| 09 | Seguridad | 3 sesiones | informe de auditoría |
| 10–11 | Oráculos, indexación y DAO | 2 sesiones | ADR |
| 12–13 | Escalabilidad e interoperabilidad | 2 sesiones | comparativa L2 |
| 14–15 | Privacidad y arquitectura | 2 sesiones | defensa de diseño |
| 16–18 | Infraestructura y empresa | 3 sesiones | plan + caso de negocio |
| Capstone | Proyecto final | 2 sesiones | demo y defensa |

## Enlaces útiles

- [Programa de 24 semanas](syllabus.md)
- [Checklist de laboratorio](lab-checklist.md)
- [Rúbrica general](../docs/evaluacion.md)
- [Bibliografía](../docs/bibliografia.md)
- [Especificación del capstone](../capstone/README.md)
