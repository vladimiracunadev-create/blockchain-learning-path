#!/usr/bin/env node
// Abre el APK ya construido y comprueba que el curso está DENTRO.
//
// Un APK es un ZIP. Gradle puede terminar en verde, el archivo pesar 40 MB y la
// versión ser la correcta mientras `assets/public/` está vacío porque el paso de
// copia falló: la app se instala y abre una pantalla en blanco. Compilar no es
// evidencia; contar el contenido sí.
//
// Uso: node apps/android/verificar-apk.mjs [ruta-al-apk]

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const AQUI = dirname(fileURLToPath(import.meta.url));
const apkPath = process.argv[2] ??
  join(AQUI, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");

if (!existsSync(apkPath)) {
  console.error(`❌ No existe el APK en ${apkPath}`);
  process.exit(1);
}

// --- Lectura del directorio central del ZIP -----------------------------------
// Se lee el "central directory" en vez de recorrer las cabeceras locales: es la
// lista autoritativa de lo que el archivo contiene realmente.
const datos = readFileSync(apkPath);
const FIRMA_FIN = 0x06054b50;
const FIRMA_ENTRADA = 0x02014b50;

let finCentral = -1;
for (let i = datos.length - 22; i >= 0 && i > datos.length - 66000; i--) {
  if (datos.readUInt32LE(i) === FIRMA_FIN) { finCentral = i; break; }
}
if (finCentral === -1) {
  console.error("❌ El archivo no es un ZIP/APK válido (falta el fin del directorio central).");
  process.exit(1);
}

const totalEntradas = datos.readUInt16LE(finCentral + 10);
let desplazamiento = datos.readUInt32LE(finCentral + 16);

const entradas = [];
for (let i = 0; i < totalEntradas; i++) {
  if (datos.readUInt32LE(desplazamiento) !== FIRMA_ENTRADA) break;
  const metodo = datos.readUInt16LE(desplazamiento + 10);
  const comprimido = datos.readUInt32LE(desplazamiento + 20);
  const sinComprimir = datos.readUInt32LE(desplazamiento + 24);
  const largoNombre = datos.readUInt16LE(desplazamiento + 28);
  const largoExtra = datos.readUInt16LE(desplazamiento + 30);
  const largoComentario = datos.readUInt16LE(desplazamiento + 32);
  const inicioLocal = datos.readUInt32LE(desplazamiento + 42);
  const nombre = datos.toString("utf8", desplazamiento + 46, desplazamiento + 46 + largoNombre);
  entradas.push({ nombre, metodo, comprimido, sinComprimir, inicioLocal });
  desplazamiento += 46 + largoNombre + largoExtra + largoComentario;
}

function leerEntrada(entrada) {
  const largoNombre = datos.readUInt16LE(entrada.inicioLocal + 26);
  const largoExtra = datos.readUInt16LE(entrada.inicioLocal + 28);
  const inicio = entrada.inicioLocal + 30 + largoNombre + largoExtra;
  const crudo = datos.subarray(inicio, inicio + entrada.comprimido);
  return entrada.metodo === 0 ? crudo : inflateRawSync(crudo);
}

// --- Comprobaciones -----------------------------------------------------------
const fallos = [];
function comprobar(condicion, mensaje) {
  if (condicion) console.log(`  ✔ ${mensaje}`);
  else { console.error(`  ✘ ${mensaje}`); fallos.push(mensaje); }
}

// El número esperado se CUENTA del repositorio, no se escribe a mano: una cifra
// fija aquí obliga a recordar actualizarla cada vez que crece el currículo, y el
// día que se olvida el verificador miente en la dirección peligrosa.
const MODULOS_ESPERADOS = readdirSync(new URL("../../curriculum", import.meta.url))
  .filter((nombre) => /^\d{2}-/.test(nombre)).length;

const RAIZ = "assets/public/";
const contenido = entradas.filter((e) => e.nombre.startsWith(RAIZ));
const paginas = contenido.filter((e) => e.nombre.endsWith(".html"));
const modulos = new Set(
  contenido
    .map((e) => /^assets\/public\/curriculum\/(\d{2}-[a-z0-9-]+)\//.exec(e.nombre)?.[1])
    .filter(Boolean)
);

console.log(`APK: ${apkPath}`);
console.log(`Tamaño: ${(statSync(apkPath).size / 1048576).toFixed(1)} MB · ${entradas.length} entradas\n`);

comprobar(entradas.some((e) => e.nombre === "AndroidManifest.xml"), "es un APK con AndroidManifest");
comprobar(entradas.some((e) => e.nombre === "classes.dex"), "incluye el código compilado (classes.dex)");
comprobar(contenido.length > 0, `el curso está empaquetado en ${RAIZ} (${contenido.length} archivos)`);
comprobar(paginas.length >= 80, `trae las páginas del curso (${paginas.length} HTML)`);
comprobar(
  modulos.size === MODULOS_ESPERADOS,
  `trae los ${MODULOS_ESPERADOS} módulos del currículo (${modulos.size} encontrados)`
);
comprobar(
  entradas.some((e) => e.nombre === `${RAIZ}manual/MANUAL.pdf` && e.sinComprimir > 1_000_000),
  "el manual PDF viaja dentro del APK"
);
comprobar(
  entradas.some((e) => /^res\/.*ic_launcher.*\.png$/.test(e.nombre)) ||
  entradas.some((e) => e.nombre.startsWith("res/") && e.nombre.includes("launcher")),
  "incluye el icono del lanzador"
);

// El manifiesto del bundle: la prueba de que el contenido empaquetado es el que
// se generó, y no una copia vieja que quedó en el árbol de trabajo.
const entradaManifiesto = entradas.find((e) => e.nombre === `${RAIZ}contenido.json`);
comprobar(Boolean(entradaManifiesto), "incluye el manifiesto de contenido");
if (entradaManifiesto) {
  const manifiesto = JSON.parse(leerEntrada(entradaManifiesto).toString("utf8"));
  comprobar(
    manifiesto.modulos === MODULOS_ESPERADOS,
    `el manifiesto declara ${MODULOS_ESPERADOS} módulos (declara ${manifiesto.modulos})`
  );
  comprobar(manifiesto.manual === true, "el manifiesto confirma el manual incluido");
  console.log(`\n  Versión empaquetada: ${manifiesto.version}`);
}

// Una página real, descomprimida y leída: la prueba definitiva de que el HTML
// no es un archivo vacío con el nombre correcto.
const modulo = entradas.find((e) => e.nombre === `${RAIZ}curriculum/09-seguridad/README.html`);
comprobar(Boolean(modulo), "el módulo 09 está en el APK");
if (modulo) {
  const html = leerEntrada(modulo).toString("utf8");
  comprobar(html.length > 20000, `el módulo 09 tiene su contenido (${html.length} bytes de HTML)`);
  comprobar(html.includes("Seguridad y auditoría"), "el módulo 09 conserva su título");
  comprobar((html.match(/"prompt":/g) ?? []).length === 4, "el módulo 09 lleva sus 4 preguntas de autoevaluación");
  comprobar(html.includes('rel="prev"') && html.includes('rel="next"'), "el módulo 09 lleva la navegación anterior/siguiente");
}

console.log(fallos.length
  ? `\n❌ ${fallos.length} comprobaciones fallidas: el APK NO sirve para publicar.`
  : "\n✅ El APK contiene el curso completo.");
process.exit(fallos.length ? 1 : 0);
