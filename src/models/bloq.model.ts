import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface BloqDocument extends Document {
  id: string;
  title: string;
  address: string;
}

const bloqSchema = new Schema<BloqDocument>(
  {
    id: { type: String, default: uuid, required: true, unique: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

const Bloq = mongoose.model<BloqDocument>('Bloq', bloqSchema);
export { Bloq };
