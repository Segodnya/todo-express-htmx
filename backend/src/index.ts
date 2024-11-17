import express, { Express } from 'express';
import dotenv from 'dotenv';
import { UserController } from '@controllers/userController';
import todoRoutes from '@routes/todoRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const userController = new UserController();

app.use(express.json());

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);

app.use('/api/todos', todoRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
