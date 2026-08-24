# Checkpoints

> Navegación: [Inicio](../README.md) · [Currículo](../curriculum/README.md) · [Evaluación](../docs/evaluacion.md) · [Banco de preguntas](module-question-bank.md)

Puntos de control por etapa del programa. Cada checkpoint define **qué debes poder hacer**, **qué evidencia lo demuestra** y una **pregunta de autoevaluación** para verificar que comprendes, no solo que ejecutaste. Para aprobar cada checkpoint se requiere el 80% de la rúbrica correspondiente y **ninguna práctica crítica de seguridad omitida**.

## Cómo usar esta guía

Avanza de una etapa a la siguiente solo cuando puedas producir la evidencia sin ayuda y responder la pregunta de autoevaluación con un argumento, no con una definición memorizada.

## Etapa 00 · Orientación

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Explicar cuándo blockchain aporta valor y cuándo no | Un caso propio con la alternativa descartada | ¿Qué problema resuelve mejor una base de datos firmada? |
| Preparar el entorno de trabajo | Repositorio clonado, herramientas instaladas | ¿Puedes reproducir el entorno en otra máquina? |

## Etapas 01–03 · Fundamentos

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Distinguir hash, firma y Merkle sin confundirlos | Explicación de qué garantiza cada uno | ¿Qué información **no** aporta una prueba Merkle? |
| Demostrar manipulación en la mini cadena | Bloque alterado y verificación que falla | ¿Por qué cambiar un bloque invalida los siguientes? |
| Comparar mecanismos de consenso con criterios claros | Tabla con cuatro criterios (coste Sybil, finalidad, etc.) | ¿Cómo afecta una partición a seguridad y vivacidad? |

## Etapa 28 · Analítica de datos on-chain

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Extraer datos de una cadena de forma reanudable e idempotente | `pnpm lab:extraccion` y `pnpm lab:normalizar` con su bitácora | ¿Por qué una respuesta truncada no es un error del nodo? |
| Medir un detector, no solo ejecutarlo | Precisión, recall y falsos positivos de tu detector | ¿Por qué el recall no se puede calcular en una cadena real? |
| Separar hecho, indicador, inferencia e hipótesis | El informe del [explorador analítico](../projects/explorador-analitico/README.md) | ¿Qué te faltaría para atribuir una dirección a una persona, y quién debería autorizarlo? |

## Etapas 04–07 · Desarrollo

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Seguir una transacción de punta a punta | Traza desde firma hasta confirmación | ¿Por qué una wallet no "contiene" monedas? |
| Revisar una solicitud de firma antes de firmar ([Wallets desde cero](../docs/wallets-desde-cero.md)) | `pnpm lab:wallet-segura` explicado control por control | ¿Qué control detecta un `approve` ilimitado y cuál una dirección envenenada? |
| Implementar el Vault y demostrar sus invariantes | Suite verde con fuzzing | ¿Por qué CEI no basta sin una guarda de reentrancia? |
| Conectar una interfaz que simula antes de firmar | dApp que muestra red, valor y efecto | ¿Qué error se evita simulando antes de pedir la firma? |

## Etapas 08–11 · Profesional

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Reproducir y corregir vulnerabilidades | PoC que falla antes del fix y prueba de regresión | ¿Distingues causa raíz de síntoma? |
| Diseñar un oráculo con freshness y fallback | Contrato que rechaza datos obsoletos | ¿Cómo se manipula un precio spot con liquidez puntual? |
| Entregar una política multisig + timelock | Gobernador con quorum y retardo de ejecución | ¿Cómo sale un usuario si la gobernanza es capturada? |

## Etapas 12–15 · Avanzado

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Defender un ADR L1/L2/appchain | Documento con trade-offs y alternativa descartada | ¿Qué supuesto de confianza añade tu elección? |
| Modelar amenazas de un puente | Threat model con actores y superficies | ¿Dónde está el punto único de falla del puente? |
| Razonar sobre privacidad y ZK | Explicación de qué se revela y qué se prueba | ¿Qué datos quedan correlacionables pese a la privacidad técnica? |

## Etapas 16–18 · Operación y empresa

| Qué debes poder hacer | Evidencia | Autoevaluación |
|---|---|---|
| Planificar infraestructura y operación | Plan de nodos, monitoreo y respaldo | ¿Cómo respondes a un incidente sin improvisar? |
| Presentar tokenomics y caso de negocio | Análisis de valor y costo total | ¿Justifica el proyecto su costo frente a una alternativa sin blockchain? |
| Preparar la defensa del capstone | Demo reproducible y rúbrica respondida | ¿Reconoces los límites de tu sistema en lugar de ocultarlos? |
