import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    calories: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
activitySchema.index({ user: 1, date: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
