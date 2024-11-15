import * as bloqController from './bloq.controller';
import * as bloqService from '../services/bloq.service';
import { Request, Response } from 'express';

describe('BloqController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockSend });
    mockReq = {} as Partial<Request>;
    mockRes = { status: mockStatus } as Partial<Response>;
  });

  it('should return 200 and a list of bloqs when called', async () => {
    const mockBloqs = [
      {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      },
    ];
    jest.spyOn(bloqService, 'getAllBloqs').mockResolvedValue(mockBloqs);

    await bloqController.getAllBloqs(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(mockBloqs);
    expect(bloqService.getAllBloqs).toHaveBeenCalled();
  });
});
