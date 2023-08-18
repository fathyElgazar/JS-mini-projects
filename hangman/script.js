const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

const words = ["programming", "software", "application", "interface"];
let selectedWord = words[Math.floor(Math.random() * words.length)];

let correctLetters = [];
let wrongLetters = [];

// Show hidden word
function displayWord() {
  wordEl.innerHTML = `
  ${selectedWord
    .split("")
    .map(
      (letter) =>
        `
      <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
      </span>
      `
    )
    .join("")}
  `;
  const innerWord = wordEl.innerText.replaceAll("\n", "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You Won! 🥳";
    setTimeout(() => (popup.style.display = "flex"), 0.5 * 1000);
  }
}

// wrong letters
function updateWrongLetterEl() {
  // display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const error = wrongLetters.length;
    if (index < error) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // chick lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Sorry for your lost. 😕";
    setTimeout(() => (popup.style.display = "flex"), 0.5 * 1000);
  }
}

// show Notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 2 * 1000);
}

// Keydown letter press
window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLetterEl();
      } else {
        showNotification();
      }
    }
  }
});

// Restart game
playAgainBtn.addEventListener("click", () => {
  // window.location.reload();
  correctLetters.splice(0);
  wrongLetters.splice(0);
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();
  updateWrongLetterEl();
  popup.style.display = "none";
});

displayWord();
