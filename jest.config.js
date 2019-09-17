module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test',
    '/__tests__/',
  ],
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  testEnvironment: 'node',
};
