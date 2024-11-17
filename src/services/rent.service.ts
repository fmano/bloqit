import { NotFoundError, ValidationError } from '../errors/errors';
import { LockerDocument } from '../models/locker.model';
import { RentDto } from '../models/rent-dto.model';
import { Rent, RentDocument } from '../models/rent.model';
import logger from '../utils/logger.util';
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
      await this.occupyLocker(rent.lockerId);
    }
    return await super.create(rent);
  }

  async update(
    id: string,
    lockerId?: string,
    status?: string,
  ): Promise<RentDto | null> {
    const rentToUpdate = (await this.model.findOne({ id })) as RentDocument;

    if (!rentToUpdate) {
      throw new NotFoundError('Rent', `Rent ${id} does not exist`);
    }

    // if lockerId changes to a different one, check if locker exists and is empty
    if (lockerId && lockerId !== rentToUpdate.lockerId) {
      await this.occupyLocker(lockerId);

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
    logger.info(`Updated object with id: ${rentToUpdate.id}`);
    return this.mapToDto(rentToUpdate);
  }

  private async occupyLocker(lockerId: string) {
    const locker = await this.findLockerToOccupy(lockerId);

    locker.isOccupied = true;
    locker.status = 'CLOSED';
    await this.lockerService.update(locker.id, locker);
  }

  async findLockerToOccupy(lockerId: string): Promise<LockerDocument> {
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
