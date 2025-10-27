const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();
});

// Funkcja pomocnicza do bezpiecznego tworzenia folderu
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Obsługa wyboru folderu
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

// Obsługa tworzenia struktury folderów
ipcMain.handle('create-folder-structure', async (event, { basePath, folderName }) => {
  try {
    const rootPath = path.join(basePath, folderName);

    if (fs.existsSync(rootPath)) {
      return { success: false, error: 'Folder już istnieje!' };
    }

    // Tworzymy folder główny
    ensureDir(rootPath);

    // Definiujemy strukturę
    const subFolders = [
      "01_Overall",
      "02_WP1",
      "03_WP3",
      "04_WP4",
      "05_Models"
    ];

    const commonSubfolders = [
      "01_Doc_Native",
      "02_Doc_PDF",
      "03_Layouts_CAD",
      "04_Layouts_PDF"
    ];

    const modelSubfolders = [
      "01_RVT",
      "02_NWC",
      "03_IFC",
      "04_DWG"
    ];

    // Tworzymy strukturę folderów
    for (const folder of subFolders) {
      const subPath = path.join(rootPath, folder);
      ensureDir(subPath);

      if (folder === "05_Models") {
        modelSubfolders.forEach(sub => ensureDir(path.join(subPath, sub)));
      } else {
        commonSubfolders.forEach(sub => ensureDir(path.join(subPath, sub)));
      }
    }

    return { success: true, path: rootPath };

  } catch (err) {
    return { success: false, error: err.message };
  }
});
