import { RentController } from './rent.controller';
import { RentService, LockerService } from '../services';
import { Request, Response } from 'express';
import { NotFoundError, ValidationError } from '../errors/errors';

jest.mock('../utils/logger.util');

describe('RentController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;
  let rentController: RentController;
  let rentService: RentService;
  let lockerService: LockerService;

  const mockValidationError = (key: string) => {
    return {
      message: 'Validation failed',
      details: [`"${key}" is not allowed`],
    };
  };

  const mockRent = {
    id: '8df3c074-e3e4-48a7-b5b0-2c60a9fdd606',
    weight: 20,
    size: 'M',
    status: 'WAITING_PICKUP',
    createdAt: new Date('2024-11-17T11:22:42.611Z'),
    droppedOffAt: new Date('2024-11-17T11:24:40.297Z'),
    pickedUpAt: new Date('2024-11-17T11:46:01.902Z'),
  };

  beforeEach(() => {
    lockerService = new LockerService();
    rentService = new RentService(lockerService);
    rentController = new RentController(rentService);
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ send: mockSend, json: mockSend });
    mockReq = {} as Partial<Request>;
    mockRes = { status: mockStatus } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return 200 and a list of rents when called without query params', async () => {
      jest.spyOn(rentService, 'getAll').mockResolvedValue([mockRent]);

      await rentController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockRent]);
      expect(rentService.getAll).toHaveBeenCalled();
    });

    it('should return 200 and a list of rents when called with correct query params', async () => {
      jest.spyOn(rentService, 'getAll').mockResolvedValue([mockRent]);
      mockReq.query = { size: 'M' };
      const expectedFilter = {
        size: 'M',
      };
      await rentController.getAll(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockRent]);
      expect(rentService.getAll).toHaveBeenCalledWith(expectedFilter);
    });

    it('should return 400 when called with an invalid query parameter', async () => {
      jest.spyOn(rentService, 'getAll').mockResolvedValue([mockRent]);

      mockReq.query = { invalidParameter: 'mockParameter' };

      await rentController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidParameter'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(rentService, 'getAll').mockRejectedValue(new Error());

      await rentController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    it('should return 200 and a single rent when rent id exists and is specified', async () => {
      jest.spyOn(rentService, 'getById').mockResolvedValue(mockRent);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await rentController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockRent);
      expect(rentService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 404 when specified rent id does not exist', async () => {
      jest.spyOn(rentService, 'getById').mockResolvedValue(null);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await rentController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(rentService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(rentService, 'getById').mockRejectedValue(new Error());
      mockReq.params = { id: 'mockId' };

      await rentController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('should return 201 and the created rent when called with valid body', async () => {
      jest.spyOn(rentService, 'create').mockResolvedValue(mockRent);
      mockReq.body = {
        weight: 20,
        size: 'M',
        status: 'WAITING_PICKUP',
      };

      await rentController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(mockRent);
    });

    it('should return 400 when called with invalid body', async () => {
      mockReq.body = {
        weight: 20,
        size: 'M',
        status: 'WAITING_PICKUP',
        invalidField: 'mockInvalidField',
      };

      await rentController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidField'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(rentService, 'create').mockRejectedValue(new Error());
      mockReq.body = {
        weight: 20,
        size: 'M',
        status: 'WAITING_PICKUP',
      };
      await rentController.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should return 200 and the updated rent when called with valid body and existing id', async () => {
      jest.spyOn(rentService, 'update').mockResolvedValue(mockRent);
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        status: 'WAITING_PICKUP',
      };

      await rentController.update(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockRent);
    });

    it('should return 400 when called with invalid body', async () => {
      const validationError = new ValidationError('Rent');
      jest.spyOn(rentService, 'update').mockRejectedValue(validationError);

      mockReq.params = { id: 'mockId' };
      mockReq.body = {
        invalidParameter: 'invalidParameter',
      };

      await rentController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(validationError.statusCode);
    });

    it('should return 404 when specified rent id does not exist', async () => {
      const notFoundError = new NotFoundError('Rent');
      jest.spyOn(rentService, 'update').mockRejectedValue(notFoundError);

      mockReq.params = { id: 'mockId' };
      mockReq.body = {
        status: 'WAITING_PICKUP',
      };

      await rentController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(notFoundError.statusCode);
    });
  });

  describe('delete', () => {
    it('should return 204 when called with an existing id', async () => {
      jest.spyOn(rentService, 'delete').mockResolvedValue(true);
      mockReq.params = { id: 'mockId ' };

      await rentController.delete(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });

  it('should return 404 when specified rent id does not exist', async () => {
    jest.spyOn(rentService, 'delete').mockResolvedValue(false);
    mockReq.params = { id: 'mockId' };

    const expectedId = 'mockId';

    await rentController.delete(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(rentService.delete).toHaveBeenCalledWith(expectedId);
  });

  it('should return 500 when an exception occurs', async () => {
    jest.spyOn(rentService, 'delete').mockRejectedValue(new Error());
    mockReq.params = { id: 'mockId ' };

    await rentController.delete(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
  });
});
