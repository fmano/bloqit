import { BloqService } from './bloq.service';
import { Bloq } from '../models/bloq.model';
import { BloqDto } from '../models/bloq-dto.model';

jest.mock('../utils/logger.util');

describe('BloqService', () => {
  let bloqService: BloqService;

  const mockBloqDto = (id: string, title: string, address: string): BloqDto => {
    return { id, title, address };
  };

  // returns bloqs with more parameters than in BloqDto to mock db model behaviour
  const mockBloqModel = (id: string, title: string, address: string) => {
    const mockBloq = mockBloqDto(id, title, address);
    return { _id: 'mockDefaultId', ...mockBloq };
  };

  beforeEach(() => {
    bloqService = new BloqService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return a list of BloqDtos', async () => {
      const foundBloqs = [
        mockBloqModel('id1', 'title1', 'address1'),
        mockBloqModel('id2', 'title2', 'address2'),
      ];

      const expectedBloqs = [
        mockBloqDto('id1', 'title1', 'address1'),
        mockBloqDto('id2', 'title2', 'address2'),
      ];

      jest.spyOn(Bloq, 'find').mockResolvedValue(foundBloqs);

      const mappedBloqs = await bloqService.getAll();

      expect(mappedBloqs).toEqual(expectedBloqs);
    });
  });

  describe('getById', () => {
    it('should return a single bloq when provided id exists', async () => {
      const foundBloq = mockBloqModel('id1', 'title1', 'address1');
      const expectedBloq = mockBloqDto('id1', 'title1', 'address1');

      jest.spyOn(Bloq, 'findOne').mockResolvedValue(foundBloq);

      const mappedBloq = await bloqService.getById('id1');

      expect(mappedBloq).toEqual(expectedBloq);
    });

    it('should return null when provided id does not exist', async () => {
      jest.spyOn(Bloq, 'findOne').mockResolvedValue(null);

      const mappedBloq = await bloqService.getById('id1');

      expect(mappedBloq).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new Bloq and return a BloqDto', async () => {
      const newBloq = mockBloqModel('id1', 'title1', 'address1');
      const expectedBloq = mockBloqDto('id1', 'title1', 'address1');

      jest.spyOn(Bloq.prototype, 'save').mockResolvedValue(newBloq);

      const createdBloq = await bloqService.create(newBloq);

      expect(createdBloq).toEqual(expectedBloq);
    });
  });

  describe('update', () => {
    it('should return an updated Bloq if the provided bloq id exists', async () => {
      const existingBloq = mockBloqModel('id1', 'title1', 'address1');
      const expectedBloq = mockBloqDto('id1', 'title1', 'address1');

      jest.spyOn(Bloq, 'findOneAndUpdate').mockResolvedValue(existingBloq);

      const updatedBloq = await bloqService.update('id1', {
        title: 'mockTitle',
        address: 'mockAddress',
      });

      expect(updatedBloq).toEqual(expectedBloq);
    });

    it('should return null when provided id does not exist', async () => {
      jest.spyOn(Bloq, 'findOneAndUpdate').mockResolvedValue(null);

      const updatedBloq = await bloqService.update('id1', {
        title: 'mockTitle',
        address: 'mockAddress',
      });
      expect(updatedBloq).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true if the provided bloq id exists', async () => {
      const deletedBloq = mockBloqModel('id1', 'title1', 'address1');

      jest.spyOn(Bloq, 'findOneAndDelete').mockResolvedValue(deletedBloq);

      const deleteResult = await bloqService.delete('id1');

      expect(deleteResult).toBeTruthy();
    });

    it('should return false if the provided bloq id does not exist', async () => {
      jest.spyOn(Bloq, 'findOneAndDelete').mockResolvedValue(null);

      const deleteResult = await bloqService.delete('id1');

      expect(deleteResult).toBeFalsy();
    });
  });
});
