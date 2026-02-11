/* ============================================
   TASKFLOW — Renderer (Main Application Logic)
   ============================================ */

// ─── Theme Definitions ───────────────────────────────
const themes = {
  midnight: {
    name: 'Meia-Noite',
    icon: 'ri-moon-clear-line',
    preview: ['#0a0a1a', '#6c8cff', '#a855f7'],
    vars: {} // default, no overrides
  },
  ocean: {
    name: 'Oceano',
    icon: 'ri-sailboat-line',
    preview: ['#080f1e', '#38bdf8', '#818cf8'],
    vars: {
      '--bg-primary': '#080f1e',
      '--bg-secondary': '#0c1a33',
      '--accent-blue': '#38bdf8',
      '--accent-purple': '#818cf8',
      '--accent-pink': '#c084fc',
      '--accent-cyan': '#22d3ee',
      '--pending-color': '#38bdf8',
      '--wip-color': '#fb923c',
      '--done-color': '#34d399',
      '--shadow-glow-blue': '0 0 20px rgba(56, 189, 248, 0.3)',
      '--shadow-glow-purple': '0 0 20px rgba(129, 140, 248, 0.3)',
    }
  },
  aurora: {
    name: 'Aurora',
    icon: 'ri-leaf-line',
    preview: ['#0a1612', '#34d399', '#22d3ee'],
    vars: {
      '--bg-primary': '#0a1612',
      '--bg-secondary': '#0f261d',
      '--accent-blue': '#22d3ee',
      '--accent-purple': '#34d399',
      '--accent-pink': '#a78bfa',
      '--accent-cyan': '#2dd4bf',
      '--pending-color': '#22d3ee',
      '--wip-color': '#facc15',
      '--done-color': '#34d399',
      '--shadow-glow-blue': '0 0 20px rgba(34, 211, 238, 0.3)',
      '--shadow-glow-purple': '0 0 20px rgba(52, 211, 153, 0.3)',
    }
  },
  sunset: {
    name: 'Pôr do Sol',
    icon: 'ri-sun-foggy-line',
    preview: ['#1a0f08', '#fb923c', '#f87171'],
    vars: {
      '--bg-primary': '#1a0f08',
      '--bg-secondary': '#261a0f',
      '--accent-blue': '#fb923c',
      '--accent-purple': '#f87171',
      '--accent-pink': '#ec4899',
      '--accent-cyan': '#facc15',
      '--pending-color': '#fb923c',
      '--wip-color': '#f87171',
      '--done-color': '#34d399',
      '--shadow-glow-blue': '0 0 20px rgba(251, 146, 60, 0.3)',
      '--shadow-glow-purple': '0 0 20px rgba(248, 113, 113, 0.3)',
    }
  },
  rose: {
    name: 'Rosé',
    icon: 'ri-flower-line',
    preview: ['#1a0a14', '#ec4899', '#a855f7'],
    vars: {
      '--bg-primary': '#1a0a14',
      '--bg-secondary': '#260f1f',
      '--accent-blue': '#ec4899',
      '--accent-purple': '#a855f7',
      '--accent-pink': '#f472b6',
      '--accent-cyan': '#c084fc',
      '--pending-color': '#ec4899',
      '--wip-color': '#fb923c',
      '--done-color': '#34d399',
      '--shadow-glow-blue': '0 0 20px rgba(236, 72, 153, 0.3)',
      '--shadow-glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
    }
  },
  snow: {
    name: 'Neve',
    icon: 'ri-snowy-line',
    preview: ['#f0f0f5', '#5b6abf', '#7c3aed'],
    vars: {
      '--bg-primary': '#f0f0f5',
      '--bg-secondary': '#e4e4ec',
      '--glass-bg': 'rgba(0, 0, 0, 0.04)',
      '--glass-bg-hover': 'rgba(0, 0, 0, 0.07)',
      '--glass-border': 'rgba(0, 0, 0, 0.1)',
      '--glass-border-hover': 'rgba(0, 0, 0, 0.18)',
      '--text-primary': '#1a1a2e',
      '--text-secondary': 'rgba(26, 26, 46, 0.65)',
      '--text-muted': 'rgba(26, 26, 46, 0.4)',
      '--accent-blue': '#5b6abf',
      '--accent-purple': '#7c3aed',
      '--accent-pink': '#db2777',
      '--accent-cyan': '#0891b2',
      '--accent-green': '#059669',
      '--accent-orange': '#ea580c',
      '--accent-red': '#dc2626',
      '--accent-yellow': '#ca8a04',
      '--pending-color': '#5b6abf',
      '--wip-color': '#ea580c',
      '--done-color': '#059669',
      '--priority-low': '#059669',
      '--priority-medium': '#5b6abf',
      '--priority-high': '#ea580c',
      '--priority-critical': '#dc2626',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
      '--shadow-glow-blue': '0 0 20px rgba(91, 106, 191, 0.2)',
      '--shadow-glow-purple': '0 0 20px rgba(124, 58, 237, 0.2)',
    }
  },
};

// Default tag colors palette
const tagColorPalette = [
  '#f87171', '#fb923c', '#facc15', '#34d399', '#22d3ee',
  '#6c8cff', '#a855f7', '#ec4899', '#f472b6', '#818cf8',
  '#2dd4bf', '#86efac',
];

// Default tags with colors
const defaultTags = [
  { name: 'Bug', color: '#f87171' },
  { name: 'Feature', color: '#a855f7' },
  { name: 'Melhoria', color: '#22d3ee' },
  { name: 'Urgente', color: '#fb923c' },
  { name: 'Documentação', color: '#facc15' },
  { name: 'Pesquisa', color: '#34d399' },
];

// ─── State ───────────────────────────────────────────
let state = {
  columns: {
    pending: { name: 'Pendente', tasks: [] },
    wip: { name: 'Em Progresso', tasks: [] },
    done: { name: 'Concluído', tasks: [] }
  },
  tags: defaultTags,
  theme: 'midnight',
  nextId: 1,
  history: [],
};

let activeTagFilter = null;
let searchQuery = '';
let priorityFilter = 'all';
let sortMode = 'newest';
let editingTaskId = null;
let draggedTask = null;
let draggedFrom = null;
let selectedTasks = new Set();
let selectionMode = false;
let selectedNewTagColor = tagColorPalette[0];

// ─── Undo System ─────────────────────────────────────
const undoStack = [];
const MAX_UNDO = 20;

function pushUndo(action, data) {
  undoStack.push({ action, data, timestamp: Date.now() });
  if (undoStack.length > MAX_UNDO) undoStack.shift();
}

function performUndo() {
  if (undoStack.length === 0) {
    showToast('Nada para desfazer', 'info');
    return;
  }
  const entry = undoStack.pop();
  const { action, data } = entry;

  switch (action) {
    case 'delete-task': {
      state.columns[data.column].tasks.splice(data.index, 0, data.task);
      showToast(`Tarefa "${data.task.title}" restaurada`, 'success');
      break;
    }
    case 'move-task': {
      const idx = state.columns[data.toColumn].tasks.findIndex(t => t.id === data.task.id);
      if (idx > -1) state.columns[data.toColumn].tasks.splice(idx, 1);
      state.columns[data.fromColumn].tasks.splice(data.fromIndex, 0, data.task);
      const statusNames = { pending: 'Pendente', wip: 'Em Progresso', done: 'Concluído' };
      showToast(`Movido de volta para ${statusNames[data.fromColumn]}`, 'info');
      break;
    }
    case 'edit-task': {
      for (const col of Object.keys(state.columns)) {
        const idx = state.columns[col].tasks.findIndex(t => t.id === data.taskId);
        if (idx > -1) {
          state.columns[col].tasks[idx] = { ...data.previousState };
          break;
        }
      }
      showToast('Edição desfeita', 'success');
      break;
    }
    case 'bulk-delete': {
      data.tasks.forEach(item => {
        state.columns[item.column].tasks.splice(item.index, 0, item.task);
      });
      showToast(`${data.tasks.length} tarefas restauradas`, 'success');
      break;
    }
    case 'bulk-move': {
      data.moves.forEach(item => {
        const idx = state.columns[item.toColumn].tasks.findIndex(t => t.id === item.task.id);
        if (idx > -1) state.columns[item.toColumn].tasks.splice(idx, 1);
        state.columns[item.fromColumn].tasks.splice(item.fromIndex, 0, item.task);
      });
      showToast(`${data.moves.length} tarefas restauradas`, 'success');
      break;
    }
    case 'clear-done': {
      state.columns.done.tasks = data.tasks;
      showToast(`${data.tasks.length} tarefas restauradas`, 'success');
      break;
    }
  }

  save();
  render();
}

