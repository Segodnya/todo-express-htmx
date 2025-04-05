import { User } from './user';

export interface Todo {
  id: string;
  userId: User['id'];
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}
