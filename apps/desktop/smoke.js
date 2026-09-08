// Comprobación de que la app EMPAQUETADA muestra el curso de verdad.
//
// Un build en verde no prueba nada: el instalador puede pesar 90 MB, tener la
// versión correcta, instalarse sin un error... y abrir una ventana vacía porque
// el bundle no se copió. Esto arranca la app real, carga la portada y una clase,
// y comprueba el contenido en el DOM. Si algo falta, sale con código 1.
//
// Uso: electron apps/desktop/smoke.js

const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const RAIZ_CONTENIDO = app.isPackaged
  ? path.join(process.resourcesPath, "bundle")
  : path.join(__dirname, "..", "bundle");

// El número esperado se CUENTA del repositorio, no se escribe a mano: una cifra
// fija aquí obliga a recordar actualizarla cada vez que crece el currículo, y el
// día que se olvida el verificador miente en la dirección peligrosa.
// En la app empaquetada no hay repositorio, así que se cuenta el propio bundle:
// ahí la comprobación que importa es que el manifiesto y el contenido coincidan.
const RAIZ_CURRICULO = app.isPackaged
  ? path.join(RAIZ_CONTENIDO, "curriculum")
  : path.join(__dirname, "..", "..", "curriculum");
const UNIDADES_ESPERADAS = fs.existsSync(RAIZ_CURRICULO)
  ? fs.readdirSync(RAIZ_CURRICULO, { withFileTypes: true })
      .filter((entrada) => entrada.isDirectory() && /^\d{2}-/.test(entrada.name)).length
  : 0;

const fallos = [];
function comprobar(condicion, mensaje) {
  if (condicion) console.log(`  ✔ ${mensaje}`);
  else { console.error(`  ✘ ${mensaje}`); fallos.push(mensaje); }
}

app.whenReady().then(async () => {
  const { crearServidorDeContenido, escuchar } = await import("./servidor.mjs");

  console.log(`Contenido esperado en: ${RAIZ_CONTENIDO}`);
  comprobar(fs.existsSync(RAIZ_CONTENIDO), "el directorio del curso existe dentro de la app");

  let manifiesto = null;
  try {
    manifiesto = JSON.parse(fs.readFileSync(path.join(RAIZ_CONTENIDO, "contenido.json"), "utf8"));
  } catch { /* se reporta abajo */ }
  comprobar(manifiesto !== null, "contenido.json presente");
  comprobar(
    manifiesto?.mapasTematicos === UNIDADES_ESPERADAS && manifiesto?.clases === 66,
    `el manifiesto declara 66 clases y ${UNIDADES_ESPERADAS} mapas temáticos`
  );
  comprobar(manifiesto?.manual === true, "el manual PDF viaja dentro de la app");

  const servidor = crearServidorDeContenido(RAIZ_CONTENIDO);
  const url = await escuchar(servidor);
  const ventana = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true } });

  // Portada
  await ventana.loadURL(url);
  const titulo = await ventana.webContents.executeJavaScript("document.title");
  comprobar(/Blockchain Learning Path/i.test(titulo), `la portada carga (título: "${titulo}")`);

  // Una clase real, con su contenido, evaluación y navegación
  await ventana.loadURL(`${url}/curriculum/09-seguridad/clase-19-modelado-de-amenazas-y-revision-manual.html`);
  await ventana.webContents.executeJavaScript(`new Promise((resolve) => {
    if (window.__mermaidDone === true) return resolve();
    const started = Date.now();
    const timer = setInterval(() => {
      if (window.__mermaidDone === true || Date.now() - started > 30000) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  })`);
  const clase = await ventana.webContents.executeJavaScript(`(() => ({
    h1: document.querySelector("h1")?.textContent || "",
    palabras: document.body.innerText.trim().split(/\\s+/).length,
    diagramas: document.querySelectorAll("pre.mermaid svg").length,
    prev: [...document.querySelectorAll("main a")].some(a => a.getAttribute("href")?.includes("clase-18")),
    next: [...document.querySelectorAll("main a")].some(a => a.getAttribute("href")?.includes("clase-20")),
    enlacesMenu: document.querySelectorAll("nav.side a").length
  }))()`);

  comprobar(/Clase 19/i.test(clase.h1), `la clase 19 carga su título propio ("${clase.h1}")`);
  comprobar(clase.palabras > 650, `la clase trae profundidad propia (${clase.palabras} palabras)`);
  comprobar(clase.diagramas >= 1, `la clase renderiza su gráfico pedagógico (${clase.diagramas})`);
  comprobar(clase.prev, "enlaza directamente a la clase 18");
  comprobar(clase.next, "enlaza directamente a la clase 20");
  comprobar(clase.enlacesMenu > 70, `el menú lateral enumera las 66 clases (${clase.enlacesMenu} enlaces)`);

  await ventana.loadURL(`${url}/curriculum/09-seguridad/README.html`);
  const preguntasTema = await ventana.webContents.executeJavaScript("document.querySelectorAll('.qm').length");
  comprobar(preguntasTema === 4, `el mapa temático conserva su autoevaluación (${preguntasTema} preguntas)`);

  // El buscador depende de un fetch: bajo file:// fallaría en silencio.
  await ventana.loadURL(url);
  const busqueda = await ventana.webContents.executeJavaScript(
    `fetch("/busqueda.json").then(r => r.json()).then(j => j.length).catch(() => -1)`
  );
  comprobar(busqueda > 50, `el índice de búsqueda se carga (${busqueda} documentos)`);

  servidor.close();
  console.log(fallos.length ? `\n❌ ${fallos.length} comprobaciones fallidas.` : "\n✅ La app empaquetada contiene el curso completo.");
  app.exit(fallos.length ? 1 : 0);
});
