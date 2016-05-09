var menubar = require('menubar')
var mb = menubar({ dir: __dirname + '/app', width: 400, height: 600, icon: __dirname + '/app/IconTemplate.png', preloadWindow: true, 'window-position': 'topRight' , webPreferences : { preload : 'preload.js', webSecurity : false}})
var ipc = require('electron').ipcMain
var globalShortcut = require('global-shortcut')
var Menu = require('menu')

mb.on('show', function () {
  mb.window.webContents.send('show')
})

mb.app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

mb.app.on('activate', function () {
  mb.showWindow()
})

var template = [
  {
    label: 'PostCodeBar',
    submenu: [
      {
        label: 'Quit App',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function () { mb.window.toggleDevTools() }
      }
    ]
  }
]

mb.on('ready', function ready () {
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

mb.on('after-create-window', function () {
  var win = mb.window
  win.setResizable(true)
  win.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    require('shell').openExternal(url)
  })
  registerShortcut('ctrl+shift+z', true)
})

// Register a shortcut listener.
var registerShortcut = function (keybinding, initialization) {
  try {
    globalShortcut.unregisterAll()
    globalShortcut.register(keybinding, function () {
      mb.window.isVisible() ? mb.hideWindow() : mb.showWindow()
    })
  } catch (err) {
    console.log(err)
  }
}
