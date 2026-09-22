# Avisos de terceros

Este repositorio cita fuentes técnicas y utiliza herramientas y bibliotecas ajenas. La licencia propia del programa no cambia las licencias, avisos de copyright ni marcas de esas partes. El archivo [`pnpm-lock.yaml`](pnpm-lock.yaml) identifica versiones exactas de dependencias instaladas; sus textos de licencia se consultan en los paquetes distribuidos y sus repositorios oficiales. Este inventario no sustituye los avisos que deba incluir un binario.

| Componente o fuente | Uso | Procedencia y licencia |
|---|---|---|
| Node.js, pnpm, ESLint, `@eslint/js`, `globals` y markdownlint-cli2 | Ejecución, instalación y validación. | Herramientas externas. Los paquetes npm inspeccionados declaran MIT; comprobar Node.js y pnpm en sus distribuciones. No forman parte del código original. |
| `marked` y `mermaid` | Generación de manual y diagramas; la compilación copia `mermaid` a `manual/assets/mermaid`. | Los paquetes instalados declaran MIT. Conservar sus avisos en artefactos que los incluyan. |
| `puppeteer-core` | Renderizado mediante Chrome o Edge. | El paquete instalado declara Apache-2.0; los navegadores tienen sus propias condiciones. |
| Electron y electron-builder | Empaquetado de la app Windows. | Los paquetes instalados declaran MIT; revisar también avisos de Electron, Chromium, Node.js y dependencias transitivas del instalador. |
| Capacitor (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`) | App Android. | Los paquetes instalados declaran MIT; conservar avisos que correspondan en el APK. |
| `viem` y `vite` | dApp e indexador de eventos. | Los paquetes instalados declaran MIT; cada dependencia transitiva conserva sus términos. |
| Foundry y `forge-std` | Compilación y pruebas de contratos; `forge-std` se instala en CI y queda fuera del árbol versionado. | MIT o Apache-2.0, a elección, según sus repositorios oficiales. |
| Slither | Análisis estático informativo en CI. | AGPL-3.0 según el proyecto oficial; se ejecuta como herramienta y no se incorpora al código original. |
| Bibliografía, documentación oficial y estándares citados en [`docs/bibliografia.md`](docs/bibliografia.md) y [`docs/recursos-oficiales.md`](docs/recursos-oficiales.md) | Referencias, enlaces y citas breves para estudio. | Pertenecen a sus autores y proyectos. Un enlace o una explicación original no concede licencia sobre la obra enlazada. |
| Insignias de shields.io, nombres de servicios, emoji y símbolos de plataforma | Enlaces e identificadores en README, sitio y aplicaciones. | Recursos o identificadores externos; no se reivindica su titularidad. |

No se detectaron en el árbol versionado copias completas de documentación oficial, fotografías de terceros ni datasets externos. La ausencia de avisos explícitos en un archivo no demuestra que sea propio. Antes de redistribuir ejecutables, verificar la lista efectiva de paquetes y avisos incorporados, incluido el contenido generado y los componentes nativos.
