import { app, BrowserWindow, ipcMain } from "electron";

import * as path from "path";
import * as url from "url";
import { BoardController, SignInController } from "./controller";
import { KeychainManger } from "./utils/keychain";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("request-saved-token", async event => {
  const kc = new KeychainManger();
  const result = await kc.find();
  if (result !== null && result !== undefined) {
    mainWindow.webContents.send("response-saved-token", { hasToken: true });
  } else {
    mainWindow.webContents.send("response-saved-token", { hasToken: false });
  }

  event.returnValue = "OK";
});

ipcMain.on("save-auth", async (event, payload) => {
  const signInController = new SignInController();
  const { host, email, password } = payload;
  const { error, session } = await signInController.signIn(
    `https://${host}`,
    email,
    password
  );
  mainWindow.webContents.send("response-save-auth", { error, session });
  mainWindow.webContents.send("response-saved-token", { hasToken: true });
  event.returnValue = "OK";
});

ipcMain.on("request-issue", async (event, payload) => {
  const kc = new KeychainManger();
  const login = await kc.find();
  const boardController = new BoardController(login);

  const { assignee, component } = payload;
  console.log(payload);

  try {
    const start = new Date();
    const data = await boardController.getTickets(component, assignee);
    const end = new Date();
    console.log(`Load time: ${end.getTime() - start.getTime()}`);
    mainWindow.webContents.send("response-issue", { data, host: login.host });
  } catch (e) {
    console.log(e);
    event.returnValue = "error";
  }
});

ipcMain.on("request-components", async (event, payload) => {
  const kc = new KeychainManger();
  const login = await kc.find();
  const boardController = new BoardController(login);
  try {
    const start = new Date();
    const components = await boardController.getComponents();
    const end = new Date();
    console.log(`Load time: ${end.getTime() - start.getTime()}`);
    mainWindow.webContents.send("response-components", { components });
  } catch (e) {
    console.log(e);
    event.returnValue = "error";
  }
});

ipcMain.on("request-assignee", async (event, payload) => {
  const kc = new KeychainManger();
  const login = await kc.find();
  const boardController = new BoardController(login);
  try {
    const start = new Date();
    const assignees = await boardController.getAssignee();
    const end = new Date();
    console.log(`Load time: ${end.getTime() - start.getTime()}`);
    mainWindow.webContents.send("response-assignee", { assignees });
  } catch (e) {
    console.log(e);
    event.returnValue = "error";
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
