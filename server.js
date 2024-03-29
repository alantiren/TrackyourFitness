// server.js
// Import required modules
const express = require('express');
const logger = require('morgan');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const { Workout, connect } = require('./models/workout'); // Import Workout model and connect function

// Create Express application instance
const app = express();

// File to load the environment variables from the .env file:
require('dotenv').config();

// Deployment errors to Render, caused me to put the schema files and server connections in the same Javascript
// file, otherwise it does not work not Render. The reason still remains unknown for now, but 
// the best solution I can provide is to put schema and routes into this server main file. 

// Originally, 
// api handlers should be stored in ./routes/api-routes.js
// html handlers should be stored in ./routes/html-routes.js

// I will convert the directory structure into best practice once I figure out the reason behind the crashes on Render.

// Express middlewares start here
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

// MongoDB connection URI
const uri = "mongodb+srv://alantiren76:TWBzluQcVhnKZnju@cluster0.lmj84nq.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useUnifiedTopology: true
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db(); // Get the database

    // Define API routes for CRUD operations on workout data
    app.get('/api/workouts', async (req, res) => {
      // Handles GET request for all workouts
      const result = await db.collection('workouts').find({}).toArray();
      res.json(result);
    });

    app.get('/api/workouts/range', async (req, res) => {
      // Handles GET request for workouts within a specific range
      await db.collection('workouts').deleteMany({ 'totalDuration': 0 });
      await db.collection('workouts').deleteMany({ 'exercises': { $elemMatch: { 'duration': 0 } } });
      const result = await db.collection('workouts').find({}).sort({ day: -1 }).limit(7).toArray();
      const reverse = result.reverse();
      res.json(reverse);
    });

    app.post('/api/workouts', async (req, res) => {
      try {
        // Get the date of the last workout
        const lastWorkout = await db.collection('workouts').findOne({}, { sort: { day: -1 } });
        const lastWorkoutDate = lastWorkout ? new Date(lastWorkout.day) : new Date();
    
        // Create a new workout with the appropriate date
        const newWorkout = await db.collection('workouts').insertOne({ day: lastWorkoutDate, exercises: [] });
    
        res.json(newWorkout.ops[0]);
      } catch (error) {
        console.error('Error creating new workout:', error);
        res.status(500).json({ error: 'An error occurred while creating a new workout.' });
      }
    });

    app.put('/api/workouts/:id', async (req, res) => {
      // Handles PUT request to update an existing workout
      const id = req.params.id;
      const data = req.body;
      const duration = data.duration;
      const workout = await db.collection('workouts').findOneAndUpdate(
        { _id: ObjectId(id) }, // Use ObjectId here
        {
          $push: { exercises: data },
          $inc: { totalDuration: duration }
        },
        { returnOriginal: false }
      );
      res.json(workout.value);
    });

    // Define route to clear all data from the collection
    app.delete('/api/workouts', async (req, res) => {
      try {
        const result = await db.collection('workouts').deleteMany({});
        res.json({ message: 'All data cleared successfully.' });
      } catch (error) {
        console.error('Error clearing data:', error);
        res.status(500).json({ error: 'An error occurred while clearing data.' });
      }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Call the function to start the server
startServer();
