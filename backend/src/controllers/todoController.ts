import { TodoService } from '@/services/todoService';
import { AuthRequestHandler, AuthenticatedRequest } from '@/types/express';

const todoService = new TodoService();

export class TodoController {
  getAllTodos: AuthRequestHandler = async (req, res) => {
    try {
      const { user } = req as AuthenticatedRequest;
      const todos = await todoService.getAllTodos(user.userId);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  };

  createTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { title } = req.body;
      const { user } = req as AuthenticatedRequest;

      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const newTodo = await todoService.createTodo(title, user.userId);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  };

  updateTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const { user } = req as AuthenticatedRequest;

      const updatedTodo = await todoService.updateTodo(
        id,
        user.userId,
        updates
      );

      if (!updatedTodo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  };

  toggleTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;
      const todo = await todoService.updateTodo(id, user.userId, {
        completed: req.body.completed,
      });

      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle todo' });
    }
  };

  deleteTodo: AuthRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req as AuthenticatedRequest;
      const deleted = await todoService.deleteTodo(id, user.userId);

      if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  };
}
