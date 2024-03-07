// Import required modules
const MongoClient = require('mongodb').MongoClient;

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

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/workout';

// Create a new MongoClient
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
  
  console.log('Connected to MongoDB');

  const db = client.db();

  try {
    // Clear existing workout data
    await db.collection('workouts').deleteMany({});

    // Insert seed data into the database
    const result = await db.collection('workouts').insertMany(workoutSeed);
    
    // Log the number of records inserted
    console.log(result.insertedCount + " records inserted!");
    
    // Close the connection
    client.close();

    // Exit the process with a success status code
    process.exit(0);
  } catch (err) {
    // Log any errors that occur during the seeding process
    console.error('Error seeding data:', err);
    
    // Close the connection
    client.close();

    // Exit the process with an error status code
    process.exit(1);
  }
});
