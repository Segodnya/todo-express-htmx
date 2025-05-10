import { TodoEntity } from '../../types';
import { FileBaseRepository } from './file-base.repository';

export class FileTodoRepository extends FileBaseRepository<TodoEntity> {
  constructor() {
    super('todos');
  }

  async findByUserId(userId: string): Promise<TodoEntity[]> {
    return this.findAll({ userId });
  }
} 