#!/usr/bin/env node
// Aplica al proyecto nativo de Android lo que `cap add android` no sabe: el
// icono del curso, el nombre visible, el color de marca y la versión.
//
// El proyecto nativo (android/) NO se versiona: se regenera en cada build, así
// que las personalizaciones tienen que ser un script y no ediciones a mano que
// se pierden en la siguiente regeneración.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RES = join(AQUI, "android", "app", "src", "main", "res");
const RECURSOS = join(AQUI, "recursos");

if (!existsSync(RES)) {
  throw new Error(`No existe el proyecto nativo en ${RES}. Ejecuta antes: npx cap add android`);
}
if (!existsSync(join(RECURSOS, "ic_launcher-mdpi.png"))) {
  throw new Error("Faltan los iconos. Ejecuta antes: pnpm build:icons");
}

// --- Iconos por densidad ------------------------------------------------------
const densidades = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];
for (const densidad of densidades) {
  const destino = join(RES, `mipmap-${densidad}`);
  mkdirSync(destino, { recursive: true });
  copyFileSync(join(RECURSOS, `ic_launcher-${densidad}.png`), join(destino, "ic_launcher.png"));
  copyFileSync(join(RECURSOS, `ic_launcher_round-${densidad}.png`), join(destino, "ic_launcher_round.png"));
  copyFileSync(join(RECURSOS, `ic_launcher_foreground-${densidad}.png`), join(destino, "ic_launcher_foreground.png"));
}

// --- Icono adaptativo ---------------------------------------------------------
// Android 8+ recorta el icono con la máscara que elija el lanzador (círculo,
// squircle…). Por eso se entrega en dos capas: un fondo liso de marca y un
// primer plano con margen, para que el recorte nunca corte los bloques.
const adaptativo = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
for (const carpeta of ["mipmap-anydpi-v26"]) {
  const destino = join(RES, carpeta);
  mkdirSync(destino, { recursive: true });
  writeFileSync(join(destino, "ic_launcher.xml"), adaptativo, "utf8");
  writeFileSync(join(destino, "ic_launcher_round.xml"), adaptativo, "utf8");
}

// --- Colores y textos ---------------------------------------------------------
const valores = join(RES, "values");
mkdirSync(valores, { recursive: true });

const version = JSON.parse(readFileSync(join(AQUI, "package.json"), "utf8")).version;
writeFileSync(join(valores, "ic_launcher_background.xml"), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#5B3FD6</color>
</resources>
`, "utf8");

writeFileSync(join(valores, "strings.xml"), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Blockchain Learning Path</string>
    <string name="title_activity_main">Blockchain Learning Path</string>
    <string name="package_name">dev.vladimiracuna.blockchainlearningpath</string>
    <string name="custom_url_scheme">dev.vladimiracuna.blockchainlearningpath</string>
</resources>
`, "utf8");

// --- Versión del APK ----------------------------------------------------------
// versionName es la que ve la persona; versionCode es el entero que Android usa
// para decidir si una instalación es una actualización. 0.7.0 → 700.
const gradle = join(AQUI, "android", "app", "build.gradle");
const [mayor, menor, parche] = version.split(".").map(Number);
const versionCode = mayor * 10000 + menor * 100 + parche;
let contenidoGradle = readFileSync(gradle, "utf8");
contenidoGradle = contenidoGradle
  .replace(/versionCode \d+/, `versionCode ${versionCode}`)
  .replace(/versionName "[^"]*"/, `versionName "${version}"`);
writeFileSync(gradle, contenidoGradle, "utf8");

console.log(`Android personalizado: icono, nombre y versión ${version} (versionCode ${versionCode}).`);
