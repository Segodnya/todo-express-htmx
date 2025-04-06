import { Request, Response, NextFunction } from 'express';
import { themeMiddleware, getUserTheme } from '@/utils/theme';
import {
  createMockRequest,
  createMockResponse,
  defaultTestUser,
} from './utils/testHelpers';
import { ThemeType, ThemeColor, ThemeSettings } from '@/utils/theme';

describe('Theme Middleware', () => {
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockNext = jest.fn();
  });

  describe('getUserTheme', () => {
    it('should return theme settings from user object', () => {
      // Arrange
      const user = {
        settings: {
          theme: {
            type: 'dark' as ThemeType,
            color: 'blue' as ThemeColor,
          },
        },
      };

      // Act
      const result = getUserTheme(user);

      // Assert
      expect(result).toEqual({
        type: 'dark',
        color: 'blue',
      });
    });

    it('should return default theme when user has no theme settings', () => {
      // Arrange
      const user = {
        settings: {
          language: 'en',
          theme: {
            type: 'system' as ThemeType,
          },
        },
      };

      // Act
      const result = getUserTheme(user);

      // Assert
      expect(result).toEqual({
        type: 'system',
      });
    });

    it('should return default theme when user has no settings', () => {
      // Arrange
      const user = {
        settings: {
          theme: {
            type: 'system' as ThemeType,
          },
        },
      };

      // Act
      const result = getUserTheme(user);

      // Assert
      expect(result).toEqual({
        type: 'system',
      });
    });
  });

  describe('themeMiddleware', () => {
    it('should set theme from user session if available', () => {
      // Arrange
      const mockRequest = createMockRequest({
        user: {
          ...defaultTestUser,
          settings: {
            ...defaultTestUser.settings,
            theme: {
              type: 'dark' as ThemeType,
              color: 'blue' as ThemeColor,
            },
          },
        },
      });
      const mockResponse = createMockResponse();

      // Act
      themeMiddleware(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.theme).toEqual({
        type: 'dark',
        color: 'blue',
      });
      expect(mockResponse.locals.theme).toEqual({
        type: 'dark',
        color: 'blue',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set theme from cookies if no user session', () => {
      // Arrange
      const mockRequest = createMockRequest({
        cookies: {
          theme_type: 'light',
        },
      });
      delete mockRequest.session?.user; // No user session

      const mockResponse = createMockResponse();

      // Act
      themeMiddleware(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.theme).toEqual({
        type: 'light',
      });
      expect(mockResponse.locals.theme).toEqual({
        type: 'light',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set special theme with color from cookies', () => {
      // Arrange
      const mockRequest = createMockRequest({
        cookies: {
          theme_type: 'special',
          theme_color: 'green',
        },
      });
      delete mockRequest.session?.user; // No user session

      const mockResponse = createMockResponse();

      // Act
      themeMiddleware(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.theme).toEqual({
        type: 'special',
        color: 'green',
      });
      expect(mockResponse.locals.theme).toEqual({
        type: 'special',
        color: 'green',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set default theme if no user session or cookies', () => {
      // Arrange
      const mockRequest = createMockRequest();
      delete mockRequest.session?.user; // No user session
      delete mockRequest.cookies; // No cookies

      const mockResponse = createMockResponse();

      // Act
      themeMiddleware(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.theme).toEqual({
        type: 'system',
      });
      expect(mockResponse.locals.theme).toEqual({
        type: 'system',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should ignore invalid theme type in cookies', () => {
      // Arrange
      const mockRequest = createMockRequest({
        cookies: {
          theme_type: 'invalid',
        },
      });
      delete mockRequest.session?.user; // No user session

      const mockResponse = createMockResponse();

      // Act
      themeMiddleware(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.theme).toEqual({
        type: 'system',
      });
      expect(mockResponse.locals.theme).toEqual({
        type: 'system',
      });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
