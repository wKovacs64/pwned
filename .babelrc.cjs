module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '18.0.0',
        },
      },
    ],
  ],
};
