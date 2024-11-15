import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface RentDocument extends Document {
  id: string;
  lockerId?: string;
  weight: number;
  size: string;
  createdAt: Date;
  droppedOffAt: Date;
  pickedUpAt: Date;
}

const rentSchema = new Schema<RentDocument>({
  id: { type: String, default: uuid, required: true, unique: true },
  lockerId: {
    type: String,
    ref: 'Locker',
    required: false,
    default: null,
  },
  weight: { type: Number, default: 0 },
  size: { type: String, required: true },
  createdAt: { type: Date, default: null },
  droppedOffAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
});

const Rent = mongoose.model<RentDocument>('Rent', rentSchema);
export { Rent };
