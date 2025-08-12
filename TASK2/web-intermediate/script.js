(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initializeFormValidation();
    initializeTodoList();
  });

  function initializeFormValidation() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message"),
    };

    const statusEl = document.getElementById("formStatus");

    const validators = {
      name: (value) => {
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
      email: (value) => {
        if (!value.trim()) return "Email is required.";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailPattern.test(value.trim())) return "Enter a valid email address.";
        return "";
      },
      subject: (value) => {
        if (!value.trim()) return "Subject is required.";
        return "";
      },
      message: (value) => {
        if (!value.trim()) return "Message is required.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    };

    for (const key of Object.keys(fields)) {
      const input = fields[key];
      input.addEventListener("input", () => validateField(key));
      input.addEventListener("blur", () => validateField(key));
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      statusEl.textContent = "";

      const results = Object.keys(fields).map((key) => ({
        key,
        error: validateField(key),
      }));

      const firstInvalid = results.find((r) => r.error);
      if (firstInvalid) {
        fields[firstInvalid.key].focus();
        return;
      }

      // Simulate successful submit
      statusEl.textContent = "Thanks! Your message has been sent (demo).";
      statusEl.style.color = "var(--success)";

      form.reset();
      clearValidationStates();
    });

    function validateField(key) {
      const input = fields[key];
      const error = validators[key](input.value);
      const errorEl = document.getElementById(key + "Error");

      if (error) {
        input.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
        errorEl.textContent = error;
      } else {
        input.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
        errorEl.textContent = "";
      }
      return error;
    }

    function clearValidationStates() {
      Object.keys(fields).forEach((key) => {
        fields[key].classList.remove("invalid");
        fields[key].removeAttribute("aria-invalid");
        const errorEl = document.getElementById(key + "Error");
        errorEl.textContent = "";
      });
    }
  }

  function initializeTodoList() {
    const input = document.getElementById("todoInput");
    const addButton = document.getElementById("addTodoButton");
    const list = document.getElementById("todoList");

    if (!input || !addButton || !list) return;

    /** @type {{ id: string, text: string, completed: boolean }[]} */
    let todos = [];

    try {
      const cached = localStorage.getItem("task2.todos");
      if (cached) todos = JSON.parse(cached);
    } catch (_) {
      // ignore
    }

    render();

    addButton.addEventListener("click", addFromInput);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addFromInput();
      }
    });

    function addFromInput() {
      const text = input.value.trim();
      if (!text) {
        input.focus();
        return;
      }
      const todo = { id: cryptoRandomId(), text, completed: false };
      todos.push(todo);
      save();
      render();
      input.value = "";
      input.focus();
    }

    function toggle(id) {
      todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      save();
      render();
    }

    function remove(id) {
      todos = todos.filter((t) => t.id !== id);
      save();
      render();
    }

    function render() {
      list.innerHTML = "";
      if (todos.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No tasks yet. Add one above.";
        empty.style.color = "var(--muted)";
        list.appendChild(empty);
        return;
      }

      for (const todo of todos) {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.completed ? " completed" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.ariaLabel = `Mark '${todo.text}' as ${todo.completed ? "incomplete" : "complete"}`;
        checkbox.addEventListener("change", () => toggle(todo.id));

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        const removeBtn = document.createElement("button");
        removeBtn.className = "button todo-remove";
        removeBtn.type = "button";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => remove(todo.id));

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(removeBtn);
        list.appendChild(li);
      }
    }

    function save() {
      try {
        localStorage.setItem("task2.todos", JSON.stringify(todos));
      } catch (_) {
        // ignore
      }
    }

    function cryptoRandomId() {
      if (crypto && crypto.getRandomValues) {
        const arr = new Uint32Array(4);
        crypto.getRandomValues(arr);
        return Array.from(arr).map((n) => n.toString(16)).join("");
      }
      return Math.random().toString(16).slice(2) + Date.now().toString(16);
    }
  }
})(); 