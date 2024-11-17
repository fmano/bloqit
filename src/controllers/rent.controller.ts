import { Request, Response } from 'express';
import { RentService } from '../services/rent.service';
import {
  rentQuerySchema,
  rentBodySchema,
  rentPatchSchema,
} from '../validation/rent-validation.schema';
import { BaseController } from './base.controller';
import { RentDocument } from '../models/rent.model';
import { NotFoundError, ValidationError } from '../errors/errors';
import logger from '../utils/logger.util';

export class RentController extends BaseController<RentDocument> {
  constructor(private rentService: RentService) {
    super(rentService, rentBodySchema, rentQuerySchema, rentPatchSchema);
  }

  /**
   * Updates a Rent with the specified values.
   * If the rent is placed or removed from a locker, the locker will also
   * be updated accordingly.
   * @param req - request object with body parameters to be updated
   * @param res - response object with the updated rent
   * @returns
   */
  async update(req: Request, res: Response): Promise<void> {
    const { error } = super.validate(rentPatchSchema, req.body);
    if (error) {
      super.handleValidationError(res, error);
      return;
    }

    try {
      const updatedRent = await this.rentService.update(
        req.params.id,
        req.body.lockerId,
        req.body.status,
      );
      res.status(200).json(updatedRent);
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
