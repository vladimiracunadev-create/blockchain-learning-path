# Laboratorio de seguridad

Contratos deliberadamente vulnerables para redes locales. Nunca los despliegues, promociones ni pruebes contra terceros.

| Reto | Vulnerabilidad | Objetivo |
|---:|---|---|
| 01 | reentrancia | comprender CEI y guardas |
| 02 | control de acceso | proteger operaciones privilegiadas |
| 03 | oráculo manipulable | separar precio de liquidez puntual |
| 04 | repetición de firma | dominio, nonce y expiración |
| 05 | front-running | usar commit-reveal y límites |
| 06 | storage collision | comprender proxies y layout |

## Proceso

1. Lee el contrato vulnerable y escribe los activos/invariantes.
2. Predice el ataque antes de ejecutarlo.
3. Crea una prueba que demuestre impacto.
4. Implementa una corrección mínima.
5. Añade una prueba de regresión.
6. Explica riesgo residual.

Las soluciones conceptuales están en [SOLUTIONS.md](SOLUTIONS.md). Intenta cada reto antes de leerlas.
