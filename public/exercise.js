// Selecting DOM elements
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
const newWorkout = document.querySelector(".new-workout")

// Initialize exercise
let workoutType = null;
let shouldNavigateAway = false;

async function initExercise() {
  console.log(`Function: initExercise called...`);
  let workout;

  // If workout ID is not provided in the URL, create a new workout
  if (location.search.split("=")[1] === undefined) {
    workout = await API.createWorkout()
    console.log(workout)
  }
  // Redirect to the newly created workout's page
  if (workout) {
    location.search = "?id=" + workout._id;
  }
}

initExercise();

// Event listener for workout type change
function handleWorkoutTypeChange(event) {
  workoutType = event.target.value;

  // Show respective forms based on workout type selected
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

  // Validate inputs based on selected workout type
  validateInputs();
}

// Validate inputs based on selected workout type
function validateInputs() {
  let isValid = true;

  if (workoutType === "resistance") {
    if (nameInput.value.trim() === "") {
      isValid = false;
    }
    // Validate other resistance inputs...
  } else if (workoutType === "cardio") {
    if (cardioNameInput.value.trim() === "") {
      isValid = false;
    }
    // Validate other cardio inputs...
  }

  // Enable/disable buttons based on input validation
  if (isValid) {
    completeButton.removeAttribute("disabled");
    addButton.removeAttribute("disabled");
  } else {
    completeButton.setAttribute("disabled", true);
    addButton.setAttribute("disabled", true);
  }
}

// Handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  let workoutData = {};

  // Prepare workout data based on selected workout type
  if (workoutType === "cardio") {
    // Construct cardio workout data...
  } else if (workoutType === "resistance") {
    // Construct resistance workout data...
  }

  // Add exercise to the workout
  await API.addExercise(workoutData);
  clearInputs();
  toast.classList.add("success");
}

// Handle toast animation end
function handleToastAnimationEnd() {
  toast.removeAttribute("class");
  if (shouldNavigateAway) {
    location.href = "/";
  }
}

// Clear input fields
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
  completeButton.addEventListener("click", function (event) {
    shouldNavigateAway = true;
    handleFormSubmit(event);
  });
}
if (addButton) {
  addButton.addEventListener("click", handleFormSubmit);
}
toast.addEventListener("animationend", handleToastAnimationEnd);

document
  .querySelectorAll("input")
  .forEach(element => element.addEventListener("input", validateInputs));
