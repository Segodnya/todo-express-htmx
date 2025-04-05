import { Request, Response, RequestHandler, NextFunction } from 'express';

// UserSession type used in our application
export interface UserSession {
  userId: string;
  email: string;
  name: string;
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
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = RequestHandler<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  { user: AuthenticatedRequest['user'] }
>;
