"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Fathy Sameh",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2023-06-15T23:36:17.929Z",
    "2023-06-18T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "de-DE", // de-DE
};

const account2 = {
  owner: "Zaki Abdelmenem",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

function formatMovementsDates(date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);

    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
}

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDates(date, acc.locale);

    const formatNumbers = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatNumbers}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const setLogOutTimer = function () {
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
let currentAccount, timer;

// Event handlers

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // create current Dates
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = setLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toDateString());

    // Update UI
    updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = setLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add Dates
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // reset timer
      clearInterval(timer);
      timer = setLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* // js Treat normal number and decimal number as there are the same
console.log(12 === 12.0);

// js use base 2 "Binary".. so it can NOT represent some simple fraction like this and gave weird result
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); // false

// parsing
// 1) parseInt()
console.log(Number.parseInt("20px", 10));
console.log(Number.parseInt("e30", 10)); // NaN
console.log(Number.parseInt(2.4));

// 2) parseFloat()
console.log(Number.parseFloat("2.4"));
console.log(Number.parseFloat("3.5rem"));

// check if a value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN("20")); // false
console.log(Number.isNaN(+"20x"));
console.log(Number.isNaN(20 / 0)); // return false because it's infinity NOT a NaN

// check if a value is a number "Best way to check"
console.log(Number.isFinite(20));
console.log(Number.isFinite("20")); // false
console.log(Number.isFinite(+"20"));
console.log(Number.isFinite(20 / 0)); // return false because already finite !==  infinity

// check if a value is an integer
console.log(Number.isInteger(20));
console.log(Number.isInteger("20"));
console.log(Number.isInteger(2.0)); // true
console.log(Number.isInteger(2.5)); // false

console.log(Math.max(1, 3, 4, 5, 6, 33, 50, 90));
console.log(Math.max(1, 3, 4, 5, 6, 33, 50, "90"));
console.log(Math.max(1, 3, 4, 5, 6, 33, 50, "90px"));

console.log(Math.min(1, 3, 4, 5, 6, 33, 50, 90));
console.log(Math.min(1, 3, 4, 5, 6, 33, 50, "90"));
console.log(Math.min(1, 3, 4, 5, 6, 33, 50, "90px"));

// some constant
console.log(Math.PI * Number.parseFloat("10") ** 2);
console.log("-----------------------");

// Make random Number in a specific range
const random = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;

console.log(random(10, 20));
console.log(random(30, 25));
console.log(random(5, 10));
console.log("-----------------------");

// rounding integers
console.log(Math.round(2.333));
console.log(Math.round(2.9));
console.log("-----------------------");
console.log(Math.ceil(2.3));
console.log(Math.ceil(2.9));
console.log("-----------------------");

console.log(Math.floor(2.9));
console.log(Math.floor(2.3));
console.log("-----------------------");

console.log(Math.trunc(2.9));

console.log(Math.trunc(-2.6)); // -2
console.log(Math.floor(-2.6)); // -3

// rounding decimal
console.log(+(2.4).toFixed(0));
console.log(+(2.4).toFixed(1)); // the 1 represent the number of  numbers after decimal point
console.log((2.43444).toFixed(8));
console.log(+(2.43444).toFixed(8));

// the reminder operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 +1

console.log(6 % 2);
console.log(6 / 2);

const isEven = (n) => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(199));
console.log(isEven(3403));
console.log(isEven(340));

labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = "orangered";
    if (i % 3 === 0) row.style.backgroundColor = "blue";
  });
});

// Numeric separator
// 234,345,600,000
const diameter = 234_345_600_000;
const price = 12_00;
const transferFee1 = 1_500;
const transferFee2 = 15_00;

const PI = 3.1415;
// All of these won't work ⬇
// const PI = _3.1415;
// const PI = 3.1415_;
// const PI = 3_.1415;
// const PI = 3._1415;
console.log(PI);

console.log(Number("234_000")); // Nan


// BigInt : js use 53bit to store the Number
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(845882983298329839283298392837n);
console.log(BigInt(747232));

// Operations
const huge = 84382389382983298398457n;
const normal = 274;
console.log(huge * BigInt(normal));
// console.log(Math.sqrt(huge));

// exceptions
console.log(20n > 4);
console.log(20n === 20);
console.log(20n == 20);
console.log(20n == "20");

console.log(`${huge} is a very BIG number`);

// Divisions
console.log(10n / 2n);
console.log(10n / 3n); // cut the decimal and return the closest BigInt
console.log(10 / 3);
*/

// Creating Dates

/* const now = new Date();
console.log(now);

console.log(account1.movementsDates[0]);

// timestamps : the number of milliseconds since 1970
console.log(new Date(0));
console.log(new Date(2003, 3, 24, 5, 30)); // the months is 0 based 

// working with Date
const birthDay = new Date(2003, 3, 24, 5, 30);
console.log(birthDay.getFullYear());
console.log(birthDay.getMonth());
console.log(birthDay.getDate()); // the day
console.log(birthDay.getDay()); // the day in a week
console.log(birthDay.getHours());
console.log(birthDay.getMinutes());
console.log(birthDay.getSeconds());
console.log(birthDay.toISOString());
console.log(birthDay.getTime()); // get the timestamps

console.log(new Date(1051155000000));

birthDay.setFullYear(2023);
console.log(birthDay);
*/

// operations with Date

/* const birthDay = new Date(2003, 3, 24, 5, 30);
console.log(birthDay.getTime());
console.log(+birthDay); // convert it to Number : get timestamps

const calcDayPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

console.log(calcDayPassed(new Date(2033, 10, 23), new Date(2033, 10, 13)));

const now = 2345453.422;

const option = {
  style: "unit",
  unit: "mile-per-hour",
};
console.log("US:", new Intl.NumberFormat("en-US", option).format(now));
console.log("Egypt:", new Intl.NumberFormat("ar-EG", option).format(now));
console.log("Germany:", new Intl.NumberFormat("de-DE", option).format(now));
console.log("Syria:", new Intl.NumberFormat("ar-SY", option).format(now));


// setTimeOut

const ingredients = ["olives", ""];

const timer = setTimeout(
  (ing1, ing2) => console.log(`Here's your pizza with ${ing1} and ${ing2} 🍕`),
  4000,
  ...ingredients
  );
  
  console.log("Waiting.....");
  
  // we can clear the settimeOut by doing this
  
  if (ingredients.includes("spinach")) clearTimeout(timer);
  
  // Important NOTEs: the execution doesNOT stop after it,, it simply continue like the "waiting message above"
  // another NOTE: any argument we pass after the time will a define we can use in the parameter
  
  // setInterval
  setInterval(function () {
    const now = new Date();
    console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
  }, 52000);
  
  */
