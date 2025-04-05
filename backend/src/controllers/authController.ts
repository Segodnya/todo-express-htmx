import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserSession } from '../types/auth';
import { userService } from '../services/userService';

export class AuthController {
  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        res.status(400).send(`
                    <div class="text-red-500">
                        User with this email already exists
                    </div>
                `);
        return;
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

      // Redirect to todos page
      res.redirect('/todos');
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).send(`
                <div class="text-red-500">
                    An error occurred during signup
                </div>
            `);
    }
  };

  public signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userService.findByEmail(email);
      if (!user) {
        res.status(400).send(`
                    <div class="text-red-500">
                        Invalid email or password
                    </div>
                `);
        return;
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).send(`
                    <div class="text-red-500">
                        Invalid email or password
                    </div>
                `);
        return;
      }

      // Set session
      const userSession: UserSession = {
        id: user.id,
        email: user.email,
      };
      req.session.user = userSession;

      // Redirect to todos page
      res.redirect('/todos');
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).send(`
                <div class="text-red-500">
                    An error occurred during signin
                </div>
            `);
    }
  };

  public signout = (req: Request, res: Response, next: NextFunction): void => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Signout error:', err);
        res.status(500).send(`
                    <div class="text-red-500">
                        An error occurred during signout
                    </div>
                `);
        return;
      }
      res.redirect('/auth/signin');
    });
  };
}
