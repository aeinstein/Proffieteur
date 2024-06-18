const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
            sandbox: false,
        }
    })
    win.loadFile('app.html')
}

app.whenReady().then(() => {
    createWindow()
})
