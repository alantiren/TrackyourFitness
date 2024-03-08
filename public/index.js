// public/index.js

init();

async function init() {
  if (location.search.split("=")[1] === undefined) {
    const workout = await API.getLastWorkout();
    if (workout) {
      location.search = "?id=" + workout._id;
    } else {
      document.querySelector("#continue-btn").classList.add("d-none")
    }
  }
  
  // Add event listener for the clear button
  const clearDataBtn = document.getElementById('clearDataBtn');
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/workouts', {
          method: 'DELETE'
        });
        if (response.ok) {
          const data = await response.json();
          alert(data.message); // Show success message
        } else {
          throw new Error('Failed to clear data');
        }
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('An error occurred while clearing data.');
      }
    });
  }
}

//toggle the visibility of the contact information when the button is clicked
document.addEventListener("DOMContentLoaded", function () {
  const toggleContactBtn = document.getElementById("toggleContactBtn");
  const contactInfo = document.getElementById("contactInfo");

  toggleContactBtn.addEventListener("click", function () {
    if (contactInfo.style.display === "none") {
      contactInfo.style.display = "block";
      toggleContactBtn.textContent = "Hide Contact";
    } else {
      contactInfo.style.display = "none";
      toggleContactBtn.textContent = "Contact Us";
    }
  });
});
