import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/postcss';
import path from 'node:path';
export default defineConfig({
  root: path.resolve(import.meta.dirname, 'browser'),
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    fs: { allow: [path.resolve(import.meta.dirname, '..')] },
  },
  css: { postcss: { plugins: [tailwind()] } },
});
