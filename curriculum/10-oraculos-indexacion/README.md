# 10 · Oráculos, almacenamiento e indexación

La blockchain no puede conocer de forma nativa el precio del dólar, el clima ni el resultado de un partido. Un oráculo introduce esa información y su modelo de confianza.

## Diseño

Valida antigüedad, rango, decimals, ronda completa, fallback y circuit breaker. Distingue precio spot, TWAP y promedio de múltiples fuentes.

Los eventos permiten indexar, pero no sustituyen estado cuando otro contrato debe verificarlo. IPFS direcciona contenido; persistencia y disponibilidad requieren una estrategia de pinning.
