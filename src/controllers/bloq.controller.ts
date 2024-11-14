import { Request, Response } from 'express';
import * as bloqService from '../services/bloq.service';

export const getAllBloqs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bloqs: any = [];
    res.status(200).json(bloqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
};

export const createBloq = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, address } = req.body;
    const newBloq = await bloqService.createBloq(title, address);
    res.status(200).json(newBloq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
};