// ─── Pomodoro Timer ──────────────────────────────────
let pomodoroState = {
  running: false,
  mode: 'work', // work | short | long
  timeRemaining: 25 * 60,
  totalTime: 25 * 60,
  interval: null,
  sessions: 0,
  totalFocusSeconds: 0,
  linkedTaskId: null,
};

// ─── Init ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  injectSVGGradient();
  const saved = await window.api.loadTasks();
  if (saved && saved.columns) {
    state = { ...state, ...saved };
    // Migrate tags from string array to object array
    if (state.tags && state.tags.length > 0 && typeof state.tags[0] === 'string') {
      const defaultColorMap = {
        'Bug': '#f87171', 'Feature': '#a855f7', 'Improvement': '#22d3ee',
        'Melhoria': '#22d3ee', 'Urgent': '#fb923c', 'Urgente': '#fb923c',
        'Documentation': '#facc15', 'Documentação': '#facc15',
        'Research': '#34d399', 'Pesquisa': '#34d399',
      };
      state.tags = state.tags.map(t => ({
        name: t,
        color: defaultColorMap[t] || '#6c8cff'
      }));
    }
    // Ensure theme exists
    if (!state.theme) state.theme = 'midnight';
  }
  applyTheme(state.theme);
  initEventListeners();
  initDragListeners();
  render();

  // Load app version
  try {
    const version = await window.api.getVersion();
    const versionEl = document.getElementById('app-version');
    if (versionEl) versionEl.textContent = `v${version}`;
  } catch (e) { /* ignore */ }

  // Setup auto-updater UI
  setupUpdateListeners();

  // Setup notification listener
  setupNotificationListener();

  // Setup pomodoro timer
  initPomodoro();
});

// ─── Auto-Updater UI ────────────────────────────────
function setupUpdateListeners() {
  const banner = document.getElementById('update-banner');
  const title = document.getElementById('update-title');
  const desc = document.getElementById('update-desc');
  const icon = document.getElementById('update-icon');
  const actionBtn = document.getElementById('update-action');
  const actionIcon = document.getElementById('update-action-icon');
  const actionText = document.getElementById('update-action-text');
  const dismissBtn = document.getElementById('update-dismiss');
  const progressContainer = document.getElementById('update-progress-container');
  const progressFill = document.getElementById('update-progress-fill');
  const progressText = document.getElementById('update-progress-text');

  let updateState = 'idle'; // idle | available | downloading | ready

  function showBanner() {
    banner.classList.add('visible');
  }

  function hideBanner() {
    banner.classList.remove('visible');
  }

  // Listen for update events from main process
  window.api.onUpdateAvailable((info) => {
    updateState = 'available';
    title.textContent = `Nova versão ${info.version} disponível!`;
    desc.textContent = 'Deseja baixar a atualização agora?';
    icon.className = 'ri-download-cloud-2-line';
    actionIcon.className = 'ri-download-2-line';
    actionText.textContent = 'Baixar';
    progressContainer.style.display = 'none';
    dismissBtn.style.display = '';
    showBanner();
  });

  window.api.onUpdateNotAvailable(() => {
    updateState = 'idle';
  });

  window.api.onUpdateProgress((progress) => {
    updateState = 'downloading';
    title.textContent = 'Baixando atualização...';
    desc.textContent = 'Não feche o aplicativo durante o download.';
    icon.className = 'ri-loader-4-line spin';
    progressContainer.style.display = 'flex';
    progressFill.style.width = `${progress.percent}%`;
    progressText.textContent = `${progress.percent}%`;
    actionBtn.style.display = 'none';
    dismissBtn.style.display = 'none';
  });

  window.api.onUpdateDownloaded(() => {
    updateState = 'ready';
    title.textContent = 'Atualização pronta!';
    desc.textContent = 'Reinicie o app para aplicar a atualização.';
    icon.className = 'ri-checkbox-circle-line';
    progressContainer.style.display = 'none';
    actionBtn.style.display = '';
    actionIcon.className = 'ri-restart-line';
    actionText.textContent = 'Reiniciar';
    dismissBtn.style.display = '';
    dismissBtn.textContent = 'Depois';
    showBanner();
  });

  window.api.onUpdateError((msg) => {
    console.warn('Update error:', msg);
    hideBanner();
  });

  // Action button
  actionBtn.addEventListener('click', () => {
    if (updateState === 'available') {
      window.api.downloadUpdate();
      updateState = 'downloading';
      title.textContent = 'Iniciando download...';
      icon.className = 'ri-loader-4-line spin';
      actionBtn.style.display = 'none';
      dismissBtn.style.display = 'none';
      progressContainer.style.display = 'flex';
      progressFill.style.width = '0%';
      progressText.textContent = '0%';
    } else if (updateState === 'ready') {
      window.api.installUpdate();
    }
  });

  // Dismiss
  dismissBtn.addEventListener('click', () => {
    hideBanner();
  });
}

// ─── Recurring Tasks ─────────────────────────────────
async function processRecurringTask(task) {
  try {
    const result = await window.api.processRecurringTask(task);
    if (result.success) {
      // Reload state from disk to get the new task
      const saved = await window.api.loadTasks();
      if (saved && saved.columns) {
        state.columns = saved.columns;
        state.nextId = saved.nextId;
      }
      const recLabels = { daily: 'diária', weekly: 'semanal', monthly: 'mensal' };
      showToast(`Tarefa recorrente (${recLabels[task.recurrence]}) recriada em Pendente`, 'info');
      render();
    }
  } catch (e) {
    console.error('Error processing recurring task:', e);
  }
}

