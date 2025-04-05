import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { UserController } from '@controllers/userController';
import todoRoutes from '@routes/todoRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const userController = new UserController();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Serve the main layout for all routes (we'll update this later with proper routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/layouts/main.html'));
});

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);

app.use('/api/todos', todoRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default app;
