const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  plugins: [
    isTest && 'babel-plugin-transform-import-meta',
    !isTest && 'babel-plugin-add-import-extension',
  ].filter(Boolean),
  presets: [
    [
      '@babel/preset-env',
      {
        // needed for jest.mock() until they have a way to mock ES modules
        modules: isTest ? 'commonjs' : false,
        targets: {
          node: '12.20',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
