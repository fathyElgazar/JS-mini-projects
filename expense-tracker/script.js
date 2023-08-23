const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

const localStorageTransaction = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransaction : [];

// Add transaction to DOM
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount ;)");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }
}

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add item to the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  
  `;

  list.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
  const amount = transactions.map((transaction) => transaction.amount);

  const total = amount.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amount
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amount.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  moneyMinus.innerText = `$${expense}`;
  moneyPlus.innerText = `$${income}`;
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Init app
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
