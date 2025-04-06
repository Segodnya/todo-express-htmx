import { Request, Response } from 'express';
import { LanguageController } from '@/controllers';
import { UserService } from '@/services';
import { createMockRequest, createMockResponse } from './utils/testHelpers';

describe('LanguageController', () => {
  let languageController: LanguageController;
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
          language: 'en'
        }
      }),
    } as unknown as jest.Mocked<UserService>;

    // Initialize the controller with mocked services
    languageController = new LanguageController(mockUserService);

    // Create a mock response object
    mockResponse = createMockResponse();
  });

  describe('changeLanguage', () => {
    it('should update language for a logged-in user', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        params: { lang: 'es' },
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
          language: 'es'
        }
      });

      // Act
      await languageController.changeLanguage(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Check if user settings were updated in session
      expect(mockRequest.session?.user?.settings?.language).toBe('es');

      // Check if user service was called to update the database
      expect(mockUserService.update).toHaveBeenCalledWith('test-user-id', {
        settings: {
          language: 'es',
        },
      });

      // Check if cookie was set
      expect(mockResponse.cookie).toHaveBeenCalledWith('i18next', 'es');

      // Check if redirected to the returnTo URL
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
    });

    it('should update language for non-logged-in users', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      delete mockRequest.session?.user; // User not logged in

      mockRequest.params = { lang: 'fr' };
      mockRequest.query = { returnTo: '/auth/signin' };

      // Act
      await languageController.changeLanguage(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Check if user service was NOT called (since no user is logged in)
      expect(mockUserService.update).not.toHaveBeenCalled();

      // Check if cookie was set
      expect(mockResponse.cookie).toHaveBeenCalledWith('i18next', 'fr');

      // Check if redirected to the returnTo URL
      expect(mockResponse.redirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should return 400 for invalid language code', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { lang: 'invalid' };

      // Act
      await languageController.changeLanguage(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid language code');
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should use default returnTo if not provided', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { lang: 'pt' };
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
          language: 'pt'
        }
      });

      // Act
      await languageController.changeLanguage(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith('/');
    });

    it('should handle database update errors gracefully', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      mockRequest.params = { lang: 'es' };

      // Make the database update fail
      mockUserService.update.mockRejectedValueOnce(new Error('Database error'));

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Act
      await languageController.changeLanguage(
        mockRequest as unknown as Request,
        mockResponse as Response
      );

      // Assert
      // Should still redirect and set cookies despite the database error
      expect(mockResponse.cookie).toHaveBeenCalledWith('i18next', 'es');
      expect(mockResponse.redirect).toHaveBeenCalledWith('/');
    });
  });
}); 