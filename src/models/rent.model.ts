import mongoose, { Document, Schema } from 'mongoose';

export interface RentDocument extends Document {
  locker?: mongoose.Types.ObjectId;
  weight: number;
  size: string;
  createdAt: Date;
  droppedOffAt: Date;
  pickedUpAt: Date;
}

const rentSchema = new Schema<RentDocument>({
  locker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Locker',
    required: false,
    default: null,
  },
  weight: { type: Number, default: 0 },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  droppedOffAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
});

const Rent = mongoose.model<RentDocument>('Locker', rentSchema);
export default Rent;
