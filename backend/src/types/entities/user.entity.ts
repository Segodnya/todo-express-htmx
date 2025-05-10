import { BaseEntity } from './base.entity';

export interface UserEntity extends BaseEntity {
  email: string;
  name: string;
  password: string;
  settings: {
    language: 'en' | 'es' | 'pt' | 'fr';
    theme: {
      type: 'system' | 'light' | 'dark' | 'special';
      color?:
        | 'red'
        | 'orange'
        | 'green'
        | 'blue'
        | 'purple'
        | 'pink'
        | 'grey'
        | 'black';
    };
  };
}

export type UserCreateDTO = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UserLoginDTO = Pick<UserEntity, 'email' | 'password'>;
