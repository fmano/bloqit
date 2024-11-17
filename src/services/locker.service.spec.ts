import { LockerService } from './locker.service';
import { Locker } from '../models/locker.model';
import { LockerDto } from '../models/locker-dto.model';

jest.mock('../utils/logger.util');

describe('LockerService', () => {
  let lockerService: LockerService;

  const mockLockerDto = (
    id: string,
    bloqId: string,
    status: string,
    isOccupied: boolean,
  ): LockerDto => {
    return { id, bloqId, status, isOccupied };
  };

  // returns lockers with more parameters than in LockerDto to mock db model behaviour
  const mockLockerModel = (
    id: string,
    bloqId: string,
    status: string,
    isOccupied: boolean,
  ) => {
    const mockLocker = mockLockerDto(id, bloqId, status, isOccupied);
    return { _id: 'mockDefaultId', ...mockLocker };
  };

  beforeEach(() => {
    lockerService = new LockerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return a list of LockerDtos', async () => {
      const foundLockers = [
        mockLockerModel('id1', 'bloqId1', 'OPEN', false),
        mockLockerModel('id2', 'bloqId2', 'OPEN', false),
      ];

      const expectedLockers = [
        mockLockerDto('id1', 'bloqId1', 'OPEN', false),
        mockLockerDto('id2', 'bloqId2', 'OPEN', false),
      ];

      jest.spyOn(Locker, 'find').mockResolvedValue(foundLockers);

      const mappedLockers = await lockerService.getAll();

      expect(mappedLockers).toEqual(expectedLockers);
    });
  });

  describe('getById', () => {
    it('should return a single locker when provided id exists', async () => {
      const foundLocker = mockLockerModel('id1', 'bloqId1', 'OPEN', false);
      const expectedLocker = mockLockerDto('id1', 'bloqId1', 'OPEN', false);

      jest.spyOn(Locker, 'findOne').mockResolvedValue(foundLocker);

      const mappedLocker = await lockerService.getById('id1');

      expect(mappedLocker).toEqual(expectedLocker);
    });

    it('should return null when provided id does not exist', async () => {
      jest.spyOn(Locker, 'findOne').mockResolvedValue(null);

      const mappedLocker = await lockerService.getById('id1');

      expect(mappedLocker).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new Locker and return a LockerDto', async () => {
      const newLocker = mockLockerModel('id1', 'bloqId1', 'OPEN', false);
      const expectedLocker = mockLockerDto('id1', 'bloqId1', 'OPEN', false);

      jest.spyOn(Locker.prototype, 'save').mockResolvedValue(newLocker);

      const createdLocker = await lockerService.create(newLocker);

      expect(createdLocker).toEqual(expectedLocker);
    });
  });

  describe('update', () => {
    it('should return an updated Locker if the provided locker id exists', async () => {
      const existingLocker = mockLockerModel('id1', 'bloqId1', 'OPEN', false);
      const expectedLocker = mockLockerDto('id1', 'bloqId1', 'OPEN', false);

      jest.spyOn(Locker, 'findOneAndUpdate').mockResolvedValue(existingLocker);

      const updatedLocker = await lockerService.update('id1', {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      });

      expect(updatedLocker).toEqual(expectedLocker);
    });

    it('should return null when provided id does not exist', async () => {
      jest.spyOn(Locker, 'findOneAndUpdate').mockResolvedValue(null);

      const updatedLocker = await lockerService.update('id1', {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      });
      expect(updatedLocker).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true if the provided locker id exists', async () => {
      const deletedLocker = mockLockerModel('id1', 'bloqId1', 'OPEN', false);

      jest.spyOn(Locker, 'findOneAndDelete').mockResolvedValue(deletedLocker);

      const deleteResult = await lockerService.delete('id1');

      expect(deleteResult).toBeTruthy();
    });

    it('should return false if the provided locker id does not exist', async () => {
      jest.spyOn(Locker, 'findOneAndDelete').mockResolvedValue(null);

      const deleteResult = await lockerService.delete('id1');

      expect(deleteResult).toBeFalsy();
    });
  });
});
