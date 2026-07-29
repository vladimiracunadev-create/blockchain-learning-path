# Mejores prácticas

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [🔐 Seguridad y auditoría](../curriculum/09-seguridad/README.md)

Buenas prácticas de desarrollo, prueba y operación de sistemas blockchain. Cada práctica
se describe con **qué** es, **por qué** importa y **cómo verificar** que se cumple. La
profundización con exploits reales está en el módulo
[09 · Seguridad y auditoría](../curriculum/09-seguridad/README.md).

## Diseño

Decisiones tomadas antes de escribir la primera línea de código.

| Práctica | Qué | Por qué | Cómo verificar |
|---|---|---|---|
| Justificar la descentralización | Documentar por qué se necesita consenso e inmutabilidad | Evita usar blockchain por moda | ADR con alternativas descartadas |
| Minimizar estado on-chain | Almacenar y calcular fuera de la cadena cuando se pueda | Storage y cómputo cuestan gas real | Revisar variables y bucles por costo |
| Definir invariantes primero | Escribir las propiedades que nunca deben romperse | Guían el diseño y las pruebas | Lista de invariantes en el repo |
| Separar responsabilidades | Aislar lógica, permisos, tesorería y actualización | Reduce el radio de impacto de un fallo | Módulos y roles distintos |

## Seguridad de contratos

| Práctica | Qué | Por qué | Cómo verificar |
|---|---|---|---|
| Checks-Effects-Interactions | Validar, actualizar estado y **luego** llamar al exterior | Neutraliza reentrancia | Revisión y test de reentrancia |
| Control de acceso | Mínimo privilegio, roles explícitos, admin en dos pasos | Limita abuso interno y errores | Test por rol; `onlyRole` cubierto |
| Reentrancy guards | Candado en funciones con llamadas externas | Defensa en profundidad ante CEI incompleto | Test que simula el reingreso |
| Pull over push | El beneficiario retira; el contrato no empuja fondos | Un receptor malicioso no bloquea a otros | Patrón de retiro comprobado con test |
| No reinventar criptografía | Usar estándares auditados (OpenZeppelin, libs probadas) | Implementar cripto desde cero introduce fallos | Dependencias auditadas y fijadas |
| Evitar bucles no acotados | No iterar sobre colecciones de tamaño arbitrario | Un bucle grande agota el gas y bloquea | Revisión de bucles; límites explícitos |

## Pruebas

| Tipo | Qué prueba | Herramienta | Cómo verificar |
|---|---|---|---|
| Unitaria | Una función en aislamiento | `forge test` | Casos felices y de error |
| Fuzz | Entradas aleatorias contra una propiedad | Foundry fuzz | Miles de runs sin contraejemplo |
| Invariante | Propiedades globales tras secuencias de acciones | Foundry invariant | Invariantes se mantienen |
| Fork | Comportamiento contra estado real de una red | `forge test --fork-url` | Integración con protocolos reales |

- **Cobertura por comportamiento, no por porcentaje:** un 100% de líneas no garantiza
  que se probaron los estados adversos (pausa, oráculo obsoleto, rol comprometido).
- **Una auditoría reduce riesgo; no demuestra ausencia de errores.**

## Gestión de claves

| Práctica | Qué | Por qué | Cómo verificar |
|---|---|---|---|
| Nunca en el repositorio | Claves y secretos fuera de git | Un secreto commiteado se compromete | Escaneo de secretos en CI |
| `.env` fuera de control de versiones | Cargar secretos desde el entorno local | Evita fugas accidentales | `.gitignore` cubre `.env` |
| HSM / MPC en producción | Custodia en hardware o firma multiparte | Elimina el punto único de compromiso | Claves críticas nunca en texto plano |
| Claves de prueba desechables | Usar las claves que muestra Anvil solo local | Aislar experimentos de fondos reales | No reutilizar claves entre entornos |

## Operación

| Práctica | Qué | Por qué | Cómo verificar |
|---|---|---|---|
| Multisig | Firma de N-de-M para acciones críticas | Ningún individuo actúa solo | Safe u equivalente configurado |
| Timelock | Retraso obligatorio en cambios sensibles | Da tiempo a reaccionar ante abuso | Delay verificable on-chain |
| Monitoreo | Vigilar eventos, balances, roles e invariantes | Detectar anomalías temprano | Alertas y panel activos |
| Runbooks | Procedimientos de incidente y divulgación | Reducir el tiempo de respuesta | Ver [operación e incidentes](operacion-incidentes.md) |

Simula actualizaciones y respuestas a incidentes **antes** de producción.

## Calidad de código y CI

| Práctica | Qué | Herramienta | Cómo verificar |
|---|---|---|---|
| Formato y linters | Estilo consistente y automatizado | `forge fmt`, linters | CI falla si hay desviaciones |
| Análisis estático | Detectar patrones peligrosos | Slither, Semgrep | Reporte sin hallazgos críticos |
| Fuzzing dirigido | Buscar contraejemplos económicos | Echidna, Foundry | Propiedades sin violación |
| Integración continua | Ejecutar todo en cada cambio | GitHub Actions | Build en verde, escaneo de secretos |

## Dependencias

- **Fijar versiones (pin):** compilador y librerías en versiones exactas y estables.
- **Auditar antes de adoptar:** revisar y preferir dependencias mantenidas y auditadas.
- **Mínima superficie:** cada dependencia amplía el área de ataque; incluir solo lo necesario.

## Experiencia de usuario

| Práctica | Qué | Por qué | Cómo verificar |
|---|---|---|---|
| Mostrar contexto antes de firmar | Red, dirección abreviada, monto, gas y consecuencias | El usuario firma con información completa | Revisar la pantalla de confirmación |
| Distinguir firma de tx | Separar firma de mensaje de firma de transacción | Un mensaje mal presentado puede autorizar valor | Probar ambos flujos en la UI |
| Aprobaciones acotadas | Evitar `approve` ilimitado por defecto | Limita el daño si el gastador se compromete | Verificar el monto exacto aprobado |
| Protección ante ataques | Mitigar front-running, slippage y phishing | El usuario opera en un entorno adversarial | Límites de slippage y dominio verificado |

## Priorización

No todas las prácticas tienen el mismo retorno. Cuando el tiempo es limitado, prioriza
en este orden:

1. **Seguridad de contratos** — un fallo aquí es irreversible y con pérdida directa.
2. **Gestión de claves** — un secreto filtrado anula cualquier otra defensa.
3. **Pruebas** — sin evidencia reproducible no sabes si lo anterior funciona.
4. **Operación** — controla el riesgo una vez en producción.
5. **Calidad y dependencias** — sostienen todo lo demás a largo plazo.

## Recursos relacionados

- [09 · Seguridad y auditoría](../curriculum/09-seguridad/README.md)
- [Modelo de amenazas del proyecto](threat-model-project.md)
- [Operación e incidentes](operacion-incidentes.md)
