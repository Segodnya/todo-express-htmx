import { TodoEntity } from '../types';
import { IBaseRepository } from './base.repository';

export interface ITodoRepository extends IBaseRepository<TodoEntity> {
  findByUserId(userId: string): Promise<TodoEntity[]>;
} 