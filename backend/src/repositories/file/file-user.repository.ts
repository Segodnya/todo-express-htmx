import { UserEntity } from '../../types';
import { FileBaseRepository } from './file-base.repository';

export class FileUserRepository extends FileBaseRepository<UserEntity> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email });
  }
} 