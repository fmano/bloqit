import { RentDocument } from './rent.model';

export class RentDto {
  id?: string;
  lockerId?: string;
  weight: number;
  size: string;
  createdAt: Date;
  droppedOffAt?: Date;
  pickedUpAt?: Date;

  constructor(rent: RentDocument) {
    this.id = rent.id;
    this.lockerId = rent.lockerId;
    this.weight = rent.weight;
    this.size = rent.size;
    this.createdAt = rent.createdAt;
    this.droppedOffAt = rent.droppedOffAt;
    this.pickedUpAt = rent.pickedUpAt;
  }
}
