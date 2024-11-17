import { RequestHandler } from 'express';
import { TodoService } from '@/services/todoService';

const todoService = new TodoService();

export class TodoController {
    getAllTodos: RequestHandler = async (req, res) => {
        try {
            const todos = await todoService.getAllTodos();
            res.json(todos);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch todos' });
        }
    }

    createTodo: RequestHandler = async (req, res) => {
        try {
            const { title } = req.body;
            if (!title) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }
            const newTodo = await todoService.createTodo(title);
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create todo' });
        }
    }

    updateTodo: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedTodo = await todoService.updateTodo(id, updates);

            if (!updatedTodo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.json(updatedTodo);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update todo' });
        }
    }

    toggleTodo: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const todo = await todoService.updateTodo(id, { completed: req.body.completed });

            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.json(todo);
        } catch (error) {
            res.status(500).json({ error: 'Failed to toggle todo' });
        }
    }

    deleteTodo: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await todoService.deleteTodo(id);

            if (!deleted) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete todo' });
        }
    }
}