// ─── Notification Badge ──────────────────────────────
function setupNotificationListener() {
  window.api.onNotificationCount((count) => {
    const badge = document.getElementById('notification-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  });
}

function injectSVGGradient() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.innerHTML = `
    <defs>
      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#6c8cff"/>
        <stop offset="100%" style="stop-color:#a855f7"/>
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svg);
}

// ─── Theme System ────────────────────────────────────
function applyTheme(themeKey) {
  const theme = themes[themeKey];
  if (!theme) return;

  // Reset all overrides first
  const root = document.documentElement;
  const allVarNames = new Set();
  Object.values(themes).forEach(t => {
    Object.keys(t.vars).forEach(v => allVarNames.add(v));
  });
  allVarNames.forEach(v => root.style.removeProperty(v));

  // Apply theme vars
  Object.entries(theme.vars).forEach(([prop, val]) => {
    root.style.setProperty(prop, val);
  });

  state.theme = themeKey;
}

// ─── Save ────────────────────────────────────────────
async function save() {
  await window.api.saveTasks(state);
}

// ─── Event Listeners ─────────────────────────────────
function initEventListeners() {
  // Sidebar toggle
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });

  // View navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
      document.getElementById(`${view}-view`).classList.add('active');
      if (view === 'analytics') renderAnalytics();
      if (view === 'calendar') renderTimeline();
      if (view === 'settings') renderSettings();
    });
  });

  // New task button
  document.getElementById('btn-add-task').addEventListener('click', () => openTaskModal());

  // Column add buttons
  document.querySelectorAll('.column-add').forEach(btn => {
    btn.addEventListener('click', () => openTaskModal(btn.dataset.column));
  });

  // Clear done button
  document.getElementById('btn-clear-done').addEventListener('click', () => {
    showConfirm('Limpar todas as tarefas concluídas?', 'Isso irá excluir permanentemente todas as tarefas na coluna Concluído.', () => {
      pushUndo('clear-done', { tasks: [...state.columns.done.tasks] });
      state.columns.done.tasks = [];
      save();
      render();
      showToast('Tarefas concluídas removidas (Ctrl+Z para desfazer)', 'success');
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderBoard();
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      performUndo();
    }
    if (e.key === 'Escape') {
      closeTaskModal();
      closeConfirm();
    }
    // Keyboard navigation for task cards
    handleBoardKeyNavigation(e);
  });

  // Priority filter
  document.getElementById('priority-filter').addEventListener('change', (e) => {
    priorityFilter = e.target.value;
    renderBoard();
  });

  // Sort
  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderBoard();
  });

  // Modal events
  document.getElementById('modal-close').addEventListener('click', closeTaskModal);
  document.getElementById('btn-cancel-task').addEventListener('click', closeTaskModal);
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTaskModal();
  });

  // Form submit
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveTask();
  });

  // Delete task
  document.getElementById('btn-delete-task').addEventListener('click', () => {
    if (editingTaskId) {
      showConfirm('Excluir esta tarefa?', 'Esta ação não pode ser desfeita.', () => {
        deleteTask(editingTaskId);
        closeTaskModal();
      });
    }
  });

  // Subtask add
  document.getElementById('btn-add-subtask').addEventListener('click', addSubtaskToForm);
  document.getElementById('subtask-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtaskToForm();
    }
  });

  // Confirm modal
  document.getElementById('confirm-cancel').addEventListener('click', closeConfirm);
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfirm();
  });

  // Settings: add tag
  document.getElementById('btn-add-tag').addEventListener('click', addNewTag);
  document.getElementById('new-tag-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTag();
    }
  });

  // Data export/import
  document.getElementById('btn-export-data').addEventListener('click', async () => {
    const result = await window.api.exportData();
    if (result.success) {
      showToast('Dados exportados com sucesso!', 'success');
    } else if (!result.canceled) {
      showToast('Erro ao exportar: ' + result.error, 'error');
    }
  });

  document.getElementById('btn-import-data').addEventListener('click', () => {
    showConfirm(
      'Importar dados?',
      'Isso substituirá todos os seus dados atuais. Considere exportar um backup antes de prosseguir.',
      async () => {
        const result = await window.api.importData();
        if (result.success) {
          state = { ...state, ...result.data };
          if (!state.theme) state.theme = 'midnight';
          applyTheme(state.theme);
          render();
          showToast('Dados importados com sucesso!', 'success');
        } else if (!result.canceled) {
          showToast('Erro ao importar: ' + result.error, 'error');
        }
      }
    );
  });

  // Manual check for updates
  document.getElementById('btn-check-updates').addEventListener('click', async () => {
    const statusText = document.getElementById('update-status-text');
    statusText.textContent = 'Verificando...';
    try {
      const result = await window.api.checkForUpdates();
      if (result && result.dev) {
        statusText.textContent = 'Verificação desativada no modo de desenvolvimento.';
      } else {
        statusText.textContent = 'Você está na versão mais recente!';
        // If update is found, the onUpdateAvailable listener will handle it
      }
    } catch (e) {
      statusText.textContent = 'Erro ao verificar atualizações.';
    }
    // Reset text after a delay
    setTimeout(() => {
      statusText.textContent = 'Clique para buscar novas versões';
    }, 8000);
  });
}

// ─── Full Render ─────────────────────────────────────
function render() {
  renderBoard();
  renderStats();
  renderTagFilters();
  renderProgressRing();
}

// ─── Board Rendering ─────────────────────────────────
function renderBoard() {
  ['pending', 'wip', 'done'].forEach(col => {
    const list = document.getElementById(`list-${col}`);
    const count = document.getElementById(`count-${col}`);
    const tasks = getFilteredTasks(col);
    count.textContent = tasks.length;

    list.innerHTML = '';

    if (tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = col === 'pending'
        ? '<i class="ri-inbox-line"></i><span>Nenhuma tarefa pendente</span>'
        : col === 'wip'
        ? '<i class="ri-loader-4-line"></i><span>Nada em progresso</span>'
        : '<i class="ri-checkbox-circle-line"></i><span>Nenhuma tarefa concluída</span>';
      list.appendChild(empty);
    } else {
      tasks.forEach(task => {
        list.appendChild(createTaskCard(task, col));
      });
    }
  });
}

// Attach drag listeners ONCE (not on every render)
function initDragListeners() {
  ['pending', 'wip', 'done'].forEach(col => {
    const list = document.getElementById(`list-${col}`);
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('dragleave', handleDragLeave);
    list.addEventListener('drop', (e) => handleDrop(e, col));
  });
}

function getFilteredTasks(column) {
  let tasks = [...state.columns[column].tasks];

  if (searchQuery) {
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery) ||
      (t.description && t.description.toLowerCase().includes(searchQuery))
    );
  }

  if (activeTagFilter) {
    tasks = tasks.filter(t => t.tags && t.tags.includes(activeTagFilter));
  }

  if (priorityFilter !== 'all') {
    tasks = tasks.filter(t => t.priority === priorityFilter);
  }

  tasks.sort((a, b) => {
    switch (sortMode) {
      case 'newest': return (b.createdAt || 0) - (a.createdAt || 0);
      case 'oldest': return (a.createdAt || 0) - (b.createdAt || 0);
      case 'priority': return priorityWeight(b.priority) - priorityWeight(a.priority);
      case 'dueDate': return compareDueDates(a, b);
      case 'manual': return 0;
      default: return 0;
    }
  });

  return tasks;
}

function priorityWeight(p) {
  const map = { low: 0, medium: 1, high: 2, critical: 3 };
  return map[p] || 0;
}

function compareDueDates(a, b) {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return new Date(a.dueDate) - new Date(b.dueDate);
}

// ─── Tag Color Helpers ───────────────────────────────
function getTagColor(tagName) {
  const tag = state.tags.find(t => t.name === tagName);
  return tag ? tag.color : '#6c8cff';
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Task Card ───────────────────────────────────────
function createTaskCard(task, column) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.taskId = task.id;
  card.dataset.column = column;

  const priorityBar = `<div class="task-card-priority ${task.priority || 'medium'}"></div>`;

  let tagsHtml = '';
  if (task.tags && task.tags.length > 0) {
    tagsHtml = `<div class="task-card-tags">${task.tags.map(t => {
      const color = getTagColor(t);
      return `<span class="task-tag" style="background:${hexToRgba(color, 0.12)};border-color:${hexToRgba(color, 0.25)};color:${color}">${escapeHtml(t)}</span>`;
    }).join('')}</div>`;
  }

  let subtaskHtml = '';
  if (task.subtasks && task.subtasks.length > 0) {
    const done = task.subtasks.filter(s => s.completed).length;
    const total = task.subtasks.length;
    const pct = Math.round((done / total) * 100);
    const subtaskItems = task.subtasks.map(s => `
      <div class="card-subtask-item ${s.completed ? 'done' : ''}">
        <i class="${s.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}"></i>
        <span>${escapeHtml(s.text)}</span>
      </div>
    `).join('');
    subtaskHtml = `
      <div class="task-card-subtasks">
        <div class="subtask-progress-bar">
          <div class="subtask-progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="subtask-progress-text">${done}/${total}</span>
      </div>
      <div class="card-subtask-list">${subtaskItems}</div>
    `;
  }

  let dueHtml = '';
  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const now = new Date();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    let dueClass = '';
    if (diff < 0) dueClass = 'overdue';
    else if (diff <= 2) dueClass = 'soon';
    dueHtml = `
      <div class="task-card-due ${dueClass}">
        <i class="ri-calendar-line"></i>
        ${formatDate(task.dueDate)}
      </div>
    `;
  }

  let recurrenceHtml = '';
  if (task.recurrence) {
    const recLabels = { daily: 'Diária', weekly: 'Semanal', monthly: 'Mensal' };
    recurrenceHtml = `
      <div class="task-card-recurrence">
        <i class="ri-repeat-line"></i>
        ${recLabels[task.recurrence] || task.recurrence}
      </div>
    `;
  }

  let descHtml = '';
  if (task.description) {
    descHtml = `<p class="task-card-desc">${escapeHtml(task.description)}</p>`;
  }

  let notesIndicator = '';
  if (task.notes) {
    notesIndicator = `<span class="task-card-notes-icon" title="Contém notas"><i class="ri-sticky-note-line"></i></span>`;
  }

  const selectCheck = selectionMode
    ? `<label class="task-select" onclick="event.stopPropagation()">
        <input type="checkbox" class="task-checkbox" ${selectedTasks.has(task.id) ? 'checked' : ''}>
        <span class="custom-check"><i class="ri-check-line"></i></span>
       </label>`
    : '';

  const deleteBtn = `<button class="task-card-delete" title="Excluir tarefa"><i class="ri-delete-bin-6-line"></i></button>`;

  card.innerHTML = `
    ${priorityBar}
    <div class="task-card-header">
      ${selectCheck}
      <span class="task-card-title">${escapeHtml(task.title)}</span>
      ${deleteBtn}
    </div>
    ${descHtml}
    ${tagsHtml}
    ${subtaskHtml}
    <div class="task-card-footer">
      ${dueHtml}
      ${recurrenceHtml}
      ${notesIndicator}
      <span class="task-card-id">#${task.id}</span>
    </div>
  `;

  if (selectedTasks.has(task.id)) card.classList.add('selected');

  card.querySelector('.task-card-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showConfirm('Excluir esta tarefa?', `"${task.title}" será excluída permanentemente.`, () => {
      deleteTask(task.id);
    });
  });

  const checkbox = card.querySelector('.task-checkbox');
  if (checkbox) {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedTasks.add(task.id);
        card.classList.add('selected');
      } else {
        selectedTasks.delete(task.id);
        card.classList.remove('selected');
      }
      updateBulkBar();
    });
  }

  card.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    if (selectionMode) {
      if (selectedTasks.has(task.id)) {
        selectedTasks.delete(task.id);
        card.classList.remove('selected');
      } else {
        selectedTasks.add(task.id);
        card.classList.add('selected');
      }
      const cb = card.querySelector('.task-checkbox');
      if (cb) cb.checked = selectedTasks.has(task.id);
      updateBulkBar();
      return;
    }
    openTaskModal(column, task);
  });

  card.addEventListener('dragstart', (e) => handleDragStart(e, task, column));
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

// ─── Drag & Drop ─────────────────────────────────────
let dragIndicatorThrottle = null;

function handleDragStart(e, task, column) {
  draggedTask = task;
  draggedFrom = column;
  // Use setTimeout so the ghost image captures the card before we style it
  requestAnimationFrame(() => {
    e.target.classList.add('dragging');
  });
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', task.id);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
  draggedTask = null;
  draggedFrom = null;
  dragIndicatorThrottle = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const column = e.currentTarget.closest('.column');
  if (column) column.classList.add('drag-over');

  // Throttle indicator updates to avoid DOM thrashing
  const now = Date.now();
  if (dragIndicatorThrottle && now - dragIndicatorThrottle < 50) return;
  dragIndicatorThrottle = now;

  // Show drop position indicator
  const list = e.currentTarget;
  const afterElement = getDragAfterElement(list, e.clientY);

  // Only update if position actually changed
  const existing = list.querySelector('.drop-indicator');
  if (existing) {
    const nextSib = existing.nextElementSibling;
    if (afterElement === nextSib) return; // already in right spot
    existing.remove();
  }

  const indicator = document.createElement('div');
  indicator.className = 'drop-indicator';
  if (afterElement) {
    list.insertBefore(indicator, afterElement);
  } else {
    list.appendChild(indicator);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
  let closest = null;
  let closestOffset = Number.NEGATIVE_INFINITY;
  draggableElements.forEach(child => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closest = child;
    }
  });
  return closest;
}

function handleDragLeave(e) {
  // Only react when actually leaving the list, not its children
  const list = e.currentTarget;
  const related = e.relatedTarget;
  if (related && list.contains(related)) return;

  const column = list.closest('.column');
  if (column) column.classList.remove('drag-over');
  list.querySelectorAll('.drop-indicator').forEach(el => el.remove());
}

function handleDrop(e, targetColumn) {
  e.preventDefault();
  const column = e.currentTarget.closest('.column');
  if (column) column.classList.remove('drag-over');
  document.querySelectorAll('.drop-indicator').forEach(el => el.remove());

  if (!draggedTask || !draggedFrom) return;

  const list = e.currentTarget;
  const afterElement = getDragAfterElement(list, e.clientY);

  if (draggedFrom === targetColumn) {
    // ── Reorder within same column ──
    const tasks = state.columns[targetColumn].tasks;
    const oldIdx = tasks.findIndex(t => t.id === draggedTask.id);
    if (oldIdx === -1) return;

    let newIdx;
    if (afterElement) {
      const afterId = parseInt(afterElement.dataset.taskId);
      newIdx = tasks.findIndex(t => t.id === afterId);
    } else {
      newIdx = tasks.length;
    }
    if (oldIdx < newIdx) newIdx--;
    if (oldIdx === newIdx) return;

    const [task] = tasks.splice(oldIdx, 1);
    tasks.splice(newIdx, 0, task);

    // Switch to manual sort so the new order is preserved
    if (sortMode !== 'manual') {
      sortMode = 'manual';
      document.getElementById('sort-select').value = 'manual';
    }

    save();
    render();
    return;
  }

  // ── Move between columns ──
  const sourceIdx = state.columns[draggedFrom].tasks.findIndex(t => t.id === draggedTask.id);
  if (sourceIdx > -1) {
    pushUndo('move-task', {
      task: { ...draggedTask },
      fromColumn: draggedFrom,
      toColumn: targetColumn,
      fromIndex: sourceIdx
    });
    state.columns[draggedFrom].tasks.splice(sourceIdx, 1);
  }

  // Insert at drop position instead of always at top
  if (afterElement) {
    const afterId = parseInt(afterElement.dataset.taskId);
    const insertIdx = state.columns[targetColumn].tasks.findIndex(t => t.id === afterId);
    state.columns[targetColumn].tasks.splice(insertIdx, 0, draggedTask);
  } else {
    state.columns[targetColumn].tasks.push(draggedTask);
  }

  if (targetColumn === 'done') {
    const today = new Date().toISOString().split('T')[0];
    if (!state.history) state.history = [];
    state.history.push(today);

    // Handle recurring tasks
    if (draggedTask.recurrence) {
      processRecurringTask(draggedTask);
    }
  }

  save();
  render();

  const statusNames = { pending: 'Pendente', wip: 'Em Progresso', done: 'Concluído' };
  showToast(`Movido para ${statusNames[targetColumn]} (Ctrl+Z para desfazer)`, 'info');
}

// ─── Task Modal ──────────────────────────────────────
function openTaskModal(column = 'pending', task = null) {
  const modal = document.getElementById('task-modal');
  const title = document.getElementById('modal-title');
  const saveBtn = document.getElementById('btn-save-text');
  const deleteBtn = document.getElementById('btn-delete-task');
  const form = document.getElementById('task-form');

  form.reset();
  editingTaskId = null;

  buildTagSelector(task ? task.tags : []);
  buildSubtaskList(task ? task.subtasks : []);

  if (task) {
    editingTaskId = task.id;
    title.textContent = 'Editar Tarefa';
    saveBtn.textContent = 'Salvar Alterações';
    deleteBtn.style.display = 'flex';

    document.getElementById('task-title-input').value = task.title;
    document.getElementById('task-desc-input').value = task.description || '';
    document.getElementById('task-priority-input').value = task.priority || 'medium';
    document.getElementById('task-due-input').value = task.dueDate || '';
    document.getElementById('task-column-input').value = column;
    document.getElementById('task-recurrence-input').value = task.recurrence || 'none';
    document.getElementById('task-notes-input').value = task.notes || '';
    document.getElementById('task-id-input').value = task.id;
  } else {
    title.textContent = 'Nova Tarefa';
    saveBtn.textContent = 'Criar Tarefa';
    deleteBtn.style.display = 'none';
    document.getElementById('task-column-input').value = column;
  }

  modal.classList.add('visible');
  setTimeout(() => document.getElementById('task-title-input').focus(), 100);
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.remove('visible');
  editingTaskId = null;
}

function buildTagSelector(selectedTags = []) {
  const container = document.getElementById('tag-selector');
  container.innerHTML = '';
  state.tags.forEach(tag => {
    const el = document.createElement('span');
    const tagName = tag.name || tag;
    const tagColor = tag.color || '#6c8cff';
    el.className = `tag-option${selectedTags.includes(tagName) ? ' selected' : ''}`;
    el.textContent = tagName;
    el.style.setProperty('--tag-color', tagColor);
    if (selectedTags.includes(tagName)) {
      el.style.background = hexToRgba(tagColor, 0.15);
      el.style.borderColor = hexToRgba(tagColor, 0.3);
      el.style.color = tagColor;
    }
    el.addEventListener('click', () => {
      el.classList.toggle('selected');
      if (el.classList.contains('selected')) {
        el.style.background = hexToRgba(tagColor, 0.15);
        el.style.borderColor = hexToRgba(tagColor, 0.3);
        el.style.color = tagColor;
      } else {
        el.style.background = '';
        el.style.borderColor = '';
        el.style.color = '';
      }
    });
    container.appendChild(el);
  });
}

function buildSubtaskList(subtasks = []) {
  const container = document.getElementById('subtask-list');
  container.innerHTML = '';
  (subtasks || []).forEach((st, idx) => {
    addSubtaskElement(container, st.text, st.completed, idx);
  });
  updateSubtaskCounter();
}

function updateSubtaskCounter() {
  const items = document.querySelectorAll('#subtask-list .subtask-item');
  const done = document.querySelectorAll('#subtask-list .subtask-item input:checked').length;
  const el = document.getElementById('subtask-counter');
  if (el) el.textContent = items.length === 0 ? 'Nenhum item' : `${done}/${items.length} concluídas`;
}

function addSubtaskElement(container, text, completed = false) {
  const item = document.createElement('div');
  item.className = 'subtask-item';
  item.innerHTML = `
    <label class="subtask-check-label">
      <input type="checkbox" ${completed ? 'checked' : ''}>
      <span class="subtask-custom-check"><i class="ri-check-line"></i></span>
    </label>
    <span class="subtask-text ${completed ? 'completed' : ''}">${escapeHtml(text)}</span>
    <button type="button" class="subtask-remove" title="Remover subtarefa"><i class="ri-delete-bin-line"></i></button>
  `;

  item.querySelector('input').addEventListener('change', (e) => {
    item.querySelector('.subtask-text').classList.toggle('completed', e.target.checked);
    updateSubtaskCounter();
  });

  item.querySelector('.subtask-remove').addEventListener('click', () => {
    item.classList.add('removing');
    setTimeout(() => { item.remove(); updateSubtaskCounter(); }, 200);
  });

  container.appendChild(item);
  updateSubtaskCounter();
}

function addSubtaskToForm() {
  const input = document.getElementById('subtask-input');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('subtask-list');
  addSubtaskElement(container, text, false);
  input.value = '';
  input.focus();
}

// ─── Save Task ───────────────────────────────────────
function saveTask() {
  const titleVal = document.getElementById('task-title-input').value.trim();
  if (!titleVal) return;

  const column = document.getElementById('task-column-input').value;
  const priority = document.getElementById('task-priority-input').value;
  const dueDate = document.getElementById('task-due-input').value;
  const description = document.getElementById('task-desc-input').value.trim();
  const recurrence = document.getElementById('task-recurrence-input').value;
  const notes = document.getElementById('task-notes-input').value.trim();

  const tags = [];
  document.querySelectorAll('#tag-selector .tag-option.selected').forEach(el => {
    tags.push(el.textContent);
  });

  const subtasks = [];
  document.querySelectorAll('#subtask-list .subtask-item').forEach(item => {
    subtasks.push({
      text: item.querySelector('.subtask-text').textContent,
      completed: item.querySelector('input').checked
    });
  });

  if (editingTaskId) {
    let found = false;
    for (const col of Object.keys(state.columns)) {
      const idx = state.columns[col].tasks.findIndex(t => t.id === editingTaskId);
      if (idx > -1) {
        const task = state.columns[col].tasks[idx];
        // Save previous state for undo
        pushUndo('edit-task', { taskId: task.id, previousState: { ...task, subtasks: [...(task.subtasks || [])], tags: [...(task.tags || [])] } });
        task.title = titleVal;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
        task.tags = tags;
        task.subtasks = subtasks;
        task.recurrence = recurrence !== 'none' ? recurrence : undefined;
        task.notes = notes;

        if (col !== column) {
          state.columns[col].tasks.splice(idx, 1);
          state.columns[column].tasks.unshift(task);
          if (column === 'done') {
            const today = new Date().toISOString().split('T')[0];
            if (!state.history) state.history = [];
            state.history.push(today);
            // Handle recurring tasks
            if (task.recurrence) {
              processRecurringTask(task);
            }
          }
        }

        found = true;
        break;
      }
    }
    if (found) showToast('Tarefa atualizada', 'success');
  } else {
    const task = {
      id: state.nextId++,
      title: titleVal,
      description,
      priority,
      dueDate,
      tags,
      subtasks,
      recurrence: recurrence !== 'none' ? recurrence : undefined,
      notes,
      createdAt: Date.now()
    };
    state.columns[column].tasks.unshift(task);
    showToast('Tarefa criada', 'success');
  }

  save();
  render();
  closeTaskModal();
}

// ─── Delete Task ─────────────────────────────────────
function deleteTask(taskId) {
  for (const col of Object.keys(state.columns)) {
    const idx = state.columns[col].tasks.findIndex(t => t.id === taskId);
    if (idx > -1) {
      const task = { ...state.columns[col].tasks[idx] };
      pushUndo('delete-task', { task, column: col, index: idx });
      state.columns[col].tasks.splice(idx, 1);
      break;
    }
  }
  save();
  render();
  showToast('Tarefa excluída (Ctrl+Z para desfazer)', 'success');
}

// ─── Bulk Selection ──────────────────────────────────
function toggleSelectionMode() {
  selectionMode = !selectionMode;
  selectedTasks.clear();
  const btn = document.getElementById('btn-select-mode');
  if (selectionMode) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="ri-close-line"></i> Cancelar';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<i class="ri-checkbox-multiple-line"></i> Selecionar';
  }
  updateBulkBar();
  renderBoard();
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-action-bar');
  if (selectedTasks.size > 0) {
    bar.classList.add('visible');
    document.getElementById('bulk-count').textContent = `${selectedTasks.size} selecionada(s)`;
  } else {
    bar.classList.remove('visible');
  }
}

function bulkMoveTo(targetColumn) {
  const names = { pending: 'Pendente', wip: 'Em Progresso', done: 'Concluído' };
  let moved = 0;
  const moves = [];
  selectedTasks.forEach(id => {
    for (const col of Object.keys(state.columns)) {
      const idx = state.columns[col].tasks.findIndex(t => t.id === id);
      if (idx > -1) {
        const task = { ...state.columns[col].tasks[idx] };
        moves.push({ task, fromColumn: col, toColumn: targetColumn, fromIndex: idx });
        const [removed] = state.columns[col].tasks.splice(idx, 1);
        state.columns[targetColumn].tasks.unshift(removed);
        if (targetColumn === 'done') {
          const today = new Date().toISOString().split('T')[0];
          if (!state.history) state.history = [];
          state.history.push(today);
        }
        moved++;
        break;
      }
    }
  });
  if (moves.length > 0) pushUndo('bulk-move', { moves });
  selectedTasks.clear();
  updateBulkBar();
  save();
  render();
  showToast(`${moved} tarefa(s) movida(s) para ${names[targetColumn]} (Ctrl+Z para desfazer)`, 'success');
}

function bulkDelete() {
  showConfirm(`Excluir ${selectedTasks.size} tarefa(s)?`, 'Esta ação não pode ser desfeita.', () => {
    const deletedTasks = [];
    selectedTasks.forEach(id => {
      for (const col of Object.keys(state.columns)) {
        const idx = state.columns[col].tasks.findIndex(t => t.id === id);
        if (idx > -1) {
          const task = { ...state.columns[col].tasks[idx] };
          deletedTasks.push({ task, column: col, index: idx });
          state.columns[col].tasks.splice(idx, 1);
          break;
        }
      }
    });
    if (deletedTasks.length > 0) pushUndo('bulk-delete', { tasks: deletedTasks });
    const count = selectedTasks.size;
    selectedTasks.clear();
    updateBulkBar();
    save();
    render();
    showToast(`${count} tarefa(s) excluída(s) (Ctrl+Z para desfazer)`, 'success');
  });
}

// ─── Stats ───────────────────────────────────────────
function renderStats() {
  const pending = state.columns.pending.tasks.length;
  const wip = state.columns.wip.tasks.length;
  const done = state.columns.done.tasks.length;
  const total = pending + wip + done;

  animateValue('stat-total', total);
  animateValue('stat-pending', pending);
  animateValue('stat-wip', wip);
  animateValue('stat-done', done);
}

function animateValue(elementId, target) {
  const el = document.querySelector(`#${elementId} .stat-value`);
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const duration = 400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(current + (target - current) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── Progress Ring ───────────────────────────────────
function renderProgressRing() {
  const total = Object.values(state.columns).reduce((s, c) => s + c.tasks.length, 0);
  const done = state.columns.done.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const circle = document.getElementById('progress-ring');
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (pct / 100) * circumference;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = 'url(#progress-gradient)';

  document.getElementById('progress-text').textContent = `${pct}%`;
}

// ─── Tag Filters ─────────────────────────────────────
function renderTagFilters() {
  const container = document.getElementById('tag-filters');
  container.innerHTML = '';

  state.tags.forEach(tag => {
    const tagName = tag.name || tag;
    const tagColor = tag.color || '#6c8cff';
    const el = document.createElement('span');
    el.className = `tag-filter${activeTagFilter === tagName ? ' active' : ''}`;
    el.textContent = tagName;
    if (activeTagFilter === tagName) {
      el.style.background = hexToRgba(tagColor, 0.15);
      el.style.borderColor = hexToRgba(tagColor, 0.3);
      el.style.color = tagColor;
    }
    el.addEventListener('click', () => {
      activeTagFilter = activeTagFilter === tagName ? null : tagName;
      renderTagFilters();
      renderBoard();
    });
    container.appendChild(el);
  });
}

// ─── Analytics ───────────────────────────────────────
function renderAnalytics() {
  renderWeeklyChart();
  renderDonutChart();
  renderStreak();
  renderTagChart();
}

function renderWeeklyChart() {
  const container = document.getElementById('weekly-chart');
  container.innerHTML = '';

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const history = state.history || [];

  const counts = new Array(7).fill(0);
  history.forEach(dateStr => {
    const d = new Date(dateStr);
    const day = (d.getDay() + 6) % 7;
    counts[day]++;
  });

  const max = Math.max(...counts, 1);

  days.forEach((day, i) => {
    const group = document.createElement('div');
    group.className = 'chart-bar-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'chart-bar-wrapper';

    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${(counts[i] / max) * 100}%`;
    bar.title = `${counts[i]} tarefa(s)`;

    const label = document.createElement('span');
    label.className = 'chart-bar-label';
    label.textContent = day;

    wrapper.appendChild(bar);
    group.appendChild(wrapper);
    group.appendChild(label);
    container.appendChild(group);
  });
}

function renderDonutChart() {
  const container = document.getElementById('donut-chart');
  const pending = state.columns.pending.tasks.length;
  const wip = state.columns.wip.tasks.length;
  const done = state.columns.done.tasks.length;
  const total = pending + wip + done || 1;

  const circumference = 2 * Math.PI * 40;
  const pendingArc = (pending / total) * circumference;
  const wipArc = (wip / total) * circumference;
  const doneArc = (done / total) * circumference;

  let offset = 0;
  const segments = [
    { value: pending, color: 'var(--pending-color)', arc: pendingArc, label: 'Pendente' },
    { value: wip, color: 'var(--wip-color)', arc: wipArc, label: 'Em Progresso' },
    { value: done, color: 'var(--done-color)', arc: doneArc, label: 'Concluído' },
  ];

  let circles = '';
  segments.forEach(seg => {
    circles += `<circle cx="50" cy="50" r="40" 
      stroke="${seg.color}" 
      stroke-dasharray="${seg.arc} ${circumference - seg.arc}" 
      stroke-dashoffset="${-offset}"
      stroke-linecap="round" />`;
    offset += seg.arc;
  });

  let legend = '';
  segments.forEach(seg => {
    legend += `
      <div class="donut-legend-item">
        <span class="legend-dot" style="background:${seg.color}"></span>
        ${seg.label}: ${seg.value}
      </div>
    `;
  });

  container.innerHTML = `
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="14"/>
      ${circles}
    </svg>
    <div class="donut-legend">${legend}</div>
  `;
}

function renderStreak() {
  const history = state.history || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const dateSet = new Set(history);
  const check = new Date(today);

  while (true) {
    const key = check.toISOString().split('T')[0];
    if (dateSet.has(key)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  document.querySelector('.streak-number').textContent = streak;

  const heatmap = document.getElementById('streak-heatmap');
  heatmap.innerHTML = '';

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const count = history.filter(h => h === key).length;

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    if (count >= 4) cell.classList.add('level-4');
    else if (count >= 3) cell.classList.add('level-3');
    else if (count >= 2) cell.classList.add('level-2');
    else if (count >= 1) cell.classList.add('level-1');

    cell.title = `${key}: ${count} tarefa(s)`;
    heatmap.appendChild(cell);
  }
}

function renderTagChart() {
  const container = document.getElementById('tag-chart');
  container.innerHTML = '';

  const allTasks = Object.values(state.columns).flatMap(c => c.tasks);
  const tagCounts = {};
  state.tags.forEach(t => {
    const name = t.name || t;
    tagCounts[name] = 0;
  });
  allTasks.forEach(task => {
    (task.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const max = Math.max(...Object.values(tagCounts), 1);

  Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
    const color = getTagColor(tag);
    const row = document.createElement('div');
    row.className = 'tag-chart-row';
    row.innerHTML = `
      <span class="tag-chart-label">${escapeHtml(tag)}</span>
      <div class="tag-chart-bar-bg">
        <div class="tag-chart-bar-fill" style="width: ${(count / max) * 100}%; background: linear-gradient(90deg, ${color}, ${hexToRgba(color, 0.6)})"></div>
      </div>
      <span class="tag-chart-count">${count}</span>
    `;
    container.appendChild(row);
  });
}

// ─── Timeline ────────────────────────────────────────
function renderTimeline() {
  const container = document.getElementById('timeline');
  container.innerHTML = '';

  const allTasks = [];
  Object.entries(state.columns).forEach(([col, data]) => {
    data.tasks.forEach(t => allTasks.push({ ...t, column: col }));
  });

  const withDate = allTasks.filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const withoutDate = allTasks.filter(t => !t.dueDate);

  if (withDate.length === 0 && withoutDate.length === 0) {
    container.innerHTML = '<div class="timeline-empty"><i class="ri-calendar-line" style="font-size:32px;margin-bottom:8px;display:block;opacity:0.4;"></i>Nenhuma tarefa ainda. Crie tarefas para vê-las aqui.</div>';
    return;
  }

  const statusLabel = { pending: 'Pendente', wip: 'Em Progresso', done: 'Concluído' };

  withDate.forEach((task, i) => {
    const item = document.createElement('div');
    item.className = `timeline-item status-${task.column}`;
    item.style.animationDelay = `${i * 0.05}s`;

    item.innerHTML = `
      <div class="timeline-date">${formatDateLong(task.dueDate)}</div>
      <div class="timeline-title">${escapeHtml(task.title)}</div>
      <span class="timeline-status ${task.column}">${statusLabel[task.column]}</span>
    `;
    container.appendChild(item);
  });

  if (withoutDate.length > 0) {
    const separator = document.createElement('div');
    separator.className = 'timeline-date';
    separator.style.cssText = 'padding: 16px 0 8px; color: var(--text-muted); font-size: 12px; font-weight: 600;';
    separator.textContent = 'Sem Prazo Definido';
    container.appendChild(separator);

    withoutDate.forEach((task, i) => {
      const item = document.createElement('div');
      item.className = `timeline-item status-${task.column}`;
      item.style.animationDelay = `${(withDate.length + i) * 0.05}s`;

      item.innerHTML = `
        <div class="timeline-title">${escapeHtml(task.title)}</div>
        <span class="timeline-status ${task.column}">${statusLabel[task.column]}</span>
      `;
      container.appendChild(item);
    });
  }
}

// ─── Settings View ───────────────────────────────────
function renderSettings() {
  renderThemeGrid();
  renderTagsManager();
  renderColorPicker();
}

function renderThemeGrid() {
  const container = document.getElementById('theme-grid');
  container.innerHTML = '';

  Object.entries(themes).forEach(([key, theme]) => {
    const card = document.createElement('div');
    card.className = `theme-card${state.theme === key ? ' active' : ''}`;
    
    const [bg, c1, c2] = theme.preview;
    card.innerHTML = `
      <div class="theme-preview" style="background: ${bg}">
        <div class="theme-preview-orb" style="background: radial-gradient(circle, ${c1}, transparent 70%); left: 10%; top: 10%;"></div>
        <div class="theme-preview-orb" style="background: radial-gradient(circle, ${c2}, transparent 70%); right: 10%; bottom: 10%;"></div>
        <div class="theme-preview-card" style="border-color: ${hexToRgba(c1, 0.3)}">
          <div class="theme-preview-line" style="background: ${c1}"></div>
          <div class="theme-preview-line short" style="background: ${hexToRgba(c1, 0.4)}"></div>
        </div>
      </div>
      <div class="theme-info">
        <i class="${theme.icon}"></i>
        <span>${theme.name}</span>
      </div>
      ${state.theme === key ? '<div class="theme-active-badge"><i class="ri-check-line"></i></div>' : ''}
    `;

    card.addEventListener('click', () => {
      applyTheme(key);
      save();
      renderThemeGrid();
      showToast(`Tema "${theme.name}" aplicado`, 'success');
    });

    container.appendChild(card);
  });
}

function renderTagsManager() {
  const container = document.getElementById('tags-manager');
  container.innerHTML = '';

  state.tags.forEach((tag, idx) => {
    const tagName = tag.name || tag;
    const tagColor = tag.color || '#6c8cff';

    const item = document.createElement('div');
    item.className = 'tag-manager-item';
    item.innerHTML = `
      <div class="tag-manager-color" style="background: ${tagColor}"></div>
      <span class="tag-manager-name">${escapeHtml(tagName)}</span>
      <div class="tag-manager-preview">
        <span class="task-tag" style="background:${hexToRgba(tagColor, 0.12)};border-color:${hexToRgba(tagColor, 0.25)};color:${tagColor}">${escapeHtml(tagName)}</span>
      </div>
      <button class="tag-manager-delete" title="Remover tag" data-idx="${idx}">
        <i class="ri-close-line"></i>
      </button>
    `;

    item.querySelector('.tag-manager-delete').addEventListener('click', () => {
      showConfirm('Remover esta tag?', `A tag "${tagName}" será removida. Tarefas existentes manterão a tag.`, () => {
        state.tags.splice(idx, 1);
        save();
        renderTagsManager();
        renderTagFilters();
        showToast('Tag removida', 'success');
      });
    });

    container.appendChild(item);
  });

  if (state.tags.length === 0) {
    container.innerHTML = '<div class="tags-empty"><i class="ri-price-tag-3-line"></i><span>Nenhuma tag criada</span></div>';
  }
}

function renderColorPicker() {
  const container = document.getElementById('tag-color-picker');
  container.innerHTML = '';

  tagColorPalette.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = `color-swatch${selectedNewTagColor === color ? ' active' : ''}`;
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      selectedNewTagColor = color;
      renderColorPicker();
    });
    container.appendChild(swatch);
  });
}

function addNewTag() {
  const input = document.getElementById('new-tag-name');
  const name = input.value.trim();
  if (!name) {
    showToast('Digite um nome para a tag', 'error');
    return;
  }

  const exists = state.tags.some(t => (t.name || t).toLowerCase() === name.toLowerCase());
  if (exists) {
    showToast('Já existe uma tag com este nome', 'error');
    return;
  }

  state.tags.push({ name, color: selectedNewTagColor });
  input.value = '';
  save();
  renderTagsManager();
  renderTagFilters();
  showToast(`Tag "${name}" adicionada`, 'success');
}

// ─── Confirm Modal ───────────────────────────────────
let confirmCallback = null;

function showConfirm(title, message, onConfirm) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  document.getElementById('confirm-modal').classList.add('visible');
  confirmCallback = onConfirm;

  document.getElementById('confirm-ok').onclick = () => {
    const cb = confirmCallback;
    closeConfirm();
    if (cb) cb();
  };
}

function closeConfirm() {
  document.getElementById('confirm-modal').classList.remove('visible');
  confirmCallback = null;
}

// ─── Toast ───────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: 'ri-checkbox-circle-line',
    error: 'ri-error-warning-line',
    info: 'ri-information-line'
  };

  toast.innerHTML = `<i class="${icons[type]}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ─── Utilities ───────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';

  return d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Keyboard Navigation ─────────────────────────────
let focusedCardIndex = -1;
let focusedColumn = 'pending';

function handleBoardKeyNavigation(e) {
  // Only navigate when board view is active and no modal is open
  const boardView = document.getElementById('board-view');
  if (!boardView || !boardView.classList.contains('active')) return;
  if (document.getElementById('task-modal').classList.contains('visible')) return;
  if (document.getElementById('confirm-modal').classList.contains('visible')) return;
  if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'SELECT') return;

  const columns = ['pending', 'wip', 'done'];
  const colIdx = columns.indexOf(focusedColumn);

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      const cards = getColumnCards(focusedColumn);
      if (cards.length === 0) return;
      focusedCardIndex = Math.min(focusedCardIndex + 1, cards.length - 1);
      focusCard(focusedColumn, focusedCardIndex);
      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      const cards = getColumnCards(focusedColumn);
      if (cards.length === 0) return;
      focusedCardIndex = Math.max(focusedCardIndex - 1, 0);
      focusCard(focusedColumn, focusedCardIndex);
      break;
    }
    case 'ArrowRight': {
      e.preventDefault();
      if (colIdx < columns.length - 1) {
        focusedColumn = columns[colIdx + 1];
        focusedCardIndex = 0;
        focusCard(focusedColumn, focusedCardIndex);
      }
      break;
    }
    case 'ArrowLeft': {
      e.preventDefault();
      if (colIdx > 0) {
        focusedColumn = columns[colIdx - 1];
        focusedCardIndex = 0;
        focusCard(focusedColumn, focusedCardIndex);
      }
      break;
    }
    case 'Enter': {
      const cards = getColumnCards(focusedColumn);
      if (focusedCardIndex >= 0 && focusedCardIndex < cards.length) {
        e.preventDefault();
        const card = cards[focusedCardIndex];
        const taskId = parseInt(card.dataset.taskId);
        const task = findTaskById(taskId);
        if (task) openTaskModal(focusedColumn, task.task);
      }
      break;
    }
    case 'Delete':
    case 'Backspace': {
      if (e.target === document.body || e.target === document.documentElement) {
        const cards = getColumnCards(focusedColumn);
        if (focusedCardIndex >= 0 && focusedCardIndex < cards.length) {
          e.preventDefault();
          const card = cards[focusedCardIndex];
          const taskId = parseInt(card.dataset.taskId);
          const task = findTaskById(taskId);
          if (task) {
            showConfirm('Excluir esta tarefa?', `"${task.task.title}" será excluída permanentemente.`, () => {
              deleteTask(taskId);
            });
          }
        }
      }
      break;
    }
    case 'n':
    case 'N': {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        openTaskModal(focusedColumn);
      }
      break;
    }
  }
}

function getColumnCards(column) {
  const list = document.getElementById(`list-${column}`);
  if (!list) return [];
  return Array.from(list.querySelectorAll('.task-card'));
}

function focusCard(column, index) {
  // Remove previous focus
  document.querySelectorAll('.task-card.kb-focused').forEach(c => c.classList.remove('kb-focused'));
  const cards = getColumnCards(column);
  if (index >= 0 && index < cards.length) {
    cards[index].classList.add('kb-focused');
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function findTaskById(id) {
  for (const col of Object.keys(state.columns)) {
    const task = state.columns[col].tasks.find(t => t.id === id);
    if (task) return { task, column: col };
  }
  return null;
}

// ─── Pomodoro Timer ──────────────────────────────────
function initPomodoro() {
  const widget = document.getElementById('pomodoro-widget');
  const navBtn = document.getElementById('pomodoro-nav');
  const closeBtn = document.getElementById('pomodoro-close');
  const minimizeBtn = document.getElementById('pomodoro-minimize');
  const startBtn = document.getElementById('pomodoro-start');
  const resetBtn = document.getElementById('pomodoro-reset');
  const body = document.getElementById('pomodoro-body');

  // Toggle widget
  navBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (widget.style.display === 'none' || !widget.style.display) {
      widget.style.display = 'flex';
      navBtn.classList.add('active');
      populateTaskPicker();
    } else {
      widget.style.display = 'none';
      navBtn.classList.remove('active');
    }
  });

  closeBtn.addEventListener('click', () => {
    if (pomodoroState.running) {
      showConfirm('Fechar Pomodoro?', 'O timer ainda está rodando. Deseja fechar?', () => {
        stopPomodoro();
        widget.style.display = 'none';
        navBtn.classList.remove('active');
      });
    } else {
      widget.style.display = 'none';
      navBtn.classList.remove('active');
    }
  });

  minimizeBtn.addEventListener('click', () => {
    body.classList.toggle('minimized');
  });

  // Mode buttons
  document.querySelectorAll('.pomodoro-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      if (pomodoroState.running) return;
      document.querySelectorAll('.pomodoro-mode').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pomodoroState.mode = btn.dataset.mode;
      pomodoroState.totalTime = parseInt(btn.dataset.minutes) * 60;
      pomodoroState.timeRemaining = pomodoroState.totalTime;
      updatePomodoroDisplay();
    });
  });

  // Start/Pause
  startBtn.addEventListener('click', () => {
    if (pomodoroState.running) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    stopPomodoro();
    pomodoroState.timeRemaining = pomodoroState.totalTime;
    updatePomodoroDisplay();
  });

  // Task picker
  document.getElementById('pomodoro-task-select').addEventListener('change', (e) => {
    const taskId = parseInt(e.target.value);
    pomodoroState.linkedTaskId = taskId || null;
    const taskName = document.getElementById('pomodoro-task-name');
    if (taskId) {
      const found = findTaskById(taskId);
      taskName.textContent = found ? found.task.title : 'Nenhuma tarefa';
    } else {
      taskName.textContent = 'Nenhuma tarefa selecionada';
    }
  });

  updatePomodoroDisplay();
}

