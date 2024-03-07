// Import necessary dependencies
const mongodb = require('mongodb');
const { MongoClient } = mongodb;

// Define MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/workout';

// Create a new MongoClient
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB using the MongoClient
client.connect()
  .then(async () => {
    console.log("Connected to MongoDB");

    // Define schema for workout data
    const WorkoutSchema = {
      day: {
        type: Date,
        default: new Date()
      },
      totalDuration: {
        type: Number,
        default: 0
      },
      exercises: [{
        type: {
          type: String,
          enum: ['resistance', 'cardio']
        },
        name: {
          type: String,
          trim: true
        },
        distance: Number,
        duration: Number,
        weight: Number,
        reps: Number,
        sets: Number
      }]
    };

    // Define model based on the schema
    const workoutCollection = client.db().collection('workout');

    // Export the model
    module.exports = workoutCollection;

    // Use the model as needed
    const lastWorkout = await workoutCollection.findOne({}); // Example usage

    console.log("Last workout:", lastWorkout);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
