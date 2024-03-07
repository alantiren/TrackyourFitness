const mongoose = require('mongoose');

// Define schema for the Workout model
const workoutSchema = new mongoose.Schema({
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
});

// Calculate total duration before saving
workoutSchema.pre('save', function(next) {
  this.totalDuration = this.exercises.reduce((total, exercise) => {
    return total + exercise.duration;
  }, 0);
  next();
});

// Create Workout model based on the schema
const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
