// Initialize the page
init();

// Function to initialize the page
async function init() {
  // Check if there is an ID in the URL query parameter
  if (location.search.split("=")[1] === undefined) {
    // If no ID is found, fetch the last workout
    const workout = await API.getLastWorkout();
    // If a workout is found, redirect to its ID page
    if (workout) {
      location.search = "?id=" + workout._id;
    } else {
      // If no workout is found, hide the continue button
      document.querySelector("#continue-btn").classList.add("d-none")
    }
  }
}
