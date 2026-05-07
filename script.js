// === ДЗ 3. Часть 1: CLI-логика (работает в консоли) ===

let projects = [];

// Валидация (стрелочная функция)
const validateProject = (data) => {
    if (!data.title || data.title.length < 3) {
        return { valid: false, error: "Название минимум 3 символа" };
    }
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
        return { valid: false, error: "Цена должна быть числом >= 0" };
    }
    let skills = [];
    if (data.skills) {
        skills = data.skills.split(",").map(s => s.trim());
    }
    return { valid: true, skills, price };
};

// Добавление проекта (function declaration)
function addProject(project) {
    projects.push(project);
    renderProjectsToDOM();
    console.table(projects);
}

// Отрисовка карточек в DOM
function renderProjectsToDOM() {
    const container = document.getElementById("projects-list");
    if (!container) return;

    container.innerHTML = "";

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.description || "")}</p>
            <p><strong>Технологии:</strong> ${escapeHtml(project.skills.join(", "))}</p>
            <p><strong>Цена:</strong> ${project.price} ₽</p>
            <a href="${escapeHtml(project.link || "#")}" target="_blank">Проект →</a>
            <button class="delete-btn" data-index="${index}">🗑 Удалить</button>
        `;
        container.appendChild(card);
    });

    // Обработчики удаления
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = btn.dataset.index;
            projects.splice(idx, 1);
            renderProjectsToDOM();
        });
    });
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

// === DOM-форма ===
function addProjectForm() {
    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const formHtml = `
        <div class="form-container">
            <h3>➕ Добавить проект</h3>
            <form id="project-form">
                <input type="text" id="title" placeholder="Название проекта" required>
                <input type="text" id="tech" placeholder="Технологии (через запятую)" required>
                <textarea id="description" placeholder="Описание"></textarea>
                <input type="text" id="price" placeholder="Цена (руб)" required>
                <input type="text" id="link" placeholder="Ссылка (необязательно)">
                <button type="submit">Добавить</button>
            </form>
        </div>
    `;

    projectsSection.insertAdjacentHTML("afterend", formHtml);

    const form = document.getElementById("project-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const skills = document.getElementById("tech").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const link = document.getElementById("link").value;

        const validation = validateProject({ title, skills, description, price, link });

        if (validation.valid) {
            const newProject = {
                title,
                link: link || "#",
                skills: validation.skills,
                description,
                price: validation.price
            };
            addProject(newProject);
            form.reset();
        } else {
            alert("❌ Ошибка: " + validation.error);
        }
    });
}

// === Запуск после загрузки страницы ===
document.addEventListener("DOMContentLoaded", () => {
    addProjectForm();
    console.log("✅ ДЗ 3: CLI и DOM работают. Используй форму для добавления проектов.");
});

// === CLI-часть для консоли (можно вызывать вручную) ===
window.runCLI = function() {
    const title = prompt("Название проекта:");
    if (!title) return;
    const skills = prompt("Технологии (через запятую):");
    const description = prompt("Описание:");
    const price = prompt("Цена:");
    const link = prompt("Ссылка:");

    const validation = validateProject({ title, skills, description, price, link });
    if (validation.valid) {
        addProject({
            title,
            link: link || "#",
            skills: validation.skills,
            description,
            price: validation.price
        });
    } else {
        alert(validation.error);
    }
};

console.log("Для запуска CLI-версии введи в консоли: runCLI()");