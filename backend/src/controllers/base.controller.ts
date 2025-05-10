import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/responseUtils';

export abstract class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    handler: () => Promise<void>
  ) {
    try {
      await handler();
    } catch (error) {
      console.error('Request error:', error);
      if (error instanceof Error) {
        this.handleError(res, error.message);
      } else {
        this.handleError(res, 'An unexpected error occurred');
      }
    }
  }

  protected handleError(res: Response, message: string, status = 500) {
    ResponseUtils.sendHtmxError(res, message, status);
  }

  protected handleAuthError(res: Response, message: string) {
    this.handleError(res, message, 401);
  }

  protected handleValidationError(res: Response, message: string) {
    this.handleError(res, message, 400);
  }

  protected handleNotFoundError(res: Response, message: string) {
    this.handleError(res, message, 404);
  }

  protected sendSuccess(res: Response, message: string) {
    ResponseUtils.sendHtmxSuccess(res, message);
  }

  protected sendRedirect(res: Response, url: string) {
    ResponseUtils.sendHtmxRedirect(res, url);
  }
} 