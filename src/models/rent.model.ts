import mongoose, { Document, Schema } from 'mongoose';

export interface RentDocument extends Document {
  locker?: mongoose.Types.ObjectId;
  weight: number;
  size: string;
  createdAt: Date;
  droppedOffAt: Date;
  pickedUpAt: Date;
}

const rentSchema = new Schema<RentDocument>(
  {
    locker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Locker',
      required: false,
      default: null,
    },
    weight: { type: Number, default: 0 },
    size: { type: String, required: true },
    droppedOffAt: { type: Date, default: null },
    pickedUpAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const Rent = mongoose.model<RentDocument>('Rent', rentSchema);
export { Rent };
