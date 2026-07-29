# Proyecto transversal · Community Funding

Este proyecto crece durante los módulos 06–11 y conecta contrato, pruebas, interfaz, eventos, seguridad y gobernanza.

## Reglas

- Un creador abre una campaña con meta y fecha límite.
- Las contribuciones quedan asociadas a cada participante.
- Si se alcanza la meta, el creador puede retirar una vez.
- Si vence sin alcanzar la meta, cada participante recupera su aporte.
- El contrato sigue checks-effects-interactions y emite eventos indexables.

## Ejecución

```bash
forge test -vv
forge test --fuzz-runs 1000
```

## Evolución por módulo

1. **Solidity:** contrato y errores.
2. **dApp:** lectura, simulación, firma y estados.
3. **Tokens:** comprobante opcional, justificando si es necesario.
4. **Seguridad:** invariantes, reentrancia, griefing y administración.
5. **Indexación:** listado desde eventos.
6. **DAO:** aprobación comunitaria de retiros extraordinarios.
7. **L2:** ADR de despliegue y puente.

## Invariantes

- Una campaña no paga más de lo aportado.
- Una contribución no puede retirarse y reembolsarse.
- Los reembolsos solo existen después del fracaso.
- El creador no retira antes de alcanzar la meta.
