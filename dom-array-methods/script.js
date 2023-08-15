"use strict";
const main = document.getElementById("main");
const addUserBtn = document.getElementById("add-user");
const doubleMoneyBtn = document.getElementById("double");
const showMillionairesBtn = document.getElementById("show-millionaires");
const sortBtn = document.getElementById("sort");
const calculateWealthBtn = document.getElementById("calculate-wealth");

let data = [];

getRandomUser();
getRandomUser();
getRandomUser();

// fetch data
async function getRandomUser() {
  const res = await fetch("https://randomuser.me/api");
  const data = await res.json();
  console.log(data);

  const user = data.results[0];
  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000),
  };
  addData(newUser);
}

// add Data
function addData(obj) {
  data.push(obj);

  updateDOM();
}

// double money
function doubleMoney() {
  data = data.map((user) => {
    return { ...user, money: user.money * 2 };
  });
  updateDOM();
}

// sortByRichest
function sortByRichest() {
  data.sort((a, b) => b.money - a.money);
  updateDOM();
}

// show Millionaires
function showMillionaires() {
  data = data.filter((num) => num.money > 1000000);
  updateDOM();
}

// calculate Wealth
function calculateWealth() {
  const Wealth = data.reduce((acc, user) => (acc += user.money), 0);
  const WealthEl = document.createElement("div");
  WealthEl.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(
    Wealth
  )}</strong></h3>`;
  main.appendChild(WealthEl);
}

// update dom
function updateDOM(providedData = data) {
  // clear main
  main.innerHTML = "<h2><strong>Person</strong>Wealth</h2>";
  providedData.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("person");
    element.innerHTML = `<strong>${item.name}</strong>${formatMoney(
      item.money
    )}`;
    main.appendChild(element);
  });
}

// format money
function formatMoney(number) {
  return `$${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

// Events

addUserBtn.addEventListener("click", getRandomUser);
doubleMoneyBtn.addEventListener("click", doubleMoney);
sortBtn.addEventListener("click", sortByRichest);
showMillionairesBtn.addEventListener("click", showMillionaires);
calculateWealthBtn.addEventListener("click", calculateWealth);
