import mongoose, { Document, Schema } from 'mongoose';

export interface IPlacedObject {
  assetId: string;
  x_pos: number;
  y_pos: number;
  z_pos: number;
  rotation: number;
}

export interface IEcoSphere extends Document {
  userId: mongoose.Types.ObjectId;
  healthIndex: number;
  unlockedAssets: string[];
  placedObjects: IPlacedObject[];
  lastUpdated: Date;
}

const EcoSphereSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  healthIndex: { type: Number, default: 1.0, min: 0.0, max: 1.0 },
  unlockedAssets: [{ type: String }],
  placedObjects: [{
    assetId: { type: String, required: true },
    x_pos: { type: Number, required: true },
    y_pos: { type: Number, required: true },
    z_pos: { type: Number, required: true },
    rotation: { type: Number, default: 0 }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IEcoSphere>('EcoSphere', EcoSphereSchema);
