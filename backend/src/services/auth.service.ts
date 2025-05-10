import { UserCreateDTO, UserEntity, UserLoginDTO } from '../types';
import { UserService } from './user.service';

export class AuthService {
  constructor(private userService: UserService) {}

  async registerUser(userData: UserCreateDTO): Promise<UserEntity> {
    // Check if user with this email already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Register new user
    return this.userService.registerUser(userData);
  }

  async loginUser(credentials: UserLoginDTO): Promise<UserEntity | null> {
    return this.userService.authenticateUser(credentials);
  }
} 