module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    project: ['./backend/tsconfig.json', './client/tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: { jsx: true, legacyDecorators: true }
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-non-null-assertion': 0,
    'eol-last': [2, 'windows'],
    'eslint/no-throw-literal': 'off',
    'linebreak-style': [
      'error',
      'windows'
    ],
    'max-len': ['error', 100, 2],
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-max-props-per-line': [2, { maximum: 1, when: 'multiline' }],
    'react/jsx-uses-react': 'off',
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off'
  }
};
