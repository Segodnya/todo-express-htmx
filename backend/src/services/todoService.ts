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

    async getAllTodos(userId: string): Promise<Todo[]> {
        await this.ensureFileExists();
        const data = await fs.readFile(TODO_FILE_PATH, 'utf-8');
        const todos = JSON.parse(data);
        return todos
            .filter((todo: Todo) => todo.userId === userId)
            .map((todo: Todo) => ({
                ...todo,
                createdAt: new Date(todo.createdAt),
                updatedAt: new Date(todo.updatedAt)
            }));
    }

    async saveTodos(todos: Todo[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(TODO_FILE_PATH, JSON.stringify(todos, null, 2));
    }

    async createTodo(title: string, userId: string): Promise<Todo> {
        const todos = await this.getAllTodos(userId);
        const now = Date.now();
        const newTodo: Todo = {
            id: now.toString(),
            userId,
            title,
            completed: false,
            createdAt: now,
            updatedAt: now,
        };
        
        const allTodos = JSON.parse(await fs.readFile(TODO_FILE_PATH, 'utf-8'));
        allTodos.push(newTodo);
        await this.saveTodos(allTodos);
        return newTodo;
    }

    async updateTodo(id: string, userId: string, updates: Partial<Todo>): Promise<Todo | null> {
        const allTodos = JSON.parse(await fs.readFile(TODO_FILE_PATH, 'utf-8'));
        const todoIndex = allTodos.findIndex(
            (todo: Todo) => todo.id === id && todo.userId === userId
        );
        
        if (todoIndex === -1) return null;

        const updatedTodo = {
            ...allTodos[todoIndex],
            ...updates,
            userId,
            updatedAt: Date.now()
        };
        allTodos[todoIndex] = updatedTodo;

        await this.saveTodos(allTodos);
        return updatedTodo;
    }

    async deleteTodo(id: string, userId: string): Promise<boolean> {
        const allTodos = JSON.parse(await fs.readFile(TODO_FILE_PATH, 'utf-8'));
        const initialLength = allTodos.length;
        const filteredTodos = allTodos.filter(
            (todo: Todo) => !(todo.id === id && todo.userId === userId)
        );

        if (filteredTodos.length === initialLength) return false;

        await this.saveTodos(filteredTodos);
        return true;
    }
}
