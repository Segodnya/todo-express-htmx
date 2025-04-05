import { BaseEntity } from '../types';
import { IBaseRepository } from '../repositories';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected repository: IBaseRepository<T>) {}

  async findAll(filter?: Partial<T>): Promise<T[]> {
    return this.repository.findAll(filter);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.repository.findOne(filter);
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
} 