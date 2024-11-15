import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface LockerDocument extends Document {
  id: string;
  bloqId: string;
  status: string;
  isOccupied: boolean;
}

const lockerSchema = new Schema<LockerDocument>(
  {
    id: { type: String, default: uuid, required: true, unique: true },
    bloqId: {
      type: String,
      ref: 'Bloq',
      required: true,
    },
    status: { type: String, required: true },
    isOccupied: { type: Boolean, required: true },
  },
  { timestamps: true, _id: false },
);

const Locker = mongoose.model<LockerDocument>('Locker', lockerSchema);
export { Locker };
