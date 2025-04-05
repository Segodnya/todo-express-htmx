import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserSession } from '../types/auth';
import { userService } from '../services/userService';
import { BaseController } from './baseController';
import { ResponseUtils } from '../utils/responseUtils';

export class AuthController extends BaseController {
  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return this.handleValidationError(
          res,
          'User with this email already exists'
        );
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await userService.create(email, hashedPassword);

      // Set session
      const userSession: UserSession = {
        id: user.id,
        email: user.email,
      };
      req.session.user = userSession;

      // Send success response
      ResponseUtils.sendHtmxSuccess(
        res,
        'Successfully signed up! Redirecting...'
      );
    });
  };

  public signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { email, password } = req.body;

      // Find user
      const user = await userService.findByEmail(email);
      if (!user) {
        return this.handleAuthError(res, 'Invalid email or password');
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return this.handleAuthError(res, 'Invalid email or password');
      }

      // Set session
      const userSession: UserSession = {
        id: user.id,
        email: user.email,
      };
      req.session.user = userSession;

      // Send success response
      ResponseUtils.sendHtmxSuccess(
        res,
        'Successfully signed in! Redirecting...'
      );
    });
  };

  public signout = (req: Request, res: Response, next: NextFunction): void => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Signout error:', err);
        ResponseUtils.sendHtmxError(
          res,
          'An error occurred during signout',
          500
        );
        return;
      }

      ResponseUtils.sendHtmxRedirect(res, '/auth/signin');
    });
  };
}
