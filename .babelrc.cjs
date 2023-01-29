module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '16.0.0',
        },
      },
    ],
  ],
};
