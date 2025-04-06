import { Request, Response } from 'express';
import { LanguageController } from '../controllers/language.controller';
import { UserService } from '../services';
import { defaultTestUser } from './utils/testHelpers';
import { Session } from 'express-session';

describe('LanguageController', () => {
  let languageController: LanguageController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create mock user service
    mockUserService = {
      update: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    // Initialize the controller
    languageController = new LanguageController(mockUserService);

    // Create mock request
    mockRequest = {
      params: { lang: 'es' },
      query: { returnTo: '/todos' },
      session: {
        id: 'test-session-id',
        cookie: {},
        regenerate: jest.fn(),
        destroy: jest.fn(),
        save: jest.fn(),
        touch: jest.fn(),
        user: {
          ...defaultTestUser,
          userId: 'test-user-id',
        },
      } as unknown as Session,
    };

    // Create mock response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
      cookie: jest.fn(),
    };
  });

  describe('changeLanguage', () => {
    it('should update language for logged-in user', async () => {
      // Act
      await languageController.changeLanguage(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.update).toHaveBeenCalledWith('test-user-id', {
        settings: {
          language: 'es',
          theme: defaultTestUser.settings.theme,
        },
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith('i18next', 'es');
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
    });

    it('should set cookie for non-logged-in user', async () => {
      // Arrange
      delete mockRequest.session?.user;

      // Act
      await languageController.changeLanguage(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(mockResponse.cookie).toHaveBeenCalledWith('i18next', 'es');
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
    });

    it('should handle invalid language code', async () => {
      // Arrange
      if (mockRequest.params) {
        mockRequest.params.lang = 'invalid';
      }

      // Act
      await languageController.changeLanguage(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.update).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid language code');
    });

    it('should use default return URL if not provided', async () => {
      // Arrange
      delete mockRequest.query?.returnTo;

      // Act
      await languageController.changeLanguage(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith('/');
    });
  });
});
