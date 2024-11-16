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
  return await newBloq.save();
};

export const getBloqs = async (filter: object = {}): Promise<BloqDto[]> => {
  return (await Bloq.find(filter)).map((bloq) => new BloqDto(bloq));
};

export const getBloqById = async (id: string): Promise<BloqDto | null> => {
  return await Bloq.findOne({ id: id });
};
