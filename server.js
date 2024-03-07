// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// Create Express application instance
const app = express();
const Schema = mongoose.Schema;

// Load environment variables from .env file
require('dotenv').config();

// Deployment errors  to Render, caused me to put the schema files and server connections in the same Javascript
// file, otherwise it does not work not Render. The reason still remains unknown for now, but 
// the best solution I can provide is to put schema and routes into this server main file. 

// Originally, 
// schema should be stored in ./models/workout.js
// api handlers should be stored in ./routes/api-routes.js
// html handlers should be stored in ./routes/html-routes.js

// I will convert the directory structure into best practice once I figure out the reason behind the crashes on Render.

// MongoDB schema definition
// Defines the schema for the workout data to be stored in MongoDB
const WorkoutSchema = new Schema({
  // Schema fields for workout data
  day: {
    type: Date,
    default: Date.now
  },

  totalDuration: {
    type: Number,
    default: 0
  },

  exercises: [
    {
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
    }
  ]
});

// Create a MongoDB model based on the schema
const Workout = mongoose.model('workout', WorkoutSchema);
// MongoDB schema ends here

// Express middlewares starts here
// Configures middleware for logging, parsing request bodies, and serving static files
app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Define routes for handling exercise and stats pages
app.get('/exercise', (req, res) => {
  // Sends the exercise page to the client
  res.sendFile(path.join(__dirname, 'public/exercise.html'));
});

app.get('/stats', (req, res) => {
  // Sends the stats page to the client
  res.sendFile(path.join(__dirname, 'public/stats.html'));
});

// Define API routes for CRUD operations on workout data
app.get('/api/workouts', async (req, res) => {
  // Handles GET request for all workouts
  const result = await Workout.find({});
  res.json(result);
});

app.get('/api/workouts/range', async (req, res) => {
  // Handles GET request for workouts within a specific range
  await Workout.deleteMany({'totalDuration': 0}); 
  await Workout.deleteMany({'exercises': {$elemMatch: {'duration': 0}}});
  const result = await Workout.find({}).sort({day: -1}).limit(7);
  const reverse = result.reverse();
  res.json(reverse);
});

app.post('/api/workouts', async (req, res) => {
  // Handles POST request to create a new workout
  const result = await Workout.create({});
  res.json(result);
});

app.put('/api/workouts/:id', async (req, res) => {
  // Handles PUT request to update an existing workout
  const id = req.params.id;
  const data = req.body;
  const duration = data.duration;
  const workout = await Workout.findOneAndUpdate(
    { _id: id },
    {
      $push: { exercises: data },
      $inc: { totalDuration: duration}
    },
    {new: true}
  );
  const result = await workout.save();
  res.json(result);
});
// Express middlewares ends here

// Server set up starts here
const mongoParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

// MongoDB connection setup
// Connects to MongoDB database using Mongoose
mongoose.connect(process.env.MONGODB_URI, mongoParams)
  .then(() => {
    // Start the server once connected to MongoDB
    const PORT = process.env.PORT || 27017;
    app.listen(PORT, () => {
      console.log(`==> 🌎  Listening on port ${PORT}. Visit http://localhost:${PORT} in your browser.`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Other middleware and route handlers
// ...

// Export the Express app
module.exports = app;
