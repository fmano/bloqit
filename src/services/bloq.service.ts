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

export const getAllBloqs = async (): Promise<BloqDto[]> => {
  return (await Bloq.find()).map((bloq) => new BloqDto(bloq));
};
