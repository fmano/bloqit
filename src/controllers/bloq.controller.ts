import { BloqService } from '../services/bloq.service';
import {
  bloqQuerySchema,
  bloqBodySchema,
} from '../validation/bloq-validation.schema';
import { BaseController } from './base.controller';
import { BloqDocument } from '../models/bloq.model';

export class BloqController extends BaseController<BloqDocument> {
  constructor(private bloqService: BloqService) {
    super(bloqService);
  }
}
