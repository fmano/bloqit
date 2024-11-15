import { LockerDocument } from './locker.model';

export class LockerDto {
  id?: string;
  bloqId: string;
  status: string;
  isOccupied: boolean;

  constructor(locker: LockerDocument) {
    this.id = locker.id;
    this.bloqId = locker.bloqId;
    this.status = locker.status;
    this.isOccupied = locker.isOccupied;
  }
}
