import fs from 'fs/promises';
import path from 'path';
import { FileUserRepository } from '@/repositories/file/file-user.repository';
import { UserEntity } from '@/types';

// Mock fs module
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
}));

describe('FileUserRepository', () => {
  let userRepository: FileUserRepository;
  const testDataDir = path.join(process.cwd(), 'data');
  const testFilePath = path.join(testDataDir, 'users.json');

  // Sample user data for testing
  const mockUsers: UserEntity[] = [
    {
      id: 'user1',
      email: 'user1@example.com',
      name: 'User One',
      password: 'hashed_password1',
      createdAt: 1617984000000,
      updatedAt: 1617984000000,
    },
    {
      id: 'user2',
      email: 'user2@example.com',
      name: 'User Two',
      password: 'hashed_password2',
      createdAt: 1617984000000,
      updatedAt: 1617984000000,
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock filesystem setup
    (fs.access as jest.Mock).mockResolvedValue(undefined);
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockUsers));
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

    // Initialize the repository
    userRepository = new FileUserRepository();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Act
      const users = await userRepository.findAll();

      // Assert
      expect(fs.readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(users).toEqual(mockUsers);
    });

    it('should filter users by provided criteria', async () => {
      // Act
      const filteredUsers = await userRepository.findAll({
        name: 'User One',
      });

      // Assert
      expect(filteredUsers).toHaveLength(1);
      expect(filteredUsers[0].id).toBe('user1');
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      // Act
      const user = await userRepository.findById('user1');

      // Assert
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null if user not found', async () => {
      // Act
      const user = await userRepository.findById('nonexistent');

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      // Act
      const user = await userRepository.findByEmail('user1@example.com');

      // Assert
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null if user not found by email', async () => {
      // Act
      const user = await userRepository.findByEmail('nonexistent@example.com');

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user matching criteria', async () => {
      // Act
      const user = await userRepository.findOne({
        email: 'user2@example.com',
      });

      // Assert
      expect(user).toEqual(mockUsers[1]);
    });

    it('should return null if no user matches criteria', async () => {
      // Act
      const user = await userRepository.findOne({
        email: 'nonexistent@example.com',
      });

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const newUserData = {
        email: 'new@example.com',
        name: 'New User',
        password: 'hashed_newpassword',
      };

      // Mock for the write operation
      (fs.writeFile as jest.Mock).mockImplementation((path, data) => {
        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(mockUsers.length + 1);
        expect(parsedData[mockUsers.length].email).toBe(newUserData.email);
        return Promise.resolve();
      });

      // Act
      const createdUser = await userRepository.create(newUserData);

      // Assert
      expect(fs.writeFile).toHaveBeenCalled();
      expect(createdUser).toMatchObject(newUserData);
      expect(createdUser.id).toBeDefined();
      expect(createdUser.createdAt).toBeDefined();
      expect(createdUser.updatedAt).toBeDefined();
    });

    it('should handle errors when creating a user', async () => {
      // Arrange
      const newUserData = {
        email: 'error@example.com',
        name: 'Error User',
        password: 'hashed_password',
      };

      // Mock fs.writeFile to throw an error
      const mockError = new Error('Write failed');
      (fs.writeFile as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(userRepository.create(newUserData)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      // Arrange
      const userId = 'user1';
      const updateData = {
        name: 'Updated Name',
      };

      // Mock the write operation
      (fs.writeFile as jest.Mock).mockImplementation((path, data) => {
        const parsedData = JSON.parse(data);
        const updatedUser = parsedData.find((u: UserEntity) => u.id === userId);
        expect(updatedUser.name).toBe(updateData.name);
        return Promise.resolve();
      });

      // Act
      const updatedUser = await userRepository.update(userId, updateData);

      // Assert
      expect(fs.writeFile).toHaveBeenCalled();
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.name).toBe(updateData.name);
      expect(updatedUser?.updatedAt).not.toBe(mockUsers[0].updatedAt);
    });

    it('should return null if user to update does not exist', async () => {
      // Act
      const result = await userRepository.update('nonexistent', {
        name: 'Updated',
      });

      // Assert
      expect(result).toBeNull();
      // WriteFile should not be called if the user doesn't exist
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user and return true', async () => {
      // Arrange
      const userId = 'user1';

      // Mock the write operation
      (fs.writeFile as jest.Mock).mockImplementation((path, data) => {
        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(mockUsers.length - 1);
        expect(
          parsedData.find((u: UserEntity) => u.id === userId)
        ).toBeUndefined();
        return Promise.resolve();
      });

      // Act
      const result = await userRepository.delete(userId);

      // Assert
      expect(fs.writeFile).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user to delete does not exist', async () => {
      // Act
      const result = await userRepository.delete('nonexistent');

      // Assert
      expect(result).toBe(false);
      // We don't need to explicitly check writeFile since it would still be called
      // but the file contents would be unchanged
    });
  });

  describe('initStorage', () => {
    it('should create data directory if it does not exist', async () => {
      // Arrange
      // Mock access to throw an error for directory
      (fs.access as jest.Mock)
        .mockRejectedValueOnce(new Error('Directory not found'))
        .mockResolvedValueOnce(undefined); // File access succeeds

      // Re-initialize repository to trigger initStorage
      userRepository = new FileUserRepository();

      // Wait for initStorage to complete
      await new Promise(process.nextTick);

      // Assert
      expect(fs.mkdir).toHaveBeenCalledWith(testDataDir, { recursive: true });
    });

    it('should create an empty file if it does not exist', async () => {
      // Arrange
      // Mock access to succeed for directory but fail for file
      (fs.access as jest.Mock)
        .mockResolvedValueOnce(undefined) // Directory access succeeds
        .mockRejectedValueOnce(new Error('File not found')); // File access fails

      // Re-initialize repository to trigger initStorage
      userRepository = new FileUserRepository();

      // Wait for initStorage to complete
      await new Promise(process.nextTick);

      // Assert
      expect(fs.writeFile).toHaveBeenCalledWith(testFilePath, '[]');
    });
  });
});
