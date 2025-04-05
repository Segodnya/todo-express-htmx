import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services';
import { UserCreateDTO, UserLoginDTO, UserSession } from '../types';

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  // Render sign-in form
  renderSignIn = async (req: Request, res: Response) => {
    if (req.session.user) {
      return res.redirect('/todos');
    }
    res.render('auth/signin', {
      title: 'Sign In',
      user: null,
    });
  };

  // Render sign-up form
  renderSignUp = async (req: Request, res: Response) => {
    if (req.session.user) {
      return res.redirect('/todos');
    }
    res.render('auth/signup', {
      title: 'Sign Up',
      user: null,
    });
  };

  // Process sign-in
  signIn = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return this.handleValidationError(res, 'Email and password are required');
      }

      const credentials: UserLoginDTO = { email, password };
      const user = await this.authService.loginUser(credentials);

      if (!user) {
        return this.handleAuthError(res, 'Invalid email or password');
      }

      // Set session with the type expected by UserSession
      req.session.user = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };

      this.sendRedirect(res, '/todos');
    });
  };

  // Process sign-up
  signUp = async (req: Request, res: Response) => {
    await this.handleRequest(req, res, async () => {
      const { name, email, password, confirmPassword } = req.body;

      // Validation
      if (!name || !email || !password) {
        return this.handleValidationError(res, 'All fields are required');
      }

      if (password !== confirmPassword) {
        return this.handleValidationError(res, 'Passwords do not match');
      }

      try {
        const userData: UserCreateDTO = { name, email, password };
        const user = await this.authService.registerUser(userData);

        // Set session with the type expected by UserSession
        req.session.user = {
          userId: user.id,
          email: user.email,
          name: user.name,
        };

        this.sendRedirect(res, '/todos');
      } catch (error) {
        if (error instanceof Error) {
          return this.handleValidationError(res, error.message);
        }
        throw error;
      }
    });
  };

  // Sign out
  signOut = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/auth/signin');
    });
  };
} 