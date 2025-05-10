import { UserEntity } from '../types';
import { IBaseRepository } from './base.repository';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
} 