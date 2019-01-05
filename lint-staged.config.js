module.exports = {
  '*.{js,ts}': ['prettier --write', 'eslint --fix', 'git add'],
  '*.{json,md,yml}': ['prettier --write', 'git add'],
};
