import { User } from '../types/auth';
import { FileService } from './fileService';

interface StoredUser extends User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private storage: FileService<StoredUser>;

  constructor() {
    this.storage = new FileService<StoredUser>('users');
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    return this.storage.findOne({ email });
  }

  async create(email: string, password: string): Promise<StoredUser> {
    const now = new Date().toISOString();
    return this.storage.create({
      email,
      password,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export const userService = new UserService();
