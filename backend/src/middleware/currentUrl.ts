import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to set current URL for use in views (especially for language switcher)
 */
export const currentUrlMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set the current URL excluding query parameters
  res.locals.currentUrl = req.originalUrl.split('?')[0];
  next();
};
