module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:prettier/recommended'
  ],
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
    project: './tsconfig.json',
    tsconfigRootDir: './',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: { legacyDecorators: true }
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 0,
    'no-spaced-func': 0,
    'trailing-comma': false,
    'prettier/prettier': 'error'
  }
};
