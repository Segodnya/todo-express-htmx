import { Request, Response } from 'express';
import { AuthController } from '@/controllers';
import { AuthService } from '@/services';
import { UserEntity, UserCreateDTO, UserLoginDTO } from '@/types';
import {
  createMockRequest,
  createMockResponse,
  defaultTestUser,
} from './utils/testHelpers';

/**
 * Type-safe tests for the AuthController
 * Note: We're using 'as any' in a few places to work around Express type limitations
 */
describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockResponse: Partial<Response>;

  const mockUser: UserEntity = {
    ...defaultTestUser,
    id: 'user-123',
    password: 'hashed_password123',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    // Create mock services and dependencies
    mockAuthService = {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    // Initialize the controller with mocked services
    authController = new AuthController(mockAuthService);

    // Create a mock response object
    mockResponse = createMockResponse();
  });

  describe('renderSignIn', () => {
    it('should render the sign in page if user is not logged in', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      delete mockRequest.session?.user; // User not logged in

      // Act
      await authController.renderSignIn(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.render).toHaveBeenCalledWith('auth/signin', {
        title: 'Sign In',
        user: null,
      });
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to /todos if user is already logged in', async () => {
      // Arrange
      const mockRequest = createMockRequest(); // Default includes a logged-in user

      // Act
      await authController.renderSignIn(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
      expect(mockResponse.render).not.toHaveBeenCalled();
    });
  });

  describe('renderSignUp', () => {
    it('should render the sign up page if user is not logged in', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      delete mockRequest.session?.user; // User not logged in

      // Act
      await authController.renderSignUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.render).toHaveBeenCalledWith('auth/signup', {
        title: 'Sign Up',
        user: null,
      });
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to /todos if user is already logged in', async () => {
      // Arrange
      const mockRequest = createMockRequest(); // Default includes a logged-in user

      // Act
      await authController.renderSignUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith('/todos');
      expect(mockResponse.render).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should successfully log in a user with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = createMockRequest({
        body: credentials,
      });
      delete mockRequest.session?.user; // User not logged in yet

      mockAuthService.loginUser.mockResolvedValue(mockUser);

      // Act
      await authController.signIn(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(credentials);
      expect(mockRequest.session?.user).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        settings: mockUser.settings,
      });
      // Check HTMX redirect instead of standard redirect
      expect(mockResponse.header).toHaveBeenCalledWith('HX-Redirect', '/todos');
    });

    it('should return an error if email or password is missing', async () => {
      // Arrange - Missing password
      const incompleteCredentials = {
        email: 'test@example.com',
      };

      const mockRequest = createMockRequest({
        body: incompleteCredentials,
      });
      delete mockRequest.session?.user;

      // Act
      await authController.signIn(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.loginUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return an error for invalid credentials', async () => {
      // Arrange
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockRequest = createMockRequest({
        body: invalidCredentials,
      });
      delete mockRequest.session?.user;

      mockAuthService.loginUser.mockResolvedValue(null); // Authentication failed

      // Act
      await authController.signIn(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        invalidCredentials
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const signupData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const mockRequest = createMockRequest({
        body: signupData,
      });
      delete mockRequest.session?.user; // User not logged in yet

      mockAuthService.registerUser.mockResolvedValue({
        ...mockUser,
        id: 'new-user-id',
        email: signupData.email,
        name: signupData.name,
      });

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalledWith({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        settings: defaultTestUser.settings,
      });
      expect(mockRequest.session?.user).toEqual({
        userId: 'new-user-id',
        email: signupData.email,
        name: signupData.name,
        settings: defaultTestUser.settings,
      });
      expect(mockResponse.header).toHaveBeenCalledWith('HX-Redirect', '/todos');
    });

    it('should return an error if required fields are missing', async () => {
      // Arrange - Missing name
      const incompleteData = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const mockRequest = createMockRequest({
        body: incompleteData,
      });
      delete mockRequest.session?.user;

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.registerUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return an error if passwords do not match', async () => {
      // Arrange
      const unmatchedPasswordData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      const mockRequest = createMockRequest({
        body: unmatchedPasswordData,
      });
      delete mockRequest.session?.user;

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.registerUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors during registration', async () => {
      // Arrange
      const signupData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const mockRequest = createMockRequest({
        body: signupData,
      });
      delete mockRequest.session?.user;

      // Simulate error from service
      mockAuthService.registerUser.mockRejectedValue(
        new Error('User with this email already exists')
      );

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Retarget',
        '#form-messages'
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should destroy the session and redirect to sign in page', async () => {
      // Arrange
      const mockRequest = createMockRequest();

      // Act
      await authController.signOut(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockRequest.session?.destroy).toHaveBeenCalled();

      // Get the callback function from destroy call
      const destroyCallback = (mockRequest.session?.destroy as jest.Mock).mock
        .calls[0][0];

      // Call the callback to simulate session destruction
      destroyCallback(null);

      // Headers should be set for HTMX redirect
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'HX-Redirect',
        '/auth/signin'
      );
    });
  });
});
