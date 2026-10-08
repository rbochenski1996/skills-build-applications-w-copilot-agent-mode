import mongoose, { Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    durationMinutes: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
