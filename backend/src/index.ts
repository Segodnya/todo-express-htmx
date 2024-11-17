import express, { Express } from 'express';
import dotenv from 'dotenv';
import { TodoController } from '@controllers/todoController';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const todoController = new TodoController();

app.use(express.json());

app.get('/api/todos', todoController.getAllTodos);
app.post('/api/todos', todoController.createTodo);
app.put('/api/todos/:id', todoController.updateTodo);
app.patch('/api/todos/:id/toggle', todoController.toggleTodo);
app.delete('/api/todos/:id', todoController.deleteTodo);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
