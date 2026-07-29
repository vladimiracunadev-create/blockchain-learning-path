# Orientaciones de solución

1. **Reentrancia:** actualiza estado antes de la llamada externa y considera una guarda. Revisa reentrancia entre funciones.
2. **Acceso:** autorización explícita, mínimo privilegio y transferencia de rol en dos pasos.
3. **Oráculo:** fuente resistente a manipulación, TWAP/múltiples fuentes, freshness, rangos y circuit breaker.
4. **Firmas:** incluye chain ID, contrato, usuario, nonce, acción, monto y deadline en datos tipados; marca nonce antes del efecto.
5. **Front-running:** commit-reveal cuando corresponda, además de slippage, deadline y privacidad del flujo.
6. **Proxy:** estándar probado, slots definidos y herramienta que compare layouts antes de actualizar.

Una mitigación de código no corrige automáticamente una falla económica o de gobernanza.
