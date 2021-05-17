module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test',
    '/__tests__/',
    'index.ts',
  ],
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testEnvironment: 'node',
};
