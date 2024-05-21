const btnOpen = document.getElementById("btn");
const navList = document.querySelector(".menu-items-container");
const nav = document.querySelector(".nav");

function showNav(container) {
  container.classList.add("visible");
}

function hideNav(container) {
  container.classList.remove("visible");
}

btnOpen.addEventListener("mouseenter", () => {
  showNav(navList);
});

navList.addEventListener("mouseleave", () => {
  hideNav(navList);
});

// To hide the container after the mouse leaves the whole nav
nav.addEventListener("mouseleave", () => {
  hideNav(navList);
});
