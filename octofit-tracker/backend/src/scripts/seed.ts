import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [blue, gold] = await Team.create([
      { name: 'Team Blue', description: 'Morning runners and cyclists' },
      { name: 'Team Gold', description: 'Strength and conditioning crew' },
    ]);

    const users = await User.create([
      { name: 'Ava Martinez', email: 'ava@octofit.dev', team: blue._id },
      { name: 'Liam Chen', email: 'liam@octofit.dev', team: blue._id },
      { name: 'Noah Patel', email: 'noah@octofit.dev', team: gold._id },
      { name: 'Emma Johnson', email: 'emma@octofit.dev', team: gold._id },
    ]);

    await Team.updateOne({ _id: blue._id }, { members: [users[0]._id, users[1]._id] });
    await Team.updateOne({ _id: gold._id }, { members: [users[2]._id, users[3]._id] });

    const day = 24 * 60 * 60 * 1000;
    await Activity.create([
      { user: users[0]._id, type: 'Running', durationMinutes: 35, calories: 340, date: new Date(Date.now() - day) },
      { user: users[0]._id, type: 'Cycling', durationMinutes: 60, calories: 480, date: new Date(Date.now() - 2 * day) },
      { user: users[1]._id, type: 'Swimming', durationMinutes: 45, calories: 400 },
      { user: users[2]._id, type: 'Weightlifting', durationMinutes: 50, calories: 300 },
      { user: users[3]._id, type: 'Yoga', durationMinutes: 40, calories: 150 },
      { user: users[3]._id, type: 'Running', durationMinutes: 25, calories: 250 },
    ]);

    await Leaderboard.create([
      { user: users[0]._id, team: blue._id, points: 820 },
      { user: users[3]._id, team: gold._id, points: 640 },
      { user: users[1]._id, team: blue._id, points: 560 },
      { user: users[2]._id, team: gold._id, points: 510 },
    ]);

    await Workout.create([
      { name: 'Interval Sprints', description: '8 x 200m sprints with 90s rest', difficulty: 'hard', durationMinutes: 30 },
      { name: 'Easy Spin', description: 'Low-resistance steady cycling', difficulty: 'easy', durationMinutes: 45 },
      { name: 'Full Body Strength', description: 'Squats, presses, rows, planks', difficulty: 'medium', durationMinutes: 50 },
      { name: 'Vinyasa Flow', description: 'Mobility and breathing focus', difficulty: 'easy', durationMinutes: 40 },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
