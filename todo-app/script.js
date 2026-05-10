// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTodos);

// Add event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Add a new todo
function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('Please enter a todo item');
        return;
    }

    // Create todo object
    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    // Add to DOM
    addTodoToDOM(todo);

    // Save to localStorage
    saveTodoToLocalStorage(todo);

    // Clear input
    todoInput.value = '';
    todoInput.focus();

    // Update empty message
    updateEmptyMessage();
}

// Add todo to the DOM
function addTodoToDOM(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.id = `todo-${todo.id}`;
    li.setAttribute('role', 'listitem');
    if (todo.completed) li.classList.add('completed');

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''} 
            aria-label="Mark todo as ${todo.completed ? 'incomplete' : 'complete'}"
        >
        <div class="todo-content">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <button 
            class="delete-btn" 
            onclick="deleteTodo(${todo.id})" 
            aria-label="Delete: ${escapeHtml(todo.text)}"
        >
            Delete
        </button>
    `;

    // Add checkbox change handler
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => {
        toggleTodoCompletion(todo.id);
    });

    todoList.appendChild(li);
}

// Delete a todo
function deleteTodo(id) {
    const todoElement = document.getElementById(`todo-${id}`);
    if (todoElement) {
        todoElement.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            todoElement.remove();
            removeTodoFromLocalStorage(id);
            updateEmptyMessage();
        }, 300);
    }
}

// Toggle todo completion status
function toggleTodoCompletion(id) {
    const todoElement = document.getElementById(`todo-${id}`);
    if (todoElement) {
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const isCompleted = !todoElement.classList.contains('completed');
        
        todoElement.classList.toggle('completed');
        checkbox.checked = isCompleted;
        
        // Update ARIA label
        const todoText = todoElement.querySelector('.todo-text').textContent;
        checkbox.setAttribute('aria-label', `Mark todo as ${isCompleted ? 'incomplete' : 'complete'}`);
        
        updateTodoInLocalStorage(id, {
            completed: isCompleted
        });
    }
}

// Update empty message visibility
function updateEmptyMessage() {
    if (todoList.children.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }
}

// LocalStorage functions
function saveTodoToLocalStorage(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromLocalStorage(id) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function updateTodoInLocalStorage(id, updates) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...updates };
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodoToDOM(todo));
    updateEmptyMessage();
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
