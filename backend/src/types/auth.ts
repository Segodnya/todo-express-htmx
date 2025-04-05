import 'express-session';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  email: string;
}

declare module 'express-session' {
  interface Session {
    user: UserSession;
  }
}
