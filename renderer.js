const { ipcRenderer } = require('electron');

const selectBtn = document.getElementById('selectFolderBtn');
const createBtn = document.getElementById('createBtn');
const folderNameInput = document.getElementById('folderName');
const selectedPath = document.getElementById('selectedPath');
const status = document.getElementById('status');

let basePath = null;

selectBtn.addEventListener('click', async () => {
  basePath = await ipcRenderer.invoke('select-folder');
  if (basePath) {
    selectedPath.textContent = `📂 Wybrana lokalizacja: ${basePath}`;
  } else {
    selectedPath.textContent = 'Nie wybrano lokalizacji.';
  }
});

createBtn.addEventListener('click', async () => {
  if (!basePath) {
    status.textContent = '⚠️ Wybierz lokalizację przed utworzeniem folderu.';
    return;
  }
  const folderName = folderNameInput.value.trim();
  if (!folderName) {
    status.textContent = '⚠️ Podaj nazwę folderu.';
    return;
  }

  const result = await ipcRenderer.invoke('create-folder-structure', { basePath, folderName });
  if (result.success) {
    status.textContent = `✅ Struktura folderów utworzona: ${result.path}`;
  } else {
    status.textContent = `❌ Błąd: ${result.error}`;
  }
});
