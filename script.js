// ===== ДЗ 3. Часть 1: CLI-версия (работает в любом окружении) =====

let projects = [];

// Валидация (совместимый вариант)
const validateProject = (data, returnDetails = false) => {
    if (!data.title || data.title.length < 3) {
        if (returnDetails) return { valid: false, error: "Название минимум 3 символа" };
        return false;
    }
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
        if (returnDetails) return { valid: false, error: "Цена должна быть числом >= 0" };
        return false;
    }
    let skills = [];
    if (data.skills) {
        skills = data.skills.split(",").map(s => s.trim());
    }
    if (returnDetails) {
        return { valid: true, skills, price };
    }
    return true;
};

// Добавление проекта
function addProject(project) {
    projects.push(project);
    renderProjects(); // CLI-вывод
    if (typeof renderProjectsToDOM === "function") {
        renderProjectsToDOM(); // обновляем DOM, если он есть
    }
}

// CLI: вывод в консоль
function renderProjects() {
    console.table(projects);
}

// ===== Часть 2: DOM-версия =====

// Сбор данных из формы или из prompt
function collectProjectData(source) {
    if (source === "form") {
        return {
            title: document.getElementById("title")?.value || "",
            skills: document.getElementById("tech")?.value || "",
            description: document.getElementById("description")?.value || "",
            price: document.getElementById("price")?.value || "",
            link: document.getElementById("link")?.value || ""
        };
    }
    // CLI: сбор через prompt
    return {
        title: prompt("Название проекта:"),
        skills: prompt("Технологии (через запятую):"),
        description: prompt("Описание:"),
        price: prompt("Цена:"),
        link: prompt("Ссылка:")
    };
}

// Создание одной карточки
function createProjectCard(project, index) {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.index = index;
    card.innerHTML = `
        <h4>${escapeHtml(project.title)}</h4>
        <p>${escapeHtml(project.description || "")}</p>
        <p><strong>Технологии:</strong> ${escapeHtml(project.skills.join(", "))}</p>
        <p><strong>Цена:</strong> ${project.price} ₽</p>
        <a href="${escapeHtml(project.link || "#")}" target="_blank">Проект →</a>
        <button class="delete-btn" data-index="${index}">🗑 Удалить</button>
    `;
    return card;
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}

// DOM-отрисовка (перерисовка всего списка)
function renderProjectsToDOM() {
    const container = document.getElementById("projects-list");
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p class="empty-message">📭 Пока нет проектов. Добавьте первый!</p>';
        return;
    }

    container.innerHTML = "";
    projects.forEach((project, idx) => {
        container.appendChild(createProjectCard(project, idx));
    });

    // Делегирование удаления
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.removeEventListener("click", handleDelete);
        btn.addEventListener("click", handleDelete);
    });
}

function handleDelete(e) {
    const idx = e.currentTarget.dataset.index;
    projects.splice(idx, 1);
    renderProjectsToDOM();
}

// Добавление проекта через форму
function addProjectFromForm(e) {
    e.preventDefault();
    const data = collectProjectData("form");
    const validation = validateProject(data, true);

    if (validation.valid) {
        addProject({
            title: data.title,
            link: data.link || "#",
            skills: validation.skills,
            description: data.description,
            price: validation.price
        });
        document.getElementById("add-project-form")?.reset();
    } else {
        alert("❌ Ошибка: " + validation.error);
    }
}

// CLI-цикл
function runCLI() {
    while (true) {
        const data = collectProjectData("cli");
        if (!data.title) {
            console.log("Выход из CLI-режима");
            break;
        }
        const validation = validateProject(data, true);
        if (validation.valid) {
            addProject({
                title: data.title,
                link: data.link || "#",
                skills: validation.skills,
                description: data.description,
                price: validation.price
            });
        } else {
            console.error("❌ Ошибка:", validation.error);
        }
    }
}

// Инициализация DOM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-project-form");
    if (form) {
        form.addEventListener("submit", addProjectFromForm);
    }
    renderProjectsToDOM();
    console.log("✅ ДЗ 3 загружено. Для запуска CLI введи runCLI()");
});