function populateTaskPicker() {
  const select = document.getElementById('pomodoro-task-select');
  const currentVal = select.value;
  select.innerHTML = '<option value="">Nenhuma</option>';
  ['pending', 'wip'].forEach(col => {
    state.columns[col].tasks.forEach(task => {
      const opt = document.createElement('option');
      opt.value = task.id;
      opt.textContent = `${task.title} (${col === 'pending' ? 'Pendente' : 'Em Progresso'})`;
      if (task.id === pomodoroState.linkedTaskId) opt.selected = true;
      select.appendChild(opt);
    });
  });
}

function startPomodoro() {
  pomodoroState.running = true;
  const startBtn = document.getElementById('pomodoro-start');
  startBtn.innerHTML = '<i class="ri-pause-fill"></i> Pausar';
  startBtn.classList.add('running');

  pomodoroState.interval = setInterval(() => {
    pomodoroState.timeRemaining--;
    if (pomodoroState.mode === 'work') {
      pomodoroState.totalFocusSeconds++;
    }
    updatePomodoroDisplay();

    if (pomodoroState.timeRemaining <= 0) {
      completePomodoro();
    }
  }, 1000);
}

function pausePomodoro() {
  pomodoroState.running = false;
  clearInterval(pomodoroState.interval);
  const startBtn = document.getElementById('pomodoro-start');
  startBtn.innerHTML = '<i class="ri-play-fill"></i> Continuar';
  startBtn.classList.remove('running');
}

