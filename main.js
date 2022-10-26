// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // set up the menu and IPC handlers

  ipcMain.on('set-title', setTitle);

  ipcMain.handle('dialog:selectFile', handleSelectFile);

  Menu.setApplicationMenu(menuFromTemplate(mainWindow));

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode: 'detach'});

  console.log(`mainWindow: ${mainWindow}`);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const setTitle = (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
};

async function handleSelectFile() {
  const {canceled, filePaths} = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    // here should load the file and return the filepath and teh dat in an object
    const data = await openFile(filePaths[0]);
    return {filePath: filePaths[0], data};

    //return filePaths[0];
  }
}

const menuFromTemplate = (mainWindow) => {
  return Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ]);
};

function openFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        console.log('reject: ' + error); // Testing
        reject(error);
      } else {
        console.log('resolve: ' + data); // Testing
        resolve(data);
      }
    });
  });
}

ipcMain.handle('channel-load-file', async (event, filePath) => {
  console.log('channel-load-file: ' + filePath); // Testing
  return openFile(filePath)
    .then((data) => {
      console.log('handle: ' + data); // Testing
      return data;
    })
    .catch((error) => {
      console.log('handle error: ' + error); // Testing
      return 'Error Loading Log File';
    });
});
