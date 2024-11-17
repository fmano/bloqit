import { NotFoundError, ValidationError } from '../errors/errors';
import { LockerDocument } from '../models/locker.model';
import { RentDto } from '../models/rent-dto.model';
import { Rent, RentDocument } from '../models/rent.model';
import { BaseService } from './base.service';
import { LockerService } from './locker.service';

export class RentService extends BaseService<RentDocument> {
  mapToDto(data: any): RentDto {
    return new RentDto(data);
  }

  constructor(private lockerService: LockerService) {
    super(Rent);
  }

  async create(rent: any): Promise<RentDto> {
    if (rent.lockerId) {
      await this.findLocker(rent.lockerId);
    }
    return await super.create(rent);
  }

  async update(
    id: string,
    lockerId?: string,
    status?: string,
  ): Promise<RentDto> {
    const rentToUpdate = (await this.model.findOne({ id })) as RentDocument;

    // if lockerId changes to a different one, check if locker exists and is empty
    if (lockerId !== undefined && lockerId !== rentToUpdate.lockerId) {
      const locker = await this.findLocker(lockerId);

      locker.isOccupied = true;
      locker.status = 'CLOSED';
      await this.lockerService.update(locker.id, locker);

      // if placed in a new locker, rent was dropped off
      rentToUpdate.droppedOffAt = new Date();
    }

    rentToUpdate.lockerId = lockerId;

    if (status) {
      rentToUpdate.status = status;
    }

    if (lockerId === undefined) {
      // if removed from a locker, it was either picked up or delivered
      rentToUpdate.pickedUpAt = new Date();
    }

    rentToUpdate.save();

    return this.mapToDto(rentToUpdate);
  }

  private async findLocker(lockerId: string): Promise<LockerDocument> {
    const locker = (await this.lockerService.getById(
      lockerId,
    )) as LockerDocument;

    if (!locker) {
      throw new NotFoundError('Locker', `Locker ${lockerId} does not exist`);
    }

    if (locker.isOccupied) {
      throw new ValidationError(
        'Locker is occupied',
        `Locker ${lockerId} is occupied`,
      );
    }
    return locker;
  }
}
