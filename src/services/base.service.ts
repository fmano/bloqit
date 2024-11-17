import { Model, Document } from 'mongoose';
import logger from '../utils/logger.util';

export abstract class BaseService<T extends Document> {
  constructor(protected model: Model<T>) {}

  protected abstract mapToDto(data: T): any;

  async getAll(filter: object = {}): Promise<any[]> {
    const data = await this.model.find(filter);
    return data.map(this.mapToDto);
  }

  async getById(id: string): Promise<any | null> {
    const data = await this.model.findOne({ id });
    return data ? this.mapToDto(data) : null;
  }

  async create(data: any): Promise<any> {
    const created = new this.model(data);
    const createdDto = this.mapToDto(await created.save());
    logger.info(`Created object with id: ${created.id}`);
    return createdDto;
  }

  async update(id: string, data: any): Promise<any | null> {
    const updated = await this.model.findOneAndUpdate({ id }, data);
    const updatedDto = updated ? this.mapToDto(updated) : null;
    logger.info(`Updated object with id: ${id}`);
    return updatedDto;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findOneAndDelete({ id });
    const deleted = result !== null;
    deleted
      ? logger.info(`Deleted object with id: ${id}`)
      : logger.warn(`Attempted to delete object that does not exist: ${id}`);
    return deleted;
  }
}
