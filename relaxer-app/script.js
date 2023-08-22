const container = document.getElementById("container");
const text = document.getElementById("text");

const totalTime = 7500;
const breathTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

breathAnimation();

function breathAnimation() {
  container.className = "container grow";
  text.innerText = "Breath In!";
  setTimeout(() => {
    text.innerText = "Hold";

    setTimeout(() => {
      container.className = "container shrink";
      text.innerText = "Breath out!";
    }, holdTime);
  }, breathTime);
}

setInterval(() => {
  breathAnimation();
}, totalTime);
