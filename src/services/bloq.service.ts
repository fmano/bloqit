import Bloq, { BloqDocument } from '../models/bloq.model';

export const createBloq = async (
  title: string,
  address: string,
): Promise<BloqDocument> => {
  const newBloq = new Bloq({
    title,
    address,
  });
  return await newBloq.save();
};

export const getAllBloqs = async (): Promise<BloqDocument[]> => {
  return await Bloq.find();
};
