import { BloqDto } from '../models/bloq-dto.model';
import { Bloq, BloqDocument } from '../models/bloq.model';
import { BaseService } from './base.service';

export class BloqService extends BaseService<BloqDocument> {
  mapToDto(data: any): BloqDto {
    return new BloqDto(data);
  }

  constructor() {
    super(Bloq);
  }
}
