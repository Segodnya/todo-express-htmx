import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session.user) {
    res.status(401).redirect('/auth/signin');
    return;
  }

  // Add user info to request
  (req as AuthenticatedRequest).user = {
    userId: req.session.user.userId,
    email: req.session.user.email,
  };

  next();
};
