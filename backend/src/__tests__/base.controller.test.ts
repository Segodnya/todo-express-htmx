import { Request, Response } from 'express';
import { BaseController } from '@/controllers/base.controller';
import { createMockResponse } from './utils/testHelpers';
import { ResponseUtils } from '@/utils/responseUtils';

// Mock ResponseUtils
jest.mock('@/utils/responseUtils', () => ({
  ResponseUtils: {
    sendHtmxError: jest.fn(),
    sendHtmxSuccess: jest.fn(),
    sendHtmxRedirect: jest.fn(),
    sendSimpleError: jest.fn(),
  },
}));

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Create a concrete implementation of BaseController for testing
class TestController extends BaseController {
  async testHandleRequest(
    req: Request,
    res: Response,
    shouldThrow: boolean,
    errorMessage?: string
  ): Promise<void> {
    await this.handleRequest(req, res, async () => {
      if (shouldThrow) {
        if (errorMessage) {
          throw new Error(errorMessage);
        } else {
          throw new Error('Test error');
        }
      }
    });
  }

  testHandleError(res: Response, message: string, status = 500): void {
    this.handleError(res, message, status);
  }

  testHandleAuthError(res: Response, message: string): void {
    this.handleAuthError(res, message);
  }

  testHandleValidationError(res: Response, message: string): void {
    this.handleValidationError(res, message);
  }

  testHandleNotFoundError(res: Response, message: string): void {
    this.handleNotFoundError(res, message);
  }

  testSendSuccess(res: Response, message: string): void {
    this.sendSuccess(res, message);
  }

  testSendRedirect(res: Response, url: string): void {
    this.sendRedirect(res, url);
  }

  // Method to test throwing a non-Error object
  async testHandleNonErrorThrow(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      throw { message: 'Non-error object' };
    });
  }
}

describe('BaseController', () => {
  let controller: TestController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create test controller
    controller = new TestController();

    // Create mock response
    mockResponse = createMockResponse();
  });

  describe('handleRequest', () => {
    it('should execute handler without error', async () => {
      // Act
      await controller.testHandleRequest(
        {} as Request,
        mockResponse as Response,
        false
      );

      // Assert - no error handling methods should be called
      expect(ResponseUtils.sendHtmxError).not.toHaveBeenCalled();
    });

    it('should handle errors thrown in handler', async () => {
      // Arrange
      const errorMessage = 'Custom error message';

      // Act
      await controller.testHandleRequest(
        {} as Request,
        mockResponse as Response,
        true,
        errorMessage
      );

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        errorMessage,
        500
      );
    });

    it('should handle non-Error objects thrown in handler', async () => {
      // Act
      await controller.testHandleNonErrorThrow(
        {} as Request,
        mockResponse as Response
      );

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        'An unexpected error occurred',
        500
      );
    });
  });

  describe('error handling methods', () => {
    it('should handle general errors', () => {
      // Act
      controller.testHandleError(
        mockResponse as Response,
        'Error message',
        500
      );

      // Assert
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        'Error message',
        500
      );
    });

    it('should handle auth errors', () => {
      // Act
      controller.testHandleAuthError(mockResponse as Response, 'Auth error');

      // Assert
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        'Auth error',
        401
      );
    });

    it('should handle validation errors', () => {
      // Act
      controller.testHandleValidationError(
        mockResponse as Response,
        'Validation error'
      );

      // Assert
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        'Validation error',
        400
      );
    });

    it('should handle not found errors', () => {
      // Act
      controller.testHandleNotFoundError(
        mockResponse as Response,
        'Not found error'
      );

      // Assert
      expect(ResponseUtils.sendHtmxError).toHaveBeenCalledWith(
        mockResponse,
        'Not found error',
        404
      );
    });
  });

  describe('response utility methods', () => {
    it('should send success response', () => {
      // Act
      controller.testSendSuccess(mockResponse as Response, 'Success message');

      // Assert
      expect(ResponseUtils.sendHtmxSuccess).toHaveBeenCalledWith(
        mockResponse,
        'Success message'
      );
    });

    it('should send redirect', () => {
      // Act
      controller.testSendRedirect(mockResponse as Response, '/some/url');

      // Assert
      expect(ResponseUtils.sendHtmxRedirect).toHaveBeenCalledWith(
        mockResponse,
        '/some/url'
      );
    });
  });
});
