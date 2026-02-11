<div align="center">

# ✨ TaskFlow

### Seu dashboard pessoal de gerenciamento de tarefas

Um app desktop moderno com design glassmorphism, quadro Kanban com drag & drop, analytics e muito mais — tudo offline e gratuito.

[![Download](https://img.shields.io/github/v/release/cassianohub/taskFlow?label=Download&style=for-the-badge&color=7c5cfc)](https://github.com/cassianohub/taskFlow/releases/latest)
[![License](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Plataforma-Windows-0078D4?style=for-the-badge&logo=windows)](https://github.com/cassianohub/taskFlow/releases/latest)

---

<img src="assets/icon.png" width="128" alt="TaskFlow Icon">

<!-- Adicione uma screenshot aqui! Use ShareX (getsharex.com) para capturar -->
<!-- Substitua o caminho abaixo pela sua screenshot real -->
<br><br>
<img src="assets/screenshot.png" width="800" alt="TaskFlow Screenshot" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">

</div>

## 🇧🇷 Português

### Sobre

**TaskFlow** é um aplicativo desktop de organização de tarefas com interface moderna em glassmorphism. Organize suas tarefas em um quadro Kanban, acompanhe seu progresso com analytics e personalize com 6 temas diferentes.

### Funcionalidades

| | Funcionalidade | Descrição |
|-|---------------|-----------|
| 📋 | **Quadro Kanban** | Organize tarefas em colunas: Pendente, Em Progresso e Concluído |
| 🖱️ | **Drag & Drop** | Arraste tarefas entre colunas com facilidade |
| ✅ | **Subtarefas** | Divida tarefas grandes em etapas menores |
| 🏷️ | **Tags & Prioridades** | Categorize com tags coloridas e prioridades (Baixa → Crítica) |
| 📅 | **Prazos** | Acompanhe deadlines com indicadores visuais de atraso |
| 🔍 | **Busca & Filtros** | Encontre tarefas com `Ctrl+K`, filtre por prioridade ou tag |
| ⚡ | **Operações em Massa** | Selecione várias tarefas para mover ou excluir de uma vez |
| 📊 | **Dashboard Analytics** | Gráfico semanal, distribuição, streak tracker, análise por tags |
| 📆 | **Visão Timeline** | Veja todas as tarefas ordenadas por prazo |
| 🎨 | **6 Temas** | Midnight, Ocean, Aurora, Sunset, Rosé e Snow (modo claro) |
| 🏷️ | **Tags Personalizadas** | Crie suas próprias tags com seletor de cores |
| 💾 | **Exportar/Importar** | Faça backup e restaure seus dados em JSON |
| � | **Notificações** | Alertas nativos para tarefas atrasadas, vencendo hoje ou amanhã |
| 🔁 | **Tarefas Recorrentes** | Diária, semanal ou mensal — recriadas automaticamente ao concluir |
| �📡 | **Atualização Automática** | Receba updates automaticamente sem reinstalar |
| 🌐 | **100% Offline** | Fontes e ícones inclusos, funciona sem internet |

### Instalação

1. Acesse a [página de releases](https://github.com/cassianohub/taskFlow/releases/latest)
2. Baixe o arquivo `TaskFlow-Setup-x.x.x.exe`
3. Execute o instalador e siga as instruções
4. Pronto! O TaskFlow está instalado 🎉

### Atalhos

| Atalho | Ação |
|--------|------|
| `Ctrl+K` | Abrir busca rápida |
| `Escape` | Fechar modais |

### Armazenamento

Seus dados ficam salvos localmente no seu computador:
- **Windows:** `%APPDATA%/taskflow/tasks.json`

Nenhum dado é enviado para a internet. Tudo fica no seu PC.

---

## 🇺🇸 English

### About

**TaskFlow** is a desktop task management app with a modern glassmorphism UI. Organize your tasks on a Kanban board, track your progress with analytics, and customize with 6 different themes.

### Features

| | Feature | Description |
|-|---------|-------------|
| 📋 | **Kanban Board** | Organize tasks in Pending, In Progress, and Done columns |
| 🖱️ | **Drag & Drop** | Move tasks between columns effortlessly |
| ✅ | **Subtasks** | Break down tasks into smaller, trackable steps |
| 🏷️ | **Tags & Priorities** | Categorize with custom colored tags and priority levels (Low → Critical) |
| 📅 | **Due Dates** | Track deadlines with visual overdue/soon indicators |
| 🔍 | **Search & Filters** | Find tasks with `Ctrl+K`, filter by priority or tag |
| ⚡ | **Bulk Operations** | Select multiple tasks to move or delete at once |
| 📊 | **Analytics Dashboard** | Weekly activity chart, distribution donut, streak tracker, tag breakdown |
| 📆 | **Timeline View** | See all tasks ordered by due date |
| 🎨 | **6 Themes** | Midnight, Ocean, Aurora, Sunset, Rosé, and Snow (light mode) |
| 🏷️ | **Custom Tags** | Create your own tags with a color picker |
| 💾 | **Export/Import** | Back up and restore your data as JSON |
| � | **Notifications** | Native alerts for overdue, due today, or due tomorrow tasks |
| 🔁 | **Recurring Tasks** | Daily, weekly, or monthly — auto-recreated when completed |
| �📡 | **Auto-Update** | Receive updates automatically without reinstalling |
| 🌐 | **100% Offline** | All fonts and icons bundled locally, works without internet |

### Installation

1. Go to the [releases page](https://github.com/cassianohub/taskFlow/releases/latest)
2. Download `TaskFlow-Setup-x.x.x.exe`
3. Run the installer and follow the steps
4. Done! TaskFlow is installed 🎉

### Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open quick search |
| `Escape` | Close modals |

### Data Storage

Your data is stored locally on your computer:
- **Windows:** `%APPDATA%/taskflow/tasks.json`
- **macOS:** `~/Library/Application Support/taskflow/tasks.json`
- **Linux:** `~/.config/taskflow/tasks.json`

No data is sent to the internet. Everything stays on your PC.

---

## 🛠️ Para Desenvolvedores / For Developers

### Pré-requisitos / Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Comandos / Commands

```bash
# Instalar dependências / Install dependencies
npm install

# Rodar em desenvolvimento / Run in development
npm start

# Gerar instalador Windows / Build Windows installer
npm run build

# Versão portátil / Portable version
npm run build:portable
```

### Tech Stack

- **Electron** — Framework desktop multiplataforma
- **Vanilla JS** — Sem dependências de framework frontend
- **CSS3** — Glassmorphism, variáveis CSS, animações
- **Inter Font** — Tipografia moderna e limpa
- **Remix Icon** — Conjunto de ícones

---

<div align="center">

**[MIT License](LICENSE)** — Feito por Cassiano Alves

</div>
