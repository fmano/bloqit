import { RentDto } from '../models/rent-dto.model';
import { Rent, RentDocument } from '../models/rent.model';
import { BaseService } from './base.service';

export class RentService extends BaseService<RentDocument> {
  mapToDto(data: any): RentDto {
    return new RentDto(data);
  }

  constructor() {
    super(Rent);
  }
}
