import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import getDbClient from './db'

async function getPartners(dbClient) {
  const discountMap = [
    {
      from: -Infinity,
      to: 10000.0,
      discount: 0
    },
    {
      from: 10000.0,
      to: 50000.0,
      discount: 5
    },
    {
      from: 50000.0,
      to: 300000.0,
      discount: 10
    },
    {
      from: 300000.0,
      to: Infinity,
      discount: 15
    }
  ]
  try {
    const response = await dbClient.query(`
      select partners.id, partner_types.type, partners.name, partners.fio, partners.phone_number, partners.email, partners.address, partners.rating, sales_agg.amount, partners.partner_type_id 
      from partners
      join partner_types on partners.partner_type_id = partner_types.id
      left join (
	      select sales.partner_id, sum(sales.amount) as amount from sales group by sales.partner_id
      ) as sales_agg on partners.id = sales_agg.partner_id;`)
    const result = response.rows.map((partner) => {
      const amount = partner.amount ? parseFloat(partner.amount) : 0
      const discount = discountMap.find(({ from, to }) => amount >= from && amount < to).discount
      return { ...partner, amount, discount }
    })
    return result
  } catch (e) {
    console.log(e)
  }
}

async function getPartnerTypes(dbClient) {
  try {
    const response = await dbClient.query(`
      select * from partner_types;`)
    return response.rows
  } catch (e) {
    console.log(e)
  }
}

async function createPartner(dbClient, partner) {
  console.log(partner)
  try {
    await dbClient.query(`
      insert into partners (partner_type_id, name, fio, phone_number, email, address, rating) values 
	    (${partner.partner_type_id}, 
      '${partner.name}', 
      '${partner.fio}', 
      '${partner.phone_number}', 
      '${partner.email}', 
      '${partner.address}', 
      ${partner.rating});`)
    dialog.showMessageBox({ message: 'Партнер успешно создан' })
    return
  } catch (e) {
    dialog.showErrorBox('Невозможно создать партнера', e.message)
    console.log(e)
  }
}

async function updatePartner(dbClient, partner) {
  console.log(partner)
  try {
    await dbClient.query(`
      update partners set
        partner_type_id = ${partner.partner_type_id},
        name = '${partner.name}', 
        fio = '${partner.fio}', 
        phone_number = '${partner.phone_number}', 
        email = '${partner.email}', 
        address = '${partner.address}', 
        rating = ${partner.rating} 
      where id = ${partner.id};`)
    dialog.showMessageBox({ message: 'Данные партнера успешно обновлены' })
    return
  } catch (e) {
    dialog.showErrorBox('Невозможно обновить партнера', e.message)
    console.log(e)
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  const dbClient = await getDbClient()

  ipcMain.handle('getPartners', () => getPartners(dbClient))
  ipcMain.handle('getPartnerTypes', () => getPartnerTypes(dbClient))
  ipcMain.handle('createPartner', (event, partner) => createPartner(dbClient, partner))
  ipcMain.handle('updatePartner', (event, partner) => updatePartner(dbClient, partner))

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
