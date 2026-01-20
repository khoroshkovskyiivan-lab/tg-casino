const state = {
    balance: 500,
    inventory: [],
    stats: {
        casesOpened: 0,
        starsWon: 0
    },
    lastDaily: 0
};

loadState();
js
Copy code
function saveState() {
    localStorage.setItem("gift_state", JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem("gift_state");
    if (saved) Object.assign(state, JSON.parse(saved));
}
// ===== TELEGRAM INIT =====
const tg = window.Telegram.WebApp;
tg.expand();

// ===== STATE =====
let balance = 0;
let appReady = false;

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {
    appReady = true;
    forceCloseModal();

    // USER
    if (tg.initDataUnsafe?.user) {
        document.getElementById("username").innerText =
            tg.initDataUnsafe.user.username ||
            tg.initDataUnsafe.user.first_name;
    }

    updateBalance();

    // BUTTONS
    document.getElementById("donateBtn").addEventListener("click", donate);
    document.getElementById("openCaseBtn").addEventListener("click", openCase);
    document.getElementById("modalOk").addEventListener("click", closeModal);
});

// ===== BALANCE =====
function updateBalance() {
    document.getElementById("balance").innerText = balance;
}

// ===== ACTIONS =====
function donate() {
    showModal("💳 Пополнение", "Донат будет подключен позже");
}

function openCase() {
    if (balance < 100) {
        showModal("Ошибка", "Недостаточно звезд");
        return;
    }

    balance -= 100;

    const reward = Math.random() < 0.1 ? 300 : 50;
    balance += reward;

    updateBalance();
    showModal("🎉 Результат", `Вы выиграли ${reward} ⭐`);
}

// ===== MODAL SYSTEM (СТАБИЛЬНЫЙ) =====
function showModal(title, text) {
    if (!appReady) return;

    const modal = document.getElementById("modal");
    if (!modal) return;

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalText").innerText = text;

    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.classList.add("hidden");
}

function forceCloseModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.style.display = "none";
    modal.classList.add("hidden");

    setTimeout(() => {
        modal.style.display = "";
        modal.classList.add("hidden");
    }, 50);
}
function openCase(caseId) {
    const c = cases.find(x => x.id === caseId);
    if (!c || state.balance < c.price) {
        showModal("Ошибка", "Недостаточно ⭐");
        return;
    }

    state.balance -= c.price;

    const roll = Math.random() * 100;
    let sum = 0;
    let reward = 0;

    for (const d of c.drops) {
        sum += d.chance;
        if (roll <= sum) {
            reward = d.stars;
            break;
        }
    }

    state.balance += reward;
    state.stats.casesOpened++;
    state.stats.starsWon += reward;

    saveState();
    updateBalance();
    showModal("🎉 Кейc", `Вы выиграли ${reward} ⭐`);
}
function upgrade(stars, multiplier) {
    if (state.balance < stars) {
        showModal("Ошибка", "Недостаточно ⭐");
        return;
    }

    state.balance -= stars;

    const chance = 100 / multiplier;
    if (Math.random() * 100 < chance) {
        const win = stars * multiplier;
        state.balance += win;
        showModal("🔥 Успех", `Вы выиграли ${win} ⭐`);
    } else {
        showModal("💀 Провал", "Вы проиграли");
    }

    saveState();
    updateBalance();
}
function dailyBonus() {
    const now = Date.now();
    if (now - state.lastDaily < 86400000) {
        showModal("⏳", "Бонус уже получен");
        return;
    }

    const reward = 200;
    state.balance += reward;
    state.lastDaily = now;

    saveState();
    updateBalance();
    showModal("🎁 Бонус", `+${reward} ⭐`);
}

function renderProfile() {
    view.innerHTML = `
        <h2>Профиль</h2>
        <p>Кейсов открыто: ${state.stats.casesOpened}</p>
        <p>Выиграно ⭐: ${state.stats.starsWon}</p>
        <button class="main-btn" onclick="dailyBonus()">🎁 Daily Bonus</button>
    `;
}




