import { BaseEntity } from './base.entity';

export interface UserEntity extends BaseEntity {
  email: string;
  name: string;
  password: string;
}

export type UserCreateDTO = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UserLoginDTO = Pick<UserEntity, 'email' | 'password'>; 