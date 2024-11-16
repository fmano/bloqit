import { Request, Response } from 'express';
import { Document } from 'mongoose';
import { BaseService } from '../services/base.service';

export abstract class BaseController<T extends Document> {
  constructor(private service: BaseService<T>) {
    console.log('Service:', service);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.getAll(req.query);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.getById(req.params.id);

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'Resource not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.update(req.params.id, req.body);

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'Resource not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.service.delete(req.params.id);

      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Resource not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
