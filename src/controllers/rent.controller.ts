import { RentService } from '../services/rent.service';
import {
  rentQuerySchema,
  rentBodySchema,
} from '../validation/rent-validation.schema';
import { BaseController } from './base.controller';
import { RentDocument } from '../models/rent.model';

export class RentController extends BaseController<RentDocument> {
  constructor(private rentService: RentService) {
    super(rentService, rentBodySchema, rentQuerySchema);
  }
}
