import { LockerService } from '../services/locker.service';
import {
  lockerQuerySchema,
  lockerBodySchema,
} from '../validation/locker-validation.schema';
import { BaseController } from './base.controller';
import { LockerDocument } from '../models/locker.model';

export class LockerController extends BaseController<LockerDocument> {
  constructor(private lockerService: LockerService) {
    super(lockerService, lockerBodySchema, lockerQuerySchema);
  }
}
