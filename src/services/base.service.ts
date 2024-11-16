import { Model, Document } from 'mongoose';

export abstract class BaseService<T extends Document> {
  constructor(private model: Model<T>) {}

  abstract mapToDto(data: T): any;

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
    return this.mapToDto(await created.save());
  }

  async update(id: string, data: any): Promise<any | null> {
    const updated = await this.model.findOneAndUpdate({ id }, data);
    return updated ? this.mapToDto(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findOneAndDelete({ id });
    return result !== null;
  }
}
