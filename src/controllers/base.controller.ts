import { Request, Response } from 'express';
import { Document } from 'mongoose';
import { BaseService } from '../services/base.service';
import Joi, { ObjectSchema } from 'joi';
import logger from '../utils/logger.util';
import { NotFoundError, ValidationError } from '../errors/errors';

export class BaseController<T extends Document> {
  constructor(
    private service: BaseService<T>,
    private bodyValidationSchema?: ObjectSchema,
    private queryValidationSchema?: ObjectSchema,
    private patchValidationSchema?: ObjectSchema,
  ) {}
  protected validate(
    schema: ObjectSchema,
    data: any,
  ): { error?: Joi.ValidationError } {
    const { error } = schema.validate(data);
    return { error };
  }

  protected handleValidationError(
    res: Response,
    error: Joi.ValidationError,
  ): void {
    res.status(400).json({
      message: 'Validation failed',
      details: error.details.map((detail) => detail.message),
    });
  }

  protected handleError(req: Request, res: Response, error: any) {
    logger.error(error);
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      res
        .status(error.statusCode)
        .json({ message: error.message, details: error.details });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    if (this.queryValidationSchema) {
      const { error } = this.validate(this.queryValidationSchema, req.query);

      if (error) {
        this.handleValidationError(res, error);
        return;
      }
    }
    try {
      const data = await this.service.getAll(req.query);
      res.status(200).json(data);
    } catch (error) {
      this.handleError(req, res, error);
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
      this.handleError(req, res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (this.bodyValidationSchema) {
      const { error } = this.validate(this.bodyValidationSchema, req.body);
      if (error) {
        this.handleValidationError(res, error);
        return;
      }
    }
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    if (this.patchValidationSchema) {
      const { error } = this.validate(this.patchValidationSchema, req.body);
      if (error) {
        this.handleValidationError(res, error);
        return;
      }
    }
    try {
      const data = await this.service.update(req.params.id, req.body);

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'Resource not found' });
      }
    } catch (error) {
      this.handleError(req, res, error);
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
      this.handleError(req, res, error);
    }
  }
}
