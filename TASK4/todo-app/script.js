// Todo App with Local Storage
class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.selectedTasks = new Set();
        
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        // Form elements
        this.addTaskForm = document.getElementById('addTaskForm');
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        
        // Task list and empty state
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        
        // Filter elements
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Stats elements
        this.taskCount = document.getElementById('taskCount');
        this.completedCount = document.getElementById('completedCount');
        
        // Bulk actions
        this.bulkActions = document.getElementById('bulkActions');
        this.selectedCount = document.getElementById('selectedCount');
        this.markSelectedComplete = document.getElementById('markSelectedComplete');
        this.deleteSelected = document.getElementById('deleteSelected');
        
        // Clear section
        this.clearSection = document.getElementById('clearSection');
        this.clearCompleted = document.getElementById('clearCompleted');
        
        // Modal elements
        this.taskModal = document.getElementById('taskModal');
        this.editTaskForm = document.getElementById('editTaskForm');
        this.editTaskText = document.getElementById('editTaskText');
        this.editPriority = document.getElementById('editPriority');
        this.editDueDate = document.getElementById('editDueDate');
        this.editNotes = document.getElementById('editNotes');
        this.closeModal = document.getElementById('closeModal');
        this.cancelEdit = document.getElementById('cancelEdit');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Add task form
        this.addTaskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        
        // Bulk actions
        this.markSelectedComplete.addEventListener('click', () => this.markSelectedAsComplete());
        this.deleteSelected.addEventListener('click', () => this.deleteSelectedTasks());
        
        // Clear completed
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.closeTaskModal());
        this.cancelEdit.addEventListener('click', () => this.closeTaskModal());
        this.editTaskForm.addEventListener('submit', (e) => this.handleEditTask(e));
        
        // Close modal when clicking outside
        this.taskModal.addEventListener('click', (e) => {
            if (e.target === this.taskModal) {
                this.closeTaskModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const text = this.taskInput.value.trim();
        const priority = this.prioritySelect.value;
        
        if (!text) {
            this.showToast('Please enter a task description', 'error');
            return;
        }
        
        const task = {
            id: Date.now().toString(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: null,
            notes: ''
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        this.taskInput.value = '';
        this.showToast('Task added successfully!', 'success');
    }

    handleFilterChange(e) {
        const filter = e.target.dataset.filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentFilter = filter;
        this.renderTasks();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as active';
            this.showToast(message, 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.selectedTasks.delete(taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateBulkActions();
            this.showToast('Task deleted successfully!', 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editTaskText.value = task.text;
            this.editPriority.value = task.priority;
            this.editDueDate.value = task.dueDate ? task.dueDate.slice(0, 16) : '';
            this.editNotes.value = task.notes || '';
            
            this.editTaskForm.dataset.taskId = taskId;
            this.taskModal.style.display = 'block';
        }
    }

    handleEditTask(e) {
        e.preventDefault();
        
        const taskId = this.editTaskForm.dataset.taskId;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.text = this.editTaskText.value.trim();
            task.priority = this.editPriority.value;
            task.dueDate = this.editDueDate.value ? new Date(this.editDueDate.value).toISOString() : null;
            task.notes = this.editNotes.value.trim();
            
            this.saveTasks();
            this.renderTasks();
            this.closeTaskModal();
            this.showToast('Task updated successfully!', 'success');
        }
    }

    closeTaskModal() {
        this.taskModal.style.display = 'none';
        this.editTaskForm.reset();
        delete this.editTaskForm.dataset.taskId;
    }

    toggleTaskSelection(taskId) {
        if (this.selectedTasks.has(taskId)) {
            this.selectedTasks.delete(taskId);
        } else {
            this.selectedTasks.add(taskId);
        }
        this.updateBulkActions();
    }

    markSelectedAsComplete() {
        if (this.selectedTasks.size === 0) {
            this.showToast('Please select tasks to mark as complete', 'error');
            return;
        }
        
        this.tasks.forEach(task => {
            if (this.selectedTasks.has(task.id)) {
                task.completed = true;
                task.completedAt = new Date().toISOString();
            }
        });
        
        this.selectedTasks.clear();
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateBulkActions();
        this.showToast('Selected tasks marked as complete!', 'success');
    }

    deleteSelectedTasks() {
        if (this.selectedTasks.size === 0) {
            this.showToast('Please select tasks to delete', 'error');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${this.selectedTasks.size} task(s)?`)) {
            this.tasks = this.tasks.filter(t => !this.selectedTasks.has(t.id));
            this.selectedTasks.clear();
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateBulkActions();
            this.showToast('Selected tasks deleted successfully!', 'success');
        }
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            this.showToast('No completed tasks to clear', 'info');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast('Completed tasks cleared successfully!', 'success');
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.taskList.style.display = 'none';
            this.emptyState.style.display = 'block';
        } else {
            this.taskList.style.display = 'block';
            this.emptyState.style.display = 'none';
            
            this.taskList.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');
        }
        
        this.updateClearSection();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    createTaskElement(task) {
        const isSelected = this.selectedTasks.has(task.id);
        const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="todoApp.toggleTaskComplete('${task.id}')"
                >
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        <span class="task-date">${this.formatDate(task.createdAt)}</span>
                        ${task.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${this.formatDate(task.dueDate)}</span>` : ''}
                        ${task.notes ? '<span class="has-notes"><i class="fas fa-sticky-note"></i></span>' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" onclick="todoApp.editTask('${task.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="todoApp.deleteTask('${task.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        
        this.taskCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        this.completedCount.textContent = `${completedTasks} completed`;
    }

    updateBulkActions() {
        if (this.selectedTasks.size > 0) {
            this.bulkActions.style.display = 'flex';
            this.selectedCount.textContent = `${this.selectedTasks.size} task${this.selectedTasks.size !== 1 ? 's' : ''} selected`;
        } else {
            this.bulkActions.style.display = 'none';
        }
    }

    updateClearSection() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        this.clearSection.style.display = completedCount > 0 ? 'block' : 'none';
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === this.taskInput) {
            this.addTaskForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape to close modal
        if (e.key === 'Escape' && this.taskModal.style.display === 'block') {
            this.closeTaskModal();
        }
        
        // Ctrl/Cmd + A to select all tasks
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const visibleTasks = this.getFilteredTasks();
            visibleTasks.forEach(task => this.selectedTasks.add(task.id));
            this.updateBulkActions();
            this.renderTasks();
        }
    }

    // Export tasks to JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import tasks from JSON
    importTasks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    this.tasks = [...this.tasks, ...importedTasks];
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.showToast('Tasks imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showToast('Error importing tasks. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
    
    // Add some sample tasks if no tasks exist
    if (todoApp.tasks.length === 0) {
        const sampleTasks = [
            {
                id: '1',
                text: 'Welcome to your Todo App!',
                priority: 'high',
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: null,
                notes: 'This is a sample task to get you started.'
            },
            {
                id: '2',
                text: 'Click the checkbox to mark tasks as complete',
                priority: 'medium',
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: null,
                notes: ''
            },
            {
                id: '3',
                text: 'Use the edit button to modify task details',
                priority: 'low',
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: null,
                notes: ''
            }
        ];
        
        todoApp.tasks = sampleTasks;
        todoApp.saveTasks();
        todoApp.renderTasks();
        todoApp.updateStats();
    }
});

// Add some additional CSS for overdue tasks
const style = document.createElement('style');
style.textContent = `
    .task-item.overdue {
        border-left-color: #dc3545;
        background: #fff5f5;
    }
    
    .due-date.overdue {
        color: #dc3545;
        font-weight: 600;
    }
    
    .has-notes {
        color: #667eea;
    }
`;
document.head.appendChild(style); 