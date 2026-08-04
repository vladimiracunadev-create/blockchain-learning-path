# 📱 App Android

> [⬅️ Volver al programa](../../README.md) · [🖥️ App de Windows](../desktop/README.md) · [📚 Currículo](../../curriculum/README.md)

El curso completo en el teléfono: **19 módulos, 84 páginas, las 50 prácticas, los
ADR, el manual en PDF y la autoevaluación de cada módulo**, todo dentro del APK.
Una vez instalada **no necesita conexión**, que es justo lo que hace falta para
estudiar en el metro o en un aula sin wifi.

El APK pesa unos **8,5 MB**.

## Instalar

Descarga `BlockchainLearningPath-<versión>.apk` de la
[última release](https://github.com/vladimiracunadev-create/blockchain-learning-path/releases/latest).

Como no viene de Google Play, Android pedirá permiso para instalar desde esa
fuente: **Ajustes → Aplicaciones → Acceso especial → Instalar apps desconocidas**.
Compara el `SHA256` publicado en la release antes de instalar.

> El APK está firmado con la **clave de depuración** de Android, que es pública y
> conocida. Sirve para instalar y estudiar; **no** es una firma de identidad ni
> sustituye a una release firmada de Play Store.

## Cómo está hecha

Capacitor envuelve en un WebView el mismo bundle HTML que se publica en GitHub
Pages, así que el contenido de la web, la app de Windows y el móvil **son
literalmente el mismo build**: no hay una versión que se quede atrás.

```text
apps/bundle/            ← el curso renderizado (lo genera build:bundle)
apps/android/
  preparar.mjs          ← copia el bundle a www/ y falla si está incompleto
  personalizar.mjs      ← icono, nombre, color y versión del proyecto nativo
  verificar-apk.mjs     ← abre el APK y cuenta el curso que hay dentro
  recursos/             ← mipmaps generados desde apps/icono.svg
  android/              ← proyecto nativo: se REGENERA, no se versiona
```

El directorio `android/` no está en git a propósito: se regenera con
`cap add android` en cada build. Por eso las personalizaciones son un script
(`personalizar.mjs`) y no ediciones a mano, que se perderían en la siguiente
regeneración.

## Construir en local

Necesitas el **SDK de Android** y un **JDK 21** (Capacitor 7 no compila con
versiones anteriores; Android Studio incluye uno en `jbr/`).

```bash
pnpm app:android
```

Equivale a: generar el bundle → copiarlo a `www/` → `cap add android` →
personalizar → `gradlew assembleDebug`.

Si Gradle falla con `invalid source release: 21`, estás usando un JDK antiguo:

```bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
```

## Verificación

```bash
pnpm app:android:verify
```

Abre el APK como el ZIP que es y comprueba **dentro**: que `assets/public/` no
está vacío, que están los 19 módulos, que el manual PDF viaja, y que una página
concreta conserva su título, sus 4 preguntas y sus enlaces anterior/siguiente.

Existe porque el fallo característico de estos empaquetados no es que fallen al
compilar: es que compilan en verde, pesan lo esperado, se instalan sin error y
abren **una pantalla en blanco** porque el paso de copia de los assets falló en
silencio. Compilar no es evidencia de nada; contar el contenido sí.

---

> [⬅️ Volver al programa](../../README.md) · [🖥️ App de Windows](../desktop/README.md)
