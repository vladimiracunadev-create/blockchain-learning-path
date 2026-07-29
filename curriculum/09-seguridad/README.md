# 09 · Seguridad y auditoría

## Vulnerabilidades

Reentrancia, control de acceso, lógica económica, front-running/MEV, manipulación de oráculo, precision loss, firmas repetibles, `delegatecall`, upgrades inseguros, DoS y flash loans.

## Proceso de auditoría

1. Define alcance, actores, activos e invariantes.
2. Comprende arquitectura y privilegios.
3. Revisa manualmente cada flujo.
4. Ejecuta unit, fuzz, invariant y análisis estático.
5. Reproduce hallazgos con una prueba mínima.
6. Clasifica impacto y probabilidad.
7. Verifica la corrección.

Nunca pruebes exploits contra sistemas sin autorización.
