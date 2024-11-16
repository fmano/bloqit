import { Request, Response } from 'express';
import * as bloqService from '../services/bloq.service';
import { bloqQuerySchema } from '../validation/bloq-validation.schema';

export const getBloqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = bloqQuerySchema.validate(req.query);

    if (error) {
      res.status(400).json({
        message: 'Invalid query parameters',
        details: error.details,
      });

      return;
    }

    const bloqs = await bloqService.getBloqs(req.query);
    res.status(200).json(bloqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBloqById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const bloq = await bloqService.getBloqById(id);

    if (!bloq) {
      res.status(404).json({ message: 'Bloq not found' });
      return;
    }

    res.status(200).json(bloq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', details: '123' });
  }
};

export const createBloq = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, address } = req.body;
    const newBloq = await bloqService.createBloq(title, address);
    res.status(201).json(newBloq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
};
