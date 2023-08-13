module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'eslint-config-prettier'],
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    }
  },
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: { legacyDecorators: false }
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
    'eol-last': [2, 'windows'],
    'eslint/no-throw-literal': 'off',
    'max-len': ['error', 120, 2],
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }]
  }
};
