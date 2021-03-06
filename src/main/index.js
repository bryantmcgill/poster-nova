'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  const { dialog } = require('electron')

  ipcMain.on('open-save-folder-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (files) => {
      if (files && files[0]) {
        event.sender.send('selected-save-directory', files[0])
      }
    })
  })

  ipcMain.on('open-select-music-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      if (files && files[0]) {
        event.sender.send('selected-music-file', files[0])
      }
    })
  })

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1063,
    useContentSize: true,
    width: 1500
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
