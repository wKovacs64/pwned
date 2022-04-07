module.exports = {
  extends: [
    'plugin:wkovacs64/base',
    'plugin:wkovacs64/typescript',
    'plugin:wkovacs64/jest',
    'prettier',
  ],
  rules: {
    // doesn't work with vitest as it relies on jest version detection
    'jest/no-deprecated-functions': 'off',
  },
};
