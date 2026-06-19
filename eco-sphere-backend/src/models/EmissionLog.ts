import mongoose, { Document, Schema } from 'mongoose';

export interface IEmissionLog extends Document {
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  category: string;
  actionDescriptor: string;
  co2Impact: number;
}

const EmissionLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  category: { 
    type: String, 
    enum: ['Transport', 'Diet', 'Energy', 'General', 'Shopping', 'Waste'], 
    required: true 
  },
  actionDescriptor: { type: String, required: true },
  co2Impact: { type: Number, required: true },
});

export default mongoose.model<IEmissionLog>('EmissionLog', EmissionLogSchema);
