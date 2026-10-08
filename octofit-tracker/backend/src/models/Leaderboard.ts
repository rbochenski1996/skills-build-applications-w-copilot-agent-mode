import mongoose, { Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);
leaderboardSchema.pre('validate', function () {
  if (!this.user && !this.team) this.invalidate('user', 'Either user or team is required');
});
leaderboardSchema.index({ points: -1 });
leaderboardSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: 'objectId' } } },
);

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
