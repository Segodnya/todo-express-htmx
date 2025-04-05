import express from 'express';
import { TodoController } from '../controllers';
import { authMiddleware } from '../middleware/auth';

export const createTodoRouter = (todoController: TodoController) => {
  const router = express.Router();
  
  router.use(authMiddleware);
  
  router.get('/', todoController.getAllTodos);
  router.post('/', todoController.createTodo);
  router.put('/:id', todoController.updateTodo);
  router.put('/:id/toggle', todoController.toggleTodo);
  router.delete('/:id', todoController.deleteTodo);
  
  return router;
}; 