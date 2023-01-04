'use strict'

const { BrowserWindow, Notification, app, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const { ipcMain } = require('electron/main')
const { ipcMainEvents } = require('./ipc')
const ms = require('ms')
const log = require('electron-log').scope('updater')
const { showDialogSync } = require('./dialog')

// must be global to avoid gc
let updateNotification = null

let checkingManually = false

let updateAvailable = false

/** @type {string | undefined} */
let nextVersion

function quitAndInstall () {
  beforeQuitCleanup()
  autoUpdater.quitAndInstall()
}

function beforeQuitCleanup () {
  BrowserWindow.getAllWindows().forEach(w => w.removeAllListeners('close'))
  app.removeAllListeners('window-all-closed')
}

function setup (/** @type {import('./typings').Context} */ _ctx) {
  autoUpdater.logger = log
  autoUpdater.autoDownload = false // we download manually in 'update-available'

  autoUpdater.on('error', onUpdaterError)
  autoUpdater.on('update-available', onUpdateAvailable)
  autoUpdater.on('update-not-available', onUpdateNotAvailable)
  autoUpdater.on('update-downloaded', onUpdateDownloaded)

  // built-in updater != electron-updater
  // https://github.com/electron-userland/electron-builder/pull/6395
  require('electron').autoUpdater.on('before-quit-for-update', beforeQuitCleanup)
}

module.exports = async function setupUpdater (/** @type {import('./typings').Context} */ ctx) {
  ctx.getUpdaterStatus = function getUpdaterStatus () {
    return { updateAvailable }
  }

  ctx.openReleaseNotes = openReleaseNotes

  if (['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
    ctx.manualCheckForUpdates = () => {
      showDialogSync({
        title: 'Not available in development',
        message: 'Yes, you called this function successfully.',
        type: 'info',
        buttons: ['Close']
      })
    }

    ctx.restartToUpdate = () => {
      showDialogSync({
        title: 'Not available in development',
        message: 'Yes, you called this function successfully.',
        type: 'info',
        buttons: ['Close']
      })
    }

    return
  }

  setup(ctx)

  checkForUpdatesInBackground() // async check on startup
  setInterval(checkForUpdatesInBackground, ms('12h'))

  // enable on-demand check via Tray menu
  ctx.manualCheckForUpdates = () => {
    checkingManually = true
    checkForUpdatesInBackground()
  }

  ctx.restartToUpdate = () => {
    quitAndInstall()
  }
}

function checkForUpdatesInBackground () {
  ipcMain.emit(ipcMainEvents.UPDATE_CHECK_STARTED)

  // TODO: replace this with autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.checkForUpdates()
    // We are ignoring errors, they are already handled by our `error` event listener
    .finally(() => ipcMain.emit(ipcMainEvents.UPDATE_CHECK_FINISHED))
}

/**
 * @param {any} err
 */
function onUpdaterError (err) {
  log.error('error', err)

  if (!checkingManually) { return }
  checkingManually = false

  showDialogSync({
    title: 'Could not download update',
    message: 'It was not possible to download the update. Please check your Internet connection and try again.',
    type: 'error',
    buttons: ['Close']
  })
}

/**
 * @param {import('electron-updater').UpdateInfo} info
 */
function onUpdateAvailable ({ version /*, releaseNotes */ }) {
  updateAvailable = true
  nextVersion = version

  ipcMain.emit(ipcMainEvents.UPDATE_AVAILABLE)
  log.info(`Update to version ${version} is available, downloading..`)
  autoUpdater.downloadUpdate().then(
    _ => log.info('Update downloaded'),
    err => log.error('Cannot download the update.', err)
  )

  if (!checkingManually) { return }
  // do not toggle checkingManually off here so we can show a dialog once the download
  // is finished.

  const buttonIx = showDialogSync({
    title: 'Update available',
    message: `A new version ${version} of Filecoin Station is available. The download will begin shortly in the background.`,
    type: 'info',
    buttons: ['Close', 'Show Release Notes']
  })

  if (buttonIx === 1) {
    openReleaseNotes()
  }
}

function openReleaseNotes () {
  const version = nextVersion ? `v${nextVersion}` : 'latest'
  shell.openExternal(`https://github.com/filecoin-station/filecoin-station/releases/${version}`)
}

/**
 * @param {import('electron-updater').UpdateInfo} info
 */
function onUpdateNotAvailable ({ version }) {
  log.info(`update not available from version ${version}`)

  if (!checkingManually) { return }
  checkingManually = false

  showDialogSync({
    title: 'Update not available',
    message: `You are on the latest version of Filecoin Station (${version}).`,
    type: 'info',
    buttons: ['Close']
  })
}

/**
 * @param {import('electron-updater').UpdateDownloadedEvent} event
 */
function onUpdateDownloaded ({ version /*, releaseNotes */ }) {
  log.info(`update to ${version} downloaded`)

  const showUpdateDialog = () => {
    const buttonIx = showDialogSync({
      title: 'Update Filecoin Station',
      message: `An update to Filecoin Station ${version} is available. Would you like to install it now?`,
      type: 'info',
      buttons: ['Later', 'Install now']
    })
    if (buttonIx === 1) { // install now
      setImmediate(quitAndInstall)
    }
  }

  if (checkingManually) {
    // when checking manually, show the dialog immediately
    showUpdateDialog()
  } else {
    // show unobtrusive notification + dialog on click
    updateNotification = new Notification({
      title: 'Filecoin Station Update',
      body: `An update to Filecoin Station ${version} is available.`
    })
    updateNotification.on('click', showUpdateDialog)
    updateNotification.show()
  }
}
