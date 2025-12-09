import js from '@eslint/js';
import * as prettier from 'prettier/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { prettier, js },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  tseslint.configs.recommended,
]);
