import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export interface TodoEntity extends BaseEntity {
  userId: UserEntity['id'];
  text: string;
  completed: boolean;
}

export type TodoCreateDTO = Omit<TodoEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type TodoUpdateDTO = Partial<Omit<TodoEntity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>; 