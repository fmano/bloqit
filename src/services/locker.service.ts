import { LockerDto } from '../models/locker-dto.model';
import { Locker, LockerDocument } from '../models/locker.model';
import { BaseService } from './base.service';

export class LockerService extends BaseService<LockerDocument> {
  mapToDto(data: any): LockerDto {
    return new LockerDto(data);
  }

  constructor() {
    super(Locker);
  }
}
