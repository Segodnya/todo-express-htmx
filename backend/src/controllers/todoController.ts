import { TodoService } from '@/services/todoService';
import { AuthRequestHandler, AuthenticatedRequest } from '@/types/express';

const todoService = new TodoService();

export class TodoController {
  getAllTodos: AuthRequestHandler = async (req, res) => {
    try {
      const { user } = req as AuthenticatedRequest;
      const todos = await todoService.getAllTodos(user.userId);
      res.render('todos/index', {
        todos,
        user: req.session.user,
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.render('todos/index', {
        todos: [],
        error: 'Failed to fetch todos',
        user: req.session.user,
      });
    }
  };

  createTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { text } = req.body;
      const { user } = req as AuthenticatedRequest;

      if (!text) {
        res.status(400).send(`
          <div class="text-red-500">Title is required</div>
        `);
        return;
      }

      const todo = await todoService.createTodo(text, user.userId);
      res.render('partials/todo-item', { todo, layout: false });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).send(`
        <div class="text-red-500">Failed to create todo</div>
      `);
    }
  };

  updateTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const { user } = req as AuthenticatedRequest;

      const todo = await todoService.updateTodo(id, user.userId, updates);

      if (!todo) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      res.render('partials/todo-item', { todo, layout: false });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).send(`
        <div class="text-red-500">Failed to update todo</div>
      `);
    }
  };

  toggleTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;

      const currentTodo = await todoService.getTodo(id, user.userId);
      if (!currentTodo) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      const todo = await todoService.updateTodo(id, user.userId, {
        completed: !currentTodo.completed,
      });

      if (!todo) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      res.render('partials/todo-item', { todo, layout: false });
    } catch (error) {
      console.error('Error toggling todo:', error);
      res.status(500).send(`
        <div class="text-red-500">Failed to toggle todo</div>
      `);
    }
  };

  deleteTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;
      const deleted = await todoService.deleteTodo(id, user.userId);

      if (!deleted) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      res.send(''); // Empty response as the element will be removed by HTMX
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).send(`
        <div class="text-red-500">Failed to delete todo</div>
      `);
    }
  };
}
