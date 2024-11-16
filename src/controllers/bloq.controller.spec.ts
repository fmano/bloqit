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

  const mockBloqs = [
    {
      id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      title: 'Luitton Vouis Champs Elysées',
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
    },
  ];

  beforeEach(() => {
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockSend });
    mockReq = {} as Partial<Request>;
    mockRes = { status: mockStatus } as Partial<Response>;
  });

  it('should return 200 and a list of bloqs when called without query params', async () => {
    jest.spyOn(bloqService, 'getBloqs').mockResolvedValue(mockBloqs);

    await bloqController.getBloqs(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(mockBloqs);
    expect(bloqService.getBloqs).toHaveBeenCalled();
  });

  it('should return 200 and a list of bloqs when called with correct query params', async () => {
    jest.spyOn(bloqService, 'getBloqs').mockResolvedValue(mockBloqs);

    mockReq.query = { title: 'mockTitle' };
    const expectedFilter = {
      title: 'mockTitle',
    };

    await bloqController.getBloqs(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(mockBloqs);
    expect(bloqService.getBloqs).toHaveBeenCalledWith(expectedFilter);
  });

  it('should return 400 when called with an invalid query parameter', async () => {
    jest.spyOn(bloqService, 'getBloqs').mockResolvedValue(mockBloqs);

    mockReq.query = { invalidParameter: 'mockParameter' };

    await bloqController.getBloqs(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockSend).toHaveBeenCalledWith(
      mockValidationError('invalidParameter', 'mockParameter'),
    );
  });
});
