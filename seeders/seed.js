// Require necessary dependencies and models
const mongodb = require('mongodb');
const { MongoClient } = mongodb;
const db = require("../models");

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/workout';

// Create a new MongoClient
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB using the MongoClient
client.connect()
  .then(async () => {
    console.log("Connected to MongoDB");

    // Array of workout seed data
    let workoutSeed = [
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
        totalDuration: 20 // Total duration of the workout
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

    // Delete existing workout data from the database, then insert the seed data
    db.workout.deleteMany({})
      .then(() => db.workout.insertMany(workoutSeed))
      .then(data => {
        console.log(data.result.n + " records inserted!"); // Log the number of records inserted
        process.exit(0); // Exit the process with success status
      })
      .catch(err => {
        console.error(err); // Log any errors that occur during the process
        process.exit(1); // Exit the process with error status
      });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with error status
  });
