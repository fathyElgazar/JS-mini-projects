"use strict";
const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

const showError = (input, message) => {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
};

const showSuccess = (input) => {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
};

const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

const checkRequired =
  (...inputs) =>
  () => {
    const valid = Array(inputs.length).fill(false);
    inputs.forEach((input, index) => {
      if (input.value === "")
        showError(input, `${capitalize(input.id)} is required`);
      else {
        valid[index] = true;
        showSuccess(input);
      }
    });
    return valid.every((x) => x);
  };

const checkLength = (input, min, max) => () => {
  if (input.value.length < min) {
    showError(
      input,
      `${capitalize(input.id)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${capitalize(input.id)} must be less than ${max} characters`
    );
    return false;
  }
  return true;
};

const checkEmail = (email) => () => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email.value)) {
    showSuccess(email);
    return true;
  } else {
    showError(email, "Email is not valid");
    return false;
  }
};

const checkPasswordsMatch = (input1, input2) => () => {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords must match");
    return false;
  } else {
    [input1, input2].forEach(showSuccess);
    return true;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = [
    checkRequired(username, email, password, password2),
    checkLength(username, 3, 15),
    checkLength(password, 6, 25),
    checkEmail(email),
    checkPasswordsMatch(password, password2),
  ].every((check) => check());
  if (valid) {
    console.log("Register success", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
  }
});
