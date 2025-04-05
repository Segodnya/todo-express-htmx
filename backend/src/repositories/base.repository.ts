import { BaseEntity } from '../types';

export interface IBaseRepository<T extends BaseEntity> {
  findAll(filter?: Partial<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
  abstract findAll(filter?: Partial<T>): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract findOne(filter: Partial<T>): Promise<T | null>;
  abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  
  protected generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  }
  
  protected getCurrentTimestamp(): number {
    return Date.now();
  }
} 