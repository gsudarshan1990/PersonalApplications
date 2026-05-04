const STORAGE_KEY = "vending-machine-state";
const CATALOG_VERSION = 2;

const defaultItems = [
  { id: 1, code: "A1", name: "Lays Magic Masala", price: 20, quantity: 5 },
  { id: 2, code: "A2", name: "Cadbury Dairy Milk", price: 40, quantity: 4 },
  { id: 3, code: "B1", name: "Thums Up Can", price: 45, quantity: 6 },
  { id: 4, code: "B2", name: "Maaza", price: 35, quantity: 3 },
  { id: 5, code: "C1", name: "Kurkure Masala Munch", price: 20, quantity: 2 },
  { id: 6, code: "C2", name: "Parle-G Pack", price: 10, quantity: 8 }
];

const inventoryBody = document.getElementById("inventoryBody");
const balanceDisplay = document.getElementById("balanceDisplay");
const messageDisplay = document.getElementById("messageDisplay");
const purchaseHistory = document.getElementById("purchaseHistory");
const itemInput = document.getElementById("itemInput");
const quantityInput = document.getElementById("quantityInput");
const purchaseButton = document.getElementById("purchaseButton");
const cancelButton = document.getElementById("cancelButton");
const resetButton = document.getElementById("resetButton");
const moneyButtons = Array.from(document.querySelectorAll(".money-btn"));

let state = loadState();

function createDefaultState() {
  return {
    version: CATALOG_VERSION,
    balance: 0,
    items: structuredClone(defaultItems),
    purchases: []
  };
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return createDefaultState();
  }

  try {
    const parsedState = JSON.parse(savedState);

    if (parsedState.version !== CATALOG_VERSION) {
      return createDefaultState();
    }

    if (!Array.isArray(parsedState.purchases)) {
      parsedState.purchases = [];
    }

    return parsedState;
  } catch (error) {
    return createDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

function renderInventory() {
  inventoryBody.innerHTML = state.items
    .map((item) => {
      const quantityClass = item.quantity > 0 ? "in-stock" : "out-stock";
      const quantityText = item.quantity > 0 ? `${item.quantity} left` : "Sold out";

      return `
        <tr>
          <td>${item.id}</td>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td>${formatCurrency(item.price)}</td>
          <td><span class="pill ${quantityClass}">${quantityText}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderBalance() {
  balanceDisplay.textContent = formatCurrency(state.balance);
}

function renderPurchaseHistory() {
  if (state.purchases.length === 0) {
    purchaseHistory.innerHTML = '<li class="history-empty">No products purchased yet.</li>';
    return;
  }

  purchaseHistory.innerHTML = state.purchases
    .slice()
    .reverse()
    .map((purchase) => {
      return `
        <li class="history-item">
          <span class="history-name">${purchase.quantity || 1} x ${purchase.name}</span>
          <span class="history-meta">${purchase.code} • ${formatCurrency(purchase.price)}</span>
        </li>
      `;
    })
    .join("");
}

function setMessage(text, type = "info") {
  messageDisplay.textContent = text;
  messageDisplay.className = `message ${type}`;
}

function syncUi() {
  renderInventory();
  renderBalance();
  renderPurchaseHistory();
  saveState();
}

function addMoney(amount) {
  state.balance = Number((state.balance + amount).toFixed(2));
  renderBalance();
  saveState();
  setMessage(`Inserted ${formatCurrency(amount)}. Current balance is ${formatCurrency(state.balance)}.`, "info");
}

function findItem(selection) {
  const normalized = selection.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  return state.items.find((item) => {
    return item.code.toUpperCase() === normalized || String(item.id) === normalized;
  }) || null;
}

function purchaseItem() {
  const selection = itemInput.value;
  const item = findItem(selection);
  const quantity = Number.parseInt(quantityInput.value, 10);

  if (!selection.trim()) {
    setMessage("Enter an item code or number before purchasing.", "error");
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    setMessage("Enter a valid quantity of at least 1.", "error");
    return;
  }

  if (!item) {
    setMessage("That selection does not match any item in the machine.", "error");
    return;
  }

  if (item.quantity <= 0) {
    setMessage(`${item.name} is out of stock. Please choose another item.`, "error");
    return;
  }

  if (quantity > item.quantity) {
    setMessage(
      `Only ${item.quantity} unit(s) of ${item.name} are available. Please reduce the quantity.`,
      "error"
    );
    return;
  }

  const totalPrice = Number((item.price * quantity).toFixed(2));

  if (state.balance < totalPrice) {
    const shortfall = Number((totalPrice - state.balance).toFixed(2));
    setMessage(
      `Insufficient balance for ${quantity} x ${item.name}. Please add ${formatCurrency(shortfall)} more.`,
      "error"
    );
    return;
  }

  item.quantity -= quantity;
  state.balance = Number((state.balance - totalPrice).toFixed(2));
  state.purchases.push({
    code: item.code,
    name: item.name,
    price: totalPrice,
    quantity
  });
  itemInput.value = "";
  quantityInput.value = "1";
  syncUi();

  setMessage(
    `Dispensing ${quantity} x ${item.name}. Remaining balance: ${formatCurrency(state.balance)}.`,
    "success"
  );
}

function cancelTransaction() {
  if (state.balance <= 0 && state.purchases.length === 0) {
    setMessage("There is no balance or purchase to refund.", "info");
    return;
  }

  const purchaseRefund = state.purchases.reduce((total, purchase) => total + purchase.price, 0);
  const totalRefund = Number((state.balance + purchaseRefund).toFixed(2));

  state.purchases.forEach((purchase) => {
    const item = state.items.find((product) => product.code === purchase.code);

    if (item) {
      item.quantity += purchase.quantity || 1;
    }
  });

  state.balance = totalRefund;
  state.purchases = [];
  itemInput.value = "";
  quantityInput.value = "1";
  syncUi();

  setMessage(
    `Transaction canceled. ${formatCurrency(totalRefund)} has been restored to your balance and purchased items were returned to stock.`,
    "success"
  );
}

function resetMachine() {
  state = createDefaultState();
  itemInput.value = "";
  quantityInput.value = "1";
  syncUi();
  setMessage("Machine reset to default inventory and zero balance.", "info");
}

moneyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addMoney(Number(button.dataset.amount));
  });
});

purchaseButton.addEventListener("click", purchaseItem);
cancelButton.addEventListener("click", cancelTransaction);
resetButton.addEventListener("click", resetMachine);

itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    purchaseItem();
  }
});

syncUi();
