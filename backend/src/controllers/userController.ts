import { Request, Response } from 'express';
import { UserService } from '@/services/userService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = await this.userService.login(req.body);
            res.json({ token });
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    };
}
