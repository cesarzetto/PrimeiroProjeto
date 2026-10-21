const STORAGE_KEY = 'primeiro_projeto_tarefas_v1';
const THEME_STORAGE_KEY = 'primeiro_projeto_theme_mode'; // 'auto' | 'light' | 'dark'

// Estado da aplicação
let tasks = [];
let currentTab = 'active'; // 'active' | 'trash'
let currentFilter = 'all'; // 'all' | 'pending' | 'completed'
let currentThemeMode = 'auto'; // 'auto' | 'light' | 'dark'
let pendingDeleteAction = null;

// Seletores do DOM
const dateDisplay = document.getElementById('date-display');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const themeModeLabel = document.getElementById('theme-mode-label');
const metaThemeColor = document.querySelector('meta[name="theme-color"]');

const countPending = document.getElementById('count-pending');
const countCompleted = document.getElementById('count-completed');
const countTrash = document.getElementById('count-trash');
const badgeActive = document.getElementById('badge-active');
const badgeTrash = document.getElementById('badge-trash');

const tabButtons = document.querySelectorAll('.tab-btn');
const filterChips = document.querySelectorAll('.filter-chip');
const addTaskSection = document.getElementById('add-task-section');
const trashActionsSection = document.getElementById('trash-actions-section');
const btnEmptyTrash = document.getElementById('btn-empty-trash');

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const emptyState = document.getElementById('empty-state');
const emptyIcon = document.getElementById('empty-icon');
const emptyTitle = document.getElementById('empty-title');
const emptySubtitle = document.getElementById('empty-subtitle');

const confirmModal = document.getElementById('confirm-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
let toastTimeout = null;

// Inicialização
function init() {
    initTheme();
    renderCurrentDate();
    loadTasks();
    bindEvents();
    render();
}

// Inicialização do Tema Inteligente
function initTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'auto') {
        currentThemeMode = saved;
    } else {
        currentThemeMode = 'auto';
    }

    applyTheme();

    // Ouvir alterações do tema do sistema se estiver em modo auto
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
            if (currentThemeMode === 'auto') {
                applyTheme();
            }
        });
    }
}

function cycleTheme() {
    // Alterna: auto -> dark -> light -> auto
    if (currentThemeMode === 'auto') {
        currentThemeMode = 'dark';
    } else if (currentThemeMode === 'dark') {
        currentThemeMode = 'light';
    } else {
        currentThemeMode = 'auto';
    }

    localStorage.setItem(THEME_STORAGE_KEY, currentThemeMode);
    applyTheme();

    const labelMap = {
        auto: 'Automático (Sistema)',
        dark: 'Modo Escuro ativado',
        light: 'Modo Claro ativado'
    };
    showToast(labelMap[currentThemeMode]);
}

function applyTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = currentThemeMode === 'dark' || (currentThemeMode === 'auto' && prefersDark);

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#1e1b4b');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#4f46e5');
    }

    updateThemeButtonUI();
}

function updateThemeButtonUI() {
    if (!themeToggleBtn || !themeIcon || !themeModeLabel) return;

    if (currentThemeMode === 'auto') {
        themeModeLabel.textContent = 'Auto';
        themeToggleBtn.setAttribute('title', 'Tema: Automático (segue o sistema). Clique para alternar.');
        themeIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
        `;
    } else if (currentThemeMode === 'dark') {
        themeModeLabel.textContent = 'Escuro';
        themeToggleBtn.setAttribute('title', 'Tema: Modo Escuro ativado. Clique para alternar.');
        themeIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    } else {
        themeModeLabel.textContent = 'Claro';
        themeToggleBtn.setAttribute('title', 'Tema: Modo Claro ativado. Clique para alternar.');
        themeIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        `;
    }
}

function renderCurrentDate() {
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    });
    dateDisplay.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function bindEvents() {
    // Alternância do modo escuro inteligente
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', cycleTheme);
    }

    // Adicionar nova tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) return;

        addTask(title);
        taskInput.value = '';
        taskInput.focus();
    });

    // Alternar entre abas (Tarefas vs Lixeira)
    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            currentTab = btn.dataset.tab;
            tabButtons.forEach((b) => b.classList.toggle('active', b === btn));

            if (currentTab === 'active') {
                addTaskSection.classList.remove('hidden');
                trashActionsSection.classList.add('hidden');
            } else {
                addTaskSection.classList.add('hidden');
                trashActionsSection.classList.remove('hidden');
            }

            render();
        });
    });

    // Filtros de tarefas (Todas / Pendentes / Concluídas)
    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            currentFilter = chip.dataset.filter;
            filterChips.forEach((c) => c.classList.toggle('active', c === chip));
            render();
        });
    });

    // Esvaziar lixeira
    btnEmptyTrash.addEventListener('click', () => {
        const trashCount = tasks.filter((t) => t.inTrash).length;
        if (trashCount === 0) return;

        openConfirmModal(
            'Esvaziar lixeira?',
            `Deseja excluir definitivamente ${trashCount} ${trashCount === 1 ? 'tarefa' : 'tarefas'} da lixeira? Esta ação não pode ser desfeita.`,
            () => {
                tasks = tasks.filter((t) => !t.inTrash);
                saveTasks();
                render();
                showToast('Lixeira esvaziada com sucesso');
            }
        );
    });

    // Ações nos itens da lista (delegação de eventos)
    taskList.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const itemEl = btn.closest('.task-item');
        if (!itemEl) return;

        const id = itemEl.dataset.id;
        const action = btn.dataset.action;

        if (action === 'toggle') {
            toggleTaskCompleted(id);
        } else if (action === 'move-to-trash') {
            moveToTrash(id);
        } else if (action === 'restore') {
            restoreFromTrash(id);
        } else if (action === 'delete-forever') {
            confirmDeleteForever(id);
        }
    });

    // Modal de confirmação
    modalCancel.addEventListener('click', closeConfirmModal);
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });
    modalConfirm.addEventListener('click', () => {
        if (typeof pendingDeleteAction === 'function') {
            pendingDeleteAction();
        }
        closeConfirmModal();
    });
}

