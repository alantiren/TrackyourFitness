async function initWorkout() {
  try {
    const isAuthenticated = await checkAuthentication();
    const isAuthorized = await checkAuthorization();
  
    if (isAuthenticated && isAuthorized) {
      const lastWorkout = await API.getLastWorkout();
      console.log("Last workout:", lastWorkout);
      if (lastWorkout) {
        document
          .querySelector("a[href='/exercise?']")
          .setAttribute("href", `/exercise?id=${lastWorkout._id}`);
    
        const workoutSummary = {
          date: formatDate(lastWorkout.day),
          totalDuration: lastWorkout.totalDuration,
          numExercises: lastWorkout.exercises.length,
          ...tallyExercises(lastWorkout.exercises)
        };
    
        renderWorkoutSummary(workoutSummary);
      } else {
        renderNoWorkoutText()
      }
    } else {
      // Redirect to login or display unauthorized message
      window.location.href = "/login"; // Redirect to login page
      // Or display unauthorized message
    }
  } catch (error) {
    console.error('Error initializing workout:', error);
    // Handle error, display error message, or redirect to error page
  }
}

function tallyExercises(exercises) {
  const tallied = exercises.reduce((acc, curr) => {
    if (curr.type === "resistance") {
      acc.totalWeight = (acc.totalWeight || 0) + curr.weight;
      acc.totalSets = (acc.totalSets || 0) + curr.sets;
      acc.totalReps = (acc.totalReps || 0) + curr.reps;
    } else if (curr.type === "cardio") {
      acc.totalDistance = (acc.totalDistance || 0) + curr.distance;
    }
    return acc;
  }, {});
  return tallied;
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return new Date(date).toLocaleDateString(options);
}

function renderWorkoutSummary(summary) {
  const container = document.querySelector(".workout-stats");

  const workoutKeyMap = {
    date: "Date",
    totalDuration: "Total Workout Duration",
    numExercises: "Exercises Performed",
    totalWeight: "Total Weight Lifted",
    totalSets: "Total Sets Performed",
    totalReps: "Total Reps Performed",
    totalDistance: "Total Distance Covered"
  };

  Object.keys(summary).forEach(key => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = workoutKeyMap[key];
    const textNode = document.createTextNode(`: ${summary[key]}`);

    p.appendChild(strong);
    p.appendChild(textNode);

    container.appendChild(p);
  });
}

function renderNoWorkoutText() {
  const container = document.querySelector(".workout-stats");
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "You have not created a workout yet!"

  p.appendChild(strong);
  container.appendChild(p);
}

async function checkAuthentication() {
  // Implement authentication check logic here
  // Example:
  const response = await fetch('/api/authenticate', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Include any necessary authentication headers
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.isAuthenticated;
  } else {
    throw new Error('Authentication failed');
  }
}

async function checkAuthorization() {
  // Implement authorization check logic here
  // Example:
  const response = await fetch('/api/authorize', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Include any necessary authorization headers
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.isAuthorized;
  } else {
    throw new Error('Authorization failed');
  }
}

initWorkout();
