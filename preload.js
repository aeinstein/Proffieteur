const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setMain: (module) => ipcRenderer.send('main-menu-ipc', module)
})
