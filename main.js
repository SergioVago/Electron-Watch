const { app, BrowserWindow, globalShortcut, screen } = require('electron')

let win, size, width, height;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 100,
        height: 35,
        alwaysOnTop: true,
        frame: false,
        backgroundColor: "#0000",
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    // win.loadURL(config.url)
    win.loadFile('index.html')

    // Open the DevTools.
    // win.webContents.openDevTools()

    win.setAlwaysOnTop(true, "screen-saver")

    size = screen.getPrimaryDisplay().size;
    width = size.width
    height = size.height

    win.setPosition(width - 400, height - 45)
}

function toggleDevTools() {
    win.webContents.toggleDevTools()
}

const directions = ["up", "down", "left", "right"]
function move(direction, pxNumber) {
    // console.log('direction :>> ', direction);
    const px = pxNumber;

    var [x, y] = win.getPosition();
    switch (direction) {
        case "down":
            y = y + px
            break
        case "up":
            y = y - px
            break
        case "left":
            x = x - px
            break
        case "right":
            x = x + px
            break
        default:
            console.log("Invalid direction!")
    }
    win.setPosition(x, y)
}


var setPosition = true;
var lastPosition = {};
function changePositionToRightBottom() {
    if (setPosition) {
        var [x, y] = win.getPosition();
        lastPosition.x = x;
        lastPosition.y = y;

        win.setPosition(width - 100, height -40)
        setPosition = false
    } else {
        setPosition = true
        win.setPosition(lastPosition.x, lastPosition.y)
    }
}

function close() {
    app.quit()
}

function createShortcuts() {
    globalShortcut.register('CmdOrCtrl+J', toggleDevTools)
    globalShortcut.register('CmdOrCtrl+Alt+Shift+x', close)
    globalShortcut.register('Scrolllock', () => win.moveTop(99))
    globalShortcut.register('Alt+Scrolllock', changePositionToRightBottom)

    directions.map((direction) => {
        globalShortcut.register(`CmdOrCtrl+Alt+Shift+${direction}`, () => move(direction, 5))
    })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
    .then(createWindow)
    .then(createShortcuts)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.