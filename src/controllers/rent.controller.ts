import { RentService } from '../services/rent.service';
import {
  rentQuerySchema,
  rentBodySchema,
} from '../validation/rent-validation.schema';
import { BaseController } from './base.controller';
import { RentDocument } from '../models/rent.model';
import { LockerService } from '../services';
import { Request, Response } from 'express';
import logger from '../utils/logger.util';
import { NotFoundError, ValidationError } from '../errors/errors';

export class RentController extends BaseController<RentDocument> {
  constructor(private rentService: RentService) {
    super(rentService, rentBodySchema, rentQuerySchema);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updateRentResult = await this.rentService.update(
        req.params.id,
        req.body.lockerId,
        req.body.status,
      );
      res.status(201).send();
    } catch (error) {
      logger.error(error);
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res
          .status(error.statusCode)
          .json({ message: error.message, details: error.details });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
