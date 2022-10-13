module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --cache --write', 'eslint --cache --fix'],
  '*.{html,css,json,md,mdx,yml,yaml}': ['prettier --cache --write'],
};
