import { Request, Response } from 'express';
import { ThemeController } from '@/controllers';
import { UserService } from '@/services';
import {
  createMockRequest,
  createMockResponse,
  defaultTestUser,
} from './utils/testHelpers';
import { ThemeType, ThemeColor } from '@/utils/theme';

describe('ThemeController', () => {
  let themeController: ThemeController;
  let mockUserService: jest.Mocked<UserService>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create mock user service
    mockUserService = {
      update: jest.fn().mockResolvedValue({
        id: 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User',
        password: 'hashed_password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          language: 'en',
          theme: {
            type: 'system' as ThemeType,
          },
        },
      }),
    } as unknown as jest.Mocked<UserService>;

    // Initialize the controller with mocked services
    themeController = new ThemeController(mockUserService);

    // Create a mock response object
    mockResponse = createMockResponse();
  });

  describe('changeTheme', () => {
    it('should update theme for a logged-in user', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        params: { theme: 'dark' },
        query: { returnTo: '/todos' },
      });

      // Set up mock for update method to resolve successfully
      mockUserService.update.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          language: 'en',
          theme: {
            type: 'dark' as ThemeType,
          },
        },
      });

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Check if user settings were updated in session
      expect(mockRequest.session?.user?.settings?.theme?.type).toBe('dark');

      // Check if user service was called to update the database
      expect(mockUserService.update).toHaveBeenCalledWith('test-user-id', {
        settings: {
          language: 'en', // Preserves existing language
          theme: {
            type: 'dark',
          },
        },
      });

      // Check if cookie was set
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'theme_type',
        'dark',
        expect.any(Object)
      );

      // Check if redirected to the returnTo URL
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
    });

    it('should update special theme with color for a logged-in user', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        params: { theme: 'special' },
        query: { color: 'blue', returnTo: '/todos' },
      });

      // Set up mock for update method to resolve successfully
      mockUserService.update.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          language: 'en',
          theme: {
            type: 'special' as ThemeType,
            color: 'blue' as ThemeColor,
          },
        },
      });

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Check if user settings were updated in session
      expect(mockRequest.session?.user?.settings?.theme?.type).toBe('special');
      expect(mockRequest.session?.user?.settings?.theme?.color).toBe('blue');

      // Check if user service was called to update the database
      expect(mockUserService.update).toHaveBeenCalledWith('test-user-id', {
        settings: {
          language: 'en', // Preserves existing language
          theme: {
            type: 'special',
            color: 'blue',
          },
        },
      });

      // Check if cookies were set
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'theme_type',
        'special',
        expect.any(Object)
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'theme_color',
        'blue',
        expect.any(Object)
      );

      // Check if redirected to the returnTo URL
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
    });

    it('should update theme for non-logged-in users', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      delete mockRequest.session?.user; // User not logged in

      mockRequest.params = { theme: 'light' };
      mockRequest.query = { returnTo: '/auth/signin' };

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Check if user service was NOT called (since no user is logged in)
      expect(mockUserService.update).not.toHaveBeenCalled();

      // Check if cookie was set
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'theme_type',
        'light',
        expect.any(Object)
      );

      // Check if redirected to the returnTo URL
      expect(mockResponse.redirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should return 400 for invalid theme type', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { theme: 'invalid' };

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid theme type');
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid color with special theme', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { theme: 'special' };
      mockRequest.query = { color: 'invalid' };

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid theme color');
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should use default returnTo if not provided', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { theme: 'system' };
      // Not setting query.returnTo

      // Explicitly mock a resolved Promise for this test
      mockUserService.update.mockResolvedValueOnce({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          language: 'en',
          theme: {
            type: 'system' as ThemeType,
          },
        },
      });

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith('/');
    });

    it('should handle database update errors gracefully', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { theme: 'dark' };

      // Make the database update fail
      mockUserService.update.mockRejectedValueOnce(new Error('Database error'));

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Act
      await themeController.changeTheme(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Should still redirect and set cookies despite the database error
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'theme_type',
        'dark',
        expect.any(Object)
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith('/');

      // Console.error should have been called
      expect(console.error).toHaveBeenCalled();
    });
  });
});
