import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

// User.team is the source of truth; Team.members is kept in sync from it.
async function syncMembership(userId: unknown, teamId: unknown) {
  const Team = mongoose.model('Team');
  await Team.updateMany({ _id: { $ne: teamId }, members: userId } as any, { $pull: { members: userId } });
  if (teamId) await Team.updateOne({ _id: teamId } as any, { $addToSet: { members: userId } });
}

userSchema.post('save', (doc) => syncMembership(doc._id, doc.team));
userSchema.post('findOneAndUpdate', (doc) => (doc ? syncMembership(doc._id, doc.team) : undefined));
userSchema.post('findOneAndDelete', (doc) => (doc ? syncMembership(doc._id, null) : undefined));

export const User = mongoose.model('User', userSchema);
export default User;
