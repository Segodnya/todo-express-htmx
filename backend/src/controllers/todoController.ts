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
        user: req.session.user
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.render('todos/index', {
        todos: [],
        error: 'Failed to fetch todos',
        user: req.session.user
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

      const newTodo = await todoService.createTodo(text, user.userId);
      res.send(`
        <li class="px-4 py-4 flex items-center justify-between space-x-3 hover:bg-gray-50">
          <div class="flex items-center min-w-0 flex-1">
            <input type="checkbox" 
                   hx-put="/todos/${newTodo.id}/toggle"
                   hx-target="closest li"
                   class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <span class="ml-3 block truncate">
              ${newTodo.text}
            </span>
          </div>
          <div class="flex-shrink-0">
            <button hx-delete="/todos/${newTodo.id}"
                    hx-target="closest li"
                    hx-confirm="Are you sure you want to delete this todo?"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </li>
      `);
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

      const updatedTodo = await todoService.updateTodo(
        id,
        user.userId,
        updates
      );

      if (!updatedTodo) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      res.send(`
        <li class="px-4 py-4 flex items-center justify-between space-x-3 hover:bg-gray-50">
          <div class="flex items-center min-w-0 flex-1">
            <input type="checkbox" 
                   ${updatedTodo.completed ? 'checked' : ''}
                   hx-put="/todos/${updatedTodo.id}/toggle"
                   hx-target="closest li"
                   class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <span class="ml-3 block truncate ${
              updatedTodo.completed ? 'line-through text-gray-400' : ''
            }">
              ${updatedTodo.text}
            </span>
          </div>
          <div class="flex-shrink-0">
            <button hx-delete="/todos/${updatedTodo.id}"
                    hx-target="closest li"
                    hx-confirm="Are you sure you want to delete this todo?"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </li>
      `);
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
      const todo = await todoService.updateTodo(id, user.userId, {
        completed: !req.body.completed,
      });

      if (!todo) {
        res.status(404).send(`
          <div class="text-red-500">Todo not found</div>
        `);
        return;
      }

      res.send(`
        <li class="px-4 py-4 flex items-center justify-between space-x-3 hover:bg-gray-50">
          <div class="flex items-center min-w-0 flex-1">
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''}
                   hx-put="/todos/${todo.id}/toggle"
                   hx-target="closest li"
                   class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <span class="ml-3 block truncate ${
              todo.completed ? 'line-through text-gray-400' : ''
            }">
              ${todo.text}
            </span>
          </div>
          <div class="flex-shrink-0">
            <button hx-delete="/todos/${todo.id}"
                    hx-target="closest li"
                    hx-confirm="Are you sure you want to delete this todo?"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </li>
      `);
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
