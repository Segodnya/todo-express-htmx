import express, { Router } from 'express';
import { TodoController } from '@controllers/todoController';
import { authMiddleware } from '@middleware/auth';

const router: Router = express.Router();
const todoController = new TodoController();

router.use(authMiddleware as express.RequestHandler);

router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.patch('/:id/toggle', todoController.toggleTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
