module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/index.ts',
    '!src/app/**/*.interface.ts',
    '!src/app/**/*.type.ts',
    '!src/app/**/*.d.ts',
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'lcov', 'json-summary'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    // Map all paths to environments/environment to the actual file
    '^src/environments/environment$': '<rootDir>/src/environments/environment.ts',
    '^environments/environment$': '<rootDir>/src/environments/environment.ts',
    // Map relative paths ending with environments/environment
    '(.*)/environments/environment$': '<rootDir>/src/environments/environment.ts',
  },
  modulePaths: ['<rootDir>/src'],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|@fortawesome|marked|ngx-markdown)',
  ],
  testEnvironment: 'jsdom',
};
