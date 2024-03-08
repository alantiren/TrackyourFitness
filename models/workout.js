//models/workout.js
// Define the schema for the Workout model
const workoutSchema = {
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [{
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    weight: {
      type: Number
    },
    reps: {
      type: Number
    },
    sets: {
      type: Number
    },
    distance: {
      type: Number
    }
  }],
  totalDuration: {
    type: Number,
    default: 0
  }
};

module.exports = workoutSchema;
