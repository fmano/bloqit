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
