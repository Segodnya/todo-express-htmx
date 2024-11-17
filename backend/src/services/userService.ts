import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateDTO, UserLoginDTO } from '@/types/user';

export class UserService {
    private users: User[] = [];

    async createUser(userDTO: UserCreateDTO): Promise<Omit<User, 'password'>> {
        const existingUser = this.users.find(u => u.email === userDTO.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userDTO.password, 10);
        const newUser: User = {
            id: Date.now().toString(),
            email: userDTO.email,
            name: userDTO.name,
            password: hashedPassword
        };

        this.users.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async login(credentials: UserLoginDTO): Promise<string> {
        const user = this.users.find(u => u.email === credentials.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return token;
    }

    getUserById(id: string): Omit<User, 'password'> | null {
        const user = this.users.find(u => u.id === id);
        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
