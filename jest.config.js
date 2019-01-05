module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/test'],
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.(j|t)s?(x)'],
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
};
