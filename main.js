const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(app.getPath('userData'), 'tasks.json');

function loadTasks() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading tasks:', e);
  }
  return {
    columns: {
      pending: { name: 'Pending', tasks: [] },
      wip: { name: 'In Progress', tasks: [] },
      done: { name: 'Done', tasks: [] }
    },
    tags: ['Bug', 'Feature', 'Improvement', 'Urgent', 'Documentation', 'Research'],
    nextId: 1
  };
}

function saveTasks(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
  startNotificationScheduler();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── Auto Updater ────────────────────────────────────
function setupAutoUpdater() {
  // Don't check for updates in dev mode
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes
    });
  });

  autoUpdater.on('update-not-available', () => {
    mainWindow?.webContents.send('update-not-available');
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('update-download-progress', {
      percent: Math.round(progress.percent),
      transferred: progress.transferred,
      total: progress.total
    });
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', (err) => {
    mainWindow?.webContents.send('update-error', err.message);
  });

  // Check for updates after a short delay
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 5000);
}

// IPC Handlers for updates
ipcMain.handle('check-for-updates', () => {
  if (!app.isPackaged) return { available: false, dev: true };
  return autoUpdater.checkForUpdates().catch(() => null);
});

ipcMain.handle('download-update', () => {
  return autoUpdater.downloadUpdate().catch(() => null);
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall(false, true);
});

// IPC Handlers
ipcMain.handle('load-tasks', () => loadTasks());
ipcMain.handle('save-tasks', (_, data) => { saveTasks(data); return true; });

ipcMain.handle('window-minimize', () => mainWindow?.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('window-close', () => mainWindow?.close());

ipcMain.handle('get-version', () => app.getVersion());

ipcMain.handle('export-data', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportar Dados do TaskFlow',
    defaultPath: `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (!result.canceled && result.filePath) {
    try {
      const data = loadTasks();
      fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, path: result.filePath };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  return { success: false, canceled: true };
});

ipcMain.handle('import-data', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Importar Dados do TaskFlow',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const raw = fs.readFileSync(result.filePaths[0], 'utf-8');
      const data = JSON.parse(raw);
      if (data && data.columns) {
        saveTasks(data);
        return { success: true, data };
      }
      return { success: false, error: 'Arquivo inválido: formato incompatível.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  return { success: false, canceled: true };
});

// ─── Due Date Notifications ──────────────────────────
let notificationInterval = null;

function checkDueDateNotifications() {
  const data = loadTasks();
  if (!data || !data.columns) return;

  const now = new Date();

  // Track which tasks we already notified about today (in memory)
  if (!global._notifiedTasks) global._notifiedTasks = new Set();

  const tasksToNotify = [];

  for (const colKey of ['pending', 'wip']) {
    const tasks = data.columns[colKey]?.tasks || [];
    for (const task of tasks) {
      if (!task.dueDate || global._notifiedTasks.has(task.id)) continue;

      const due = new Date(task.dueDate + 'T23:59:59');
      const diffMs = due - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        tasksToNotify.push({ task, type: 'overdue', days: Math.abs(diffDays) });
      } else if (diffDays === 0) {
        tasksToNotify.push({ task, type: 'today', days: 0 });
      } else if (diffDays === 1) {
        tasksToNotify.push({ task, type: 'tomorrow', days: 1 });
      }
    }
  }

  if (tasksToNotify.length === 0) return;

  // Group notifications to avoid spam
  const overdue = tasksToNotify.filter(t => t.type === 'overdue');
  const todayTasks = tasksToNotify.filter(t => t.type === 'today');
  const tomorrowTasks = tasksToNotify.filter(t => t.type === 'tomorrow');

  if (overdue.length > 0) {
    const body = overdue.length === 1
      ? `"${overdue[0].task.title}" está atrasada!`
      : `${overdue.length} tarefas estão atrasadas!`;
    showNativeNotification('⚠️ Tarefas Atrasadas', body);
    overdue.forEach(t => global._notifiedTasks.add(t.task.id));
  }

  if (todayTasks.length > 0) {
    const body = todayTasks.length === 1
      ? `"${todayTasks[0].task.title}" vence hoje!`
      : `${todayTasks.length} tarefas vencem hoje!`;
    showNativeNotification('📅 Prazo Hoje', body);
    todayTasks.forEach(t => global._notifiedTasks.add(t.task.id));
  }

  if (tomorrowTasks.length > 0) {
    const body = tomorrowTasks.length === 1
      ? `"${tomorrowTasks[0].task.title}" vence amanhã`
      : `${tomorrowTasks.length} tarefas vencem amanhã`;
    showNativeNotification('🔔 Prazo Amanhã', body);
    tomorrowTasks.forEach(t => global._notifiedTasks.add(t.task.id));
  }

  // Notify renderer to update badges
  mainWindow?.webContents.send('notification-count', tasksToNotify.length);
}

function showNativeNotification(title, body) {
  if (!Notification.isSupported()) return;
  const notif = new Notification({
    title,
    body,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    silent: false
  });
  notif.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  notif.show();
}

function startNotificationScheduler() {
  // Check immediately after 10s, then every 30 minutes
  setTimeout(() => checkDueDateNotifications(), 10000);
  notificationInterval = setInterval(() => {
    // Reset notified list at midnight
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() < 31) {
      global._notifiedTasks = new Set();
    }
    checkDueDateNotifications();
  }, 30 * 60 * 1000);
}

ipcMain.handle('check-notifications', () => {
  checkDueDateNotifications();
  return true;
});

// ─── Recurring Tasks ─────────────────────────────────
ipcMain.handle('process-recurring-task', (_, taskData) => {
  const data = loadTasks();
  if (!data || !data.columns) return { success: false };

  const newTask = {
    id: data.nextId++,
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    tags: taskData.tags || [],
    subtasks: (taskData.subtasks || []).map(s => ({ text: s.text, completed: false })),
    recurrence: taskData.recurrence,
    createdAt: Date.now()
  };

  // Calculate next due date
  if (taskData.dueDate) {
    const currentDue = new Date(taskData.dueDate);
    let nextDue;
    switch (taskData.recurrence) {
      case 'daily':
        nextDue = new Date(currentDue);
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case 'weekly':
        nextDue = new Date(currentDue);
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 'monthly':
        nextDue = new Date(currentDue);
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      default:
        nextDue = new Date(currentDue);
        nextDue.setDate(nextDue.getDate() + 1);
    }
    const now = new Date();
    if (nextDue <= now) {
      nextDue = new Date(now);
      nextDue.setDate(nextDue.getDate() + 1);
    }
    newTask.dueDate = nextDue.toISOString().split('T')[0];
  }

  data.columns.pending.tasks.unshift(newTask);
  saveTasks(data);

  return { success: true, task: newTask, data };
});
