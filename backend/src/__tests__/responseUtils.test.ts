import { Response } from 'express';
import { ResponseUtils } from '@/utils/responseUtils';
import { createMockResponse } from './utils/testHelpers';

describe('ResponseUtils', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create a fresh mock response for each test
    mockResponse = createMockResponse();
  });

  describe('sendHtmxError', () => {
    it('should set status and send error response with proper headers', () => {
      // Arrange
      const errorMessage = 'Test error message';
      const statusCode = 400;

      // Act
      ResponseUtils.sendHtmxError(
        mockResponse as Response,
        errorMessage,
        statusCode
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('text-red-800')
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('<%= message %>')
      );
    });

    it('should default to 400 status if not provided', () => {
      // Arrange
      const errorMessage = 'Internal server error';

      // Act
      ResponseUtils.sendHtmxError(mockResponse as Response, errorMessage);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('sendHtmxSuccess', () => {
    it('should send success response with proper headers', () => {
      // Arrange
      const successMessage = 'Operation successful';

      // Act
      ResponseUtils.sendHtmxSuccess(mockResponse as Response, successMessage);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('text-green-800')
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('<%= message %>')
      );
    });
  });

  describe('sendHtmxRedirect', () => {
    it('should set redirect header', () => {
      // Arrange
      const url = '/dashboard';

      // Act
      ResponseUtils.sendHtmxRedirect(mockResponse as Response, url);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.header).toHaveBeenCalledWith('HX-Redirect', url);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('sendSimpleError', () => {
    it('should set status and send plain error message', () => {
      // Arrange
      const errorMessage = 'Simple error message';
      const statusCode = 404;

      // Act
      ResponseUtils.sendSimpleError(
        mockResponse as Response,
        errorMessage,
        statusCode
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('text-red-500')
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage)
      );
    });

    it('should default to 400 status if not provided', () => {
      // Arrange
      const errorMessage = 'Internal error';

      // Act
      ResponseUtils.sendSimpleError(mockResponse as Response, errorMessage);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage)
      );
    });
  });
});
