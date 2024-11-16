import { BloqController } from './bloq.controller';
import { BloqService } from '../services/bloq.service';
import { Request, Response } from 'express';

describe('BloqController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;
  let bloqController: BloqController;
  let bloqService: BloqService;

  const mockValidationError = (
    expectedMessage: string,
    key: string,
    value: string,
  ) => {
    return {
      message: expectedMessage,
      details: [
        {
          message: `"${key}" is not allowed`,
          path: [key],
          type: 'object.unknown',
          context: {
            child: key,
            label: key,
            value: value,
            key: key,
          },
        },
      ],
    };
  };

  const mockBloq = {
    id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
    title: 'Luitton Vouis Champs Elysées',
    address: '101 Av. des Champs-Élysées, 75008 Paris, France',
  };

  beforeEach(() => {
    bloqService = new BloqService();
    bloqController = new BloqController(bloqService);
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockSend });
    mockReq = {} as Partial<Request>;
    mockRes = { status: mockStatus } as Partial<Response>;
  });

  describe('getAll', () => {
    it('should return 200 and a list of bloqs when called without query params', async () => {
      jest.spyOn(bloqService, 'getAll').mockResolvedValue([mockBloq]);

      await bloqController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockBloq]);
      expect(bloqService.getAll).toHaveBeenCalled();
    });

    it('should return 200 and a list of bloqs when called with correct query params', async () => {
      jest.spyOn(bloqService, 'getAll').mockResolvedValue([mockBloq]);
      mockReq.query = { title: 'mockTitle' };
      const expectedFilter = {
        title: 'mockTitle',
      };
      await bloqController.getAll(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockBloq]);
      expect(bloqService.getAll).toHaveBeenCalledWith(expectedFilter);
    });

    it('should return 400 when called with an invalid query parameter', async () => {
      jest.spyOn(bloqService, 'getAll').mockResolvedValue([mockBloq]);

      mockReq.query = { invalidParameter: 'mockParameter' };

      await bloqController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError(
          'Invalid query parameters',
          'invalidParameter',
          'mockParameter',
        ),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'getAll').mockRejectedValue(new Error());

      await bloqController.getAll(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    it('should return 200 and a single bloq when bloq id exists and is specified', async () => {
      jest.spyOn(bloqService, 'getById').mockResolvedValue(mockBloq);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await bloqController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockBloq);
      expect(bloqService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 404 when specified bloq id does not exist', async () => {
      jest.spyOn(bloqService, 'getById').mockResolvedValue(null);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await bloqController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(bloqService.getById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'getById').mockRejectedValue(new Error());
      mockReq.params = { id: 'mockId' };

      await bloqController.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('should return 201 and the created bloq when called with valid body', async () => {
      jest.spyOn(bloqService, 'create').mockResolvedValue(mockBloq);
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };

      await bloqController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(mockBloq);
    });

    it('should return 400 when called with invalid body', async () => {
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
        invalidField: 'mockInvalidField',
      };

      await bloqController.create(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('Invalid body', 'invalidField', 'mockInvalidField'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'create').mockRejectedValue(new Error());
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };
      await bloqController.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should return 200 and the updated bloq when called with valid body and existing id', async () => {
      jest.spyOn(bloqService, 'update').mockResolvedValue(mockBloq);
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };

      await bloqController.update(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockBloq);
    });

    it('should return 400 when called with invalid body', async () => {
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
        invalidField: 'mockInvalidField',
      };

      await bloqController.update(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('Invalid body', 'invalidField', 'mockInvalidField'),
      );
    });

    it('should return 404 when specified bloq id does not exist', async () => {
      jest.spyOn(bloqService, 'update').mockResolvedValue(null);
      mockReq.params = { id: 'mockId' };
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };

      const expectedId = 'mockId';
      const expectedTitle = 'mockTitle';
      const expectedAddress = 'mockAddress';

      await bloqController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(bloqService.update).toHaveBeenCalledWith(
        expectedId,
        expectedTitle,
        expectedAddress,
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'update').mockRejectedValue(new Error());
      mockReq.params = { id: 'mockId ' };
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };

      await bloqController.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    it('should return 204 when called with an existing id', async () => {
      jest.spyOn(bloqService, 'delete').mockResolvedValue(true);
      mockReq.params = { id: 'mockId ' };

      await bloqController.delete(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });
});
