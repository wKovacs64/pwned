module.exports = {
  plugins: ['babel-plugin-add-import-extension'],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '14.13.1',
        },
      },
    ],
  ],
};
