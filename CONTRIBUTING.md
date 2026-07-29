# 🤝 Contribuir

> [⬅️ Volver al programa](README.md) · [🗺️ Roadmap](ROADMAP.md) · [🔐 Seguridad](SECURITY.md)

Gracias por querer mejorar **Blockchain Learning Path**. Este es un programa **educativo**: una contribución se juzga por lo que **enseña** y por la **evidencia** que la respalda, no solo por el código que añade.

## Cómo contribuir

1. Abre un issue describiendo el objetivo educativo y la evidencia que lo respalda.
2. Crea una rama pequeña y enfocada.
3. No incluyas claves, datos personales, direcciones con fondos ni material sin licencia.
4. Ejecuta `pnpm check` y `pnpm test`.
5. En el PR explica qué aprende el estudiante, cómo se prueba y qué riesgos existen.

Los cambios de dependencias deben justificar necesidad, mantenimiento, licencia y superficie de ataque.

Rellena la [plantilla de pull request](.github/PULL_REQUEST_TEMPLATE.md). La CI ejecuta el lint de Markdown, las validaciones del repositorio (`pnpm check`), las pruebas (`pnpm test`) y las de contratos con Foundry; el workflow de seguridad escanea secretos con `gitleaks` en cada push.