// Operações de Tarefas
function addTask(title) {
    const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title,
        completed: false,
        inTrash: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();

    if (currentFilter === 'completed') {
        currentFilter = 'all';
        filterChips.forEach((c) => c.classList.toggle('active', c.dataset.filter === 'all'));
    }

    render();
    showToast('Tarefa adicionada');
}

function toggleTaskCompleted(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.inTrash) return;

    task.completed = !task.completed;
    saveTasks();
    render();
}

function moveToTrash(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.inTrash = true;
    task.trashedAt = new Date().toISOString();
    saveTasks();
    render();
    showToast('Tarefa movida para a lixeira');
}

function restoreFromTrash(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.inTrash = false;
    task.completed = false; // Volta como tarefa ativa (pendente)
    delete task.trashedAt;
    saveTasks();
    render();
    showToast('Tarefa restaurada como ativa');
}

function confirmDeleteForever(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    openConfirmModal(
        'Excluir definitivamente?',
        `A tarefa "${task.title}" será apagada para sempre.`,
        () => {
            tasks = tasks.filter((t) => t.id !== id);
            saveTasks();
            render();
            showToast('Tarefa excluída definitivamente');
        }
    );
}

// Renderização
function render() {
    updateCounters();

    const visibleTasks = getVisibleTasks();
    taskList.innerHTML = '';

    if (visibleTasks.length === 0) {
        emptyState.classList.remove('hidden');
        renderEmptyState();
    } else {
        emptyState.classList.add('hidden');
        visibleTasks.forEach((task) => {
            taskList.appendChild(createTaskElement(task));
        });
    }
}

function updateCounters() {
    const activeTasks = tasks.filter((t) => !t.inTrash);
    const pendingTasks = activeTasks.filter((t) => !t.completed);
    const completedTasks = activeTasks.filter((t) => t.completed);
    const trashedTasks = tasks.filter((t) => t.inTrash);

    countPending.textContent = pendingTasks.length;
    countCompleted.textContent = completedTasks.length;
    countTrash.textContent = trashedTasks.length;

    badgeActive.textContent = activeTasks.length;
    badgeTrash.textContent = trashedTasks.length;

    btnEmptyTrash.disabled = trashedTasks.length === 0;
}

function getVisibleTasks() {
    if (currentTab === 'trash') {
        return tasks.filter((t) => t.inTrash);
    }

    const activeTasks = tasks.filter((t) => !t.inTrash);
    if (currentFilter === 'pending') {
        return activeTasks.filter((t) => !t.completed);
    }
    if (currentFilter === 'completed') {
        return activeTasks.filter((t) => t.completed);
    }
    return activeTasks;
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed && !task.inTrash ? ' completed' : ''}`;
    li.dataset.id = task.id;

    const formattedDate = formatShortDate(task.inTrash ? task.trashedAt || task.createdAt : task.createdAt);
    const metaLabel = task.inTrash ? `Na lixeira • ${formattedDate}` : `Criada em ${formattedDate}`;

    if (!task.inTrash) {
        li.innerHTML = `
            <div class="task-left">
                <button type="button" class="check-btn" data-action="toggle" aria-label="${task.completed ? 'Desmarcar tarefa' : 'Marcar como concluída'}" title="${task.completed ? 'Desmarcar' : 'Concluir'}">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <div class="task-content">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <span class="task-meta">${metaLabel}</span>
                </div>
            </div>
            <div class="task-actions">
                <button type="button" class="action-btn btn-trash" data-action="move-to-trash" aria-label="Mover para a lixeira" title="Mover para a lixeira">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
    } else {
        li.innerHTML = `
            <div class="task-left">
                <div class="task-content">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <span class="task-meta">${metaLabel}</span>
                </div>
            </div>
            <div class="task-actions">
                <button type="button" class="action-btn btn-restore" data-action="restore" aria-label="Restaurar como tarefa ativa" title="Restaurar como tarefa ativa">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    <span>Restaurar</span>
                </button>
                <button type="button" class="action-btn btn-delete-forever" data-action="delete-forever" aria-label="Excluir definitivamente" title="Excluir definitivamente">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `;
    }

    return li;
}

function renderEmptyState() {
    if (currentTab === 'trash') {
        emptyIcon.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
        emptyTitle.textContent = 'A lixeira está vazia';
        emptySubtitle.textContent = 'Tarefas removidas aparecerão aqui para você restaurar ou excluir definitivamente.';
        return;
    }

    emptyIcon.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;

    if (currentFilter === 'pending') {
        emptyTitle.textContent = 'Nenhuma tarefa pendente!';
        emptySubtitle.textContent = 'Tudo em dia por aqui.';
    } else if (currentFilter === 'completed') {
        emptyTitle.textContent = 'Nenhuma tarefa concluída';
        emptySubtitle.textContent = 'Marque uma tarefa como concluída para vê-la aqui.';
    } else {
        emptyTitle.textContent = 'Nenhuma tarefa por aqui';
        emptySubtitle.textContent = 'Adicione sua primeira tarefa no campo acima para começar!';
    }
}

// Utilitários
function openConfirmModal(title, message, onConfirm) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    pendingDeleteAction = onConfirm;
    confirmModal.classList.remove('hidden');
}

function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    pendingDeleteAction = null;
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2400);
}

function formatShortDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
