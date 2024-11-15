import { BloqDocument } from './bloq.model';

export class BloqDto {
  id?: string;
  title: string;
  address: string;

  constructor(bloq: BloqDocument) {
    this.id = bloq.id;
    this.title = bloq.title;
    this.address = bloq.address;
  }
}
