import jwt from 'jsonwebtoken';
import { UserService } from '@services/userService';
import { UserCreateDTO, UserLoginDTO } from '@/types/user';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
    let userService: UserService;
    const mockUser: UserCreateDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('mockToken');
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const result = await userService.createUser(mockUser);

            expect(result).toEqual({
                id: expect.any(String),
                email: mockUser.email,
                name: mockUser.name
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
        });

        it('should throw error if user already exists', async () => {
            await userService.createUser(mockUser);

            await expect(userService.createUser(mockUser))
                .rejects
                .toThrow('User already exists');
        });
    });

    describe('login', () => {
        const loginCredentials: UserLoginDTO = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should login successfully with correct credentials', async () => {
            await userService.createUser(mockUser);

            const token = await userService.login(loginCredentials);

            expect(token).toBe('mockToken');
            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginCredentials.password,
                'hashedPassword'
            );
            expect(jwt.sign).toHaveBeenCalled();
        });

        it('should throw error if user does not exist', async () => {
            await expect(userService.login(loginCredentials))
                .rejects
                .toThrow('Invalid credentials');
        });

        it('should throw error if password is incorrect', async () => {
            await userService.createUser(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.login(loginCredentials))
                .rejects
                .toThrow('Invalid credentials');
        });
    });

    describe('getUserById', () => {
        it('should return user without password if found', async () => {
            const createdUser = await userService.createUser(mockUser);
            const result = userService.getUserById(createdUser.id);

            expect(result).toEqual({
                id: createdUser.id,
                email: mockUser.email,
                name: mockUser.name
            });
        });

        it('should return null if user not found', () => {
            const result = userService.getUserById('nonexistent-id');
            expect(result).toBeNull();
        });
    });
});
