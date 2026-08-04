# 🖥️ App de escritorio (Windows)

> [⬅️ Volver al programa](../../README.md) · [📱 App Android](../android/README.md) · [📚 Currículo](../../curriculum/README.md)

El curso completo como aplicación de escritorio: **19 módulos, 84 páginas, las 50
prácticas, los ADR, el manual en PDF y la autoevaluación de cada módulo**, todo
dentro del ejecutable. No necesita conexión ni navegador: funciona en un aula sin
red.

## Descargar

Los instaladores están en la [última release](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest):

| Archivo | Para qué |
|---|---|
| `BlockchainLearningPath-Setup-<versión>.exe` | Instalador con acceso directo y desinstalador |
| `BlockchainLearningPath-Portable-<versión>.exe` | Portable: se ejecuta sin instalar, sirve para un pendrive |

> Windows SmartScreen avisará de que el editor es desconocido: los binarios **no
> están firmados** con un certificado de código (cuesta unos cientos de dólares al
> año). Verifica el `SHA256` publicado en la release antes de ejecutar.

## Cómo está hecha

```text
apps/bundle/          ← el curso renderizado a HTML (lo genera build:bundle)
apps/desktop/
  main.js             ← proceso principal: ventana, menú, enlaces externos
  servidor.mjs        ← http local en 127.0.0.1 que sirve el bundle
  smoke.js            ← comprueba que la app empaquetada TIENE el curso dentro
  build/icon.ico      ← icono generado desde apps/icono.svg
```

**¿Por qué un servidor local y no `file://`?** El sitio usa rutas absolutas, carga
el índice del buscador con `fetch` y guarda el progreso en `localStorage`. Bajo
`file://` el origen es opaco: el buscador no cargaría y el progreso se perdería al
cerrar. Un `http` en loopback con puerto efímero da un origen normal sin abrir
nada al exterior.

La ventana corre con `nodeIntegration: false`, `contextIsolation: true` y
`sandbox: true`: el HTML del curso no tiene acceso a Node ni al sistema de
archivos.

## Desarrollo

```bash
pnpm build:bundle && pnpm --filter @blockchain-course/desktop start
```

Para empaquetar:

```bash
pnpm app:windows
```

> **Empaquetar en local requiere el Modo Desarrollador de Windows activado.**
> `electron-builder` descarga un paquete de firma que contiene enlaces simbólicos
> de macOS, y crear symlinks en Windows exige ese privilegio; sin él la
> extracción falla con «El cliente no dispone de un privilegio requerido».
> La CI construye los instaladores en `windows-latest`, donde el privilegio existe,
> así que **no hace falta activarlo para contribuir**: basta con `start`.

## Verificación

`smoke.js` es la prueba que importa. Arranca la app real y comprueba **dentro**
que están el manifiesto, los 19 módulos, el texto de un módulo, sus 4 preguntas
de autoevaluación, los enlaces anterior/siguiente y el índice de búsqueda.

Existe porque el fallo típico de estos empaquetados no es que no compilen: es que
compilan, pesan lo esperado, se instalan sin error y abren **una ventana vacía**
porque el contenido nunca se copió. Un build en verde no prueba que la app tenga
el curso; esto sí.

```bash
pnpm app:windows:verify
```

---

> [⬅️ Volver al programa](../../README.md) · [📱 App Android](../android/README.md)
