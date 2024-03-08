// test/backend/workout.test.js

const { Workout } = require('../../models/workout');

describe('Workout Model', () => {
  let mockDb;

  beforeAll(async () => {
    // Mock the database connection
    mockDb = {
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn().mockImplementation(data => ({
        ops: [{ _id: 'mockId', ...data }],
      })),
      find: jest.fn().mockReturnThis(),
      findOneAndUpdate: jest.fn().mockResolvedValue({ value: { _id: 'mockId', exercises: [] } }),
      deleteMany: jest.fn(),
      toArray: jest.fn(),
    };

    // Connect to the mock database
    Workout.client = {
      db: jest.fn().mockReturnValue(mockDb),
      close: jest.fn(),
    };

    await Workout.connect();
  });

  afterAll(async () => {
    // Clean up mock data and close the mock database connection
    await mockDb.collection('workouts').deleteMany({});
    await Workout.client.close();
  });

  it('should save a new workout', async () => {
    // Test logic for saving a new workout
    const workout = { date: new Date(), exercises: [] };
    const savedWorkout = await Workout.save(workout);
    expect(savedWorkout).toBeDefined();
    expect(savedWorkout._id).toBeDefined();
    expect(savedWorkout.date).toEqual(workout.date);
    expect(savedWorkout.exercises).toEqual(workout.exercises);
  });

  it('should find all workouts', async () => {
    // Test logic for finding all workouts
    await Workout.find();
    expect(mockDb.find).toHaveBeenCalledWith({});
  });

  it('should find the last workout', async () => {
    // Mock the last workout data
    const lastWorkoutData = { _id: 'mockId', date: new Date(), exercises: [] };
    mockDb.toArray.mockResolvedValueOnce([lastWorkoutData]);

    // Test logic for finding the last workout
    const lastWorkout = await Workout.findLastWorkout();
    expect(lastWorkout).toEqual(lastWorkoutData.date);
  });

  it('should update a workout by ID', async () => {
    // Mock input data
    const workoutId = 'mockId';
    const updateData = { exercise: { name: 'Squats', sets: 3, reps: 10, weight: 100 } };

    // Test logic for updating a workout by ID
    await Workout.findByIdAndUpdate(workoutId, updateData);
    expect(mockDb.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: workoutId },
      { $push: { exercises: updateData.exercise } },
      { returnOriginal: false }
    );
  });

  it('should delete all workouts', async () => {
    // Test logic for deleting all workouts
    await Workout.deleteMany();
    expect(mockDb.deleteMany).toHaveBeenCalledWith({});
  });
});
