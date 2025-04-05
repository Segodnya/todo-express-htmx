import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { Session, SessionData } from 'express-session';

/**
 * Helper functions to create mocked objects for testing
 */

export interface MockUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * Type for our mocked session that allows us to bypass type checking
 * while still providing the necessary methods for tests
 */
type MockedSession = Partial<Session & Partial<SessionData>> & {
  user: MockUser;
};

/**
 * Creates a mock authenticated request with session
 */
export const createMockRequest = (
  options: {
    params?: Record<string, string>;
    body?: Record<string, any>;
    query?: Record<string, string>;
    user?: MockUser;
  } = {}
): Partial<AuthenticatedRequest> => {
  const defaultUser: MockUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  };

  // Create a session object with the minimum required properties for testing
  const mockSession: MockedSession = {
    user: options.user || defaultUser,
    id: 'test-session-id',
    cookie: {
      originalMaxAge: 86400000,
      expires: new Date(Date.now() + 86400000),
      secure: false,
      httpOnly: true,
      path: '/',
    },
    save: jest.fn((cb?: (err?: any) => void) => {
      if (cb) cb(null);
      return mockSession as any;
    }),
    destroy: jest.fn((cb?: (err?: any) => void) => {
      if (cb) cb(null);
      return mockSession as any;
    }),
    regenerate: jest.fn((cb?: (err?: any) => void) => {
      if (cb) cb(null);
      return mockSession as any;
    }),
    reload: jest.fn((cb?: (err?: any) => void) => {
      if (cb) cb(null);
      return mockSession as any;
    }),
    touch: jest.fn((cb?: (err?: any) => void) => {
      if (cb) cb(null);
      return mockSession as any;
    }),
    resetMaxAge: jest.fn(),
  };

  return {
    params: options.params || {},
    body: options.body || {},
    query: options.query || {},
    session: mockSession as Session & Partial<SessionData>,
  };
};

/**
 * Creates a mock response object
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);

  return res;
};

/**
 * Helper to create mock entity IDs
 */
export const createMockId = (): string => {
  return `mock-id-${Math.floor(Math.random() * 100000)}`;
};
