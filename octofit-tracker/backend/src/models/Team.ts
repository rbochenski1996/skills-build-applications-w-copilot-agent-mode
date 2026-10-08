import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

teamSchema.post('findOneAndDelete', (doc) =>
  doc ? mongoose.model('User').updateMany({ team: doc._id } as any, { $unset: { team: 1 } }) : undefined,
);

export const Team = mongoose.model('Team', teamSchema);
export default Team;
