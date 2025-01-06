import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '@/index';
import { TodoService } from '@/services/todoService';
import { Todo } from '@/types/todo';

jest.mock('../services/todoService');

describe('Todo API Endpoints', () => {
    let mockTodo: Todo;
    let authToken: string;
    const mockUserId = 'test-user-id';
    const mockTimestamp = Date.now();

    beforeEach(() => {
        jest.clearAllMocks();

        authToken = jwt.sign(
            { userId: mockUserId },
            process.env.JWT_SECRET || 'your-secret-key'
        );

        mockTodo = {
            id: '1',
            userId: mockUserId,
            title: 'Test Todo',
            completed: false,
            createdAt: mockTimestamp,
            updatedAt: mockTimestamp
        };
    });

    describe('GET /api/todos', () => {
        it('should return user-specific todos', async () => {
            const mockTodos = [mockTodo];
            (TodoService.prototype.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);

            const response = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTodos);
            expect(TodoService.prototype.getAllTodos).toHaveBeenCalledWith(mockUserId);
        });

        it('should handle errors when fetching todos', async () => {
            (TodoService.prototype.getAllTodos as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch todos' });
        });
    });

    describe('POST /api/todos', () => {
        it('should create a new todo for specific user', async () => {
            (TodoService.prototype.createTodo as jest.Mock).mockResolvedValue(mockTodo);

            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Test Todo' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTodo);
            expect(TodoService.prototype.createTodo).toHaveBeenCalledWith('Test Todo', mockUserId);
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Title is required' });
        });

        it('should handle errors when creating todo', async () => {
            (TodoService.prototype.createTodo as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Test Todo' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to create todo' });
        });
    });

    describe('PUT /api/todos/:id', () => {
        it('should update a todo', async () => {
            const updatedTodo = { ...mockTodo, title: 'Updated Todo' };
            (TodoService.prototype.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);

            const response = await request(app)
                .put('/api/todos/1')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated Todo' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedTodo);
        });

        it('should return 404 if todo not found', async () => {
            (TodoService.prototype.updateTodo as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/todos/999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated Todo' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Todo not found' });
        });
    });

    describe('PATCH /api/todos/:id/toggle', () => {
        it('should toggle todo completion status', async () => {
            const toggledTodo = { ...mockTodo, completed: true };
            (TodoService.prototype.updateTodo as jest.Mock).mockResolvedValue(toggledTodo);

            const response = await request(app)
                .patch('/api/todos/1/toggle')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ completed: true });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(toggledTodo);
        });

        it('should return 404 if todo not found', async () => {
            (TodoService.prototype.updateTodo as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .patch('/api/todos/999/toggle')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ completed: true });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Todo not found' });
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('should delete a todo', async () => {
            (TodoService.prototype.deleteTodo as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete('/api/todos/1')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(204);
        });

        it('should return 404 if todo not found', async () => {
            (TodoService.prototype.deleteTodo as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .delete('/api/todos/999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Todo not found' });
        });
    });

    describe('Authentication', () => {
        it('should return 401 when no token is provided', async () => {
            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Authorization header missing' });
        });

        it('should return 401 when invalid token is provided', async () => {
            const response = await request(app)
                .get('/api/todos')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Invalid token' });
        });
    });
});
