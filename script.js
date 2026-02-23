const listings = [
  { emoji: "🎁", title: "Holiday Box #147", price: 75, seller: "@mila_shop", likes: 54 },
  { emoji: "💎", title: "Rare Crystal Gift", price: 129, seller: "@pixel_hub", likes: 77 },
  { emoji: "🚀", title: "Space Rocket Pack", price: 98, seller: "@neo_store", likes: 49 },
  { emoji: "🐉", title: "Dragon Surprise", price: 210, seller: "@gift_lab", likes: 112 },
  { emoji: "🎟️", title: "Premium Ticket", price: 42, seller: "@daily_drop", likes: 36 },
  { emoji: "🌟", title: "Galaxy Star", price: 158, seller: "@prisma_gifts", likes: 89 },
];

const market = document.getElementById("market");

listings.forEach((item, index) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animation = `fadeIn 650ms ease ${index * 80}ms both`;

  card.innerHTML = `
    <div class="card__emoji">${item.emoji}</div>
    <h3>${item.title}</h3>
    <div class="card__price">${item.price} TON</div>
    <div class="card__meta">
      <span>${item.seller}</span>
      <span>❤ ${item.likes}</span>
    </div>
  `;

  market.append(card);
});

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

document.head.append(style);
