import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/responseUtils';

export class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    handler: () => Promise<void>
  ) {
    try {
      await handler();
    } catch (error) {
      console.error('Request error:', error);
      ResponseUtils.sendHtmxError(res, 'An unexpected error occurred', 500);
    }
  }

  protected handleAuthError(res: Response, message: string) {
    ResponseUtils.sendHtmxError(res, message, 401);
  }

  protected handleValidationError(res: Response, message: string) {
    ResponseUtils.sendHtmxError(res, message, 400);
  }

  protected handleNotFoundError(res: Response, message: string) {
    ResponseUtils.sendHtmxError(res, message, 404);
  }
}
