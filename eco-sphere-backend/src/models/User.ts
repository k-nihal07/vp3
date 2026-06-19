import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  authHash: string;
  baselineCarbonScore: number;
  currentStreak: number;
  ecoTokens: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authHash: { type: String, required: true },
  baselineCarbonScore: { type: Number, default: 0.0 },
  currentStreak: { type: Number, default: 0 },
  ecoTokens: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
