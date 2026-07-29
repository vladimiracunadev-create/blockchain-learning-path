# Modelo de amenazas · Community Funding

## Activos

Fondos aportados, derecho a reembolso, derecho del creador a retirar, disponibilidad, integridad de eventos y confianza del usuario.

## Actores

Contribuyente, creador, operador de interfaz, RPC, indexador, minero/secuenciador y atacante externo.

## Límites de confianza

- La wallet firma; la interfaz puede mentir sobre lo que solicita.
- El RPC entrega una vista; el contrato determina estado.
- El indexador deriva una vista; debe poder reconstruirse.
- El creador recibe fondos solo al cumplirse condiciones.

## Amenazas y controles

| Amenaza | Control | Riesgo residual |
|---|---|---|
| reentrancia en retiro/reembolso | CEI + guarda | llamadas cruzadas futuras |
| doble retiro | flag y estado antes de interacción | error en upgrade futuro |
| aporte fuera de plazo | validación temporal | manipulación acotada de timestamp |
| phishing de contrato/red | UI muestra chain y dirección | usuario ignora advertencia |
| RPC censura o engaña | redundancia/verificación | disponibilidad |
| indexador pierde/reordena logs | checkpoint, orden y replay | reorganizaciones |
| creador no cumple promesa off-chain | reglas y comunicación | contrato no valida mundo real |
| pérdida de claves | wallet/multisig según riesgo | recuperación y gobernanza |

## Invariantes

- Cada aporte se reclama o reembolsa como máximo una vez.
- El creador no retira antes de plazo y meta.
- Una campaña fallida no puede ser reclamada.
- La contabilidad por contribuyente no aumenta sin recibir valor.
