/**
 * @todo
 */
//@ts-nocheck

import { Response } from 'express';
import { TodoController } from '@/controllers';
import { TodoService } from '@/services';
import {
  TodoEntity,
  TodoCreateDTO,
  TodoUpdateDTO,
  AuthenticatedRequest,
} from '@/types';
import {
  createMockRequest,
  createMockResponse,
  MockUser,
} from './utils/testHelpers';

/**
 * Type-safe TodoController tests with strongly typed mocks.
 * Currently contains a basic setup, ready for implementation of real tests later.
 *
 * Note: We're using 'as any' in a few places to work around Express type limitations
 * when mocking request/response objects. In a real project, you might want to create
 * more sophisticated type wrappers.
 */

describe('TodoController', () => {
  let todoController: TodoController;
  let mockTodoService: jest.Mocked<TodoService>;
  let mockResponse: Partial<Response>;
  let mockTodo: TodoEntity;
  let mockUser: MockUser;

  const mockTimestamp = Date.now();

  beforeEach(() => {
    // Create mock for TodoService
    mockTodoService = {
      getAllTodosByUserId: jest.fn(),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      toggleTodoCompletion: jest.fn(),
      deleteTodo: jest.fn(),
    } as unknown as jest.Mocked<TodoService>;

    // Initialize the controller with the mock service
    todoController = new TodoController(mockTodoService);

    // Setup mock response
    mockResponse = createMockResponse();

    // Setup mock user
    mockUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    };

    // Create a mock Todo for testing
    mockTodo = {
      id: '1',
      userId: mockUser.userId,
      text: 'Test Todo',
      completed: false,
      createdAt: mockTimestamp,
      updatedAt: mockTimestamp,
    };
  });

  describe('getAllTodos', () => {
    it('should render the todos page with todos from the service', async () => {
      // Arrange
      const mockRequest = createMockRequest({ user: mockUser });
      mockTodoService.getAllTodosByUserId.mockResolvedValue([mockTodo]);

      // Act
      await todoController.getAllTodos(
        mockRequest as any,
        mockResponse as Response,
        () => {} // Add empty next function as third parameter
      );

      // Assert
      expect(mockTodoService.getAllTodosByUserId).toHaveBeenCalledWith(
        mockUser.userId
      );
      expect(mockResponse.render).toHaveBeenCalledWith(
        'todos/index',
        expect.objectContaining({
          todos: [mockTodo],
          user: mockUser,
        })
      );
    });

    // Additional test cases would be added here
  });

  describe('createTodo', () => {
    it('should create a todo and render the todo item partial', async () => {
      // Arrange
      const todoText = 'New Todo';
      const mockRequest = createMockRequest({
        user: mockUser,
        body: { text: todoText },
      });

      const todoData: TodoCreateDTO = {
        userId: mockUser.userId,
        text: todoText,
        completed: false,
      };

      const createdTodo: TodoEntity = {
        ...todoData,
        id: '2',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockTodoService.createTodo.mockResolvedValue(createdTodo);

      // Act
      await todoController.createTodo(
        mockRequest as any,
        mockResponse as Response,
        () => {} // Add empty next function as third parameter
      );

      // Assert
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(todoData);
      expect(mockResponse.render).toHaveBeenCalledWith(
        'partials/todo-item',
        expect.objectContaining({
          todo: createdTodo,
          layout: false,
        })
      );
    });

    // Additional test cases would be added here
  });

  // Additional describe blocks for other controller methods would be added here
});
