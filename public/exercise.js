const workoutTypeSelect = document.querySelector("#type");
const cardioForm = document.querySelector(".cardio-form");
const resistanceForm = document.querySelector(".resistance-form");
const cardioNameInput = document.querySelector("#cardio-name");
const nameInput = document.querySelector("#name");
const weightInput = document.querySelector("#weight");
const setsInput = document.querySelector("#sets");
const repsInput = document.querySelector("#reps");
const durationInput = document.querySelector("#duration");
const resistanceDurationInput = document.querySelector("#resistance-duration");
const distanceInput = document.querySelector("#distance");
const completeButton = document.querySelector("button.complete");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const newWorkout = document.querySelector(".new-workout");

let workoutType = null;
let shouldNavigateAway = false;

// Function to check if the user is authenticated
async function checkAuth() {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "same-origin",
    });
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

// Function to handle exercise initialization
async function initExercise() {
  console.log(`Function: initExercise called...`);
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    // Redirect to login page or display a message indicating the user is not logged in
    console.log("User is not authenticated. Redirecting to login page...");
    // Example: window.location.href = "/login";
    return;
  }
  let workout;

  if (location.search.split("=")[1] === undefined) {
    workout = await API.createWorkout();
    console.log(workout);
  }
  if (workout) {
    location.search = "?id=" + workout._id;
  }
}

// Function to handle change in workout type
function handleWorkoutTypeChange(event) {
  workoutType = event.target.value;

  if (workoutType === "cardio") {
    cardioForm.classList.remove("d-none");
    resistanceForm.classList.add("d-none");
  } else if (workoutType === "resistance") {
    resistanceForm.classList.remove("d-none");
    cardioForm.classList.add("d-none");
  } else {
    cardioForm.classList.add("d-none");
    resistanceForm.classList.add("d-none");
  }

  validateInputs();
}

// Function to validate input fields
function validateInputs() {
  let isValid = true;

  if (workoutType === "resistance") {
    if (nameInput.value.trim() === "") {
      isValid = false;
    }

    if (weightInput.value.trim() === "") {
      isValid = false;
    }

    if (setsInput.value.trim() === "") {
      isValid = false;
    }

    if (repsInput.value.trim() === "") {
      isValid = false;
    }

    if (resistanceDurationInput.value.trim() === "") {
      isValid = false;
    }
  } else if (workoutType === "cardio") {
    if (cardioNameInput.value.trim() === "") {
      isValid = false;
    }

    if (durationInput.value.trim() === "") {
      isValid = false;
    }

    if (distanceInput.value.trim() === "") {
      isValid = false;
    }
  }

  if (isValid) {
    completeButton.removeAttribute("disabled");
    addButton.removeAttribute("disabled");
  } else {
    completeButton.setAttribute("disabled", true);
    addButton.setAttribute("disabled", true);
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  let workoutData = {};

  if (workoutType === "cardio") {
    workoutData.type = "cardio";
    workoutData.name = cardioNameInput.value.trim();
    workoutData.distance = Number(distanceInput.value.trim());
    workoutData.duration = Number(durationInput.value.trim());
  } else if (workoutType === "resistance") {
    workoutData.type = "resistance";
    workoutData.name = nameInput.value.trim();
    workoutData.weight = Number(weightInput.value.trim());
    workoutData.sets = Number(setsInput.value.trim());
    workoutData.reps = Number(repsInput.value.trim());
    workoutData.duration = Number(resistanceDurationInput.value.trim());
  }

  await API.addExercise(workoutData);
  clearInputs();
  toast.classList.add("success");
}

// Function to handle animation end event of toast
function handleToastAnimationEnd() {
  toast.removeAttribute("class");
  if (shouldNavigateAway) {
    location.href = "/";
  }
}

// Function to clear input fields
function clearInputs() {
  cardioNameInput.value = "";
  nameInput.value = "";
  setsInput.value = "";
  distanceInput.value = "";
  durationInput.value = "";
  repsInput.value = "";
  resistanceDurationInput.value = "";
  weightInput.value = "";
}

// Event listeners
if (workoutTypeSelect) {
  workoutTypeSelect.addEventListener("change", handleWorkoutTypeChange);
}
if (completeButton) {
  completeButton.addEventListener("click", async function (event) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      // Redirect to login page or display a message indicating the user is not logged in
      console.log("User is not authenticated. Redirecting to login page...");
      // Example: window.location.href = "/login";
      return;
    }
    shouldNavigateAway = true;
    handleFormSubmit(event);
  });
}
if (addButton) {
  addButton.addEventListener("click", async function (event) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      // Redirect to login page or display a message indicating the user is not logged in
      console.log("User is not authenticated. Redirecting to login page...");
      // Example: window.location.href = "/login";
      return;
    }
    handleFormSubmit(event);
  });
}
toast.addEventListener("animationend", handleToastAnimationEnd);

document
  .querySelectorAll("input")
  .forEach((element) => element.addEventListener("input", validateInputs));