function stopPomodoro() {
  pomodoroState.running = false;
  clearInterval(pomodoroState.interval);
  const startBtn = document.getElementById('pomodoro-start');
  startBtn.innerHTML = '<i class="ri-play-fill"></i> Iniciar';
  startBtn.classList.remove('running');
  document.getElementById('pomodoro-nav-time').textContent = '';
}

function playPomodoroChime(isWork) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Work end: ascending major chord (C5-E5-G5). Break end: two short pings.
    if (isWork) {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.18 + 0.7);
        osc.start(audioCtx.currentTime + i * 0.18);
        osc.stop(audioCtx.currentTime + i * 0.18 + 0.7);
      });
    } else {
      [880, 1046.5].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.4);
        osc.start(audioCtx.currentTime + i * 0.12);
        osc.stop(audioCtx.currentTime + i * 0.12 + 0.4);
      });
    }
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

function completePomodoro() {
  stopPomodoro();

  if (pomodoroState.mode === 'work') {
    pomodoroState.sessions++;
    playPomodoroChime(true);
    showToast('🍅 Sessão de foco concluída! Hora de uma pausa.', 'success');

    // Save focus time to linked task
    if (pomodoroState.linkedTaskId) {
      const found = findTaskById(pomodoroState.linkedTaskId);
      if (found) {
        if (!found.task.focusTime) found.task.focusTime = 0;
        found.task.focusTime += pomodoroState.totalTime;
        save();
      }
    }

    // Auto-switch to short break (or long after 4 sessions)
    if (pomodoroState.sessions % 4 === 0) {
      switchPomodoroMode('long');
    } else {
      switchPomodoroMode('short');
    }
  } else {
    playPomodoroChime(false);
    showToast('⏰ Pausa terminada! Pronto para focar de novo?', 'info');
    switchPomodoroMode('work');
  }

  updatePomodoroStats();
}

