# 🤝 Contribuir

> [⬅️ Volver al programa](README.md) · [🗺️ Roadmap](ROADMAP.md) · [🔐 Seguridad](SECURITY.md)

Gracias por querer mejorar **Blockchain Learning Path**. Este es un programa **educativo**: una contribución se juzga por lo que **enseña** y por la **evidencia** que la respalda, no solo por el código que añade.

## Cómo contribuir

1. Abre un issue describiendo el objetivo educativo y la evidencia que lo respalda.
2. Crea una rama pequeña y enfocada.
3. No incluyas claves, datos personales, direcciones con fondos ni material sin licencia.
4. Ejecuta `pnpm check`, `pnpm test` y `pnpm lint:js`.
5. En el PR explica qué aprende el estudiante, cómo se prueba y qué riesgos existen.

Si añades o reordenas un **módulo**, `pnpm check` te avisará de dos cosas que es fácil olvidar: que el módulo necesita su **autoevaluación** en `assessments/module-quizzes.json`, y que la **cadena anterior/siguiente** de sus vecinos ha quedado rota.

Los cambios de dependencias deben justificar necesidad, mantenimiento, licencia y superficie de ataque.

Rellena la [plantilla de pull request](.github/PULL_REQUEST_TEMPLATE.md). La CI ejecuta el lint de Markdown, JavaScript y Solidity, las validaciones del repositorio (`pnpm check`), las pruebas (`pnpm test`) y las de contratos con Foundry; el workflow de seguridad escanea secretos con `gitleaks` en cada push.

Participar aquí implica respetar el [código de conducta](CODE_OF_CONDUCT.md).
