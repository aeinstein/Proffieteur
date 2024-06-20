const { app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const path = require("path");

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        },
        //titleBarStyle: 'hidden',
        //titleBarOverlay: true
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

ipcMain.on(`main-menu-ipc`, function(e, args) {
    mainWindow.loadFile('src/modules/bladeconfig/blades.html')
});

app.whenReady().then(() => {
    createWindow();
})

const template = [
    {
        label: "File",
        submenu: [
            isMac ? { role: "close" } : { role: "quit" },
            {
                label: "open",
                async click() {
                    console.log("open");
                    //mainWindow.webContents.send();

                }
            },
        ]
    },
    {
        label: "Configuration",
        submenu: [
            {
                label: "Blades",
                async click() {
                    console.log("open BladeConfig");
                    await mainWindow.loadFile('src/modules/bladeconfig/blades.html')
                    //mainWindow.webContents.send('main-menu-ipc', "bladeconfig")

                }
            },
            {
                label: "Presets", click() {
                    console.log("open PresetConfig");
                }
            },
        ]
    },

    {
        label: "Flash",
        click(){
            console.log("open flash");
        }
    },

    {
        label: "View",
        submenu: [{ role: "toggledevtools" }]
    },

    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: async () => {
                    const { shell } = require("electron");
                    await shell.openExternal("https://github.org/aeinstein");
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);



function showBladeConfig(){
    mainWindow.loadFile('src/modules/baldeconfig/blades.html')
}