import { Request, Response, RequestHandler, NextFunction } from 'express';
import { User } from './user';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: User['id'];
    email: User['email'];
  };
}

export type AuthRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = RequestHandler<P, ResBody, ReqBody, ReqQuery, { user: AuthenticatedRequest['user'] }>;

export type AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>; 