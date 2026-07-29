# Mejores prácticas

## Diseño

- Justifica por qué necesitas descentralización, inmutabilidad y consenso.
- Minimiza estado on-chain; almacenar y calcular cuesta dinero.
- Define invariantes antes de programar.
- Diseña pausas, límites y recuperación sin crear una puerta trasera opaca.
- Separa lógica, permisos, tesorería y actualización.

## Contratos

- Usa versiones estables y fijadas del compilador y dependencias.
- Sigue checks-effects-interactions y considera reentrancia cruzada.
- Usa errores personalizados, eventos útiles y validaciones explícitas.
- Evita iteraciones no acotadas y dependencia directa de timestamps.
- Aplica mínimo privilegio y transferencias de administración en dos pasos.
- No inventes criptografía ni implementes estándares consolidados desde cero en producción.

## Pruebas y verificación

- Pruebas unitarias, integración, fuzz, invariantes y fork tests.
- Analiza cobertura por comportamiento, no solo porcentaje.
- Ejecuta análisis estático y revisiones humanas independientes.
- Prueba estados adversos: pausas, oráculo obsoleto, congestión y roles comprometidos.
- Una auditoría reduce riesgo; no demuestra ausencia de errores.

## Operación

- Multisig para operaciones críticas.
- Timelock para cambios sensibles.
- Monitoreo de eventos, balances, roles e invariantes.
- Runbooks de incidentes y divulgación responsable.
- Simula actualizaciones y respuestas a incidentes antes de producción.

## Usuario

- Muestra red, dirección abreviada, monto, gas y consecuencias antes de firmar.
- Distingue firma de mensaje y transacción.
- Evita aprobaciones ilimitadas por defecto.
- Protege al usuario de front-running, slippage y phishing.
