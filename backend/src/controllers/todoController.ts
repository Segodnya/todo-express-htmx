import { TodoService } from '@/services/todoService';
import { AuthRequestHandler, AuthenticatedRequest } from '@/types/express';
import { BaseController } from './baseController';
import { ResponseUtils } from '../utils/responseUtils';

const todoService = new TodoService();

export class TodoController extends BaseController {
  getAllTodos: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { user } = req as AuthenticatedRequest;
      const todos = await todoService.getAllTodos(user.userId);
      res.render('todos/index', {
        todos,
        user: req.session.user,
      });
    });
  };

  createTodo: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { text } = req.body;
      const { user } = req as AuthenticatedRequest;

      if (!text) {
        return this.handleValidationError(res, 'Title is required');
      }

      const todo = await todoService.createTodo(text, user.userId);
      res.render('partials/todo-item', { todo, layout: false });
    });
  };

  updateTodo: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { id } = req.params;
      const updates = req.body;
      const { user } = req as AuthenticatedRequest;

      const todo = await todoService.updateTodo(id, user.userId, updates);

      if (!todo) {
        return this.handleNotFoundError(res, 'Todo not found');
      }

      res.render('partials/todo-item', { todo, layout: false });
    });
  };

  toggleTodo: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;

      const currentTodo = await todoService.getTodo(id, user.userId);
      if (!currentTodo) {
        return this.handleNotFoundError(res, 'Todo not found');
      }

      const todo = await todoService.updateTodo(id, user.userId, {
        completed: !currentTodo.completed,
      });

      if (!todo) {
        return this.handleNotFoundError(res, 'Todo not found');
      }

      res.render('partials/todo-item', { todo, layout: false });
    });
  };

  deleteTodo: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;
      const deleted = await todoService.deleteTodo(id, user.userId);

      if (!deleted) {
        return this.handleNotFoundError(res, 'Todo not found');
      }

      res.send(''); // Empty response as the element will be removed by HTMX
    });
  };
}
