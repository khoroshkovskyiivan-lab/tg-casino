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

