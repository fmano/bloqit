import mongoose, { Document, Schema } from 'mongoose';

export interface BloqDocument extends Document {
  title: string;
  address: string;
}

const bloqSchema = new Schema<BloqDocument>(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

const Bloq = mongoose.model<BloqDocument>('Bloq', bloqSchema);
export default Bloq;
