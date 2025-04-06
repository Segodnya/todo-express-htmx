import { Request, Response, RequestHandler, NextFunction } from 'express';

// UserSession type used in our application
export interface UserSession {
  userId: string;
  email: string;
  name: string;
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

// Define session augmentation
declare module 'express-session' {
  interface SessionData {
    user?: UserSession;
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export type AuthRequestHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, string | string[]>
> = RequestHandler<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  { user: AuthenticatedRequest['user'] }
>;
