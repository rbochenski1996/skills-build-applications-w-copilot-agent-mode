import mongoose, { Schema } from 'mongoose';

const opts = { timestamps: true };

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  opts,
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  opts,
);

// User.team is the source of truth; Team.members is kept in sync from it.
async function syncMembership(userId: unknown, teamId: unknown) {
  await Team.updateMany({ _id: { $ne: teamId }, members: userId } as any, { $pull: { members: userId } });
  if (teamId) await Team.updateOne({ _id: teamId } as any, { $addToSet: { members: userId } });
}

userSchema.post('save', (doc) => syncMembership(doc._id, doc.team));
userSchema.post('findOneAndUpdate', (doc) => (doc ? syncMembership(doc._id, doc.team) : undefined));
userSchema.post('findOneAndDelete', (doc) => (doc ? syncMembership(doc._id, null) : undefined));
teamSchema.post('findOneAndDelete', (doc) =>
  doc ? User.updateMany({ team: doc._id } as any, { $unset: { team: 1 } }) : undefined,
);

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    calories: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  opts,
);
activitySchema.index({ user: 1, date: -1 });

export const Activity = mongoose.model('Activity', activitySchema);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, default: 0 },
  },
  opts,
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
