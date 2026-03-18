import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        caches: 'readonly',
        self: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Promise: 'readonly',
        setTimeout: 'readonly',
        location: 'readonly',
        sessionStorage: 'readonly',
        Math: 'readonly',
        Date: 'readonly',
        Object: 'readonly',
        Set: 'readonly',
        Error: 'readonly',
        Array: 'readonly',
        Number: 'readonly',
        Boolean: 'readonly',
        JSON: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error'
    }
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js', 'sw.js']
  }
];
