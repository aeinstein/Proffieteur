const { app, BrowserWindow, Menu, ipcMain  } = require('electron')
const path = require("path");
const { menu } = require("./menu");

const isWindows = process.platform === "win32";


let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        },
        //frame: !isWindows //Remove frame to hide default menu
    })

    mainWindow.loadFile('index.html')

    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
    if (mainWindow === null) createWindow();
});


ipcMain.on(`display-app-menu`, function(e, args) {
    if (isWindows && mainWindow) {
        menu.popup({
            window: mainWindow,
            x: args.x,
            y: args.y
        });
    }
});

app.whenReady().then(() => {
    createWindow()
})
