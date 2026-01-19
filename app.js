const tg = window.Telegram.WebApp;
tg.expand();

let balance = 0;

// Профиль
if (tg.initDataUnsafe?.user) {
    document.getElementById("userId").innerText = tg.initDataUnsafe.user.id;
    document.getElementById("username").innerText =
        tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
}

// Баланс
function updateBalance() {
    document.getElementById("balance").innerText = balance;
}

// Донат
function donate() {
    if (tg) {
        tg.sendData("donate");
    } else {
        showModal("Демо", "Донат доступен только в Telegram");
    }
}

// Открытие кейса
function openCase(price) {
    if (balance < price) {
        showModal("Недостаточно ⭐", "Пополните баланс");
        return;
    }

    balance -= price;

    // шанс
    let roll = Math.random() * 100;
    let reward;

    if (roll < 1) reward = 1000;      // 1% (на самом деле 0.05%)
    else if (roll < 10) reward = 300;
    else reward = 50;

    balance += reward;
    updateBalance();

    showModal("🎉 Вы выиграли!", `+${reward} ⭐`);
}

// Модалка
function showModal(title, text) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalText").innerText = text;
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

updateBalance();

