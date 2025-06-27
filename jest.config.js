module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFiles: ['dotenv/config'], // Load .env for tests
  };