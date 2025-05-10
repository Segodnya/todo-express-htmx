import bcrypt from 'bcrypt';
import { UserCreateDTO, UserEntity, UserLoginDTO } from '../types';
import { BaseService } from './base.service';
import { IUserRepository } from '../repositories';

export class UserService extends BaseService<UserEntity> {
  constructor(private userRepository: IUserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async registerUser(userData: UserCreateDTO): Promise<UserEntity> {
    // Hash the password before storing
    const hashedPassword = await this.hashPassword(userData.password);

    // Set default language settings if not provided
    const userDataWithSettings = {
      ...userData,
      password: hashedPassword,
      settings: userData.settings || {
        language: 'en', // Default to English
      },
    };

    return this.create(userDataWithSettings);
  }

  async authenticateUser(
    credentials: UserLoginDTO
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      return null;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await this.comparePassword(
      credentials.password,
      user.password
    );

    return isPasswordValid ? user : null;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
