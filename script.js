const COMMISSION_PERCENT = 7;

const listings = [
  { emoji: "🎁", title: "Holiday Box #147", price: 75, seller: "@mila_shop", likes: 54, rarity: "Epic" },
  { emoji: "💎", title: "Rare Crystal Gift", price: 129, seller: "@pixel_hub", likes: 77, rarity: "Legendary" },
  { emoji: "🚀", title: "Space Rocket Pack", price: 98, seller: "@neo_store", likes: 49, rarity: "Epic" },
  { emoji: "🐉", title: "Dragon Surprise", price: 210, seller: "@gift_lab", likes: 112, rarity: "Mythic" },
  { emoji: "🎟️", title: "Premium Ticket", price: 42, seller: "@daily_drop", likes: 36, rarity: "Rare" },
  { emoji: "🌟", title: "Galaxy Star", price: 158, seller: "@prisma_gifts", likes: 89, rarity: "Legendary" },
];

const authStatusEl = document.getElementById("authStatus");
const userNameEl = document.getElementById("userName");
const marketEl = document.getElementById("market");
const cardTemplate = document.getElementById("cardTemplate");
const walletValueEl = document.getElementById("walletValue");
const walletNoteEl = document.getElementById("walletNote");
const topupInputEl = document.getElementById("topupInput");
const topupBtnEl = document.getElementById("topupBtn");
const sellDemoBtnEl = document.getElementById("sellDemoBtn");

let walletBalance = 0;

function formatTon(value) {
  return Number(value).toFixed(2);
}

function setWalletNote(text, type = "warn") {
  walletNoteEl.textContent = text;
  walletNoteEl.style.color = type === "good" ? "var(--good)" : "var(--warn)";
}

function renderMarket(items) {
  marketEl.innerHTML = "";

  items.forEach((item, index) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);

    card.style.animationDelay = `${index * 70}ms`;
    card.querySelector(".card__emoji").textContent = item.emoji;
    card.querySelector(".card__rarity").textContent = item.rarity;
    card.querySelector(".card__title").textContent = item.title;
    card.querySelector(".card__price").textContent = `${item.price} TON`;
    card.querySelector(".card__seller").textContent = `Продавец: ${item.seller}`;
    card.querySelector(".card__likes").textContent = `❤ ${item.likes}`;
    card.querySelector(".card__fee").textContent = `Комиссия ${Math.round(item.price * COMMISSION_PERCENT / 100)} TON`;

    card.querySelector(".card__buy").addEventListener("click", () => buyGift(item));
    marketEl.append(card);
  });
}

function buyGift(item) {
  if (walletBalance < item.price) {
    const need = item.price - walletBalance;
    setWalletNote(`Недостаточно средств. Пополни ещё на ${formatTon(need)} TON.`);
    return;
  }

  walletBalance -= item.price;
  walletValueEl.textContent = formatTon(walletBalance);
  const fee = item.price * COMMISSION_PERCENT / 100;
  setWalletNote(`Покупка успешна: ${item.title}. Твоя комиссия: ${formatTon(fee)} TON.`, "good");

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  }
}

function setupTopUp() {
  topupBtnEl.addEventListener("click", () => {
    const amount = Number(topupInputEl.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      setWalletNote("Введи корректную сумму пополнения.");
      return;
    }

    walletBalance += amount;
    walletValueEl.textContent = formatTon(walletBalance);
    setWalletNote(`Баланс пополнен на ${formatTon(amount)} TON.`, "good");
  });
}

function setupDemoSell() {
  sellDemoBtnEl.addEventListener("click", () => {
    const lotNumber = listings.length + 1;
    const newItem = {
      emoji: "🎉",
      title: `New Gift Lot #${lotNumber}`,
      price: 60 + lotNumber,
      seller: userNameEl.textContent.startsWith("@") ? userNameEl.textContent : "@you",
      likes: 0,
      rarity: "Rare",
    };

    listings.unshift(newItem);
    renderMarket(listings);
    setWalletNote(`Лот ${newItem.title} добавлен в маркетплейс.`, "good");
  });
}

function initTelegramAuth() {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (user) {
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
      userNameEl.textContent = user.username ? `@${user.username}` : fullName || `ID ${user.id}`;
      authStatusEl.textContent = "Авторизован автоматически через Telegram";
      setWalletNote("Telegram-аккаунт подключён. Можно покупать и продавать.", "good");
      return;
    }
  }

  userNameEl.textContent = "@demo_user";
  authStatusEl.textContent = "Демо-режим (вне Telegram)";
  setWalletNote("Для авто-авторизации открой Mini App из Telegram-бота.");
}

renderMarket(listings);
setupTopUp();
setupDemoSell();
initTelegramAuth();
