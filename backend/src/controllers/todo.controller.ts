import { AuthRequestHandler, AuthenticatedRequest } from '@/types';
import { BaseController } from './base.controller';
import { TodoService } from '../services';
import { TodoCreateDTO, TodoUpdateDTO } from '../types';

export class TodoController extends BaseController {
  constructor(private todoService: TodoService) {
    super();
  }

  getAllTodos: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { user } = req as AuthenticatedRequest;
      const todos = await this.todoService.getAllTodosByUserId(user.userId);
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

      const todoData: TodoCreateDTO = {
        text,
        userId: user.userId,
        completed: false
      };

      const todo = await this.todoService.createTodo(todoData);
      res.render('partials/todo-item', { todo, layout: false });
    });
  };

  updateTodo: AuthRequestHandler = async (req, res) => {
    await this.handleRequest(req, res, async () => {
      const { id } = req.params;
      const updates: TodoUpdateDTO = req.body;
      const { user } = req as AuthenticatedRequest;

      const todo = await this.todoService.updateTodo(id, user.userId, updates);

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

      const todo = await this.todoService.toggleTodoCompletion(id, user.userId);

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
      const deleted = await this.todoService.deleteTodo(id, user.userId);

      if (!deleted) {
        return this.handleNotFoundError(res, 'Todo not found');
      }

      res.send(''); // Empty response as the element will be removed by HTMX
    });
  };
} 