import { RentService } from './rent.service';
import { Rent, RentDocument } from '../models/rent.model';
import { RentDto } from '../models/rent-dto.model';
import { LockerService } from './locker.service';
import { Locker } from '../models/locker.model';
import { NotFoundError, ValidationError } from '../errors/errors';

jest.mock('../utils/logger.util');

describe('RentService', () => {
  let rentService: RentService;
  let lockerService: LockerService;

  const mockRentDto = (
    id: string,
    weight: number,
    size: string,
    status: string,
    createdAt: Date,
    droppedOffAt: Date,
    pickedUpAt: Date,
    lockerId?: string,
  ): RentDto => {
    return {
      id,
      lockerId,
      weight,
      size,
      status,
      createdAt,
      droppedOffAt,
      pickedUpAt,
    };
  };

  // returns rents with more parameters than in RentDto to mock db model behaviour
  const mockRentModel = (
    id: string,
    weight: number,
    size: string,
    status: string,
    createdAt: Date,
    droppedOffAt: Date,
    pickedUpAt: Date,
    lockerId?: string,
  ) => {
    const mockRent = mockRentDto(
      id,
      weight,
      size,
      status,
      createdAt,
      droppedOffAt,
      pickedUpAt,
      lockerId,
    );
    return new Rent(mockRent);
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 11, 17));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    lockerService = new LockerService();
    rentService = new RentService(lockerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return a list of RentDtos', async () => {
      const foundRents = [
        mockRentModel(
          'id1',
          20,
          'M',
          'WAITING_PICKUP',
          new Date(),
          new Date(),
          new Date(),
          'mockLockerId1',
        ),
        mockRentModel(
          'id2',
          20,
          'M',
          'WAITING_PICKUP',
          new Date(),
          new Date(),
          new Date(),
          'mockLockerId2',
        ),
      ];

      const expectedRents = [
        mockRentDto(
          'id1',
          20,
          'M',
          'WAITING_PICKUP',
          new Date(),
          new Date(),
          new Date(),
          'mockLockerId1',
        ),
        mockRentDto(
          'id2',
          20,
          'M',
          'WAITING_PICKUP',
          new Date(),
          new Date(),
          new Date(),
          'mockLockerId2',
        ),
      ];

      jest.spyOn(Rent, 'find').mockResolvedValue(foundRents);

      const mappedRents = await rentService.getAll();

      expect(mappedRents).toEqual(expectedRents);
    });
  });

  describe('getById', () => {
    it('should return a single rent when provided id exists', async () => {
      const foundRent = mockRentModel(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
        'mockLockerId1',
      );
      const expectedRent = mockRentDto(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
        'mockLockerId1',
      );

      jest.spyOn(Rent, 'findOne').mockResolvedValue(foundRent);

      const mappedRent = await rentService.getById('id1');

      expect(mappedRent).toEqual(expectedRent);
    });

    it('should return null when provided id does not exist', async () => {
      jest.spyOn(Rent, 'findOne').mockResolvedValue(null);

      const mappedRent = await rentService.getById('id1');

      expect(mappedRent).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new Rent and return a RentDto', async () => {
      const newRent = mockRentModel(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
        'mockLockerId1',
      );
      const expectedRent = mockRentDto(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
        'mockLockerId1',
      );

      jest.spyOn(Rent.prototype, 'save').mockResolvedValue(newRent);
      jest
        .spyOn(rentService, 'findLockerToOccupy')
        .mockResolvedValue(new Locker());
      jest.spyOn(lockerService, 'update').mockResolvedValue(null);

      const createdRent = await rentService.create(newRent);

      expect(createdRent).toEqual(expectedRent);
    });
  });

  describe('update', () => {
    it('should return an updated Rent if the provided rent id exists', async () => {
      const existingRent = mockRentModel(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
      );
      const expectedRent = mockRentDto(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
      );

      jest.spyOn(Rent.prototype, 'save').mockResolvedValue(null);
      jest.spyOn(Rent, 'findOne').mockResolvedValue(existingRent);
      jest
        .spyOn(rentService, 'findLockerToOccupy')
        .mockResolvedValue(new Locker());
      jest.spyOn(lockerService, 'update').mockResolvedValue(null);

      const updatedRent = await rentService.update(
        'id1',
        undefined,
        'WAITING_PICKUP',
      );

      expect(updatedRent).toEqual(expectedRent);
    });

    it('should return throw a NotFoundError when provided id does not exist', async () => {
      jest.spyOn(Rent.prototype, 'save').mockResolvedValue(null);
      jest.spyOn(Rent, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(rentService, 'findLockerToOccupy')
        .mockResolvedValue(new Locker());
      jest.spyOn(lockerService, 'update').mockResolvedValue(null);

      await expect(
        rentService.update('id1', undefined, 'WAITING_PICKUP'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should return throw a NotFoundError when provided lockerId does not exist', async () => {
      jest.spyOn(Rent.prototype, 'save').mockResolvedValue(null);
      jest.spyOn(Rent, 'findOne').mockResolvedValue(null);
      jest.spyOn(lockerService, 'update').mockResolvedValue(null);
      jest.spyOn(lockerService, 'getById').mockResolvedValue(null);

      await expect(
        rentService.update('id1', undefined, 'WAITING_PICKUP'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw a ValidationError when provided lockerId is occupied', async () => {
      const occupiedLocker = new Locker();
      occupiedLocker.isOccupied = true;

      const existingRent = mockRentModel(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
      );

      jest.spyOn(Rent.prototype, 'save').mockResolvedValue(null);
      jest.spyOn(Rent, 'findOne').mockResolvedValue(existingRent);
      jest.spyOn(lockerService, 'update').mockResolvedValue(null);
      jest.spyOn(lockerService, 'getById').mockResolvedValue(occupiedLocker);

      await expect(
        rentService.update('id1', 'mockLockerId', 'WAITING_PICKUP'),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should return true if the provided rent id exists', async () => {
      const deletedRent = mockRentModel(
        'id1',
        20,
        'M',
        'WAITING_PICKUP',
        new Date(),
        new Date(),
        new Date(),
        'mockLockerId1',
      );
      jest.spyOn(Rent, 'findOneAndDelete').mockResolvedValue(deletedRent);

      const deleteResult = await rentService.delete('id1');

      expect(deleteResult).toBeTruthy();
    });

    it('should return false if the provided rent id does not exist', async () => {
      jest.spyOn(Rent, 'findOneAndDelete').mockResolvedValue(null);

      const deleteResult = await rentService.delete('id1');

      expect(deleteResult).toBeFalsy();
    });
  });
});
