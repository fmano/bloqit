import { BloqDto } from '../models/bloq-dto.model';
import { Bloq, BloqDocument } from '../models/bloq.model';

export const createBloq = async (
  title: string,
  address: string,
): Promise<BloqDto> => {
  const newBloq = new Bloq({
    title,
    address,
  });
  const savedBloq = await newBloq.save();

  return new BloqDto(savedBloq);
};

export const getBloqs = async (filter: object = {}): Promise<BloqDto[]> => {
  return (await Bloq.find(filter)).map((bloq) => new BloqDto(bloq));
};

export const getBloqById = async (id: string): Promise<BloqDto | null> => {
  const bloq = await Bloq.findOne({ id: id });
  return bloq ? new BloqDto(bloq) : null;
};

export const updateBloq = async (
  id: string,
  title: string,
  address: string,
): Promise<BloqDto | null> => {
  const updatedBloq = await Bloq.findOneAndUpdate(
    { id },
    { $set: { title, address } },
    { new: true },
  );

  return updatedBloq;
};
