//seed.js

// Import required modules
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

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

async function run() {
  try {
    // Connect the client to the server  (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db(); // Get the database

    try {

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

      // Define seed data for users
      const userSeed = [
        {
          username: 'user1',
          email: 'user1@example.com',
          // Hashed password for "password123"
          password: await bcrypt.hash('password123', 10)
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          // Hashed password for "password456"
          password: await bcrypt.hash('password456', 10)
        }
        // Add more user data as needed
      ];

      // Clear existing workout data
      await db.collection('workouts').deleteMany({});
      // Clear existing user data
      await db.collection('users').deleteMany({});

      // Insert seed data into the database
      await db.collection('workouts').insertMany(workoutSeed);
      await db.collection('users').insertMany(userSeed);

      // Log the number of records inserted
      console.log(workoutSeed.length + " workout records inserted!");
      console.log(userSeed.length + " user records inserted!");

      // Exit the process with a success status code
      process.exit(0);
    } catch (err) {
      // Log any errors that occur during the seeding process
      console.error('Error seeding data:', err);
      // Exit the process with an error status code
      process.exit(1);
    }
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}

// Call the function to seed the database
run().catch(console.dir);
