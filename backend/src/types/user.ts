export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export type UserCreateDTO = Omit<User, 'id'>;

export type UserLoginDTO = Pick<User, 'email' | 'password'>;
