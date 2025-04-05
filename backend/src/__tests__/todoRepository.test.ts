import { ITodoRepository } from '@/repositories';
import { TodoEntity, TodoCreateDTO, TodoUpdateDTO } from '@/types';
import { createMockId } from './utils/testHelpers';
import fs from 'fs';

/**
 * Type-safe TodoRepository tests with in-memory database mock.
 * This demonstrates how to test database operations with a proper in-memory mock.
 */

// Mock implementation of TodoRepository with in-memory storage
class InMemoryTodoRepository implements ITodoRepository {
  // Make it protected so we can access it in tests via type assertion
  protected todos: Map<string, TodoEntity> = new Map();

  async findAll(filter?: Partial<TodoEntity>): Promise<TodoEntity[]> {
    const allTodos = Array.from(this.todos.values());

    if (!filter) {
      return allTodos;
    }

    return allTodos.filter((todo) => {
      return Object.entries(filter).every(([key, value]) => {
        return todo[key as keyof TodoEntity] === value;
      });
    });
  }

  async findById(id: string): Promise<TodoEntity | null> {
    return this.todos.get(id) || null;
  }

  async findOne(filter: Partial<TodoEntity>): Promise<TodoEntity | null> {
    const todo = Array.from(this.todos.values()).find((todo) => {
      return Object.entries(filter).every(([key, value]) => {
        return todo[key as keyof TodoEntity] === value;
      });
    });

    return todo || null;
  }

  async findByUserId(userId: string): Promise<TodoEntity[]> {
    return this.findAll({ userId });
  }

  async create(todoData: TodoCreateDTO): Promise<TodoEntity> {
    const timestamp = Date.now();
    const newTodo: TodoEntity = {
      ...todoData,
      id: createMockId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.todos.set(newTodo.id, newTodo);
    return newTodo;
  }

  async update(
    id: string,
    todoData: TodoUpdateDTO
  ): Promise<TodoEntity | null> {
    const existingTodo = this.todos.get(id);

    if (!existingTodo) {
      return null;
    }

    const updatedTodo: TodoEntity = {
      ...existingTodo,
      ...todoData,
      updatedAt: Date.now(),
    };

    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  // Helper method for tests to access todos
  getTodos(): Map<string, TodoEntity> {
    return this.todos;
  }
}

describe('TodoRepository', () => {
  let todoRepository: ITodoRepository;
  let inMemoryRepository: InMemoryTodoRepository;
  let mockUserId: string;
  let sampleTodos: TodoEntity[];

  beforeEach(() => {
    // Create an instance of our in-memory repository
    inMemoryRepository = new InMemoryTodoRepository();
    todoRepository = inMemoryRepository;
    mockUserId = 'test-user-id';

    // Setup sample todos
    sampleTodos = [
      {
        id: createMockId(),
        userId: mockUserId,
        text: 'First test todo',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: createMockId(),
        userId: mockUserId,
        text: 'Second test todo',
        completed: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: createMockId(),
        userId: 'different-user',
        text: 'Todo from another user',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    // Prefill the repository with sample data
    sampleTodos.forEach((todo: TodoEntity) => {
      inMemoryRepository.getTodos().set(todo.id, todo);
    });
  });

  describe('findAll', () => {
    it('should return all todos for a specific user', async () => {
      // Act
      const todos = await todoRepository.findByUserId(mockUserId);

      // Assert
      expect(todos).toHaveLength(2);
      expect(todos.every((todo) => todo.userId === mockUserId)).toBe(true);
    });

    it('should return an empty array if no todos exist for user', async () => {
      // Act
      const todos = await todoRepository.findByUserId('non-existent-user');

      // Assert
      expect(todos).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id if it exists', async () => {
      // Arrange
      const targetTodo = sampleTodos[0];

      // Act
      const todo = await todoRepository.findById(targetTodo.id);

      // Assert
      expect(todo).not.toBeNull();
      expect(todo?.id).toBe(targetTodo.id);
      expect(todo?.text).toBe(targetTodo.text);
    });

    it('should return null if todo does not exist', async () => {
      // Act
      const todo = await todoRepository.findById('non-existent-id');

      // Assert
      expect(todo).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new todo', async () => {
      // Arrange
      const todoData: TodoCreateDTO = {
        userId: mockUserId,
        text: 'New test todo',
        completed: false,
      };

      // Act
      const createdTodo = await todoRepository.create(todoData);

      // Assert
      expect(createdTodo).toMatchObject(todoData);
      expect(createdTodo.id).toBeDefined();
      expect(createdTodo.createdAt).toBeDefined();
      expect(createdTodo.updatedAt).toBeDefined();

      // Verify it was added to the repository
      const storedTodo = await todoRepository.findById(createdTodo.id);
      expect(storedTodo).toEqual(createdTodo);
    });
  });

  describe('update', () => {
    it('should update and return an existing todo', async () => {
      // Arrange
      const targetTodo = sampleTodos[0];
      const updateData: TodoUpdateDTO = {
        text: 'Updated todo text',
        completed: true,
      };

      // Store the original Date.now
      const originalNow = Date.now;
      const updatedTimestamp = Date.now() + 1000;

      try {
        // Mock Date.now to return a fixed time
        global.Date.now = jest.fn(() => updatedTimestamp);

        // Act
        const updatedTodo = await todoRepository.update(
          targetTodo.id,
          updateData
        );

        // Assert
        expect(updatedTodo).not.toBeNull();
        expect(updatedTodo?.text).toBe(updateData.text);
        expect(updatedTodo?.completed).toBe(updateData.completed);
        expect(updatedTodo?.id).toBe(targetTodo.id);
        expect(updatedTodo?.userId).toBe(targetTodo.userId);
        expect(updatedTodo?.updatedAt).toBe(updatedTimestamp);
      } finally {
        // Restore the original Date.now
        global.Date.now = originalNow;
      }
    });

    it('should return null if todo to update does not exist', async () => {
      // Arrange
      const updateData: TodoUpdateDTO = {
        text: 'Updated todo text',
        completed: true,
      };

      // Act
      const updatedTodo = await todoRepository.update(
        'non-existent-id',
        updateData
      );

      // Assert
      expect(updatedTodo).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing todo and return true', async () => {
      // Arrange
      const targetTodo = sampleTodos[0];

      // Act
      const result = await todoRepository.delete(targetTodo.id);

      // Assert
      expect(result).toBe(true);

      // Verify it was removed from the repository
      const deletedTodo = await todoRepository.findById(targetTodo.id);
      expect(deletedTodo).toBeNull();
    });

    it('should return false if todo to delete does not exist', async () => {
      // Act
      const result = await todoRepository.delete('non-existent-id');

      // Assert
      expect(result).toBe(false);
    });
  });
});
