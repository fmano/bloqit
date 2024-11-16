import * as bloqController from './bloq.controller';
import * as bloqService from '../services/bloq.service';
import { Request, Response } from 'express';

describe('BloqController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  const mockValidationError = (key: string, value: string) => {
    return {
      message: 'Invalid query parameters',
      details: [
        {
          message: `"${key}" is not allowed`,
          path: [`${key}`],
          type: 'object.unknown',
          context: {
            child: `${key}`,
            label: `${key}`,
            value: `${value}`,
            key: `${key}`,
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
  describe('getBloqs', () => {
    beforeEach(() => {
      mockSend = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockSend });
      mockReq = {} as Partial<Request>;
      mockRes = { status: mockStatus } as Partial<Response>;
    });

    it('should return 200 and a list of bloqs when called without query params', async () => {
      jest.spyOn(bloqService, 'getBloqs').mockResolvedValue([mockBloq]);

      await bloqController.getBloqs(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockBloq]);
      expect(bloqService.getBloqs).toHaveBeenCalled();
    });

    it('should return 200 and a list of bloqs when called with correct query params', async () => {
      jest.spyOn(bloqService, 'getBloqs').mockResolvedValue([mockBloq]);
      mockReq.query = { title: 'mockTitle' };
      const expectedFilter = {
        title: 'mockTitle',
      };
      await bloqController.getBloqs(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith([mockBloq]);
      expect(bloqService.getBloqs).toHaveBeenCalledWith(expectedFilter);
    });

    it('should return 400 when called with an invalid query parameter', async () => {
      jest.spyOn(bloqService, 'getBloqs').mockResolvedValue([mockBloq]);

      mockReq.query = { invalidParameter: 'mockParameter' };

      await bloqController.getBloqs(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidParameter', 'mockParameter'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'getBloqs').mockRejectedValue(new Error());

      await bloqController.getBloqs(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getBloqById', () => {
    beforeEach(() => {
      mockSend = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockSend });
      mockReq = {} as Partial<Request>;
      mockRes = { status: mockStatus } as Partial<Response>;
    });

    it('should return 200 and a single bloq when bloq id exists and is specified', async () => {
      jest.spyOn(bloqService, 'getBloqById').mockResolvedValue(mockBloq);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await bloqController.getBloqById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(mockBloq);
      expect(bloqService.getBloqById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 404 when specified bloq id does not exist', async () => {
      jest.spyOn(bloqService, 'getBloqById').mockResolvedValue(null);
      mockReq.params = { id: 'mockId' };
      const expectedId = 'mockId';

      await bloqController.getBloqById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(bloqService.getBloqById).toHaveBeenCalledWith(expectedId);
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'getBloqById').mockRejectedValue(new Error());

      await bloqController.getBloqById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('post', () => {
    beforeEach(() => {
      mockSend = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockSend });
      mockReq = {} as Partial<Request>;
      mockRes = { status: mockStatus } as Partial<Response>;
    });

    it('should return 201 and the created bloq when called with valid body', async () => {
      jest.spyOn(bloqService, 'createBloq').mockResolvedValue(mockBloq);
      mockReq.body = {
        title: 'mockTitle',
        address: 'mockAddress',
      };

      await bloqController.createBloq(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(mockBloq);
    });

    it('should return 400 when called with invalid body', async () => {
      mockReq.body = {
        invalidField: 'mockInvalidField',
      };

      await bloqController.createBloq(mockReq as Request, mockRes as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith(
        mockValidationError('invalidField', 'mockInvalidField'),
      );
    });

    it('should return 500 when an exception occurs', async () => {
      jest.spyOn(bloqService, 'createBloq').mockRejectedValue(new Error());

      await bloqController.createBloq(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });
});
