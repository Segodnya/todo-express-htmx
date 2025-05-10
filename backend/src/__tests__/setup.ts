/**
 * Global Jest setup file for the test environment
 */

// Set test timeout to 10 seconds
jest.setTimeout(10000);

// Configure any global mocks that should be applied to all tests
jest.mock('express-session', () => {
  return jest.fn(() => {
    return (req: any, res: any, next: any) => {
      req.session = {
        user: {
          userId: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
        save: jest.fn((cb) => cb && cb()),
        destroy: jest.fn((cb) => cb && cb()),
        regenerate: jest.fn((cb) => {
          req.session = {
            save: jest.fn((cb) => cb && cb()),
          };
          cb();
        }),
      };
      next();
    };
  });
});
