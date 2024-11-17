import fs from 'fs/promises';
import path from 'path';
import { Todo } from '@/types/todo';

const TODO_FILE_PATH = path.join(__dirname, '../data/todos.json');

export class TodoService {
    private async ensureFileExists(): Promise<void> {
        try {
            await fs.access(TODO_FILE_PATH);
        } catch {
            await fs.mkdir(path.dirname(TODO_FILE_PATH), { recursive: true });
            await fs.writeFile(TODO_FILE_PATH, JSON.stringify([]));
        }
    }

    async getAllTodos(): Promise<Todo[]> {
        await this.ensureFileExists();
        const data = await fs.readFile(TODO_FILE_PATH, 'utf-8');
        const todos = JSON.parse(data);
        return todos.map((todo: Todo) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt)
        }));
    }

    async saveTodos(todos: Todo[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(TODO_FILE_PATH, JSON.stringify(todos, null, 2));
    }

    async createTodo(title: string): Promise<Todo> {
        const todos = await this.getAllTodos();
        const now = Date.now();
        const newTodo: Todo = {
            id: now.toString(),
            title,
            completed: false,
            createdAt: now,
            updatedAt: now,
        };
        todos.push(newTodo);
        await this.saveTodos(todos);
        return newTodo;
    }

    async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
        const todos = await this.getAllTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) return null;

        const updatedTodo = {
            ...todos[todoIndex],
            ...updates,
            updatedAt: Date.now()
        };
        todos[todoIndex] = updatedTodo;

        await this.saveTodos(todos);
        return updatedTodo;
    }

    async deleteTodo(id: string): Promise<boolean> {
        const todos = await this.getAllTodos();
        const initialLength = todos.length;
        const filteredTodos = todos.filter(todo => todo.id !== id);

        if (filteredTodos.length === initialLength) return false;

        await this.saveTodos(filteredTodos);
        return true;
    }
}
