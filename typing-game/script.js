const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

// List of words for game
const words = [
  "sigh",
  "tense",
  "airplane",
  "ball",
  "pies",
  "juice",
  "warlike",
  "bad",
  "north",
  "dependent",
  "steer",
  "silver",
  "highfalutin",
  "superficial",
  "quince",
  "eight",
  "feeble",
  "admit",
  "drag",
  "loving",
];

// Init word
let randomWord;

// Init Score
let score = 0;

// Init time
let time = 10;

// Init difficulty
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

// Focus text on start
text.focus();

// Time count down
const timeInterval = setInterval(() => updateTime(), 1000);

// Get Random word from Array
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Add word to DOM
function addWordToDom() {
  randomWord = getRandomWord();
  word.innerText = randomWord;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerText = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);

    // end game
    gameOver();
  }
}

// End game, show modal
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;
  endgameEl.style.display = "flex";
}

addWordToDom();

// Event listener
// Typing
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;

  if (insertedText === randomWord) {
    addWordToDom();
    e.target.value = "";
    score++;
    scoreEl.innerText = score;

    if (difficulty === "hard") {
      time += 2;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 5;
    }

    updateTime();
  }
});

// Setting btn click
settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));

// Difficulty Change
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});
