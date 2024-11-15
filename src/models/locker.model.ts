import mongoose, { Document, Schema } from 'mongoose';

export interface LockerDocument extends Document {
  bloqId: mongoose.Types.ObjectId;
  status: string;
  isOccupied: boolean;
}

const lockerSchema = new Schema<LockerDocument>(
  {
    bloqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bloq',
      required: true,
    },
    status: { type: String, required: true },
    isOccupied: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const Locker = mongoose.model<LockerDocument>('Locker', lockerSchema);
export { Locker };
