import { LockerController } from './locker.controller';
import { LockerService } from '../services/locker.service';
import { Request, Response } from 'express';

jest.mock('../utils/logger.util');

describe('LockerController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;
  let lockerController: LockerController;
  let lockerService: LockerService;

  const mockValidationError = (key: string) => {
    return {
      message: 'Validation failed',
      details: [`"${key}" is not allowed`],
    };
  };

  const mockLocker = {
    id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
    title: 'Luitton Vouis Champs Elysées',
    address: '101 Av. des Champs-Élysées, 75008 Paris, France',
  };

  beforeEach(() => {
    lockerService = new LockerService();
    lockerController = new LockerController(lockerService);
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ send: mockSend, json: mockSend });
    mockReq = {} as Partial<Request>;
    mockRes = { status: mockStatus } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return 200 and a list of lockers when called without query params', async () => {
      jest.spyOn(lockerService, 'getAll').mockResolvedValue([mockLocker]);

      await lockerController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockLocker]);
      expect(lockerService.getAll).toHaveBeenCalled();
    });

    it('should return 200 and a list of lockers when called with correct query params', async () => {
      jest.spyOn(lockerService, 'getAll').mockResolvedValue([mockLocker]);
      mockReq.query = { status: 'OPEN' };
      const expectedFilter = {
        status: 'OPEN',
      };
      await lockerController.getAll(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockLocker]);
      expect(lockerService.getAll).toHaveBeenCalledWith(expectedFilter);
    });

    it('should return 400 when called with an invalid query parameter', async () => {
      jest.spyOn(lockerService, 'getAll').mockResolvedValue([mockLocker]);

      mockReq.query = { invalidParameter: 'mockParameter' };

      await lockerController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidParameter'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(lockerService, 'getAll').mockRejectedValue(new Error());

      await lockerController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    it('should return 200 and a single locker when locker id exists and is specified', async () => {
      jest.spyOn(lockerService, 'getById').mockResolvedValue(mockLocker);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await lockerController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockLocker);
      expect(lockerService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 404 when specified locker id does not exist', async () => {
      jest.spyOn(lockerService, 'getById').mockResolvedValue(null);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await lockerController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(lockerService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(lockerService, 'getById').mockRejectedValue(new Error());
      mockReq.params = { id: 'mockId' };

      await lockerController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('should return 201 and the created locker when called with valid body', async () => {
      jest.spyOn(lockerService, 'create').mockResolvedValue(mockLocker);
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      };

      await lockerController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(mockLocker);
    });

    it('should return 400 when called with invalid body', async () => {
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
        invalidField: 'mockInvalidField',
      };

      await lockerController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidField'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(lockerService, 'create').mockRejectedValue(new Error());
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      };
      await lockerController.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should return 200 and the updated locker when called with valid body and existing id', async () => {
      jest.spyOn(lockerService, 'update').mockResolvedValue(mockLocker);
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      };

      await lockerController.update(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockLocker);
    });

    it('should return 400 when called with invalid body', async () => {
      jest.spyOn(lockerService, 'update').mockResolvedValue(mockLocker);
      mockReq.params = { id: 'mockId' };
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
        invalidField: 'mockInvalidField',
      };

      await lockerController.update(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidField'),
      );
    });

    it('should return 404 when specified locker id does not exist', async () => {
      jest.spyOn(lockerService, 'update').mockResolvedValue(false);
      mockReq.params = { id: 'mockId' };
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      };

      const expectedId = 'mockId';
      const expectedBloqId = 'mockBloqId';
      const expectedStatus = 'OPEN';
      const expectedIsOccupied = false;

      await lockerController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(lockerService.update).toHaveBeenCalledWith(expectedId, {
        bloqId: expectedBloqId,
        status: expectedStatus,
        isOccupied: expectedIsOccupied,
      });
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(lockerService, 'update').mockRejectedValue(new Error());
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        bloqId: 'mockBloqId',
        status: 'OPEN',
        isOccupied: false,
      };

      await lockerController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    it('should return 204 when called with an existing id', async () => {
      jest.spyOn(lockerService, 'delete').mockResolvedValue(true);
      mockReq.params = { id: 'mockId ' };

      await lockerController.delete(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });

  it('should return 404 when specified locker id does not exist', async () => {
    jest.spyOn(lockerService, 'delete').mockResolvedValue(false);
    mockReq.params = { id: 'mockId' };

    const expectedId = 'mockId';

    await lockerController.delete(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(lockerService.delete).toHaveBeenCalledWith(expectedId);
  });

  it('should return 500 when an exception occurs', async () => {
    jest.spyOn(lockerService, 'delete').mockRejectedValue(new Error());
    mockReq.params = { id: 'mockId ' };

    await lockerController.delete(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
  });
});
