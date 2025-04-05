import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware, AuthenticatedRequest } from '@/types/express';

export const authMiddleware: AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.session.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    (req as AuthenticatedRequest).user = {
      userId: req.session.user.id,
      email: req.session.user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
