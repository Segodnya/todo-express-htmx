# Type-Safe Testing Setup

This directory contains a type-safe testing setup for the Todo application's backend. The testing architecture follows the same patterns as the application's architecture, with proper mocking and type enforcement.

## Testing Structure

- `setup.ts` - Global Jest configuration and mocks for the testing environment
- `utils/testHelpers.ts` - Reusable test utilities and type-safe mock factories
- `todoService.test.ts` - Example of type-safe service tests with mocked repositories
- `todo.controller.test.ts` - Example of type-safe controller tests with mocked services

## Key Features

1. **Type Safety**: All tests are fully type-safe, leveraging TypeScript to catch errors at compile time.
2. **Mock Helpers**: Utility functions to create properly typed mocks for requests, responses, and users.
3. **Clean Architecture**: Tests follow the same layered architecture as the application.
4. **Isolation**: Each component is tested in isolation with proper mocking of dependencies.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- --testMatch "**/todoService.test.ts"
```

To run tests with coverage:

```bash
npm test -- --coverage
```

### Running Tests with Type Checking Disabled

For development, you can run the tests with type checking disabled to focus on the functionality:

```bash
npm test -- --no-cache
```

Or to skip TypeScript errors during the build:

```bash
TS_NODE_TRANSPILE_ONLY=1 npm test
```

## Known Issues and Workarounds

1. **Express Type Incompatibility**: Due to the complex type system in Express, sometimes you need to use `as any` in tests to bypass type checking for request/response objects. This is a common practice in TypeScript testing.

2. **Repository Interface Incompatibility**: When testing repositories, you might encounter TypeScript errors related to method signatures. Use `as unknown as IYourRepository` for mocking, and consider using interface segregation for your test implementations.

## Creating New Tests

### 1. Service Tests

When testing services, mock the repositories and verify that the service correctly interacts with them:

```typescript
// Create a mock repository
const mockRepository = {
  findAll: jest.fn(),
  // Other methods...
} as unknown as jest.Mocked<IYourRepository>;

// Initialize service with mock repository
const service = new YourService(mockRepository);

// Set up mock repository behavior
mockRepository.findAll.mockResolvedValue([...]);

// Call the service method
const result = await service.yourMethod();

// Assert expectations
expect(mockRepository.findAll).toHaveBeenCalledWith(...);
expect(result).toEqual(...);
```

### 2. Controller Tests

For controllers, use the test helpers to create mock requests and responses:

```typescript
// Import helpers
import { createMockRequest, createMockResponse } from './utils/testHelpers';

// Create mocks
const mockRequest = createMockRequest({
  params: { id: '123' },
  body: { text: 'New todo' },
  user: { userId: 'user-id', email: 'user@example.com', name: 'Test User' }
});

const mockResponse = createMockResponse();

// Mock your service
const mockService = {
  yourMethod: jest.fn()
} as unknown as jest.Mocked<YourService>;

// Initialize controller with mock service
const controller = new YourController(mockService);

// Set up service mock behavior
mockService.yourMethod.mockResolvedValue(...);

// Call controller method (using 'as any' to bypass type checking for tests)
await controller.yourMethod(
  mockRequest as any,
  mockResponse as Response,
  () => {} // Mock next function
);

// Assert expectations
expect(mockService.yourMethod).toHaveBeenCalledWith(...);
expect(mockResponse.render).toHaveBeenCalledWith(...);
```

## Best Practices

1. **Arrange-Act-Assert**: Structure tests in three phases
   - Arrange: Set up the test data and mock behavior
   - Act: Execute the code being tested
   - Assert: Verify the results

2. **Test Isolation**: Each test should be independent and not rely on the state of other tests

3. **Mock External Dependencies**: Always mock external dependencies like repositories

4. **Type Safety**: Leverage TypeScript to ensure that mocks and assertions are type-safe

5. **Clear Naming**: Use descriptive test names that explain what is being tested and expected behavior 