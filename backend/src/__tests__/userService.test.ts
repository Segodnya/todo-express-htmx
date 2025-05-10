import { UserService } from '@/services';
import { IUserRepository } from '@/repositories';
import { UserEntity, UserCreateDTO, UserLoginDTO } from '@/types';
import bcrypt from 'bcrypt';
import { defaultTestUser } from './utils/testHelpers';
import { ThemeType, ThemeColor } from '@/utils/theme';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest
    .fn()
    .mockImplementation((password, salt) =>
      Promise.resolve(`hashed_${password}`)
    ),
  compare: jest
    .fn()
    .mockImplementation((password, hashedPassword) =>
      Promise.resolve(hashedPassword === `hashed_${password}`)
    ),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockTimestamp = Date.now();

  // Sample user for testing
  const mockUser: UserEntity = {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password123',
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    settings: {
      language: 'en',
      theme: {
        type: 'system' as ThemeType,
      },
    },
  };

  beforeEach(() => {
    // Create mock repository with jest functions
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    // Initialize the service with the mock repository
    userService = new UserService(mockRepository);
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await userService.findByEmail(mockUser.email);

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.findByEmail('nonexistent@example.com');

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com'
      );
      expect(result).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should register a new user with hashed password', async () => {
      // Arrange
      const userData: UserCreateDTO = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        settings: {
          language: 'en',
          theme: {
            type: 'system' as ThemeType,
          },
        },
      };

      const hashedPassword = 'hashed_password123';

      // Mock bcrypt hash to return our expected hashed password
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const createdUser: UserEntity = {
        ...userData,
        id: 'new-user-id',
        password: hashedPassword,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await userService.registerUser(userData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });

    it('should register a new user with theme preferences', async () => {
      // Arrange
      const userData: UserCreateDTO = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        settings: {
          language: 'en',
          theme: {
            type: 'dark' as ThemeType,
          },
        },
      };

      const hashedPassword = 'hashed_password123';

      // Mock bcrypt hash to return our expected hashed password
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const createdUser: UserEntity = {
        ...userData,
        id: 'new-user-id',
        password: hashedPassword,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await userService.registerUser(userData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result.settings.theme.type).toBe('dark');
    });

    it('should register a new user with special theme color', async () => {
      // Arrange
      const userData: UserCreateDTO = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        settings: {
          language: 'en',
          theme: {
            type: 'special' as ThemeType,
            color: 'blue' as ThemeColor,
          },
        },
      };

      const hashedPassword = 'hashed_password123';

      // Mock bcrypt hash to return our expected hashed password
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const createdUser: UserEntity = {
        ...userData,
        id: 'new-user-id',
        password: hashedPassword,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await userService.registerUser(userData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result.settings.theme.type).toBe('special');
      expect(result.settings.theme.color).toBe('blue');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with valid credentials', async () => {
      // Arrange
      const credentials: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockRepository.findByEmail.mockResolvedValue(mockUser);
      // Ensure the bcrypt.compare returns true for this test
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      // Act
      const result = await userService.authenticateUser(credentials);

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        credentials.email
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        mockUser.password
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      const credentials: UserLoginDTO = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.authenticateUser(credentials);

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        credentials.email
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      // Arrange
      const credentials: UserLoginDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockRepository.findByEmail.mockResolvedValue(mockUser);
      // Mock bcrypt compare to return false for this test
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      // Act
      const result = await userService.authenticateUser(credentials);

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        credentials.email
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        mockUser.password
      );
      expect(result).toBeNull();
    });
  });
});
