import mongoose, { Schema } from 'mongoose';

const opts = { timestamps: true };

export const User = mongoose.model(
  'User',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      team: { type: Schema.Types.ObjectId, ref: 'Team' },
    },
    opts,
  ),
);

export const Team = mongoose.model(
  'Team',
  new Schema(
    {
      name: { type: String, required: true, unique: true, trim: true },
      description: String,
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    opts,
  ),
);

export const Activity = mongoose.model(
  'Activity',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      type: { type: String, required: true },
      durationMinutes: { type: Number, required: true, min: 0 },
      calories: { type: Number, min: 0 },
      date: { type: Date, default: Date.now },
    },
    opts,
  ),
);

export const Leaderboard = mongoose.model(
  'Leaderboard',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      team: { type: Schema.Types.ObjectId, ref: 'Team' },
      points: { type: Number, required: true, default: 0 },
    },
    opts,
  ),
);

export const Workout = mongoose.model(
  'Workout',
  new Schema(
    {
      name: { type: String, required: true },
      description: String,
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
      durationMinutes: { type: Number, min: 0 },
    },
    opts,
  ),
);
