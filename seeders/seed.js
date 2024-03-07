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
