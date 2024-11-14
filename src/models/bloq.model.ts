import mongoose, { Document, Schema } from 'mongoose';
import { LockerDocument } from './locker.model';

export interface BloqDocument extends Document {
  title: string;
  address: string;
  lockers: LockerDocument[];
}

const bloqSchema = new Schema<BloqDocument>({
  title: { type: String, required: true },
  address: { type: String, required: true },
  lockers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locker' }],
});

const Bloq = mongoose.model<BloqDocument>('Locker', bloqSchema);
export default Bloq;