function switchPomodoroMode(mode) {
  pomodoroState.mode = mode;
  document.querySelectorAll('.pomodoro-mode').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
    if (b.dataset.mode === mode) {
      pomodoroState.totalTime = parseInt(b.dataset.minutes) * 60;
    }
  });
  pomodoroState.timeRemaining = pomodoroState.totalTime;
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomodoroState.timeRemaining / 60);
  const seconds = pomodoroState.timeRemaining % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  document.getElementById('pomodoro-time').textContent = timeStr;

  // Update ring
  const ring = document.getElementById('pomodoro-ring-fill');
  const circumference = 2 * Math.PI * 52;
  const progress = pomodoroState.timeRemaining / pomodoroState.totalTime;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference * (1 - progress);

  // Update nav badge when running
  if (pomodoroState.running) {
    document.getElementById('pomodoro-nav-time').textContent = timeStr;
  }

  updatePomodoroStats();
}

function updatePomodoroStats() {
  document.getElementById('pomodoro-sessions').textContent = pomodoroState.sessions;
  const totalMin = Math.round(pomodoroState.totalFocusSeconds / 60);
  document.getElementById('pomodoro-total-time').textContent = totalMin >= 60
    ? `${Math.floor(totalMin / 60)}h${totalMin % 60}min`
    : `${totalMin}min`;
}
