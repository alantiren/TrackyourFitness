// Define seed data for workouts
const workoutSeed = [
  {
    day: new Date(new Date().setDate(new Date().getDate() - 10)),
    exercises: [
      {
        type: "resistance",
        name: "Bicep Curl",
        duration: 20,
        weight: 100,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 9)),
    exercises: [
      {
        type: "resistance",
        name: "Lateral Pull",
        duration: 20,
        weight: 300,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 8)),
    exercises: [
      {
        type: "resistance",
        name: "Push Press",
        duration: 25,
        weight: 185,
        reps: 8,
        sets: 4
      }
    ],
    totalDuration: 25
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 7)),
    exercises: [
      {
        type: "cardio",
        name: "Running",
        duration: 25,
        distance: 4
      }
    ],
    totalDuration: 25
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 6)),
    exercises: [
      {
        type: "resistance",
        name: "Bench Press",
        duration: 20,
        weight: 285,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 5)),
    exercises: [
      {
        type: "resistance",
        name: "Bench Press",
        duration: 20,
        weight: 300,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 4)),
    exercises: [
      {
        type: "resistance",
        name: "Quad Press",
        duration: 30,
        weight: 300,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 30
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 3)),
    exercises: [
      {
        type: "resistance",
        name: "Bench Press",
        duration: 20,
        weight: 300,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  },
  {
    day: new Date(new Date().setDate(new Date().getDate() - 2)),
    exercises: [
      {
        type: "resistance",
        name: "Military Press",
        duration: 20,
        weight: 300,
        reps: 10,
        sets: 4
      }
    ],
    totalDuration: 20
  }
];

// Import required modules
const mongoose = require("mongoose");
const Workout = require("../models/workout");

// Import the Workout model from the models directory

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/workout';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Event listener for successful MongoDB connection
mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing workout data
    await Workout.deleteMany({});

    // Insert seed data into the database
    const result = await Workout.collection.insertMany(workoutSeed);
    
    // Log the number of records inserted
    console.log(result.insertedCount + " records inserted!");
    
    // Exit the process with a success status code
    process.exit(0);
  } catch (err) {
    // Log any errors that occur during the seeding process
    console.error(err);
    
    // Exit the process with an error status code
    process.exit(1);
  }
});

// Event listener for MongoDB connection errors
mongoose.connection.on('error', (err) => {
  // Log the MongoDB connection error
  console.error('MongoDB connection error:', err);
  
  // Exit the process with an error status code
  process.exit(1);
});
