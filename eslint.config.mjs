import js from '@eslint/js';
import path from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const frontend = ['apps/storefront/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}'];
const browserSafe = [...frontend, 'packages/**/*.{ts,tsx}'];

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.cache/**',
    '**/.pnpm-store/**',
    '.tools/**',
    '.verification/**',
    '**/next-env.d.ts',
    '**/*.tsbuildinfo',
    '**/generated/**',
  ]),
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: { 'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }] },
  },
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
      '@typescript-eslint/no-unused-vars': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
    },
  },
  {
    files: frontend,
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      hooks.configs.flat.recommended,
      a11y.flatConfigs.recommended,
    ],
    plugins: { '@next/next': next },
    rules: { ...next.configs['core-web-vitals'].rules },
    languageOptions: { globals: globals.browser },
    settings: {
      next: {
        rootDir: [
          path.join(import.meta.dirname, 'apps/storefront'),
          path.join(import.meta.dirname, 'apps/admin'),
        ],
      },
      react: { version: '19.3' },
    },
  },
  {
    files: ['packages/ui/**/*.tsx'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      hooks.configs.flat.recommended,
      a11y.flatConfigs.recommended,
    ],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: '19.3' } },
  },
  {
    files: ['apps/api/**/*.ts', 'apps/*/*.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: browserSafe,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@nestjs/*',
                '@prisma/*',
                'prisma',
                '@supabase/*',
                'pg',
                'postgres',
                '@commercehub/api',
                '**/apps/api/**',
              ],
              message: 'Frontend/shared code must not import backend or database internals.',
            },
          ],
        },
      ],
    },
  },
  prettier,
]);
