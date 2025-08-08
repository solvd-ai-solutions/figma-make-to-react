const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');
const { pathToFileURL } = require('url');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let serverProcess;

function waitForPort(port, host = '127.0.0.1', timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.connect(port, host, () => {
        socket.end();
        resolve(true);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port}`));
        } else {
          setTimeout(tryConnect, 500);
        }
      });
    };
    tryConnect();
  });
}

async function ensureNextServer() {
  const projectRoot = path.resolve(__dirname, '..');
  const port = 3001;
  const host = '127.0.0.1';

  if (isDev) {
    try {
      await waitForPort(port, host, 2000);
      return { type: 'http', url: `http://${host}:${port}` };
    } catch {}

    serverProcess = spawn('npm', ['run', 'dev'], { cwd: projectRoot, env: { ...process.env }, stdio: 'ignore' });
    serverProcess.unref();
    await waitForPort(port, host, 30000);
    return { type: 'http', url: `http://${host}:${port}` };
  }

  // Production: prefer static export if present
  const outDir = path.join(projectRoot, 'out');
  const rootHtml = path.join(outDir, 'index.html');
  if (fs.existsSync(rootHtml)) {
    return { type: 'file', fileUrl: pathToFileURL(rootHtml).toString() };
  }

  // Fallback: attempt to start Next.js server if available
  try {
    await waitForPort(port, host, 2000);
    return { type: 'http', url: `http://${host}:${port}` };
  } catch {}
  serverProcess = spawn('npm', ['run', 'start'], { cwd: projectRoot, env: { ...process.env }, stdio: 'ignore' });
  serverProcess.unref();
  await waitForPort(port, host, 30000);
  return { type: 'http', url: `http://${host}:${port}` };
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hiddenInset', // macOS native title bar
    show: false, // Don't show until ready
  });

  // Ensure Next.js server is running, then load the app
  ensureNextServer()
    .then((info) => {
      if (info.type === 'file') {
        mainWindow.loadURL(info.fileUrl);
      } else {
        mainWindow.loadURL(info.url);
      }
    })
    .catch((err) => {
      const msg = `Failed to start Next.js server: ${err.message}`;
      mainWindow.loadURL(`data:text/plain,${encodeURIComponent(msg)}`);
    });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create menu
function createMenu() {
  const template = [
    {
      label: 'Figma Converter',
      submenu: [
        {
          label: 'About Figma Converter',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (serverProcess) {
    try { serverProcess.kill(); } catch {}
    serverProcess = null;
  }
});

// Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
}); 