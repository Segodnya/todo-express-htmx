import { TodoCreateDTO, TodoEntity, TodoUpdateDTO } from '../types';
import { BaseService } from './base.service';
import { ITodoRepository } from '../repositories';

export class TodoService extends BaseService<TodoEntity> {
  constructor(private todoRepository: ITodoRepository) {
    super(todoRepository);
  }

  async getAllTodosByUserId(userId: string): Promise<TodoEntity[]> {
    return this.todoRepository.findByUserId(userId);
  }

  async createTodo(data: TodoCreateDTO): Promise<TodoEntity> {
    return this.create(data);
  }

  async updateTodo(id: string, userId: string, updates: TodoUpdateDTO): Promise<TodoEntity | null> {
    // First check if the todo exists and belongs to the user
    const todo = await this.todoRepository.findOne({ id, userId });
    if (!todo) {
      return null;
    }
    
    // Then update the todo
    return this.update(id, updates);
  }

  async toggleTodoCompletion(id: string, userId: string): Promise<TodoEntity | null> {
    // Get the todo to check if it exists and belongs to the user
    const todo = await this.todoRepository.findOne({ id, userId });
    if (!todo) {
      return null;
    }
    
    // Toggle the completed status
    return this.update(id, { completed: !todo.completed });
  }

  async deleteTodo(id: string, userId: string): Promise<boolean> {
    // First check if the todo exists and belongs to the user
    const todo = await this.todoRepository.findOne({ id, userId });
    if (!todo) {
      return false;
    }
    
    // Then delete the todo
    return this.delete(id);
  }
} 