// models/workout.js
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://alantiren76:TWBzluQcVhnKZnju@cluster0.lmj84nq.mongodb.net/";
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Connect to the MongoDB server
async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Define the Workout model
const Workout = {
  // Method to find workouts
  async find() {
    try {
      const db = client.db();
      const workouts = await db.collection('workouts').find({}).toArray();
      return workouts;
    } catch (error) {
      console.error("Error finding workouts:", error);
      throw error;
    }
  },

  // Method to save a new workout
  async save(workout) {
    try {
      const db = client.db();
      const result = await db.collection('workouts').insertOne(workout);
      return result.ops[0];
    } catch (error) {
      console.error("Error saving workout:", error);
      throw error;
    }
  },

  // Method to find the last workout
  async findLastWorkout() {
    try {
      const db = client.db();
      const lastWorkout = await db.collection('workouts').find().sort({ day: -1 }).limit(1).toArray();
      return lastWorkout.length > 0 ? lastWorkout[0].day : new Date(); // Return the date of the last workout or current date
    } catch (error) {
      console.error("Error finding last workout:", error);
      throw error;
    }
  },

  // Method to find and update a workout by ID
  async findByIdAndUpdate(id, data) {
    try {
      const db = client.db();
      const workout = await db.collection('workouts').findOneAndUpdate(
        { _id: ObjectId(id) },
        { $push: { exercises: data } },
        { returnOriginal: false }
      );
      return workout.value;
    } catch (error) {
      console.error("Error updating workout:", error);
      throw error;
    }
  },

  // Method to delete all workouts
  async deleteMany() {
    try {
      const db = client.db();
      const result = await db.collection('workouts').deleteMany({});
      return result.deletedCount;
    } catch (error) {
      console.error("Error deleting workouts:", error);
      throw error;
    }
  }
};

module.exports = { Workout, connect };
