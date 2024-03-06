// This function initializes the workout page by fetching the last workout from the database
async function initWorkout() {
  // Fetch the last workout from the database
  const lastWorkout = await API.getLastWorkout();
  console.log("Last workout:", lastWorkout);
  
  // If a last workout exists
  if (lastWorkout) {
    // Set the link to the exercise page with the ID of the last workout
    document.querySelector("a[href='/exercise?']").setAttribute("href", `/exercise?id=${lastWorkout._id}`);

    // Create a workout summary object
    const workoutSummary = {
      date: formatDate(lastWorkout.day), // Format the date of the last workout
      totalDuration: lastWorkout.totalDuration, // Total duration of the last workout
      numExercises: lastWorkout.exercises.length, // Number of exercises performed
      ...tallyExercises(lastWorkout.exercises) // Tally the exercises (total weight, sets, reps, distance)
    };

    // Render the workout summary
    renderWorkoutSummary(workoutSummary);
  } else {
    // If no last workout exists, render a message indicating no workout has been created yet
    renderNoWorkoutText()
  }
}

// Tally the exercises based on type (resistance or cardio)
function tallyExercises(exercises) {
  // Reduce the array of exercises to compute totals
  const tallied = exercises.reduce((acc, curr) => {
    if (curr.type === "resistance") {
      // If the exercise is resistance, tally weight, sets, and reps
      acc.totalWeight = (acc.totalWeight || 0) + curr.weight;
      acc.totalSets = (acc.totalSets || 0) + curr.sets;
      acc.totalReps = (acc.totalReps || 0) + curr.reps;
    } else if (curr.type === "cardio") {
      // If the exercise is cardio, tally distance
      acc.totalDistance = (acc.totalDistance || 0) + curr.distance;
    }
    return acc;
  }, {});
  return tallied;
}

// Format the date using options for weekday, year, month, and day
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return new Date(date).toLocaleDateString(options);
}

// Render the workout summary by populating the container with key-value pairs
function renderWorkoutSummary(summary) {
  const container = document.querySelector(".workout-stats");

  // Map keys to user-friendly labels
  const workoutKeyMap = {
    date: "Date",
    totalDuration: "Total Workout Duration",
    numExercises: "Exercises Performed",
    totalWeight: "Total Weight Lifted",
    totalSets: "Total Sets Performed",
    totalReps: "Total Reps Performed",
    totalDistance: "Total Distance Covered"
  };

  // Iterate through the summary object keys
  Object.keys(summary).forEach(key => {
    // Create a paragraph element and a strong element
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    // Set the strong element text content to the corresponding label
    strong.textContent = workoutKeyMap[key];

    // Create a text node with the summary value
    const textNode = document.createTextNode(`: ${summary[key]}`);

    // Append the strong and text node to the paragraph element
    p.appendChild(strong);
    p.appendChild(textNode);

    // Append the paragraph element to the container
    container.appendChild(p);
  });
}

// Render a message indicating no workout has been created yet
function renderNoWorkoutText() {
  const container = document.querySelector(".workout-stats");
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "You have not created a workout yet!"

  p.appendChild(strong);
  container.appendChild(p);
}

// Initialize the workout page
initWorkout();
