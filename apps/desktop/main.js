// Proceso principal de la app de escritorio (Windows).
//
// La app es un lector offline del curso: arranca un http local que sirve
// apps/bundle y abre una ventana sobre él. No hay conexión a internet en el
// camino crítico, así que el curso funciona en un aula sin red.

const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

// Empaquetada, el bundle viaja como recurso extra junto al asar; en desarrollo
// se lee directamente del repositorio.
const RAIZ_CONTENIDO = app.isPackaged
  ? path.join(process.resourcesPath, "bundle")
  : path.join(__dirname, "..", "bundle");

let ventana = null;
let servidor = null;

function leerManifiesto() {
  try {
    return JSON.parse(fs.readFileSync(path.join(RAIZ_CONTENIDO, "contenido.json"), "utf8"));
  } catch {
    return null;
  }
}

function construirMenu(url) {
  const plantilla = [
    {
      label: "Curso",
      submenu: [
        { label: "Inicio", accelerator: "Alt+Home", click: () => ventana?.loadURL(url) },
        { label: "Currículo", click: () => ventana?.loadURL(`${url}/curriculum/README.html`) },
        { label: "Laboratorios", click: () => ventana?.loadURL(`${url}/labs/CATALOG.html`) },
        { label: "Autoevaluación", click: () => ventana?.loadURL(`${url}/autoevaluacion.html`) },
        { type: "separator" },
        { role: "quit", label: "Salir" }
      ]
    },
    {
      label: "Navegar",
      submenu: [
        { label: "Atrás", accelerator: "Alt+Left", click: () => ventana?.webContents.navigateHistory?.(-1) ?? ventana?.webContents.goBack() },
        { label: "Adelante", accelerator: "Alt+Right", click: () => ventana?.webContents.navigateHistory?.(1) ?? ventana?.webContents.goForward() },
        { role: "reload", label: "Recargar" },
        { type: "separator" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
        { role: "resetZoom", label: "Tamaño normal" },
        { role: "togglefullscreen", label: "Pantalla completa" }
      ]
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Acerca de",
          click: () => {
            const m = leerManifiesto();
            dialog.showMessageBox(ventana, {
              type: "info",
              title: "Blockchain Learning Path",
              message: `Blockchain Learning Path ${m ? "v" + m.version : ""}`,
              detail: m
                ? `${m.modulos} módulos · ${m.paginas} páginas${m.manual ? " · manual PDF incluido" : ""}\n\nTodo el contenido está dentro de la app: funciona sin conexión.`
                : "No se encontró el contenido del curso dentro de la app."
            });
          }
        },
        {
          label: "Repositorio en GitHub",
          click: () => shell.openExternal("https://github.com/vladimiracunadev-create/blockchain-learning-path")
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(plantilla));
}

async function crearVentana() {
  const { crearServidorDeContenido, escuchar } = await import("./servidor.mjs");

  if (!fs.existsSync(path.join(RAIZ_CONTENIDO, "index.html"))) {
    dialog.showErrorBox(
      "Contenido no encontrado",
      `La app no encuentra el curso en:\n${RAIZ_CONTENIDO}\n\nEjecuta "pnpm build:bundle" antes de empaquetar.`
    );
    app.quit();
    return;
  }

  servidor = crearServidorDeContenido(RAIZ_CONTENIDO);
  const url = await escuchar(servidor);

  ventana = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 480,
    backgroundColor: "#0d1117",
    title: "Blockchain Learning Path",
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      // La app solo muestra contenido propio; no expone nada de Node al HTML.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  construirMenu(url);
  await ventana.loadURL(url);

  // Los enlaces externos (fuentes, documentación oficial) abren en el navegador
  // del sistema en vez de secuestrar la ventana del curso.
  ventana.webContents.setWindowOpenHandler(({ url: destino }) => {
    if (/^https?:/.test(destino)) shell.openExternal(destino);
    return { action: "deny" };
  });
  ventana.webContents.on("will-navigate", (evento, destino) => {
    if (!destino.startsWith(url)) {
      evento.preventDefault();
      shell.openExternal(destino);
    }
  });

  ventana.on("closed", () => { ventana = null; });
}

// Una sola instancia: abrir el acceso directo dos veces enfoca la ventana ya
// abierta en lugar de levantar un segundo servidor y perder el progreso a medias.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (ventana) {
      if (ventana.isMinimized()) ventana.restore();
      ventana.focus();
    }
  });

  app.whenReady().then(crearVentana);

  app.on("window-all-closed", () => {
    servidor?.close();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
}
