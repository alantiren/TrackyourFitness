// Import required modules
const express = require('express');
const logger = require('morgan');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jwt for generating tokens
const authMiddleware = require('./authMiddleware'); // Import authentication middleware
const authRoutes = require('./authRoutes'); // Import authentication routes
const User = require('./models/user'); // Import the User model

// Create Express application instance
const app = express();

// File to load the environment variables from the .env file:
require('dotenv').config();

// Deployment errors to Render, caused me to put the schema files and server connections in the same Javascript
// file, otherwise it does not work not Render. The reason still remains unknown for now, but 
// the best solution I can provide is to put schema and routes into this server main file. 

// Originally, 
// schema should be stored in ./models/workout.js
// api handlers should be stored in ./routes/api-routes.js
// html handlers should be stored in ./routes/html-routes.js

// I will convert the directory structure into best practice once I figure out the reason behind the crashes on Render.

// MongoDB schema definition
// Defines the schema for the workout data to be stored in MongoDB

// Express middlewares start here
// Configures middleware for logging, parsing request bodies, and serving static files
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Include authentication routes
app.use('/auth', authRoutes);

// Apply authentication middleware to routes that require authentication
app.use('/api', authMiddleware);

// Define routes for handling login and signup
app.get('/login', (req, res) => {
  // Sends the login page to the client
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/signup', (req, res) => {
  // Sends the signup page to the client
  res.sendFile(path.join(__dirname, 'public/signup.html'));
});

// Define POST route for user signup
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up.' });
  }
});

// Define POST route for user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
});

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
      // Handles POST request to create a new workout
      const result = await db.collection('workouts').insertOne({});
      res.json(result.ops[0]);
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
