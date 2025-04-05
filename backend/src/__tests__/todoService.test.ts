import { TodoService } from '@/services';
import { ITodoRepository } from '@/repositories';
import { TodoEntity, TodoCreateDTO, TodoUpdateDTO } from '@/types';

/**
 * Type-safe TodoService tests with strongly typed mocks.
 * Demonstrates how to properly test the service layer with mocked repositories.
 */

describe('TodoService', () => {
  let todoService: TodoService;
  let mockRepository: jest.Mocked<ITodoRepository>;

  const mockUserId = 'test-user-id';
  const mockTimestamp = Date.now();

  // Sample todo for testing
  const mockTodo: TodoEntity = {
    id: '1',
    userId: mockUserId,
    text: 'Test Todo',
    completed: false,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
  };

  beforeEach(() => {
    // Create mock repository with jest functions
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ITodoRepository>;

    // Initialize the service with the mock repository
    todoService = new TodoService(mockRepository);
  });

  describe('getAllTodosByUserId', () => {
    it('should return all todos for a user', async () => {
      // Arrange - Set up mock repo to return sample todos
      mockRepository.findByUserId.mockResolvedValue([mockTodo]);

      // Act
      const result = await todoService.getAllTodosByUserId(mockUserId);

      // Assert
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual([mockTodo]);
    });

    it('should return empty array when no todos exist', async () => {
      // Arrange
      mockRepository.findByUserId.mockResolvedValue([]);

      // Act
      const result = await todoService.getAllTodosByUserId(mockUserId);

      // Assert
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual([]);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      // Arrange
      const todoData: TodoCreateDTO = {
        userId: mockUserId,
        text: 'New Todo',
        completed: false,
      };

      const createdTodo: TodoEntity = {
        ...todoData,
        id: '2',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockRepository.create.mockResolvedValue(createdTodo);

      // Act
      const result = await todoService.createTodo(todoData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(todoData);
      expect(result).toEqual(createdTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      // Arrange
      const todoId = '1';
      const updateData: TodoUpdateDTO = {
        text: 'Updated Todo',
        completed: true,
      };

      const updatedTodo: TodoEntity = {
        ...mockTodo,
        ...updateData,
        updatedAt: mockTimestamp + 1000, // Later timestamp
      };

      mockRepository.findOne.mockResolvedValue(mockTodo);
      mockRepository.update.mockResolvedValue(updatedTodo);

      // Act
      const result = await todoService.updateTodo(
        todoId,
        mockUserId,
        updateData
      );

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.update).toHaveBeenCalledWith(todoId, updateData);
      expect(result).toEqual(updatedTodo);
    });

    it('should return null if todo to update does not exist', async () => {
      // Arrange
      const todoId = 'non-existent';
      const updateData: TodoUpdateDTO = {
        text: 'Updated Todo',
        completed: true,
      };

      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await todoService.updateTodo(
        todoId,
        mockUserId,
        updateData
      );

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('toggleTodoCompletion', () => {
    it('should toggle todo completion status to true', async () => {
      // Arrange
      const todoId = '1';
      const existingTodo = { ...mockTodo, completed: false };

      const updatedTodo = {
        ...existingTodo,
        completed: true,
        updatedAt: mockTimestamp + 1000,
      };

      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.update.mockResolvedValue(updatedTodo);

      // Act
      const result = await todoService.toggleTodoCompletion(todoId, mockUserId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.update).toHaveBeenCalledWith(todoId, {
        completed: true,
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should toggle todo completion status to false', async () => {
      // Arrange
      const todoId = '1';
      const existingTodo = { ...mockTodo, completed: true };

      const updatedTodo = {
        ...existingTodo,
        completed: false,
        updatedAt: mockTimestamp + 1000,
      };

      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.update.mockResolvedValue(updatedTodo);

      // Act
      const result = await todoService.toggleTodoCompletion(todoId, mockUserId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.update).toHaveBeenCalledWith(todoId, {
        completed: false,
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should return null if todo does not exist', async () => {
      // Arrange
      const todoId = 'non-existent';

      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await todoService.toggleTodoCompletion(todoId, mockUserId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return true on success', async () => {
      // Arrange
      const todoId = '1';
      mockRepository.findOne.mockResolvedValue(mockTodo);
      mockRepository.delete.mockResolvedValue(true);

      // Act
      const result = await todoService.deleteTodo(todoId, mockUserId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(todoId);
      expect(result).toBe(true);
    });

    it('should return false if todo does not exist', async () => {
      // Arrange
      const todoId = 'non-existent';
      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await todoService.deleteTodo(todoId, mockUserId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        id: todoId,
        userId: mockUserId,
      });
      expect(mockRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
