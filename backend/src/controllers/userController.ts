import { Request, Response } from 'express';
import { userService } from '../services/userService';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.create(email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Login failed' });
    }
  }
}
