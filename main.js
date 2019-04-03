const electron = require('electron')
const webContents = electron.webContents;
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });


  mainWindow.maximize();

}
var mainSender;

ipcMain.on('test-call', (e, ar) => {
  console.log("test call");
})
ipcMain.on('doc-window', (event, arg1) => {
  // let w1=webContents.fromId('tab1-webview');
  // w1.executeJavaScript('document.getElementsByTagName("body")[0].innerHTML;', true)
  //   .then((result) => {
  //     console.log(result) // Will be the JSON object from the fetch call
  //   })
  // Print 1
  console.log("arg" + arg1);
  mainSender = event.sender;
  ipcMain.on('is-tab-available', (e, id) => {
    console.log("is tab available");
    e.sender.send('is-tab-available-reply', {
      id: id, tab: arg1.tab, tabContent: arg1.tabContent,
      webviewContent: arg1.webviewContent
    });
  })
  dockedWindow = new BrowserWindow({ width: 800, height: 600 })
  dockedWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));



});

ipcMain.on('undock-start', (e, args) => {
  // console.log("undock start "+args.top);
  //console.log("is visible "+mainWindow.isVisible());
  if (mainWindow.isVisible() && args.top <= -60 && dockedWindow) {
    mainSender.send('add-new-tab');
    console.log("undock start " + args.top);
    //console.log("webcontents "+JSON.stringify(dockedWindow.webContents));
    dockedWindow.close();
    dockedWindow = null;
  } else {
    // console.log("m "+JSON.stringify(mainWindow.getBounds()));
    // console.log("d "+JSON.stringify(dockedWindow.getBounds()));
  }

})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
