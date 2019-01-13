module.exports = {
  env: {
    jest: true,
  },
  extends: ['airbnb-base', 'prettier', 'prettier/typescript'],
  parser: 'eslint-plugin-typescript/parser',
  plugins: ['typescript'],
  rules: {
    'valid-jsdoc': [
      'error',
      {
        prefer: {
          arg: 'param',
          argument: 'param',
          return: 'returns',
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'typescript/class-name-casing': 'error',
        'typescript/explicit-function-return-type': [
          'error',
          { allowExpressions: true },
        ],
        'typescript/interface-name-prefix': 'error',
        'typescript/no-angle-bracket-type-assertion': 'error',
        'typescript/no-empty-interface': 'error',
        'typescript/no-inferrable-types': [
          'error',
          { ignoreProperties: false, ignoreParameters: false },
        ],
        'typescript/no-namespace': 'error',
        'typescript/no-non-null-assertion': 'error',
        'typescript/no-object-literal-type-assertion': 'error',
        'typescript/no-parameter-properties': 'error',
        'typescript/no-triple-slash-reference': 'error',
        'no-unused-vars': 'off',
        'typescript/no-unused-vars': 'error',
        'typescript/no-var-requires': 'error',
        'typescript/prefer-interface': 'error',
        'typescript/prefer-namespace-keyword': 'error',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
