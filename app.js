// ===== TELEGRAM INIT =====
let tg = window.Telegram?.WebApp;
let isTelegram = false;

let user = {
    id: null,
    username: "Игрок",
    balance: 0
};

// ===== DEMO STORAGE =====
function loadData() {
    const data = localStorage.getItem("casino_user");
    if (data) {
        user = JSON.parse(data);
    }
}

function saveData() {
    localStorage.setItem("casino_user", JSON.stringify(user));
}

// ===== INIT =====
function init() {
    if (tg) {
        tg.ready();
        isTelegram = true;

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
            user.id = tgUser.id;
            user.username = tgUser.username || tgUser.first_name;
        }
    }

    loadData();
    updateUI();
}

document.addEventListener("DOMContentLoaded", init);

// ===== UI =====
function updateUI() {
    document.getElementById("username").innerText = user.username;
    document.getElementById("userid").innerText = user.id || "demo";
    document.getElementById("balance").innerText = user.balance;
}

// ===== MODAL =====
function showModal(title, text) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalText").innerText = text;
    document.getElementById("modal").classList.remove("hidden");

    if (isTelegram) tg.HapticFeedback.impactOccurred("medium");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// ===== CASE LOGIC =====
function openCase(price) {
    if (user.balance < price) {
        showModal("❌ Недостаточно звёзд", "Пополните баланс");
        return;
    }

    user.balance -= price;

    // реальные шансы (скрытые)
    const rewards = [
        { name: "Ничего", reward: 0, chance: 50 },
        { name: "+25 ⭐", reward: 25, chance: 25 },
        { name: "+50 ⭐", reward: 50, chance: 15 },
        { name: "+100 ⭐", reward: 100, chance: 8 },
        { name: "+500 ⭐", reward: 500, chance: 2 }
    ];

    let roll = Math.random() * 100;
    let cumulative = 0;
    let result = rewards[0];

    for (let item of rewards) {
        cumulative += item.chance;
        if (roll <= cumulative) {
            result = item;
            break;
        }
    }

    setTimeout(() => {
        user.balance += result.reward;
        saveData();
        updateUI();

        showModal("🎁 Кейс открыт", `Вы выиграли: ${result.name}`);
    }, 700);
}

// ===== PROMO =====
function applyPromo() {
    const input = document.getElementById("promoInput");
    const code = input.value.trim();

    if (!code) return;

    if (code === "VanoJR") {
        user.balance += 5000;
        saveData();
        updateUI();
        showModal("✅ Промокод активирован", "+5000 ⭐");
        input.value = "";
    } else {
        showModal("❌ Ошибка", "Промокод недействителен");
        
        function donate() {
    // если это WebApp
    if (tg) {
        tg.sendData("donate");
    } else {
        showModal("⚠️ Demo", "В демо режиме донат недоступен");
    }
}

    }
}

