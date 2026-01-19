const tg = window.Telegram.WebApp;
tg.expand();

let balance = 0;

if (tg.initDataUnsafe?.user) {
    document.getElementById("username").innerText =
        tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
    document.getElementById("uid").innerText = tg.initDataUnsafe.user.id;
}

function updateBalance() {
    balance = Math.max(balance, 0);
    document.getElementById("balance").innerText = balance;
    document.getElementById("balance2").innerText = balance;
}

function openPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function donate() {
    showModal("💳 Пополнение", "Скоро будет доступно через Telegram");
}

function openCase(price) {
    if (balance < price) {
        showModal("Ошибка", "Недостаточно звезд");
        return;
    }

    balance -= price;
    updateBalance();

    const overlay = document.getElementById("caseOverlay");
    overlay.classList.remove("hidden");

    setTimeout(() => {
        overlay.classList.add("hidden");

        let roll = Math.random() * 100;
        let reward = roll < 1 ? 1000 : roll < 10 ? 300 : 50;

        balance += reward;
        updateBalance();
        showModal("🎉 Победа", `Вы выиграли ${reward} ⭐`);
    }, 2000);
}

function usePromo() {
    let code = document.getElementById("promo").value;
    if (code === "VanoJR") {
        balance += 5000;
        updateBalance();
        showModal("Успех", "+5000 ⭐");
    } else {
        showModal("Ошибка", "Неверный код");
    }
}

function showModal(title, text) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalText").innerText = text;
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

updateBalance();
