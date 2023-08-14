"use strict";

///////////////////////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScroll = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navHeigh = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll(".section");
const images = document.querySelectorAll("img[data-src]");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////
// Implementing smooth btn scrolling

btnScroll.addEventListener("click", function (e) {
  // the coordinates of the section : it's relative to the viewport
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log("----------------------");
  console.log(e.target.getBoundingClientRect());

  // How many pixels you scrolled
  console.log("current scroll (x/y)", window.pageXOffset, window.pageYOffset);

  // the height and width of current viewport
  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  // 1 ) old school one : add the coordinates to the pixels you have scrolled to work right
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // to implement smooth in the old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // the MODERN way
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////
// Page Navigation => Event Delegation

/* document.querySelectorAll(".nav__link").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    const id = this.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
}); */

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////////////////////////////////
// Tapped Component

tabsContainer.addEventListener("click", function (e) {
  // e.preventDefault();

  // we made this solution to solve the span element when we click on it .. we click on the span so the target will be the span but we want the tap itself .. so we use this method
  const clicked = e.target.closest(".operations__tab");

  // Guard Clause
  if (!clicked) return;

  //   clearing Active classes  tab and content area
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabContent.forEach((c) => c.classList.remove("operations__content--active"));

  //Active Tap
  clicked.classList.add("operations__tab--active");

  // Activate content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////////////////////////////////////
// menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing "argument" to the event handler
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////

// Sticky Navigation : using scroll event is NOT a good way for performance

/* const initialCoords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
  if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}); */

// Sticky Navigation : using Intersection Observer API
/* const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0,0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */

function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const newHeaderObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeigh}px`,
});
newHeaderObserver.observe(header);

//////////////////////////////////////
// reveal section on scroll

function obsSectionsCallback(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}
const obsSectionReveal = new IntersectionObserver(obsSectionsCallback, {
  root: null,
  threshold: 0.15,
});

sections.forEach(function (section) {
  obsSectionReveal.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////////
// Lazy loading images

function loadImg(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

images.forEach((img) => imgObserver.observe(img));

//////////////////////////////////////
// Building a Slider component

// Slider
function slider() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // FUNCTIONS
  function createDots() {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activeDots(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add("dots__dot--active");
  }

  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  // Next slide

  function nextSlide() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  }

  function prevSlide() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  }

  function init() {
    createDots();
    goToSlide(0);
    activeDots(0);
  }

  init();

  // Event Handler
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDots(slide);
    }
  });
}
slider();
/////////////////////////////////////

/*
// Selecting & Creating and Deleting Elements

// selecting
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(".header");

const allSections = document.querySelectorAll(".section"); // Return Node List
console.log(allSections);

document.getElementById("section--1");

const allBtn = document.getElementsByTagName("button"); // Return HTML Collection
console.log(allBtn);

console.log(document.getElementsByClassName("btn"));

// Creating and inserting Elements
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  "We use cookies to improve functionality. <button class='btn btn--close-cookie'>Got it</button>";

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message)
// header.after(message)

// Delete Elements
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
    // message.parentElement.removeChild(message);
  });

// style
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 60 + "px";

console.log(getComputedStyle(message).height);

// we used getComputedStyle because that's the property that we didn't set our self using .style.. so .style only work with the property that she added

// custom property
document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
console.log(logo.className);
console.log(logo.alt);

// non-standard
console.log(logo.designer);
console.log(logo.getAttribute("designer"));
logo.setAttribute("company", "BANKIST");

// LINKS AND src
const link = document.querySelector(".nav__link--btn");
console.log(link.href); // the absolute value
console.log(link.getAttribute("href")); // the relative value

console.log(logo.src); // the absolute
console.log(logo.getAttribute("src")); // the relative

// Data Attributes
console.log(logo.dataset.versionNumber); // IT MUST start with "data" we use kamelCAse here instead of - .. stored in dataset Object

// Classes
logo.classList.add("c", "g");
logo.classList.remove("c");
logo.classList.toggle("c");
logo.classList.contains("g");

// don't use this : because it will override the all existing classes
logo.className = "fathy";
*/

/*
// Types of  Events and Event handlers

const h1 = document.querySelector("h1");

const alertH1 = function (e) {
  alert("addEventListener: Great! You are reading the Heading.");
};

h1.addEventListener("mouseenter", alertH1);

// the good about addEventListener is that we can pass multiple events and also we can stop the event..

setTimeout(
  () => h1.removeEventListener("mouseenter", alertH1),

  5000
);

// old way .. for every event there's a one like this
// h1.onmouseenter = function (e) {
//   alert("onmouseenter: Great! You are reading the Heading.");
// };

// Event propagation in practice

// rgb(255,255,255)
const randomInt = (min, max) => Math.floor(Math.random() * max - min + 1) + min;

const randomColor = () =>
`rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target, e.currentTarget);
  console.log(e.currentTarget === this);
  
  // stop propagation
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("Container", e.target, e.currentTarget);
  // e.stopPropagation();
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("Nav", e.target, e.currentTarget);
});


// DOM Traversing : walking in the document

const h1 = document.querySelector("h1");

// Going downwards : Child
console.log(h1.querySelectorAll(".highlight")); // all level deep down
console.log(h1.childNodes); // node // direct children
console.log(h1.children); // html collection // direct children
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "orangered";

// Going upwards : Parents
console.log(h1.parentElement); // node
console.log(h1.parentNode); // node

// for parent element no matter how far it.. NOT direct parent
h1.closest(".header").style.background = "var(--gradient-secondary)";
h1.closest("h1").style.background = "var(--gradient-primary)";

// Going sideways = Siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// all the siblings
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});
*/
// Dom lifeCycle

//1) when the HTML is loaded
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM built.!", e);
});

//2) when every thing is loaded "html and imgs"
window.addEventListener("load", function (e) {
  console.log("Finished", e);
});

//3) when someone is about to leave the page

/* window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
}); */
