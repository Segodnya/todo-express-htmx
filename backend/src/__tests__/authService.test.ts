import { AuthService } from '@/services';
import { UserService } from '@/services';
import { UserEntity, UserCreateDTO, UserLoginDTO } from '@/types';
import { defaultTestUser } from './utils/testHelpers';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;

  const mockTimestamp = Date.now();

  // Sample user for testing
  const mockUser: UserEntity = {
    ...defaultTestUser,
    id: 'user1',
    password: 'hashed_password123',
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
  };

  beforeEach(() => {
    // Create mock user service
    mockUserService = {
      findByEmail: jest.fn(),
      registerUser: jest.fn(),
      authenticateUser: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    // Initialize the auth service with the mock user service
    authService = new AuthService(mockUserService);
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData: UserCreateDTO = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        settings: defaultTestUser.settings,
      };

      const createdUser: UserEntity = {
        ...userData,
        id: 'new-user-id',
        password: 'hashed_password123',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.registerUser.mockResolvedValue(createdUser);

      // Act
      const result = await authService.registerUser(userData);

      // Assert
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserService.registerUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if user with email already exists', async () => {
      // Arrange
      const userData: UserCreateDTO = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
        settings: defaultTestUser.settings,
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.registerUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserService.registerUser).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      // Arrange
      const credentials: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserService.authenticateUser.mockResolvedValue(mockUser);

      // Act
      const result = await authService.loginUser(credentials);

      // Assert
      expect(mockUserService.authenticateUser).toHaveBeenCalledWith(
        credentials
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when credentials are invalid', async () => {
      // Arrange
      const credentials: UserLoginDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUserService.authenticateUser.mockResolvedValue(null);

      // Act
      const result = await authService.loginUser(credentials);

      // Assert
      expect(mockUserService.authenticateUser).toHaveBeenCalledWith(
        credentials
      );
      expect(result).toBeNull();
    });
  });
});
