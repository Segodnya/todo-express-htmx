import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    resetMocks: true,
    setupFiles: ['dotenv/config'],
};

export default config;
